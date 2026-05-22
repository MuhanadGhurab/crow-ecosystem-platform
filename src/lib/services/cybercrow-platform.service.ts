import { prisma } from "@/lib/db";
import { CYBERCROW_AUDIT_ACTIONS } from "@/lib/constants/cybercrow-audit-events";
import { logisticsAuditActionFilter } from "@/lib/constants/cybercrow-audit-events";

export type PlatformCybercrowPosture = {
  liveTenantCount: number;
  tenantsWithBaseline: number;
  securityEventCount: number;
  openIncidentCount: number;
  complianceControlCount: number;
  compliantControlCount: number;
  logisticsAuditCount: number;
  totalAuditCount: number;
  compliancePct: number | null;
};

/** Cross-tenant CyberCrow aggregates for platform admin overview (not MEEM-only). */
export async function getPlatformCybercrowPosture(): Promise<PlatformCybercrowPosture> {
  const [
    liveTenantCount,
    tenantsWithBaseline,
    securityEventCount,
    openIncidentCount,
    complianceControlCount,
    compliantControlCount,
    logisticsAuditCount,
    totalAuditCount,
  ] = await Promise.all([
    prisma.tenant.count({ where: { isActive: true } }),
    prisma.cybercrowAuditLog.groupBy({
      by: ["tenantId"],
      where: { action: CYBERCROW_AUDIT_ACTIONS.CYBERCROW_INITIALIZED },
    }).then((rows) => rows.length),
    prisma.securityEvent.count(),
    prisma.incident.count({ where: { status: "open" } }),
    prisma.complianceControl.count(),
    prisma.complianceControl.count({ where: { status: "compliant" } }),
    prisma.cybercrowAuditLog.count({ where: logisticsAuditActionFilter() }),
    prisma.cybercrowAuditLog.count(),
  ]);

  return {
    liveTenantCount,
    tenantsWithBaseline,
    securityEventCount,
    openIncidentCount,
    complianceControlCount,
    compliantControlCount,
    logisticsAuditCount,
    totalAuditCount,
    compliancePct:
      complianceControlCount > 0
        ? Math.round((compliantControlCount / complianceControlCount) * 100)
        : null,
  };
}
