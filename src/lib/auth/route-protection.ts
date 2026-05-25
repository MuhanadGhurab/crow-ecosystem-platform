/** Reserved first path segments — not tenant workspace slugs. */
export const RESERVED_PATH_SEGMENTS = new Set([
  "admin",
  "api",
  "dev",
  "discovery",
  "blueprints",
  "sarea",
  "portal",
  "modules",
  "loyalty-programs",
  "security",
  "pricing",
  "request",
  "login",
  "auth",
  "unauthorized",
  "about",
  "architecture",
  "services",
  "clients",
  "industries",
  "case-studies",
  "_next",
  "favicon.ico",
]);

const PUBLIC_PREFIXES = [
  "/",
  "/modules",
  "/loyalty-programs",
  "/security",
  "/pricing",
  "/request",
  "/about",
  "/architecture",
  "/services",
  "/clients",
  "/industries",
  "/case-studies",
  "/login",
  "/auth/callback",
  "/auth/entra",
  "/proposal",
  "/unauthorized",
] as const;

const PLATFORM_PREFIXES = ["/admin", "/discovery", "/blueprints", "/sarea"] as const;

const PORTAL_PREFIXES = ["/portal"] as const;

export function isPortalPath(pathname: string): boolean {
  return PORTAL_PREFIXES.some(
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
  if (pathname === "/api/implementation-requests" && method === "POST") {
    return true;
  }
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
  return false;
}
