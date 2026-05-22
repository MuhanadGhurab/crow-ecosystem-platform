import {
  TENANT_CEM_ROLE_PERMISSIONS,
  type PermissionKey,
} from "@/lib/auth/permissions";
import { permissionKeysForDiscoveryRoleName } from "@/lib/auth/tenant-cem-permissions";
import { prisma } from "@/lib/db";
import { slugifyOrganization } from "@/lib/slugify";
const DEFAULT_ROLES = [
  { name: "Tenant Admin", slug: "tenant-admin", permissions: ["cem.dashboard.view", "cem.workflows.manage", "cem.users.manage"] },
  { name: "Manager", slug: "manager", permissions: ["cem.dashboard.view", "cem.workflows.manage"] },
  { name: "Employee", slug: "employee", permissions: ["cem.dashboard.view"] },
] as const;

/**
 * Seed CEM structure from discovery answers and blueprint contact.
 * Safe to call once after tenant provision (skips if departments already exist).
 */
export async function seedTenantCemFromDiscovery(
  tenantId: string,
  discoveryProfileId: string
) {
  const existing = await prisma.department.count({ where: { tenantId } });
  if (existing > 0) {
    return { skipped: true as const };
  }

  const discovery = await prisma.discoveryProfile.findUnique({
    where: { id: discoveryProfileId },
    include: {
      departments: true,
      branches: true,
      roles: true,
      workflows: true,
      request: { include: { contacts: { where: { isPrimary: true }, take: 1 } } },
    },
  });

  if (!discovery) {
    return { skipped: true as const };
  }

  const deptIdByName = new Map<string, string>();

  if (discovery.departments.length > 0) {
    for (const d of discovery.departments) {
      const dept = await prisma.department.create({
        data: { tenantId, name: d.name, nameAr: d.nameAr ?? undefined },
      });
      deptIdByName.set(d.name.toLowerCase(), dept.id);
    }
  } else {
    const general = await prisma.department.create({
      data: { tenantId, name: "General" },
    });
    deptIdByName.set("general", general.id);
  }

  for (const b of discovery.branches) {
    await prisma.branch.create({
      data: {
        tenantId,
        name: b.name,
        city: b.city ?? undefined,
        region: b.region ?? undefined,
      },
    });
  }

  const roleIdBySlug = new Map<string, string>();

  if (discovery.roles.length > 0) {
    for (const r of discovery.roles) {
      const slug = slugifyOrganization(r.name) || "role";
      const uniqueSlug = roleIdBySlug.has(slug) ? `${slug}-${roleIdBySlug.size}` : slug;
      const role = await prisma.role.create({
        data: { tenantId, name: r.name, slug: uniqueSlug.slice(0, 48) },
      });
      roleIdBySlug.set(uniqueSlug, role.id);
      const permKeys =
        TENANT_CEM_ROLE_PERMISSIONS[uniqueSlug] ??
        permissionKeysForDiscoveryRoleName(r.name);
      await attachRolePermissions(role.id, permKeys);
    }
  } else {
    await seedDefaultRoles(tenantId, roleIdBySlug);
  }

  for (const w of discovery.workflows) {
    await prisma.workflow.create({
      data: { tenantId, name: w.name, status: "active" },
    });
  }

  const contact = discovery.request.contacts[0];
  if (contact) {
    const roleForContact =
      roleIdBySlug.get("tenant-admin") ?? roleIdBySlug.values().next().value;
    const profile = await prisma.profile.create({
      data: {
        tenantId,
        email: contact.email,
        fullName: contact.fullName,
        departmentId: deptIdByName.values().next().value,
      },
    });
    if (roleForContact) {
      await prisma.userRole.create({
        data: { profileId: profile.id, roleId: roleForContact },
      });
    }
  }

  return { skipped: false as const };
}

async function attachRolePermissions(roleId: string, keys: readonly PermissionKey[]) {
  for (const key of keys) {
    await prisma.permission.upsert({
      where: { key },
      create: { key },
      update: {},
    });
  }
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

async function seedDefaultRoles(
  tenantId: string,
  roleIdBySlug: Map<string, string>
) {
  for (const def of DEFAULT_ROLES) {
    const role = await prisma.role.create({
      data: { tenantId, name: def.name, slug: def.slug },
    });
    roleIdBySlug.set(def.slug, role.id);
    const keys =
      TENANT_CEM_ROLE_PERMISSIONS[def.slug] ??
      (def.permissions as unknown as readonly PermissionKey[]);
    await attachRolePermissions(role.id, keys);
  }
}
