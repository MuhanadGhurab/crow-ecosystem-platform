import type { CrowRole } from "@/lib/auth/roles";
import { isPlatformStaff } from "@/lib/auth/roles";

/** Fine-grained permission keys — platform route guards + tenant CEM/CyberCrow policy. */
export const Permission = {
  // Platform — commercial pipeline
  "platform.admin.view": "platform.admin.view",
  "platform.requests.view": "platform.requests.view",
  "platform.requests.manage": "platform.requests.manage",
  "platform.discovery.view": "platform.discovery.view",
  "platform.discovery.write": "platform.discovery.write",
  "platform.blueprint.view": "platform.blueprint.view",
  "platform.blueprint.provision": "platform.blueprint.provision",
  "platform.sarea.studio": "platform.sarea.studio",
  "platform.audit.view": "platform.audit.view",
  "platform.tenants.manage": "platform.tenants.manage",
  // Client portal
  "portal.requests.view": "portal.requests.view",
  // Tenant CEM modules
  "cem.dashboard.view": "cem.dashboard.view",
  "cem.users.manage": "cem.users.manage",
  "cem.roles.manage": "cem.roles.manage",
  "cem.workflows.manage": "cem.workflows.manage",
  "cem.hr.write": "cem.hr.write",
  "cem.crm.write": "cem.crm.write",
  "cem.logistics.view": "cem.logistics.view",
  "cem.logistics.manage": "cem.logistics.manage",
  "cem.sales.view": "cem.sales.view",
  "cem.inventory.view": "cem.inventory.view",
  "cem.warehouse.view": "cem.warehouse.view",
  "cem.finance.view": "cem.finance.view",
  "cem.procurement.view": "cem.procurement.view",
  // CyberCrow
  "cybercrow.dashboard.view": "cybercrow.dashboard.view",
  "cybercrow.audit.view": "cybercrow.audit.view",
  "cybercrow.incidents.manage": "cybercrow.incidents.manage",
  // C3 — account self-service (least privilege)
  "account.profile.read.self": "account.profile.read.self",
  "account.profile.update.self": "account.profile.update.self",
  "account.request.read.self": "account.request.read.self",
  "account.request.create.self": "account.request.create.self",
  "account.invitation.read.self": "account.invitation.read.self",
  "account.invitation.accept.self": "account.invitation.accept.self",
  "account.session.read.self": "account.session.read.self",
  "account.session.revoke.self": "account.session.revoke.self",
  "account.legal.read.self": "account.legal.read.self",
  "account.consent.update.self": "account.consent.update.self",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

/** Supabase `crow_role` → granted permissions (route + action layer). */
export const PLATFORM_ROLE_PERMISSIONS: Record<
  Exclude<CrowRole, "client" | "tenant_admin" | "tenant_user">,
  readonly PermissionKey[]
> = {
  platform_admin: Object.values(Permission),
  implementer: [
    Permission["platform.admin.view"],
    Permission["platform.requests.view"],
    Permission["platform.requests.manage"],
    Permission["platform.discovery.view"],
    Permission["platform.discovery.write"],
    Permission["platform.blueprint.view"],
    Permission["platform.blueprint.provision"],
    Permission["platform.sarea.studio"],
    Permission["platform.audit.view"],
    Permission["platform.tenants.manage"],
    Permission["portal.requests.view"],
    Permission["cem.dashboard.view"],
    Permission["cem.users.manage"],
    Permission["cem.roles.manage"],
    Permission["cem.workflows.manage"],
    Permission["cem.hr.write"],
    Permission["cem.crm.write"],
    Permission["cem.logistics.view"],
    Permission["cem.logistics.manage"],
    Permission["cem.sales.view"],
    Permission["cem.inventory.view"],
    Permission["cem.warehouse.view"],
    Permission["cem.finance.view"],
    Permission["cem.procurement.view"],
    Permission["cybercrow.dashboard.view"],
    Permission["cybercrow.audit.view"],
    Permission["cybercrow.incidents.manage"],
  ],
  sales: [
    Permission["platform.requests.view"],
    Permission["platform.discovery.view"],
    Permission["platform.blueprint.view"],
    Permission["portal.requests.view"],
  ],
  auditor_readonly: [
    Permission["platform.audit.view"],
    Permission["platform.blueprint.view"],
    Permission["cybercrow.audit.view"],
    Permission["cybercrow.dashboard.view"],
  ],
};

/** Tenant CEM role slug (Postgres `roles.slug`) → permission keys for module/nav gating. */
export const TENANT_CEM_ROLE_PERMISSIONS: Record<string, readonly PermissionKey[]> = {
  "tenant-admin": [
    Permission["cem.dashboard.view"],
    Permission["cem.users.manage"],
    Permission["cem.roles.manage"],
    Permission["cem.workflows.manage"],
    Permission["cem.hr.write"],
    Permission["cem.crm.write"],
    Permission["cem.logistics.view"],
    Permission["cem.logistics.manage"],
    Permission["cem.sales.view"],
    Permission["cem.inventory.view"],
    Permission["cem.warehouse.view"],
    Permission["cem.finance.view"],
    Permission["cem.procurement.view"],
    Permission["cybercrow.dashboard.view"],
    Permission["cybercrow.audit.view"],
    Permission["cybercrow.incidents.manage"],
  ],
  manager: [
    Permission["cem.dashboard.view"],
    Permission["cem.workflows.manage"],
    Permission["cem.hr.write"],
    Permission["cem.crm.write"],
    Permission["cem.logistics.view"],
    Permission["cem.logistics.manage"],
    Permission["cem.sales.view"],
    Permission["cem.inventory.view"],
    Permission["cem.warehouse.view"],
    Permission["cem.finance.view"],
    Permission["cem.procurement.view"],
    Permission["cybercrow.dashboard.view"],
    Permission["cybercrow.audit.view"],
  ],
  "hub-manager": [
    Permission["cem.dashboard.view"],
    Permission["cem.workflows.manage"],
    Permission["cem.logistics.view"],
    Permission["cem.logistics.manage"],
    Permission["cem.sales.view"],
    Permission["cem.inventory.view"],
    Permission["cem.warehouse.view"],
    Permission["cybercrow.dashboard.view"],
    Permission["cybercrow.audit.view"],
  ],
  employee: [Permission["cem.dashboard.view"], Permission["cem.logistics.view"]],
  dispatcher: [
    Permission["cem.dashboard.view"],
    Permission["cem.logistics.view"],
    Permission["cem.workflows.manage"],
    Permission["cem.warehouse.view"],
    Permission["cybercrow.audit.view"],
  ],
  "auditor-readonly": [
    Permission["cem.dashboard.view"],
    Permission["cybercrow.audit.view"],
    Permission["cybercrow.dashboard.view"],
  ],
};

/** Discovery role name / level hints → tenant slug permissions (MEEM logistics). */
export const DISCOVERY_ROLE_PERMISSION_HINTS: Record<
  string,
  { slug: string; permissions: readonly PermissionKey[] }
> = {
  "hub manager": { slug: "hub-manager", permissions: TENANT_CEM_ROLE_PERMISSIONS["hub-manager"] },
  dispatcher: { slug: "dispatcher", permissions: TENANT_CEM_ROLE_PERMISSIONS.dispatcher },
  manager: { slug: "manager", permissions: TENANT_CEM_ROLE_PERMISSIONS.manager },
  executive: { slug: "tenant-admin", permissions: TENANT_CEM_ROLE_PERMISSIONS["tenant-admin"] },
  frontline: { slug: "employee", permissions: TENANT_CEM_ROLE_PERMISSIONS.employee },
};

const ACCOUNT_SELF_PERMISSIONS: readonly PermissionKey[] = [
  Permission["account.profile.read.self"],
  Permission["account.profile.update.self"],
  Permission["account.request.read.self"],
  Permission["account.request.create.self"],
  Permission["account.invitation.read.self"],
  Permission["account.invitation.accept.self"],
  Permission["account.session.read.self"],
  Permission["account.session.revoke.self"],
  Permission["account.legal.read.self"],
  Permission["account.consent.update.self"],
];

const CLIENT_PERMISSIONS: readonly PermissionKey[] = [
  Permission["portal.requests.view"],
  ...ACCOUNT_SELF_PERMISSIONS,
];

const TENANT_ADMIN_PERMISSIONS: readonly PermissionKey[] = [
  ...PLATFORM_ROLE_PERMISSIONS.implementer.filter((p) => p.startsWith("cem.") || p.startsWith("cybercrow.")),
];

const TENANT_USER_PERMISSIONS: readonly PermissionKey[] = [
  Permission["cem.dashboard.view"],
  Permission["cem.hr.write"],
  Permission["cem.logistics.view"],
  Permission["cem.sales.view"],
  Permission["cem.inventory.view"],
  Permission["cem.warehouse.view"],
  Permission["cybercrow.dashboard.view"],
  Permission["cybercrow.audit.view"],
];

function permissionsForCrowRole(role: CrowRole | null): Set<PermissionKey> {
  if (!role) return new Set();
  if (role === "client") return new Set(CLIENT_PERMISSIONS);
  if (role === "tenant_admin") return new Set(TENANT_ADMIN_PERMISSIONS);
  if (role === "tenant_user") return new Set(TENANT_USER_PERMISSIONS);
  const list = PLATFORM_ROLE_PERMISSIONS[role as keyof typeof PLATFORM_ROLE_PERMISSIONS];
  return new Set(list ?? []);
}

export function hasPermission(role: CrowRole | null, permission: PermissionKey): boolean {
  return permissionsForCrowRole(role).has(permission);
}

export function hasAnyPermission(role: CrowRole | null, permissions: PermissionKey[]): boolean {
  const set = permissionsForCrowRole(role);
  return permissions.some((p) => set.has(p));
}

/** Path → required permission for platform / portal routes (null = session only). */
export function getRoutePermissionRequirement(pathname: string): PermissionKey | null {
  if (pathname.startsWith("/account")) {
    return Permission["account.profile.read.self"];
  }
  if (pathname.startsWith("/portal")) {
    return Permission["portal.requests.view"];
  }
  if (pathname.startsWith("/admin/audit")) {
    return Permission["platform.audit.view"];
  }
  if (pathname.startsWith("/admin/tenants")) {
    return Permission["platform.tenants.manage"];
  }
  if (pathname.startsWith("/admin")) {
    return Permission["platform.admin.view"];
  }
  if (pathname.startsWith("/sarea")) {
    return Permission["platform.sarea.studio"];
  }
  if (pathname.match(/\/blueprints\/[^/]+\/go-live/)) {
    return Permission["platform.blueprint.provision"];
  }
  if (pathname.startsWith("/blueprints")) {
    return Permission["platform.blueprint.view"];
  }
  if (pathname.startsWith("/discovery")) {
    return pathname.endsWith("/summary") || pathname.includes("/roles")
      ? Permission["platform.discovery.write"]
      : Permission["platform.discovery.view"];
  }
  return null;
}

export function canAccessPlatformPath(role: CrowRole | null, pathname: string): boolean {
  if (isPlatformStaff(role)) return true;
  const required = getRoutePermissionRequirement(pathname);
  if (!required) return false;
  if (required === Permission["platform.admin.view"]) {
    return hasAnyPermission(role, [
      Permission["platform.admin.view"],
      Permission["platform.requests.view"],
      Permission["platform.audit.view"],
    ]);
  }
  return hasPermission(role, required);
}

export function canAccessPortalPath(role: CrowRole | null): boolean {
  if (!role) return false;
  if (isPlatformStaff(role) || role === "sales") return hasPermission(role, Permission["portal.requests.view"]);
  return role === "client" && hasPermission(role, Permission["portal.requests.view"]);
}

/** Tenant sub-route permission (module pages). Platform staff always allowed. */
export function getTenantPathPermission(pathname: string, slug: string): PermissionKey | null {
  const prefix = `/${slug}/`;
  if (!pathname.startsWith(prefix)) return null;
  const rest = pathname.slice(prefix.length).split("/")[0];
  switch (rest) {
    case "users":
    case "roles":
      return Permission["cem.users.manage"];
    case "logistics":
      return Permission["cem.logistics.view"];
    case "sales":
      return Permission["cem.sales.view"];
    case "inventory":
      return Permission["cem.inventory.view"];
    case "warehouse":
      return Permission["cem.warehouse.view"];
    case "finance":
      return Permission["cem.finance.view"];
    case "procurement":
      return Permission["cem.procurement.view"];
    case "hr":
      return Permission["cem.hr.write"];
    case "crm":
      return Permission["cem.crm.write"];
    case "workflows":
      return Permission["cem.workflows.manage"];
    case "cybercrow":
      return Permission["cybercrow.dashboard.view"];
    default:
      return Permission["cem.dashboard.view"];
  }
}

export function canAccessTenantPath(
  role: CrowRole | null,
  pathname: string,
  slug: string
): boolean {
  if (isPlatformStaff(role)) return true;
  const required = getTenantPathPermission(pathname, slug);
  if (!required) return true;
  return hasPermission(role, required);
}

/** Nav href → hide when user lacks view permission. */
export function filterNavByCrowRole<T extends { href: string }>(
  items: T[],
  role: CrowRole | null,
  slug: string
): T[] {
  return items.filter((item) => canAccessTenantPath(role, item.href, slug));
}

export function permissionDeniedMessage(permission: PermissionKey): string {
  return `You do not have permission: ${permission}`;
}
