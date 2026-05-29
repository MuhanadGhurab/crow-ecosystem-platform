/**
 * L1 — Portal routing discipline (documentation + verifier anchor).
 */

export const PUBLIC_SITE_ROUTES = [
  "/",
  "/about",
  "/modules",
  "/industries",
  "/architecture",
  "/security",
  "/pricing",
  "/services",
] as const;

export const AUTH_CLIENT_ROUTES_PREFIX = ["/login", "/client", "/request"] as const;

export const PROCROW_ADMIN_ROUTE_PREFIX = "/admin" as const;

export const PRODUCT_PORTAL_MODEL = {
  publicSite:
    "Help clients understand Crow — browse home, modules, industries, architecture, security, pricing, services.",
  clientPortal: "Authenticated clients request, review proposals/blueprints, approve scope, and track onboarding.",
  procrow: "Internal operator control tower — request-to-tenant, trust, experience, validation, deployment discipline.",
  tenantRuntime:
    "CEM business runtime — HR, finance, CRM, procurement, inventory, logistics, tasks, reports (operated per tenant).",
} as const;
