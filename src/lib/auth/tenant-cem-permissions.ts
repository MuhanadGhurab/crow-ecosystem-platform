import {
  DISCOVERY_ROLE_PERMISSION_HINTS,
  TENANT_CEM_ROLE_PERMISSIONS,
  type PermissionKey,
} from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { slugifyOrganization } from "@/lib/slugify";

async function ensurePermissionKeys(keys: readonly PermissionKey[]) {
  for (const key of keys) {
    await prisma.permission.upsert({
      where: { key },
      create: { key },
      update: {},
    });
  }
}

async function attachPermissionsToRole(roleId: string, keys: readonly PermissionKey[]) {
  const permissions = await prisma.permission.findMany({
    where: { key: { in: [...keys] } },
  });
  const permByKey = new Map(permissions.map((p) => [p.key, p.id]));
  for (const key of keys) {
    const permissionId = permByKey.get(key);
    if (!permissionId) continue;
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      create: { roleId, permissionId },
      update: {},
    });
  }
}

/** Map discovery role names (e.g. Hub Manager) → Postgres permission rows. Idempotent. */
export async function syncDiscoveryRolesPermissions(tenantId: string) {
  const roles = await prisma.role.findMany({ where: { tenantId } });
  if (roles.length === 0) return { synced: 0 };

  const allKeys = new Set<PermissionKey>();
  for (const def of Object.values(TENANT_CEM_ROLE_PERMISSIONS)) {
    def.forEach((k) => allKeys.add(k));
  }
  await ensurePermissionKeys([...allKeys]);

  let synced = 0;
  for (const role of roles) {
    const discoveryHint = DISCOVERY_ROLE_PERMISSION_HINTS[role.name.toLowerCase()];
    const keys =
      discoveryHint?.permissions ??
      TENANT_CEM_ROLE_PERMISSIONS[role.slug];
    if (!keys?.length) continue;
    await attachPermissionsToRole(role.id, keys);
    synced += 1;
  }
  return { synced };
}

/** After MEEM ops seed — ensure hub-manager & dispatcher slugs have logistics permissions. */
export async function syncMeemTenantRolePermissions(tenantSlug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: { roles: true },
  });
  if (!tenant) return { synced: 0 };
  return syncDiscoveryRolesPermissions(tenant.id);
}

/** Resolve permission keys for a discovery role name before tenant exists. */
export function permissionKeysForDiscoveryRoleName(name: string): readonly PermissionKey[] {
  const hint = DISCOVERY_ROLE_PERMISSION_HINTS[name.toLowerCase()];
  if (hint && "permissions" in hint) return hint.permissions;
  const slug = slugifyOrganization(name);
  return TENANT_CEM_ROLE_PERMISSIONS[slug] ?? TENANT_CEM_ROLE_PERMISSIONS.employee;
}
