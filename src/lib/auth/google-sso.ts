import { buildAuthCallbackUrl } from "@/lib/auth/entra-sso";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

/** Google OAuth via Supabase Auth — credentials live in Supabase Dashboard only. */
export function isGoogleSsoEnabled(): boolean {
  return (
    isSupabaseAuthConfigured() && process.env.GOOGLE_SSO_ENABLED === "true"
  );
}

export function googleOAuthOptions(origin: string) {
  return {
    redirectTo: buildAuthCallbackUrl(origin),
    scopes: "openid email profile",
  };
}
