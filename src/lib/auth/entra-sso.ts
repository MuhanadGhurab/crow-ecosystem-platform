import {
  buildAppAuthCallbackUrl,
  buildEntraAuthority,
  entraOidcScopeString,
  getSupabaseAzureRedirectUri,
  OAUTH_NEXT_COOKIE,
} from "@/lib/auth/msal-config";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { getSupabaseUrl, isSupabaseAuthConfigured } from "@/lib/supabase/env";

/** Microsoft Entra ID via Supabase Auth (Azure OAuth provider). */
export function isEntraSsoEnabled(): boolean {
  return (
    isSupabaseAuthConfigured() &&
    process.env.AZURE_SSO_ENABLED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_AZURE_TENANT_ID?.trim())
  );
}

/** Short-lived cookie so post-login path survives OAuth without ?next= on redirectTo. */
export function oauthNextCookieOptions(maxAgeSeconds = 600) {
  return {
    name: OAUTH_NEXT_COOKIE,
    maxAge: maxAgeSeconds,
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
}

function normalizeOAuthNextPath(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  let path = raw.trim();
  try {
    if (path.includes("%")) {
      path = decodeURIComponent(path);
    }
  } catch {
    return undefined;
  }
  return sanitizeAuthNextPathOptional(path);
}

export function resolveOAuthNextPath(
  explicitNext: string | null | undefined,
  cookieNext: string | undefined
): string | undefined {
  return (
    normalizeOAuthNextPath(explicitNext) ?? normalizeOAuthNextPath(cookieNext)
  );
}

/**
 * Supabase redirectTo must match Dashboard allow list exactly.
 * Do not append ?next= — use OAUTH_NEXT_COOKIE instead (see /auth/entra, SignInWithEntra).
 */
export function buildAuthCallbackUrl(origin: string): string {
  return buildAppAuthCallbackUrl(origin);
}

export function azureOAuthOptions(origin: string) {
  const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID?.trim();
  return {
    redirectTo: buildAuthCallbackUrl(origin),
    scopes: entraOidcScopeString(),
    ...(tenantId
      ? {
          queryParams: {
            tenant: tenantId,
          } as Record<string, string>,
        }
      : {}),
  };
}

/** For docs / env:check — Azure Portal redirect URI for Supabase-mediated OAuth. */
export function getConfiguredSupabaseAzureRedirectUri(): string | null {
  try {
    return getSupabaseAzureRedirectUri(getSupabaseUrl());
  } catch {
    return null;
  }
}

/** For docs — MSAL-style authority string for the configured tenant. */
export function getConfiguredEntraAuthority(): string | null {
  const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID?.trim();
  if (!tenantId) return null;
  return buildEntraAuthority(tenantId);
}
