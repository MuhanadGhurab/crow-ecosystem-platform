import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isStripeConfigured } from "@/lib/billing/env";
import { isUseMockData } from "@/lib/mock/env";
import { isAuthDisabled, isSupabaseAuthConfigured } from "@/lib/supabase/env";

export async function GET() {
  let db: "ok" | "unreachable" | "not_configured" = "not_configured";

  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      db = "ok";
    } catch {
      db = "unreachable";
    }
  }

  const auth = isAuthDisabled()
    ? "disabled"
    : isSupabaseAuthConfigured()
      ? "configured"
      : "not_configured";

  const isProduction = process.env.NODE_ENV === "production";
  const productionBlocked =
    isProduction && (isAuthDisabled() || isUseMockData());
  const deployReady =
    db === "ok" &&
    auth === "configured" &&
    !isUseMockData() &&
    !isAuthDisabled() &&
    Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

  return NextResponse.json({
    ok: db === "ok" && !productionBlocked,
    db,
    auth,
    mockData: isUseMockData(),
    deployReady,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    stripeConfigured: isStripeConfigured(),
    productionBlocked: productionBlocked || undefined,
  });
}
