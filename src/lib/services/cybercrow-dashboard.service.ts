import { prisma } from "@/lib/db";
import { listTenantSecurityEvents } from "@/lib/services/cybercrow-tenant.service";

const SEVERITY_WEIGHT: Record<string, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 1,
};

const CONTROL_STATUS_SCORE: Record<string, number> = {
  compliant: 100,
  in_progress: 70,
  at_risk: 45,
  not_assessed: 30,
};

export type CybercrowDashboardMetrics = {
  riskScore: number;
  riskTrend: "up" | "down" | "stable";
  compliancePct: number;
  openIncidentCount: number;
  highSeverityEventCount: number;
  recentEvents: {
    id: string;
    action: string;
    severity: string;
    at: string;
  }[];
  controls: { key: string; status: string; pct: number }[];
  demoMetrics: boolean;
};

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return date.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
}

function controlStatusPct(status: string): number {
  return CONTROL_STATUS_SCORE[status] ?? 50;
}

/** Posture metrics from tenant CyberCrow tables (incidents, events, controls). */
export async function getCybercrowDashboardMetrics(
  tenantId: string
): Promise<CybercrowDashboardMetrics> {
  const [
    openIncidentCount,
    highSeverityEventCount,
    latestRisk,
    controls,
    recentSecurityEvents,
    totalSecurityEvents,
  ] = await Promise.all([
    prisma.incident.count({ where: { tenantId, status: "open" } }),
    prisma.securityEvent.count({
      where: { tenantId, severity: { in: ["high", "critical", "medium"] } },
    }),
    prisma.riskScore.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.complianceControl.findMany({
      where: { tenantId },
      orderBy: { controlKey: "asc" },
      take: 8,
    }),
    listTenantSecurityEvents(tenantId, { limit: 5 }),
    prisma.securityEvent.count({ where: { tenantId } }),
  ]);

  const controlRows =
    controls.length > 0
      ? controls.map((c) => ({
          key: c.controlKey,
          status: c.status,
          pct: controlStatusPct(c.status),
        }))
      : [];

  const compliancePct =
    controlRows.length > 0
      ? Math.round(
          controlRows.reduce((sum, c) => sum + c.pct, 0) / controlRows.length
        )
      : totalSecurityEvents === 0 && openIncidentCount === 0
        ? 100
        : 75;

  let riskScore = latestRisk ? Math.round(latestRisk.score) : 85;
  riskScore -= openIncidentCount * 12;
  riskScore -= Math.min(highSeverityEventCount * 4, 24);
  riskScore = Math.max(35, Math.min(100, riskScore));

  const priorRisk = await prisma.riskScore.findFirst({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    skip: 1,
  });
  const riskTrend: CybercrowDashboardMetrics["riskTrend"] = priorRisk
    ? riskScore > priorRisk.score
      ? "down"
      : riskScore < priorRisk.score
        ? "up"
        : "stable"
    : openIncidentCount > 0
      ? "down"
      : "up";

  const recentEvents =
    recentSecurityEvents.length > 0
      ? recentSecurityEvents.map((e) => ({
          id: e.id,
          action: e.eventType.replace(/_/g, " "),
          severity: e.severity,
          at: formatRelativeTime(e.createdAt),
        }))
      : [];

  const demoMetrics =
    controlRows.length === 0 &&
    recentEvents.length === 0 &&
    openIncidentCount === 0 &&
    totalSecurityEvents === 0;

  return {
    riskScore,
    riskTrend,
    compliancePct,
    openIncidentCount,
    highSeverityEventCount,
    recentEvents,
    controls: controlRows,
    demoMetrics,
  };
}
