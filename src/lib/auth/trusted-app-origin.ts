import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const LOCAL_DEV_ORIGIN = "http://localhost:3000";

function parseOriginAllowlist(raw: string | undefined): Set<string> {
  const set = new Set<string>();
  if (!raw?.trim()) return set;
  for (const part of raw.split(/[\s,]+/)) {
    const origin = part.trim().replace(/\/$/, "");
    if (origin.startsWith("http://") || origin.startsWith("https://")) {
      set.add(origin);
    }
  }
  return set;
}

function originFromForwarded(
  host: string | null,
  proto: string | null
): string | null {
  const trimmedHost = host?.trim();
  if (!trimmedHost) return null;
  const scheme = proto === "https" ? "https" : "http";
  return `${scheme}://${trimmedHost}`;
}

/**
 * Resolves a trusted application origin for auth redirects (recovery, OAuth).
 * Prefers configured NEXT_PUBLIC_SITE_URL; falls back to forwarded host only when
 * listed in CROW_AUTH_REDIRECT_ORIGINS.
 */
export function resolveTrustedAppOrigin(
  forwardedHost?: string | null,
  forwardedProto?: string | null
): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const allowlist = parseOriginAllowlist(process.env.CROW_AUTH_REDIRECT_ORIGINS);
  const forwarded = originFromForwarded(forwardedHost ?? null, forwardedProto ?? null);
  if (forwarded && allowlist.has(forwarded)) return forwarded;

  return LOCAL_DEV_ORIGIN;
}

export function resolveTrustedAppOriginFromHeaders(
  headersList: ReadonlyHeaders
): string {
  return resolveTrustedAppOrigin(
    headersList.get("x-forwarded-host") ?? headersList.get("host"),
    headersList.get("x-forwarded-proto")
  );
}

export function buildPasswordRecoveryCallbackUrl(origin: string): string {
  const next = encodeURIComponent("/reset-password");
  return `${origin.replace(/\/$/, "")}/auth/callback?next=${next}`;
}
