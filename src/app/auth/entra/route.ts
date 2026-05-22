import { NextResponse } from "next/server";
import {
  azureOAuthOptions,
  isEntraSsoEnabled,
  oauthNextCookieOptions,
} from "@/lib/auth/entra-sso";
import { createClient } from "@/lib/supabase/server";

/** Start Microsoft Entra ID (Azure) OAuth — redirects to identity provider. */
export async function GET(request: Request) {
  if (!isEntraSsoEnabled()) {
    return NextResponse.redirect(
      new URL("/login?error=entra_not_configured", request.url)
    );
  }

  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/admin/overview";
  const nextPath = next.startsWith("/") && !next.startsWith("//") ? next : "/admin/overview";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: azureOAuthOptions(origin),
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/login?error=entra_start_failed", request.url));
  }

  const response = NextResponse.redirect(data.url);
  response.cookies.set(oauthNextCookieOptions().name, nextPath, oauthNextCookieOptions());
  return response;
}
