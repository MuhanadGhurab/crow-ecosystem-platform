import { normalizeSupabaseProjectUrl } from "@/lib/supabase/env";

/**
 * Reference values from Microsoft's ms-identity-node sample (archive/ms-identity-node-main).
 * CYBERCROW uses Supabase Auth (Azure provider), not direct MSAL — this module maps sample
 * env names to Crow / Supabase settings and documents the correct Azure redirect URI.
 */

/** Sample: CLOUD_INSTANCE — must end with trailing slash in MSAL; we normalize without it. */
export const ENTRA_CLOUD_INSTANCE = "https://login.microsoftonline.com";

/** OIDC scopes (MSAL adds these by default; Supabase Azure provider expects the same set). */
export const ENTRA_OIDC_SCOPES = ["openid", "profile", "email"] as const;

export const OAUTH_NEXT_COOKIE = "crow_oauth_next";

/** MSAL authority URL: https://login.microsoftonline.com/{tenantId} */
export function buildEntraAuthority(tenantId: string): string {
  const tenant = tenantId.trim();
  return `${ENTRA_CLOUD_INSTANCE}/${tenant}`;
}

/**
 * Azure App Registration redirect URI when using Supabase Auth (not the sample's /auth/redirect).
 * Register this exact URI as Web redirect in Entra — not http://localhost:3000/auth/callback.
 */
export function getSupabaseAzureRedirectUri(supabaseProjectUrl: string): string {
  const base = normalizeSupabaseProjectUrl(supabaseProjectUrl);
  return `${base}/auth/v1/callback`;
}

/** App route Supabase may redirect to after OAuth (must be in Supabase URL allow list). */
export function buildAppAuthCallbackUrl(origin: string): string {
  return `${origin.replace(/\/$/, "")}/auth/callback`;
}

/** Map sample .env.dev names → Crow .env (secrets stay in Supabase Dashboard for Option B). */
export const ENTRA_ENV_MAP = {
  sample: {
    CLIENT_ID: "Application (client) ID — paste into Supabase Azure provider",
    TENANT_ID: "NEXT_PUBLIC_AZURE_TENANT_ID",
    CLOUD_INSTANCE: "ENTRA_CLOUD_INSTANCE (fixed)",
    CLIENT_SECRET: "Supabase Dashboard → Azure provider (never in .env)",
    REDIRECT_URI: "getSupabaseAzureRedirectUri(NEXT_PUBLIC_SUPABASE_URL)",
    POST_LOGOUT_REDIRECT_URI: "NEXT_PUBLIC_SITE_URL or app origin",
  },
} as const;

export function entraOidcScopeString(): string {
  return ENTRA_OIDC_SCOPES.join(" ");
}
