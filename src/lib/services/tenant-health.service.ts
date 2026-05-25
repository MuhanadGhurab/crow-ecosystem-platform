import type { Prisma } from "@prisma/client";
import { CYBERCROW_AUDIT_ACTIONS } from "@/lib/constants/cybercrow-audit-events";
import { prisma } from "@/lib/db";

async function getTenantsWithCybercrowBaseline(): Promise<Set<string>> {
  const rows = await prisma.cybercrowAuditLog.groupBy({
    by: ["tenantId"],
    where: { action: CYBERCROW_AUDIT_ACTIONS.CYBERCROW_INITIALIZED },
  });
  return new Set(rows.map((r) => r.tenantId));
}

export type TenantHealthSummary = {
  membershipCount: number;
  openIncidentCount: number;
  lastAuditAt: Date | null;
  auditLogCount: number;
  securityEventCount: number;
  healthScore: "good" | "watch" | "attention";
  healthLabel: string;
};

export type TenantPostureSummary = {
  cybercrowInitialized: boolean;
  enabledModuleCount: number;
  sareaProfileCount: number;
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
    _count: {
      select: {
        modules: { where: { enabled: true } },
        cybercrowAuditLogs: true,
        profiles: true,
        sareaProfiles: true,
      },
    },
  },
} satisfies Prisma.TenantFindManyArgs;

export type TenantWithHealth = Prisma.TenantGetPayload<typeof tenantWithHealthArgs> & {
  health: TenantHealthSummary;
  posture: TenantPostureSummary;
};

export async function listTenantsWithHealth(): Promise<TenantWithHealth[]> {
  const [tenants, baselineTenants] = await Promise.all([
    prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      ...tenantWithHealthArgs,
    }),
    getTenantsWithCybercrowBaseline(),
  ]);

  return Promise.all(
    tenants.map(async (t): Promise<TenantWithHealth> => ({
      ...t,
      health: await getTenantHealthSummary(t.id),
      posture: {
        cybercrowInitialized: baselineTenants.has(t.id),
        enabledModuleCount: t._count.modules,
        sareaProfileCount: t._count.sareaProfiles,
      },
    }))
  );
}
