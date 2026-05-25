import { NextResponse } from "next/server";
import {
  googleOAuthOptions,
  isGoogleSsoEnabled,
} from "@/lib/auth/google-sso";
import {
  oauthNextCookieOptions,
} from "@/lib/auth/entra-sso";
import { createClient } from "@/lib/supabase/server";

/** Start Google OAuth — redirects to Google via Supabase Auth. */
export async function GET(request: Request) {
  if (!isGoogleSsoEnabled()) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    );
  }

  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/admin/overview";
  const nextPath =
    next.startsWith("/") && !next.startsWith("//") ? next : "/admin/overview";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: googleOAuthOptions(origin),
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      new URL("/login?error=google_start_failed", request.url)
    );
  }

  const response = NextResponse.redirect(data.url);
  response.cookies.set(
    oauthNextCookieOptions().name,
    nextPath,
    oauthNextCookieOptions()
  );
  return response;
}
