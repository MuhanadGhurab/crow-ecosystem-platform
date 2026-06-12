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
  "/auth/callback",
  "/auth/entra",
  "/proposal",
  "/unauthorized",
  "/access",
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
