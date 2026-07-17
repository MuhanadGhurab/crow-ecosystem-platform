/**
 * CROW.PUBLIC.3 — canonical public browsing policy (informational pages, no auth).
 * Conversion actions route to signup/login/client portal separately.
 */

import { publicRoutes } from "./routes";

/** Paths that must be reachable without a session (middleware + reserved segments). */
export const PUBLIC_BROWSE_PATHS = [
  publicRoutes.home,
  publicRoutes.howCrowWorks,
  publicRoutes.newOrganization,
  publicRoutes.transformExisting,
  publicRoutes.enterpriseBlueprint,
  publicRoutes.platform.overview,
  publicRoutes.platform.cem,
  publicRoutes.platform.cybercrow,
  publicRoutes.platform.sarea,
  publicRoutes.platform.procrow,
  publicRoutes.security,
  publicRoutes.industries,
  publicRoutes.pricing,
  publicRoutes.caseStudies,
  publicRoutes.start,
  publicRoutes.request,
  publicRoutes.login,
  publicRoutes.signup,
  "/register",
  "/legal",
  "/preview/public-home",
] as const;

/** First URL segment reserved so paths are not mistaken for tenant slugs. */
export const PUBLIC_RESERVED_SEGMENTS = [
  "platform",
  "how-crow-works",
  "new-organization",
  "transform-existing",
  "enterprise-blueprint",
  "start",
  "preview",
  "experience",
  "story",
] as const;

/** Prefixes for isPublicPath — includes legacy redirects still reachable. */
export const PUBLIC_PATH_PREFIXES = [
  "/",
  ...PUBLIC_BROWSE_PATHS.filter((p) => p !== "/"),
  "/modules",
  "/loyalty-programs",
  "/about",
  "/architecture",
  "/services",
  "/clients",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/auth/callback",
  "/auth/entra",
  "/proposal",
  "/unauthorized",
  "/access",
  "/auth-canary",
  "/experience",
] as const;

/** Client-process paths that require authentication (static policy check). */
export const GATED_CLIENT_PROCESS_PREFIXES = [
  "/client",
  "/portal",
  "/discovery",
  "/blueprints",
  "/admin",
  "/account",
] as const;

export function isPublicBrowsePath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_BROWSE_PATHS.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

export function isGatedClientProcessPath(pathname: string): boolean {
  return GATED_CLIENT_PROCESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
