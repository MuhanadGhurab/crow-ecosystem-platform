import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

  return NextResponse.json({
    ok: true,
    db,
    auth,
    mockData: isUseMockData(),
  });
}
