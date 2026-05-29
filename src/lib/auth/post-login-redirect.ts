import type { User } from "@supabase/supabase-js";
import { safeRedirectPath } from "@/lib/http/safe-redirect-path";
import {
  canAccessPlatformPath,
  canAccessPortalPath,
  canAccessTenantPath,
  hasPermission,
  Permission,
} from "@/lib/auth/permissions";
import {
  canAccessTenant,
  getCrowAuth,
  isClient,
  isPlatformConsoleRole,
  isPlatformStaff,
  type CrowRole,
} from "@/lib/auth/roles";
import {
  getTenantSlugFromPath,
  isPlatformPath,
  isPortalPath,
} from "@/lib/auth/route-protection";
import { routes } from "@/lib/routes";

const DEFAULT_STAFF_OVERVIEW = routes.admin.overview;
const DEFAULT_CLIENT_HOME = routes.client.home;

export type AuthenticatedPortalCta = {
  href: string;
  label: string;
};

/** Client-only landing paths — must not override platform staff post-login. */
function isClientPortalNext(path: string): boolean {
  return (
    path === DEFAULT_CLIENT_HOME ||
    path.startsWith("/portal") ||
    path.startsWith("/client") ||
    path === routes.public.request
  );
}

function isClientIntentNext(path: string | null | undefined): boolean {
  if (!path) return false;
  return isClientPortalNext(path);
}

function defaultLandingForRole(role: CrowRole, tenantSlugs: string[]): string {
  switch (role) {
    case "platform_admin":
    case "implementer":
      return DEFAULT_STAFF_OVERVIEW;
    case "sales":
      return routes.admin.requests;
    case "auditor_readonly":
      return hasPermission(role, Permission["platform.audit.view"])
        ? routes.admin.audit
        : DEFAULT_STAFF_OVERVIEW;
    case "tenant_admin":
    case "tenant_user": {
      const slug = tenantSlugs[0];
      return slug ? routes.tenant(slug).dashboard : DEFAULT_CLIENT_HOME;
    }
    case "client":
      return DEFAULT_CLIENT_HOME;
    default:
      return `${routes.auth.login}?error=no_role`;
  }
}

/** Whether the signed-in user may open this internal path after login. */
export function canUserAccessInternalPath(
  role: CrowRole | null,
  tenantSlugs: string[],
  pathname: string
): boolean {
  if (!role) return false;

  if (pathname === "/login" || pathname === "/unauthorized") {
    return true;
  }

  if (pathname === routes.public.request) {
    return canAccessPortalPath(role) || isPlatformStaff(role);
  }

  if (isPortalPath(pathname)) {
    return canAccessPortalPath(role);
  }

  if (isPlatformPath(pathname)) {
    return canAccessPlatformPath(role, pathname);
  }

  const slug = getTenantSlugFromPath(pathname);
  if (slug) {
    return (
      canAccessTenant(role, tenantSlugs, slug) &&
      canAccessTenantPath(role, pathname, slug)
    );
  }

  return false;
}

function resolveExplicitNext(
  explicitNext: string | null | undefined,
  role: CrowRole | null,
  tenantSlugs: string[],
  fallback: string
): string | null {
  if (!explicitNext) return null;

  const safe = safeRedirectPath(explicitNext, fallback);
  if (safe === fallback && explicitNext.trim() !== fallback) {
    return null;
  }

  if (role && isPlatformConsoleRole(role) && isClientPortalNext(safe)) {
    return null;
  }

  if (role && !canUserAccessInternalPath(role, tenantSlugs, safe)) {
    return null;
  }

  return safe;
}

function landingWithoutRole(explicitNext?: string | null): string {
  if (isClientIntentNext(explicitNext)) {
    return safeRedirectPath(explicitNext!, routes.public.request);
  }
  return `${routes.auth.login}?error=role_config`;
}

/**
 * Resolve post-auth landing path from crow_role, tenant_slugs, and optional ?next= / cookie.
 */
export function resolvePostLoginDestination(
  user: User,
  explicitNext?: string | null
): string {
  const { role, tenantSlugs } = getCrowAuth(user);

  if (!role) {
    return landingWithoutRole(explicitNext);
  }

  const fallback = defaultLandingForRole(role, tenantSlugs);
  const next = resolveExplicitNext(explicitNext, role, tenantSlugs, fallback);

  if (isPlatformStaff(role)) {
    return next ?? DEFAULT_STAFF_OVERVIEW;
  }

  if (role === "sales" || role === "auditor_readonly") {
    return next ?? fallback;
  }

  if (role === "tenant_admin" || role === "tenant_user") {
    return next ?? fallback;
  }

  if (role === "client") {
    return next ?? DEFAULT_CLIENT_HOME;
  }

  return `${routes.auth.login}?error=no_role`;
}

/** K2.5 — preferred name for post sign-in / sign-up / OAuth landing. */
export const resolvePostAuthLanding = resolvePostLoginDestination;

/**
 * Role-based portal CTA for public header (never exposes ProCrow to clients).
 */
export function getAuthenticatedPortalCta(user: User): AuthenticatedPortalCta | null {
  const { role, tenantSlugs } = getCrowAuth(user);
  if (!role) return null;

  if (isPlatformConsoleRole(role)) {
    return { href: DEFAULT_STAFF_OVERVIEW, label: "ProCrow" };
  }

  if (role === "tenant_admin" || role === "tenant_user") {
    const slug = tenantSlugs[0];
    if (slug) {
      return { href: routes.tenant(slug).dashboard, label: "Tenant Runtime" };
    }
    return { href: DEFAULT_CLIENT_HOME, label: "Client Portal" };
  }

  if (isClient(role)) {
    return { href: DEFAULT_CLIENT_HOME, label: "Client Portal" };
  }

  return null;
}

/** @deprecated Use resolvePostLoginDestination — kept for existing imports. */
export const resolvePostLoginPath = resolvePostLoginDestination;

export {
  DEFAULT_CLIENT_HOME as DEFAULT_CLIENT_PORTAL,
  DEFAULT_CLIENT_HOME as DEFAULT_CLIENT_NEXT,
  DEFAULT_STAFF_OVERVIEW as DEFAULT_STAFF_NEXT,
};
