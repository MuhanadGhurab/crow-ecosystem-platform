import { NextResponse } from "next/server";
import { z } from "zod";

import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled, isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { prisma } from "@/lib/db";
import { createSubscriptionCheckout } from "@/lib/services/billing.service";

const bodySchema = z.object({
  tenantId: z.string().min(1),
  planKey: z.enum(["startup", "growth", "enterprise"]),
  monthlySar: z.number().positive().optional(),
});

async function authorizeCheckout(tenantId: string) {
  if (isAuthDisabled()) return { ok: true as const, user: null };

  if (!isSupabaseAuthConfigured()) {
    return { ok: false as const, status: 503, error: "Auth not configured" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  const { role, tenantSlugs } = getCrowAuth(user);
  if (isPlatformStaff(role)) {
    return { ok: true as const, user };
  }

  if (role === "tenant_admin") {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { slug: true },
    });
    if (tenant && tenantSlugs.includes(tenant.slug)) {
      return { ok: true as const, user };
    }
  }

  return { ok: false as const, status: 403, error: "Forbidden" };
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.parse(json);

    const auth = await authorizeCheckout(parsed.tenantId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    const result = await createSubscriptionCheckout({
      tenantId: parsed.tenantId,
      planKey: parsed.planKey,
      monthlySar: parsed.monthlySar,
      customerEmail: auth.user?.email ?? undefined,
      successUrl: `${siteUrl}/admin/subscriptions?checkout=success`,
      cancelUrl: `${siteUrl}/admin/subscriptions?checkout=cancel`,
    });

    if (!result.ok) {
      const status = result.reason === "not_configured" ? 503 : 400;
      return NextResponse.json({ error: result.reason, message: result.message }, { status });
    }

    return NextResponse.json({ sessionId: result.sessionId, url: result.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error("[billing/checkout POST]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
