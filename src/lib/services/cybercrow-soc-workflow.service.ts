import type { Incident, SecurityEvent } from "@prisma/client";
import { INCIDENT_STATUS, isOpenIncidentStatus, normalizeIncidentStatus } from "@/lib/constants/cybercrow-incident-status";
import { prisma } from "@/lib/db";
import { getCybercrowIdentityTelemetrySummary } from "@/lib/services/cybercrow-identity-telemetry.service";
import {
  getSecurityEventReviewStatus,
  type SecurityEventReviewStatus,
} from "@/lib/services/cybercrow-mutations.service";
import { getCybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
import {
  getCybercrowGrcSummary,
  listTenantComplianceControls,
  listTenantSecurityEvents,
} from "@/lib/services/cybercrow-tenant.service";

function payloadObject(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};
  return payload as Record<string, unknown>;
}

export type SocWorkflowSummary = {
  pendingReviewEvents: number;
  reviewedEvents: number;
  dismissedEvents: number;
  escalatedEvents: number;
  openIncidents: number;
  underReviewIncidents: number;
  resolvedIncidents: number;
  reopenedIncidents: number;
  riskScore: number;
  evidenceCount: number;
  controlsWithoutEvidence: number;
  openGrcFindings: number;
  identityNote: string;
};

export async function getSocWorkflowSummary(tenantId: string): Promise<SocWorkflowSummary> {
  const [events, incidents, metrics, grc, identity] = await Promise.all([
    listTenantSecurityEvents(tenantId, { limit: 200 }),
    prisma.incident.findMany({ where: { tenantId } }),
    getCybercrowDashboardMetrics(tenantId),
    getCybercrowGrcSummary(tenantId),
    getCybercrowIdentityTelemetrySummary(tenantId),
  ]);

  let pendingReviewEvents = 0;
  let reviewedEvents = 0;
  let dismissedEvents = 0;
  let escalatedEvents = 0;

  for (const e of events) {
    const status = getSecurityEventReviewStatus(e.payload);
    if (status === "pending") pendingReviewEvents++;
    else if (status === "reviewed") reviewedEvents++;
    else if (status === "dismissed") dismissedEvents++;
    else if (status === "escalated") escalatedEvents++;
  }

  let openIncidents = 0;
  let underReviewIncidents = 0;
  let resolvedIncidents = 0;
  let reopenedIncidents = 0;

  for (const i of incidents) {
    const s = normalizeIncidentStatus(i.status);
    if (s === INCIDENT_STATUS.open) openIncidents++;
    else if (s === INCIDENT_STATUS.under_review) underReviewIncidents++;
    else if (s === INCIDENT_STATUS.resolved) resolvedIncidents++;
    else if (s === INCIDENT_STATUS.reopened) reopenedIncidents++;
  }

  const controls = await listTenantComplianceControls(tenantId);
  const controlsWithoutEvidence = controls.filter((c) => c._count.evidence === 0).length;

  const identityNote = identity.hasStoredTelemetry
    ? `${identity.loginEventCount} logins · ${identity.sessionEventCount} sessions · ${identity.accessAttemptCount} access attempts observed`
    : "Identity telemetry is advisory until login/session events are recorded from auth flows.";

  return {
    pendingReviewEvents,
    reviewedEvents,
    dismissedEvents,
    escalatedEvents,
    openIncidents,
    underReviewIncidents,
    resolvedIncidents,
    reopenedIncidents,
    riskScore: metrics.riskScore,
    evidenceCount: grc.evidenceCount,
    controlsWithoutEvidence,
    openGrcFindings: grc.openFindings,
    identityNote,
  };
}

export function recommendedActionForEvent(
  reviewStatus: SecurityEventReviewStatus,
  severity: string
): string {
  if (reviewStatus === "escalated") {
    return "Track the linked incident through resolve or reopen — duplicate escalation is blocked.";
  }
  if (reviewStatus === "dismissed") {
    return "No further action — event remains in catalog for auditability.";
  }
  if (reviewStatus === "reviewed") {
    return "Monitor for recurrence; escalate if severity increases or workflow impact spreads.";
  }
  if (severity === "info" || severity === "low") {
    return "Review recommended — dismiss only if truly informational.";
  }
  if (severity === "critical" || severity === "high") {
    return "Review urgently — consider escalation to an incident if business impact is confirmed.";
  }
  return "Review observed security activity and document outcome.";
}

export type SecurityEventEnriched = {
  event: SecurityEvent;
  reviewStatus: SecurityEventReviewStatus;
  escalatedIncidentId: string | null;
  escalatedIncidentTitle: string | null;
  recommendedAction: string;
  workflowName: string | null;
  referenceCode: string | null;
};

export async function listSecurityEventsEnriched(
  tenantId: string,
  options?: { limit?: number; logisticsOnly?: boolean; reviewFilter?: SecurityEventReviewStatus | "all" }
): Promise<SecurityEventEnriched[]> {
  const events = await listTenantSecurityEvents(tenantId, {
    limit: options?.limit ?? 80,
    logisticsOnly: options?.logisticsOnly,
  });

  const incidents = await prisma.incident.findMany({
    where: { tenantId },
    select: { id: true, title: true },
  });
  const titleById = new Map(incidents.map((i) => [i.id, i.title]));

  const filter = options?.reviewFilter ?? "all";

  return events
    .map((event) => {
      const p = payloadObject(event.payload);
      const reviewStatus = getSecurityEventReviewStatus(event.payload);
      const escalatedIncidentId =
        typeof p.escalatedIncidentId === "string" ? p.escalatedIncidentId : null;
      return {
        event,
        reviewStatus,
        escalatedIncidentId,
        escalatedIncidentTitle: escalatedIncidentId
          ? titleById.get(escalatedIncidentId) ?? null
          : null,
        recommendedAction: recommendedActionForEvent(reviewStatus, event.severity),
        workflowName: typeof p.workflowName === "string" ? p.workflowName : null,
        referenceCode: typeof p.referenceCode === "string" ? p.referenceCode : null,
      };
    })
    .filter((row) => filter === "all" || row.reviewStatus === filter);
}

export type IncidentStatusHistoryEntry = {
  at: Date;
  previousStatus?: string;
  nextStatus?: string;
};

export type IncidentEnriched = {
  incident: Incident;
  linkedEvent: {
    id: string;
    eventType: string;
    severity: string;
  } | null;
  statusHistory: IncidentStatusHistoryEntry[];
  relatedAuditCount: number;
  evidenceHints: string[];
  recommendedAction: string;
};

function recommendedActionForIncident(incident: Incident): string {
  const status = normalizeIncidentStatus(incident.status);
  if (status === INCIDENT_STATUS.open) {
    return "Acknowledge under review and assign evidence references in GRC.";
  }
  if (status === INCIDENT_STATUS.under_review) {
    return "Document findings, link compliance evidence, then resolve when remediation is verified.";
  }
  if (status === INCIDENT_STATUS.resolved) {
    return "Reopen if recurrence is observed; otherwise monitor related security events.";
  }
  if (status === INCIDENT_STATUS.reopened) {
    return "Return to under review and capture updated audit notes.";
  }
  return "Review incident workflow state.";
}

export async function listIncidentsEnriched(tenantId: string): Promise<IncidentEnriched[]> {
  const [incidents, events, auditLogs] = await Promise.all([
    prisma.incident.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    listTenantSecurityEvents(tenantId, { limit: 200 }),
    prisma.cybercrowAuditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
  ]);

  const eventByIncidentId = new Map<string, SecurityEvent>();
  for (const e of events) {
    const p = payloadObject(e.payload);
    const incId = typeof p.escalatedIncidentId === "string" ? p.escalatedIncidentId : null;
    if (incId && !eventByIncidentId.has(incId)) {
      eventByIncidentId.set(incId, e);
    }
  }

  return incidents.map((incident) => {
    const linked = eventByIncidentId.get(incident.id);
    const statusHistory = auditLogs
      .filter(
        (log) =>
          log.entityType === "incident" &&
          log.entityId === incident.id &&
          log.action === "INCIDENT_STATUS_CHANGED"
      )
      .map((log) => {
        const meta = payloadObject(log.metadata);
        return {
          at: log.createdAt,
          previousStatus:
            typeof meta.previousStatus === "string" ? meta.previousStatus : undefined,
          nextStatus: typeof meta.nextStatus === "string" ? meta.nextStatus : undefined,
        };
      })
      .reverse();

    const relatedAuditCount = auditLogs.filter(
      (log) =>
        (log.entityType === "incident" && log.entityId === incident.id) ||
        (linked && log.entityType === "security_event" && log.entityId === linked.id)
    ).length;

    const evidenceHints = [
      "Incident status change entries in CyberCrow audit log",
      linked ? "Escalated security event record (payload link)" : "Originating security event not linked in payload",
      "Compliance evidence rows mapped to NCA control keys",
      "GRC finding closure note when remediation completes",
    ];

    return {
      incident,
      linkedEvent: linked
        ? { id: linked.id, eventType: linked.eventType, severity: linked.severity }
        : null,
      statusHistory,
      relatedAuditCount,
      evidenceHints,
      recommendedAction: recommendedActionForIncident(incident),
    };
  });
}

export type RiskPostureDetail = {
  score: number;
  trend: "up" | "down" | "stable";
  contributors: { label: string; impact: string; detail: string }[];
  recommendedActions: string[];
};

export async function getRiskPostureDetail(tenantId: string): Promise<RiskPostureDetail> {
  const metrics = await getCybercrowDashboardMetrics(tenantId);
  const grc = await getCybercrowGrcSummary(tenantId);
  const openIncidents = await prisma.incident.count({
    where: { tenantId, status: { in: [INCIDENT_STATUS.open, INCIDENT_STATUS.reopened] } },
  });

  const atRiskControls = metrics.controls.filter(
    (c) => c.status === "at_risk" || c.status === "not_assessed"
  ).length;

  const contributors: RiskPostureDetail["contributors"] = [
    {
      label: "Open incidents",
      impact: openIncidents > 0 ? "Negative" : "Neutral",
      detail: `${openIncidents} open or reopened incident(s) (−12 each in formula)`,
    },
    {
      label: "High-severity events",
      impact: metrics.highSeverityEventCount > 0 ? "Negative" : "Neutral",
      detail: `${metrics.highSeverityEventCount} medium+ events (up to −24 total)`,
    },
    {
      label: "Compliance controls",
      impact: metrics.compliancePct < 70 ? "Negative" : "Positive",
      detail: `${metrics.compliancePct}% average control readiness`,
    },
    {
      label: "Evidence gaps",
      impact: grc.evidenceCount === 0 ? "Negative" : "Neutral",
      detail: `${grc.evidenceCount} evidence item(s) on file`,
    },
    {
      label: "GRC findings",
      impact: grc.openFindings > 0 ? "Negative" : "Neutral",
      detail: `${grc.openFindings} open finding(s)`,
    },
  ];

  const recommendedActions: string[] = [];
  if (openIncidents > 0) {
    recommendedActions.push("Close or progress open incidents to improve posture score.");
  }
  if (metrics.highSeverityEventCount > 0) {
    recommendedActions.push("Triage security events — review pending items first.");
  }
  if (atRiskControls > 0) {
    recommendedActions.push("Attach evidence or update status for at-risk compliance controls.");
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push("Continue periodic audit and identity review — posture is stable.");
  }

  return {
    score: metrics.riskScore,
    trend: metrics.riskTrend,
    contributors,
    recommendedActions,
  };
}

export type EvidenceReadiness = {
  evidenceCount: number;
  controlCount: number;
  controlsMissingEvidence: { controlKey: string; status: string }[];
  guidance: string[];
  incidentEvidenceHints: string[];
};

export async function getEvidenceReadiness(tenantId: string): Promise<EvidenceReadiness> {
  const [grc, controls, incidents] = await Promise.all([
    getCybercrowGrcSummary(tenantId),
    listTenantComplianceControls(tenantId),
    prisma.incident.findMany({
      where: { tenantId, status: { not: INCIDENT_STATUS.resolved } },
      take: 10,
      select: { id: true, title: true, status: true },
    }),
  ]);

  const controlsMissingEvidence = controls
    .filter((c) => c._count.evidence === 0)
    .slice(0, 8)
    .map((c) => ({ controlKey: c.controlKey, status: c.status }));

  const guidance = [
    "Audit log entries for incident status changes and security event reviews",
    "Compliance evidence titles linked to control keys (read-only catalog)",
    "Security event payload retains review and escalation metadata",
    "Identity/session telemetry summaries when auth flows record events",
  ];

  const incidentEvidenceHints = incidents.map(
    (i) => `${i.title} (${normalizeIncidentStatus(i.status)}) — link GRC evidence to remediation`
  );

  return {
    evidenceCount: grc.evidenceCount,
    controlCount: grc.controlCount,
    controlsMissingEvidence,
    guidance,
    incidentEvidenceHints,
  };
}

export async function findSecurityEventForIncident(
  tenantId: string,
  incidentId: string
): Promise<SecurityEvent | null> {
  const events = await listTenantSecurityEvents(tenantId, { limit: 200 });
  for (const e of events) {
    const p = payloadObject(e.payload);
    if (p.escalatedIncidentId === incidentId) return e;
  }
  return null;
}

export function incidentNeedsAttention(incident: Incident): boolean {
  return isOpenIncidentStatus(incident.status);
}
