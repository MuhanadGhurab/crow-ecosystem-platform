import { NextResponse } from "next/server";
import {
  googleOAuthOptions,
  isGoogleSsoEnabled,
  oauthProviderCookieOptions,
} from "@/lib/auth/google-sso";
import {
  oauthNextCookieOptions,
} from "@/lib/auth/entra-sso";
import { sanitizeAuthNextPathWithDefault } from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

/** Start Google OAuth — redirects to Google via Supabase Auth. */
export async function GET(request: Request) {
  if (!isGoogleSsoEnabled()) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    );
  }

  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next");
  const nextPath = sanitizeAuthNextPathWithDefault(next, routes.account.home);

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
  response.cookies.set(
    oauthProviderCookieOptions().name,
    "google",
    oauthProviderCookieOptions()
  );
  return response;
}
