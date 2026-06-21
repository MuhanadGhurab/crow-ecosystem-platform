import "server-only";

import type { User } from "@supabase/supabase-js";
import {
  canAccessPlatformPath,
  canAccessPortalPath,
} from "@/lib/auth/permissions";
import {
  getCrowAuth,
  isClient,
  isPlatformConsoleRole,
  isPlatformStaff,
  type CrowRole,
} from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

export type AuthenticatedPortalCta = {
  href: string;
  label: string;
  /** Account-home CTA uses user icon; portal CTAs use grid icon. */
  tone?: "portal" | "account";
};

function hasClientPortalAccess(role: CrowRole | null): boolean {
  return role === "client" && canAccessPortalPath(role);
}

function hasProcrowPortalAccess(role: CrowRole | null): boolean {
  return Boolean(
    role && isPlatformConsoleRole(role) && canAccessPlatformPath(role, routes.admin.overview)
  );
}

/** Sync conservative check — full DB membership resolved on /access and /[tenant] guards. */
function hasBusinessPortalAccess(role: CrowRole | null, tenantSlugs: string[]): boolean {
  if (!role || isClient(role)) return false;
  if (isPlatformStaff(role)) return true;
  if (role !== "tenant_admin" && role !== "tenant_user") return false;
  return tenantSlugs.length > 0;
}

/** Count portals available to the user without building full gateway cards. */
export function countAvailablePortals(user: User | null): number {
  if (!user) return 0;
  const { role, tenantSlugs } = getCrowAuth(user);
  let count = 0;
  if (hasClientPortalAccess(role)) count += 1;
  if (hasProcrowPortalAccess(role)) count += 1;
  if (hasBusinessPortalAccess(role, tenantSlugs)) count += 1;
  return count;
}

export function shouldRouteToAccessGateway(user: User | null): boolean {
  return countAvailablePortals(user) > 1;
}

/** Single-portal default route when only one portal is available. */
export function singlePortalRoute(user: User | null): string | null {
  if (!user) return null;
  const { role, tenantSlugs } = getCrowAuth(user);
  const clientOk = hasClientPortalAccess(role);
  const procrowOk = hasProcrowPortalAccess(role);
  const businessOk = hasBusinessPortalAccess(role, tenantSlugs);
  const available = Number(clientOk) + Number(procrowOk) + Number(businessOk);
  if (available !== 1) return null;
  if (clientOk) return routes.client.home;
  if (procrowOk) return routes.admin.overview;
  if (businessOk && tenantSlugs[0]) return routes.tenant(tenantSlugs[0]).dashboard;
  return null;
}

const DEFAULT_STAFF_OVERVIEW = routes.admin.overview;
const DEFAULT_CLIENT_HOME = routes.client.home;

/**
 * Role-based portal CTA for public header (never exposes ProCrow to clients).
 */
export function getAuthenticatedPortalCta(user: User): AuthenticatedPortalCta | null {
  const { role } = getCrowAuth(user);
  if (!role) return null;

  if (shouldRouteToAccessGateway(user)) {
    return { href: routes.access, label: "Open workspace" };
  }

  const single = singlePortalRoute(user);
  if (single) {
    if (isPlatformConsoleRole(role)) {
      return { href: single, label: "ProCrow" };
    }
    if (isClient(role)) {
      return { href: single, label: "Client Portal" };
    }
    return { href: single, label: "Business Portal" };
  }

  if (isPlatformConsoleRole(role)) {
    return { href: DEFAULT_STAFF_OVERVIEW, label: "ProCrow" };
  }

  if (isClient(role)) {
    return { href: DEFAULT_CLIENT_HOME, label: "Client Portal" };
  }

  if (role === "tenant_admin" || role === "tenant_user") {
    const { tenantSlugs } = getCrowAuth(user);
    if (tenantSlugs[0]) {
      return { href: routes.tenant(tenantSlugs[0]).dashboard, label: "Business Portal" };
    }
  }

  return null;
}

export function isProcrowVisibleToUser(user: User | null): boolean {
  if (!user) return false;
  const { role } = getCrowAuth(user);
  return hasProcrowPortalAccess(role);
}

export function isClientOnlyUser(user: User | null): boolean {
  if (!user) return false;
  const { role } = getCrowAuth(user);
  return isClient(role) && !isPlatformStaff(role);
}
