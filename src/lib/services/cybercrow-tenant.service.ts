import { prisma } from "@/lib/db";
import type { LogisticsAuditFilter } from "@/lib/constants/cybercrow-audit-events";
import {
  isLogisticsSecurityEventType,
  logisticsAuditActionFilter,
  LOGISTICS_SECURITY_EVENT_TYPES,
  platformAuditActionFilter,
} from "@/lib/constants/cybercrow-audit-events";

export async function listTenantIncidents(tenantId: string) {
  return prisma.incident.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listTenantRiskScores(tenantId: string) {
  return prisma.riskScore.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function listTenantComplianceControls(tenantId: string) {
  return prisma.complianceControl.findMany({
    where: { tenantId },
    orderBy: { controlKey: "asc" },
    include: { _count: { select: { evidence: true } } },
  });
}

export async function listTenantComplianceControlsWithEvidence(
  tenantId: string,
  evidenceLimit = 3
) {
  return prisma.complianceControl.findMany({
    where: { tenantId },
    orderBy: { controlKey: "asc" },
    include: {
      evidence: { orderBy: { createdAt: "desc" }, take: evidenceLimit },
      _count: { select: { evidence: true } },
    },
  });
}

export async function listTenantGrcFindings(tenantId: string) {
  return prisma.grcFinding.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listTenantAuditLogs(
  tenantId: string,
  options?: { limit?: number; category?: LogisticsAuditFilter }
) {
  const limit = options?.limit ?? 50;
  const category = options?.category ?? "all";

  const where =
    category === "logistics"
      ? { tenantId, ...logisticsAuditActionFilter() }
      : category === "platform"
        ? { tenantId, ...platformAuditActionFilter() }
        : { tenantId };

  return prisma.cybercrowAuditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listTenantSecurityEvents(
  tenantId: string,
  options?: { limit?: number; logisticsOnly?: boolean }
) {
  const limit = options?.limit ?? 50;
  const where = options?.logisticsOnly
    ? {
        tenantId,
        eventType: { in: [...LOGISTICS_SECURITY_EVENT_TYPES] },
      }
    : { tenantId };

  return prisma.securityEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function isLogisticsSecurityEvent(eventType: string): boolean {
  return isLogisticsSecurityEventType(eventType);
}

export async function getCybercrowGrcSummary(tenantId: string) {
  const [controlCount, compliantCount, findingCount, openFindings, evidenceCount] =
    await Promise.all([
      prisma.complianceControl.count({ where: { tenantId } }),
      prisma.complianceControl.count({ where: { tenantId, status: "compliant" } }),
      prisma.grcFinding.count({ where: { tenantId } }),
      prisma.grcFinding.count({ where: { tenantId, status: "open" } }),
      prisma.complianceEvidence.count({
        where: { control: { tenantId } },
      }),
    ]);

  return {
    controlCount,
    compliantCount,
    findingCount,
    openFindings,
    evidenceCount,
    compliancePct:
      controlCount > 0 ? Math.round((compliantCount / controlCount) * 100) : null,
  };
}
