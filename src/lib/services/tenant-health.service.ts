import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type TenantHealthSummary = {
  membershipCount: number;
  openIncidentCount: number;
  lastAuditAt: Date | null;
  auditLogCount: number;
  securityEventCount: number;
  healthScore: "good" | "watch" | "attention";
  healthLabel: string;
};

export async function getTenantHealthSummary(tenantId: string): Promise<TenantHealthSummary> {
  const [membershipCount, openIncidentCount, auditLogCount, securityEventCount, lastAudit] =
    await Promise.all([
      prisma.tenantMembership.count({ where: { tenantId } }),
      prisma.incident.count({ where: { tenantId, status: "open" } }),
      prisma.cybercrowAuditLog.count({ where: { tenantId } }),
      prisma.securityEvent.count({ where: { tenantId } }),
      prisma.cybercrowAuditLog.findFirst({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

  let healthScore: TenantHealthSummary["healthScore"] = "good";
  if (openIncidentCount > 2 || securityEventCount > 10) {
    healthScore = "attention";
  } else if (openIncidentCount > 0 || membershipCount === 0) {
    healthScore = "watch";
  }

  const healthLabel =
    healthScore === "good"
      ? "Healthy"
      : healthScore === "watch"
        ? "Monitor"
        : "Needs attention";

  return {
    membershipCount,
    openIncidentCount,
    lastAuditAt: lastAudit?.createdAt ?? null,
    auditLogCount,
    securityEventCount,
    healthScore,
    healthLabel,
  };
}

const tenantWithHealthArgs = {
  include: {
    organization: true,
    blueprint: {
      include: {
        request: { select: { referenceCode: true, status: true } },
      },
    },
    _count: { select: { modules: true, cybercrowAuditLogs: true, profiles: true } },
  },
} satisfies Prisma.TenantFindManyArgs;

export type TenantWithHealth = Prisma.TenantGetPayload<typeof tenantWithHealthArgs> & {
  health: TenantHealthSummary;
};

export async function listTenantsWithHealth(): Promise<TenantWithHealth[]> {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    ...tenantWithHealthArgs,
  });

  return Promise.all(
    tenants.map(async (t): Promise<TenantWithHealth> => ({
      ...t,
      health: await getTenantHealthSummary(t.id),
    }))
  );
}
