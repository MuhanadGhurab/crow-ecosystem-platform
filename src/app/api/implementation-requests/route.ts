import { NextResponse } from "next/server";
import { z } from "zod";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled, isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { CEM_MODULES } from "@/lib/constants/modules";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import type { CemModuleKey } from "@/lib/constants/modules";
import type { SecurityPackageKey } from "@/lib/constants/security-packages";
import { createImplementationRequest, listImplementationRequests } from "@/lib/services/implementation-request.service";

const cemModuleKeySchema = z.enum(
  CEM_MODULES.map((m) => m.key) as [CemModuleKey, ...CemModuleKey[]]
);
const securityPackageKeySchema = z.enum(
  SECURITY_PACKAGES.map((p) => p.key) as [SecurityPackageKey, ...SecurityPackageKey[]]
);

const createSchema = z.object({
  organizationName: z.string().min(2),
  organizationNameAr: z.string().optional(),
  industry: z.string().optional(),
  employeeBand: z.string().optional(),
  countryCode: z.string().optional(),
  planKey: z.enum(["startup", "growth", "enterprise"]),
  moduleKeys: z.array(cemModuleKeySchema).default([]),
  securityPackageKeys: z.array(securityPackageKeySchema).default([]),
  contact: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    jobTitle: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);

    let submittedByUserId: string | undefined;
    if (!isAuthDisabled() && isSupabaseAuthConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        submittedByUserId = user.id;
      }
    }

    const created = await createImplementationRequest(parsed, { submittedByUserId });
    return NextResponse.json(
      { id: created.id, referenceCode: created.referenceCode, status: created.status },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error("[implementation-requests POST]", err);
    return NextResponse.json(
      { error: "Database unavailable — configure DATABASE_URL and run migrations" },
      { status: 503 }
    );
  }
}

export async function GET() {
  if (!isAuthDisabled()) {
    if (!isSupabaseAuthConfigured()) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { role } = getCrowAuth(user);
    if (!user || !isPlatformStaff(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const requests = await listImplementationRequests();
    return NextResponse.json(requests);
  } catch (err) {
    console.error("[implementation-requests GET]", err);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
