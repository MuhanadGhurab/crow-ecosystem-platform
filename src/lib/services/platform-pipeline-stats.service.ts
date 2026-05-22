import { prisma } from "@/lib/db";

export type PlatformPipelineStats = {
  requestCount: number;
  discoveryCount: number;
  blueprintCount: number;
  liveTenantCount: number;
  live: boolean;
};

export async function getPlatformPipelineStats(): Promise<PlatformPipelineStats> {
  try {
    const [requestCount, discoveryCount, blueprintCount, liveTenantCount] = await Promise.all([
      prisma.implementationRequest.count(),
      prisma.implementationRequest.count({
        where: { status: { in: ["UNDER_DISCOVERY", "BLUEPRINT_BUILD"] } },
      }),
      prisma.enterpriseBlueprint.count(),
      prisma.tenant.count({ where: { isActive: true } }),
    ]);

    return {
      requestCount,
      discoveryCount,
      blueprintCount,
      liveTenantCount,
      live: true,
    };
  } catch {
    return {
      requestCount: 0,
      discoveryCount: 0,
      blueprintCount: 0,
      liveTenantCount: 0,
      live: false,
    };
  }
}
