/** Reserved first path segments — not tenant workspace slugs. */
export const RESERVED_PATH_SEGMENTS = new Set([
  "admin",
  "api",
  "dev",
  "discovery",
  "blueprints",
  "sarea",
  "portal",
  "client",
  "modules",
  "loyalty-programs",
  "security",
  "pricing",
  "request",
  "login",
  "signup",
  "register",
  "verify-email",
  "legal",
  "account",
  "auth",
  "unauthorized",
  "about",
  "architecture",
  "services",
  "clients",
  "industries",
  "case-studies",
  "access",
  "tenant-invite",
  "auth-canary",
  "_next",
  "favicon.ico",
]);

const PUBLIC_PREFIXES = [
  "/",
  "/modules",
  "/loyalty-programs",
  "/security",
  "/pricing",
  "/about",
  "/architecture",
  "/services",
  "/clients",
  "/industries",
  "/case-studies",
  "/login",
  "/signup",
  "/register",
  "/verify-email",
  "/legal",
  "/auth/callback",
  "/auth/entra",
  "/proposal",
  "/unauthorized",
  "/access",
  "/auth-canary",
] as const;

const PLATFORM_PREFIXES = ["/admin", "/discovery", "/blueprints", "/sarea"] as const;

/** Authenticated client surfaces — legacy /portal and I3 /client skeleton. */
const CLIENT_AREA_PREFIXES = ["/portal", "/client"] as const;

export function isPortalPath(pathname: string): boolean {
  return CLIENT_AREA_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => prefix !== "/" && (pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

export function isPlatformPath(pathname: string): boolean {
  return PLATFORM_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function getTenantSlugFromPath(pathname: string): string | null {
  const segment = pathname.split("/")[1];
  if (!segment || RESERVED_PATH_SEGMENTS.has(segment) || pathname.includes(".")) {
    return null;
  }
  return segment;
}

export function isAuthApiPath(pathname: string): boolean {
  return pathname.startsWith("/auth/");
}

/** Public API routes for intake, health smoke, and Stripe webhooks (handler verifies signature). */
export function isPublicApiPath(pathname: string, method: string): boolean {
  if (pathname === "/api/health" && method === "GET") {
    return true;
  }
  if (pathname === "/api/c3/session-proof" && method === "GET") {
    return true;
  }
  /** L1 — ERP request intake requires an authenticated session (see implementation-requests POST). */
  if (pathname === "/api/billing/webhook" && method === "POST") {
    return true;
  }
  return false;
}

/**
 * Authenticated API routes that enforce authorization in the route handler.
 * Middleware requires a session but does not require platform staff (RC1 SEC-003).
 */
/** C3 — email verification gate (session required; role optional). */
export function isVerifyEmailPath(pathname: string): boolean {
  return pathname === "/verify-email";
}

/** C3 — legal registration gate (session required; no ACTIVE account yet). */
export function isC3LegalRegistrationPath(pathname: string): boolean {
  return pathname === "/register/legal";
}

/** Public read-only legal document views (print/download). */
export function isPublicLegalDocumentPath(pathname: string): boolean {
  return pathname.startsWith("/legal/");
}

/** C3 — self-service account area (session required; ACTIVE enforced in pages). */
export function isAccountSelfServicePath(pathname: string): boolean {
  return pathname === "/account" || pathname.startsWith("/account/");
}

/**
 * C3 — account self-service requires a Supabase session in middleware.
 * `/register/legal` and `/verify-email` are auth-entry paths (see public-auth-paths)
 * and stay reachable without a session when registration is enabled; pages enforce
 * platform-account state server-side.
 */
export function isC3SessionOnlyPath(pathname: string): boolean {
  return isAccountSelfServicePath(pathname);
}

export function isHandlerAuthorizedApiPath(pathname: string, method: string): boolean {
  if (pathname === "/api/billing/checkout" && method === "POST") {
    return true;
  }
  /** Authenticated client ERP intake — role checks in route handler (RC1 SEC-003). */
  if (pathname === "/api/implementation-requests" && method === "POST") {
    return true;
  }
  return false;
}
