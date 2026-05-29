import { safeRedirectPath } from "@/lib/http/safe-redirect-path";

/** Roles assignable from public sign-up / OAuth default — never platform_admin. */
export const PUBLIC_SIGNUP_ALLOWED_ROLE = "client" as const;

/**
 * True when `raw` is a same-origin relative path (blocks //, https://, backslashes).
 */
export function isSafeAuthNextPath(raw: string | null | undefined): boolean {
  const candidate = raw?.trim();
  if (!candidate) return false;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return false;
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(candidate)) return false;
  if (candidate.includes("\\")) return false;
  return true;
}

/** Login / OAuth optional ?next= — undefined when missing or unsafe. */
export function sanitizeAuthNextPathOptional(
  raw: string | null | undefined
): string | undefined {
  if (!isSafeAuthNextPath(raw)) return undefined;
  return raw!.trim();
}

/** Sign-up and post-auth redirects — unsafe values fall back to `defaultPath`. */
export function sanitizeAuthNextPathWithDefault(
  raw: string | null | undefined,
  defaultPath: string
): string {
  return safeRedirectPath(raw, defaultPath);
}
