import { prisma } from "@/lib/db";
import {
  buildRecommendedActions,
  buildWorkflowIntel,
  deriveOperationalReadiness,
  isOpenTaskStatus,
} from "@/lib/cem-operations/readiness";
import type { CemOperationsSnapshot } from "@/lib/cem-operations/types";
import { listTenantWorkflows } from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

export async function getCemOperationsSnapshot(
  tenantId: string
): Promise<CemOperationsSnapshot> {
  const [workflows, tasks, summary, deptWithProfiles, rolesWithUsers] = await Promise.all([
    listTenantWorkflows(tenantId),
    prisma.task.findMany({
      where: { tenantId },
      select: {
        id: true,
        status: true,
        workflowId: true,
        assigneeId: true,
      },
    }),
    getTenantWorkspaceSummary(tenantId),
    prisma.department.count({
      where: {
        tenantId,
        profiles: { some: {} },
      },
    }),
    prisma.role.count({
      where: {
        tenantId,
        userRoles: { some: {} },
      },
    }),
  ]);

  const tasksByStatus: Record<string, number> = {};
  let unassignedTaskCount = 0;
  let tasksWithoutWorkflow = 0;
  const openTasksByWorkflow = new Map<string, number>();

  for (const task of tasks) {
    tasksByStatus[task.status] = (tasksByStatus[task.status] ?? 0) + 1;
    if (!task.assigneeId) unassignedTaskCount += 1;
    if (!task.workflowId) tasksWithoutWorkflow += 1;
    if (task.workflowId && isOpenTaskStatus(task.status)) {
      openTasksByWorkflow.set(
        task.workflowId,
        (openTasksByWorkflow.get(task.workflowId) ?? 0) + 1
      );
    }
  }

  const workflowIntel = buildWorkflowIntel(workflows, openTasksByWorkflow);
  const workflowsWithTasks = workflowIntel.filter((w) => w.taskCount > 0).length;
  const workflowsWithoutTasks = workflowIntel.filter((w) => w.taskCount === 0).length;
  const activeWorkflowCount = workflowIntel.filter((w) => w.status === "active").length;

  const readiness = deriveOperationalReadiness({
    workflowCount: workflows.length,
    workflowsWithoutTasks,
    taskCount: tasks.length,
    openTaskCount: summary.openTaskCount,
    departmentCount: summary.departmentCount,
    roleCount: summary.roleCount,
    profileCount: summary.profileCount,
    unassignedTaskCount,
    tasksWithoutWorkflow,
  });

  return {
    workflowCount: workflows.length,
    activeWorkflowCount,
    workflowsWithTasks,
    workflowsWithoutTasks,
    taskCount: tasks.length,
    openTaskCount: summary.openTaskCount,
    tasksByStatus,
    unassignedTaskCount,
    tasksWithoutWorkflow,
    departmentCount: summary.departmentCount,
    roleCount: summary.roleCount,
    profileCount: summary.profileCount,
    departmentsWithProfiles: deptWithProfiles,
    rolesWithAssignments: rolesWithUsers,
    readinessLevel: readiness.level,
    readinessLabel: readiness.label,
    readinessDetail: readiness.detail,
    recommendedActions: buildRecommendedActions({
      workflowCount: workflows.length,
      workflowsWithoutTasks,
      openTaskCount: summary.openTaskCount,
      unassignedTaskCount,
      departmentCount: summary.departmentCount,
      roleCount: summary.roleCount,
      profileCount: summary.profileCount,
      cybercrowInitialized: summary.cybercrowInitialized,
    }),
    workflows: workflowIntel,
    cybercrowInitialized: summary.cybercrowInitialized,
  };
}
