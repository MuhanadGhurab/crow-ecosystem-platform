import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { isC3SessionProofEnabled } from "@/lib/account/c3-session-diagnostics";
import { getSessionUser } from "@/lib/auth/session";
import { listSupabaseAuthCookieNames } from "@/lib/supabase/auth-cookie-names";

export const dynamic = "force-dynamic";

/**
 * Preview-only session proof — booleans only; no IDs, tokens, or PII.
 * Enabled when `C3_SESSION_DIAGNOSTICS=true` on Vercel Preview.
 */
export async function GET() {
  if (!isC3SessionProofEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const cookieStore = await cookies();
  const authCookieNames = listSupabaseAuthCookieNames(cookieStore.getAll());
  const sessionCookiePresent = authCookieNames.length > 0;

  const user = await getSessionUser();
  const authenticated = Boolean(user);

  let platformAccountActive = false;
  if (user && isAccountRegistrationEnabled()) {
    const account = await findPlatformAccountBySupabaseUserId(user.id);
    platformAccountActive = Boolean(account && isPlatformAccountActive(account));
  }

  return NextResponse.json(
    {
      authenticated,
      platformAccountActive,
      sessionCookiePresent,
      authCookieCount: authCookieNames.length,
    },
    {
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}
