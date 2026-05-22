import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";

async function assertProfileAndRoleInTenant(
  tenantId: string,
  profileId: string,
  roleId: string
) {
  const [profile, role] = await Promise.all([
    prisma.profile.findFirst({ where: { id: profileId, tenantId } }),
    prisma.role.findFirst({ where: { id: roleId, tenantId } }),
  ]);

  if (!profile) throw new Error("User profile not found in this workspace");
  if (!role) throw new Error("Role not found in this workspace");

  return { profile, role };
}

async function logRoleChange(
  tenantId: string,
  actor: User,
  action: "ROLE_ASSIGNED" | "ROLE_REMOVED",
  profileId: string,
  roleSlug: string,
  roleName: string
) {
  await prisma.cybercrowAuditLog.create({
    data: {
      tenantId,
      actorId: actor.id,
      action,
      entityType: "user_role",
      entityId: profileId,
      metadata: { roleSlug, roleName, actorEmail: actor.email },
    },
  });
}

export async function assignProfileRole(
  tenantId: string,
  actor: User,
  profileId: string,
  roleId: string
) {
  const { profile, role } = await assertProfileAndRoleInTenant(tenantId, profileId, roleId);

  const existing = await prisma.userRole.findUnique({
    where: { profileId_roleId: { profileId, roleId } },
  });

  if (existing) {
    return { userRole: existing, role, profile, alreadyAssigned: true as const };
  }

  const userRole = await prisma.userRole.create({
    data: { profileId, roleId },
    include: { role: true },
  });

  await logRoleChange(tenantId, actor, "ROLE_ASSIGNED", profileId, role.slug, role.name);

  return { userRole, role, profile, alreadyAssigned: false as const };
}

export async function removeProfileRole(
  tenantId: string,
  actor: User,
  profileId: string,
  roleId: string
) {
  const { profile, role } = await assertProfileAndRoleInTenant(tenantId, profileId, roleId);

  const deleted = await prisma.userRole.deleteMany({
    where: { profileId, roleId },
  });

  if (deleted.count === 0) {
    throw new Error("Role was not assigned to this user");
  }

  await logRoleChange(tenantId, actor, "ROLE_REMOVED", profileId, role.slug, role.name);

  return { profile, role };
}
