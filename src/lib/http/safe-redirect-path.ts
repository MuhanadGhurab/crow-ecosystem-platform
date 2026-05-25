const DEFAULT_FALLBACK = "/meem-global/dashboard";

/**
 * Restrict redirects to same-origin relative paths (RC1 SEC-002).
 * Rejects protocol-relative (//), absolute URLs, and backslash paths.
 */
export function safeRedirectPath(
  raw: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK
): string {
  const candidate = raw?.trim();
  if (!candidate) {
    return fallback;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(candidate)) {
    return fallback;
  }

  if (candidate.includes("\\")) {
    return fallback;
  }

  return candidate;
}
