import { buildAuthCallbackUrl } from "@/lib/auth/entra-sso";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

/** Short-lived server cookie set when /auth/google starts — survives identity hydration lag. */
export const C3_OAUTH_PROVIDER_COOKIE = "c3_oauth_provider";

/** Google OAuth via Supabase Auth — credentials live in Supabase Dashboard only. */
export function isGoogleSsoEnabled(): boolean {
  return (
    isSupabaseAuthConfigured() && process.env.GOOGLE_SSO_ENABLED === "true"
  );
}

export function oauthProviderCookieOptions(maxAgeSeconds = 600) {
  return {
    name: C3_OAUTH_PROVIDER_COOKIE,
    maxAge: maxAgeSeconds,
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
}

export function isGoogleOAuthProviderHint(value: string | undefined): boolean {
  return value === "google";
}

export function googleOAuthOptions(origin: string) {
  return {
    redirectTo: buildAuthCallbackUrl(origin),
    scopes: "openid email profile",
  };
}
