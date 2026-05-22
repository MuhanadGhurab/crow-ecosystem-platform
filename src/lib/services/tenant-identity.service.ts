import { prisma } from "@/lib/db";

/** All CEM identity reads are scoped by tenantId. */

export async function listTenantDepartments(tenantId: string) {
  return prisma.department.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
    include: { _count: { select: { profiles: true } } },
  });
}

export async function listTenantBranches(tenantId: string) {
  return prisma.branch.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function listTenantRoles(tenantId: string) {
  return prisma.role.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { userRoles: true, rolePermissions: true } },
    },
  });
}

export async function listTenantProfiles(tenantId: string) {
  return prisma.profile.findMany({
    where: { tenantId },
    orderBy: { fullName: "asc" },
    include: {
      department: { select: { name: true } },
      userRoles: { include: { role: { select: { name: true, slug: true } } } },
    },
  });
}

export async function listTenantWorkflows(tenantId: string) {
  return prisma.workflow.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
    include: {
      steps: { orderBy: { orderIndex: "asc" } },
      _count: { select: { steps: true, tasks: true } },
    },
  });
}

export async function listTenantTasks(tenantId: string) {
  return prisma.task.findMany({
    where: { tenantId },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      workflow: { select: { id: true, name: true } },
    },
  });
}

export async function countTenantOpenTasks(tenantId: string) {
  return prisma.task.count({
    where: { tenantId, status: { in: ["open", "in_progress"] } },
  });
}

export async function getTenantIdentityCounts(tenantId: string) {
  const [departments, branches, roles, profiles, workflows] = await Promise.all([
    prisma.department.count({ where: { tenantId } }),
    prisma.branch.count({ where: { tenantId } }),
    prisma.role.count({ where: { tenantId } }),
    prisma.profile.count({ where: { tenantId } }),
    prisma.workflow.count({ where: { tenantId } }),
  ]);
  return { departments, branches, roles, profiles, workflows };
}
