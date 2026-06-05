import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import {
  BUSINESS_PORTAL_DESCRIPTION,
  CLIENT_PORTAL_DESCRIPTION,
  type CrowAccessGatewaySnapshot,
  type CrowPortalKind,
  type CrowPortalOption,
  PORTAL_GATEWAY_SAFETY_NOTES,
  PROCROW_PORTAL_DESCRIPTION,
} from "@/lib/portal/portal-access-contract";
import {
  countAvailablePortals,
  isClientOnlyUser,
  isProcrowVisibleToUser,
  shouldRouteToAccessGateway,
  singlePortalRoute,
} from "@/lib/portal/portal-access-lite";
import {
  canAccessPlatformPath,
  canAccessPortalPath,
} from "@/lib/auth/permissions";
import {
  getCrowAuth,
  isClient,
  isPlatformConsoleRole,
  PROCROW_PORTAL_ALLOWED_ROLES,
  type CrowRole,
} from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

function hasClientPortalAccess(role: CrowRole | null): boolean {
  return role === "client" && canAccessPortalPath(role);
}

function hasProcrowPortalAccess(role: CrowRole | null): boolean {
  return Boolean(
    role && isPlatformConsoleRole(role) && canAccessPlatformPath(role, routes.admin.overview)
  );
}

function hasBusinessPortalAccess(role: CrowRole | null, tenantSlugs: string[]): boolean {
  if (!role) return false;
  if (role !== "tenant_admin" && role !== "tenant_user") return false;
  return tenantSlugs.length > 0;
}

function buildClientOption(access: boolean, reason: string | null): CrowPortalOption {
  return {
    kind: "client",
    label: "Client Portal",
    description: CLIENT_PORTAL_DESCRIPTION,
    route: routes.client.home,
    accessState: access ? "available" : "requires_sign_in",
    reason,
    badge: "Request & onboarding",
    priority: 20,
    allowedRoles: ["client"],
  };
}

function buildBusinessOption(
  access: boolean,
  tenantSlug: string | undefined,
  reason: string | null
): CrowPortalOption {
  const route = tenantSlug ? routes.tenant(tenantSlug).dashboard : routes.auth.login;
  return {
    kind: "business",
    label: "Business Portal",
    description: BUSINESS_PORTAL_DESCRIPTION,
    route,
    accessState: access ? "available" : tenantSlug ? "unavailable" : "requires_sign_in",
    reason,
    badge: "CEM · day-to-day operations",
    priority: 30,
    allowedRoles: ["tenant_admin", "tenant_user"],
    tenantSlug,
    tenantName: tenantSlug ? tenantSlug : undefined,
  };
}

function buildProcrowOption(access: boolean, reason: string | null): CrowPortalOption {
  return {
    kind: "procrow",
    label: "ProCrow",
    description: PROCROW_PORTAL_DESCRIPTION,
    route: routes.admin.overview,
    accessState: access ? "available" : "requires_sign_in",
    reason,
    badge: "Internal operators",
    priority: 10,
    allowedRoles: PROCROW_PORTAL_ALLOWED_ROLES,
  };
}

function choosePrimaryPortal(available: CrowPortalOption[]): CrowPortalKind | null {
  if (available.length === 0) return null;
  if (available.length === 1) return available[0].kind;
  const sorted = [...available].sort((a, b) => a.priority - b.priority);
  return sorted[0].kind;
}

/** Build gateway snapshot for /access only (full portal cards). */
export function buildCrowAccessGatewaySnapshot(user: User | null): CrowAccessGatewaySnapshot {
  if (!user) {
    const signedOut: CrowPortalOption[] = [
      {
        ...buildClientOption(false, "Sign in with your client account."),
        accessState: "requires_sign_in",
      },
      {
        ...buildBusinessOption(false, undefined, "Requires tenant employee access after ProCrow provisions your workspace."),
        accessState: "requires_sign_in",
      },
      {
        ...buildProcrowOption(false, "Internal Crow operators only — not available on the public site."),
        accessState: "unavailable",
        reason: "ProCrow is not available without operator credentials.",
      },
    ];
    return {
      isAuthenticated: false,
      primaryPortal: null,
      availablePortals: [],
      unavailablePortals: signedOut,
      recommendedNextAction: "Sign in to open the portal that matches your role.",
      safetyNotes: PORTAL_GATEWAY_SAFETY_NOTES,
    };
  }

  const { role, tenantSlugs } = getCrowAuth(user);
  const clientOk = hasClientPortalAccess(role);
  const procrowOk = hasProcrowPortalAccess(role);
  const businessOk = hasBusinessPortalAccess(role, tenantSlugs);
  const businessSlug = tenantSlugs[0];

  const options: CrowPortalOption[] = [];

  if (clientOk) {
    options.push(buildClientOption(true, null));
  } else if (role && !isPlatformConsoleRole(role) && role !== "tenant_admin" && role !== "tenant_user") {
    options.push({
      ...buildClientOption(false, "Your account does not have Client Portal access."),
      accessState: "unavailable",
    });
  } else if (!role || isPlatformConsoleRole(role)) {
    // Hide client portal from operators — do not add unavailable card
  } else if (role === "tenant_admin" || role === "tenant_user") {
    options.push({
      ...buildClientOption(false, "Tenant employee accounts use the Business Portal, not Client Portal."),
      accessState: "unavailable",
    });
  }

  if (businessOk && businessSlug) {
    options.push(buildBusinessOption(true, businessSlug, null));
  } else if (role === "tenant_admin" || role === "tenant_user") {
    options.push({
      ...buildBusinessOption(false, undefined, "No tenant workspace slug is linked to your account yet."),
      accessState: "pending",
    });
  } else if (!isPlatformConsoleRole(role) && role !== "client") {
    options.push({
      ...buildBusinessOption(false, undefined, "Business Portal requires tenant_admin or tenant_user role."),
      accessState: "unavailable",
    });
  }

  if (procrowOk) {
    options.push(buildProcrowOption(true, null));
  } else if (isClient(role)) {
    // Never expose ProCrow card to clients
  } else if (!role) {
    options.push({
      ...buildProcrowOption(false, "Operator credentials required."),
      accessState: "unavailable",
    });
  }

  const availablePortals = options.filter((o) => o.accessState === "available");
  const unavailablePortals = options.filter((o) => o.accessState !== "available");

  let recommendedNextAction = "Choose a portal below.";
  if (availablePortals.length === 1) {
    recommendedNextAction = `Continue to ${availablePortals[0].label}.`;
  } else if (availablePortals.length > 1) {
    recommendedNextAction = "You have access to more than one portal — pick the workspace you need.";
  } else if (!role) {
    recommendedNextAction = "Your account is signed in but has no Crow role configured.";
  }

  return {
    isAuthenticated: true,
    primaryPortal: choosePrimaryPortal(availablePortals),
    availablePortals,
    unavailablePortals,
    recommendedNextAction,
    safetyNotes: PORTAL_GATEWAY_SAFETY_NOTES,
  };
}

export {
  countAvailablePortals,
  isClientOnlyUser,
  isProcrowVisibleToUser,
  shouldRouteToAccessGateway,
  singlePortalRoute,
};
