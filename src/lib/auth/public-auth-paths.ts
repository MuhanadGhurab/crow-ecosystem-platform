/** Unauthenticated auth entry surfaces (login, signup, registration gates). */
const AUTH_ENTRY_PREFIXES = [
  "/login",
  "/signup",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/legal",
  "/auth",
] as const;

/**
 * Paths where the startup loader must not block first paint.
 * Includes auth entry paths and protected self-service shells that must not
 * appear stuck behind the global homepage loader.
 */
const STARTUP_LOADER_BYPASS_PREFIXES = [
  ...AUTH_ENTRY_PREFIXES,
  "/account",
  "/auth-canary",
] as const;

/** C3 self-service account area — session + ACTIVE account enforced in layout/middleware. */
const PROTECTED_SELF_SERVICE_PREFIXES = ["/account"] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthEntryPath(pathname: string): boolean {
  return matchesPrefix(pathname, AUTH_ENTRY_PREFIXES);
}

export function isStartupLoaderBypassPath(pathname: string): boolean {
  return matchesPrefix(pathname, STARTUP_LOADER_BYPASS_PREFIXES);
}

export function isProtectedSelfServicePath(pathname: string): boolean {
  return matchesPrefix(pathname, PROTECTED_SELF_SERVICE_PREFIXES);
}

/** @deprecated Use isStartupLoaderBypassPath — name implied public authorization. */
export function isAuthPublicPath(pathname: string): boolean {
  return isStartupLoaderBypassPath(pathname);
}
