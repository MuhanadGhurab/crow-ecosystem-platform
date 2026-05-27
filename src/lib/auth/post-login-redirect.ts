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
  isPlatformConsoleRole,
  isPlatformStaff,
  type CrowRole,
} from "@/lib/auth/roles";
import {
  getTenantSlugFromPath,
  isPlatformPath,
  isPortalPath,
} from "@/lib/auth/route-protection";

const DEFAULT_STAFF_OVERVIEW = "/admin/overview";
const DEFAULT_CLIENT_PORTAL = "/portal/requests";

/** Client-only landing paths — must not override platform staff post-login. */
function isClientPortalNext(path: string): boolean {
  return (
    path === DEFAULT_CLIENT_PORTAL ||
    path.startsWith("/portal") ||
    path.startsWith("/client") ||
    path === "/request"
  );
}

function defaultLandingForRole(
  role: CrowRole,
  tenantSlugs: string[]
): string {
  switch (role) {
    case "platform_admin":
    case "implementer":
      return DEFAULT_STAFF_OVERVIEW;
    case "sales":
      return "/admin/requests";
    case "auditor_readonly":
      return hasPermission(role, Permission["platform.audit.view"])
        ? "/admin/audit"
        : DEFAULT_STAFF_OVERVIEW;
    case "tenant_admin":
    case "tenant_user": {
      const slug = tenantSlugs[0];
      return slug ? `/${slug}/dashboard` : DEFAULT_CLIENT_PORTAL;
    }
    case "client":
      return DEFAULT_CLIENT_PORTAL;
    default:
      return "/login?error=no_role";
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

/**
 * Resolve post-auth landing path from crow_role, tenant_slugs, and optional ?next= / cookie.
 */
export function resolvePostLoginDestination(
  user: User,
  explicitNext?: string | null
): string {
  const { role, tenantSlugs } = getCrowAuth(user);

  if (!role) {
    return "/login?error=no_role";
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
    return next ?? DEFAULT_CLIENT_PORTAL;
  }

  return "/login?error=no_role";
}

/** @deprecated Use resolvePostLoginDestination — kept for existing imports. */
export const resolvePostLoginPath = resolvePostLoginDestination;

export { DEFAULT_CLIENT_PORTAL as DEFAULT_CLIENT_NEXT, DEFAULT_STAFF_OVERVIEW as DEFAULT_STAFF_NEXT };
