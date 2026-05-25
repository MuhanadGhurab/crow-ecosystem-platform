import { prisma } from "@/lib/db";
import { getPlatformCybercrowPosture } from "@/lib/services/cybercrow-platform.service";
import { getPlatformPipelineStats } from "@/lib/services/platform-pipeline-stats.service";
import { getSareaStudioSummary } from "@/lib/services/sarea.service";
import { listTenantsWithHealth, type TenantWithHealth } from "@/lib/services/tenant-health.service";

export type CemCommandCenterSnapshot = {
  pipeline: Awaited<ReturnType<typeof getPlatformPipelineStats>>;
  cybercrow: Awaited<ReturnType<typeof getPlatformCybercrowPosture>>;
  sarea: Awaited<ReturnType<typeof getSareaStudioSummary>>;
  tenants: TenantWithHealth[];
  platformHealth: {
    activeUsers: number;
    authMemberships: number;
    workflowsActive: number;
    openTasks: number;
    departments: number;
    branches: number;
    tenantsProvisioning: number;
  };
};

/** Aggregated data for /admin/overview — CEM Command Center. */
export async function getCemCommandCenterSnapshot(): Promise<CemCommandCenterSnapshot> {
  const [
    pipeline,
    cybercrow,
    sarea,
    tenants,
    activeUsers,
    authMemberships,
    workflowsActive,
    openTasks,
    departments,
    branches,
    tenantsProvisioning,
  ] = await Promise.all([
    getPlatformPipelineStats(),
    getPlatformCybercrowPosture(),
    getSareaStudioSummary(),
    listTenantsWithHealth(),
    prisma.profile.count(),
    prisma.tenantMembership.count(),
    prisma.workflow.count(),
    prisma.task.count({ where: { status: { in: ["open", "in_progress"] } } }),
    prisma.department.count(),
    prisma.branch.count(),
    prisma.implementationRequest.count({
      where: {
        status: { in: ["TENANT_PROVISIONING", "SECURITY_INIT", "SAREA_INIT", "BLUEPRINT_BUILD"] },
      },
    }),
  ]);

  return {
    pipeline,
    cybercrow,
    sarea,
    tenants,
    platformHealth: {
      activeUsers,
      authMemberships,
      workflowsActive,
      openTasks,
      departments,
      branches,
      tenantsProvisioning,
    },
  };
}
