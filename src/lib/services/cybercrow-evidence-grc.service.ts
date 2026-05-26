import type { ComplianceEvidence } from "@prisma/client";
import { INCIDENT_STATUS, normalizeIncidentStatus } from "@/lib/constants/cybercrow-incident-status";
import { getNcaControlDefinition } from "@/lib/constants/nca-compliance-controls";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { getCybercrowIdentityTelemetrySummary } from "@/lib/services/cybercrow-identity-telemetry.service";
import {
  getSecurityEventReviewStatus,
  type SecurityEventReviewStatus,
} from "@/lib/services/cybercrow-mutations.service";
import {
  getCybercrowGrcSummary,
  listTenantComplianceControls,
  listTenantComplianceControlsWithEvidence,
  listTenantComplianceEvidence,
  listTenantGrcFindings,
  listTenantSecurityEvents,
} from "@/lib/services/cybercrow-tenant.service";

export type EvidenceSource =
  | "incident"
  | "event"
  | "audit"
  | "identity"
  | "workflow"
  | "policy"
  | "manual"
  | "catalog";

export type EvidenceCatalogStatus = "available" | "needs_review" | "recommended";

export type EvidenceCatalogEntry = {
  id: string;
  title: string;
  controlKey: string;
  domain: string;
  frameworkId: string;
  category: string;
  source: EvidenceSource;
  status: EvidenceCatalogStatus;
  owner: string;
  lastUpdated: Date;
  storageKey: string | null;
  controlStatus: string;
  fileBacked: boolean;
};

export type EvidenceGapSeverity = "advisory" | "medium" | "high";

export type EvidenceGap = {
  id: string;
  title: string;
  severity: EvidenceGapSeverity;
  whyItMatters: string;
  suggestedEvidence: string;
  relatedRouteLabel: string;
  relatedHref: string;
  status: "open" | "advisory";
};

export type ReadinessLabel =
  | "ready_for_review"
  | "needs_evidence"
  | "needs_owner"
  | "not_enabled"
  | "advisory_only";

export type ControlReadinessRow = {
  controlKey: string;
  frameworkId: string;
  title: string;
  domain: string;
  readiness: ReadinessLabel;
  controlStatus: string;
  evidenceCount: number;
  missingEvidenceCount: number;
  requiredExamples: string[];
  availableTitles: string[];
  recommendedAction: string;
};

export type GrcDomainGroup = {
  domainLabel: string;
  readiness: ReadinessLabel;
  controlCount: number;
  evidenceCount: number;
  missingEvidenceCount: number;
  openFindings: number;
  controls: ControlReadinessRow[];
};

const REQUIRED_EVIDENCE_BY_CONTROL: Record<string, string[]> = {
  "access-control": ["RBAC matrix", "Conditional access / MFA policy", "Privileged access review"],
  "audit-logging": ["Audit retention config", "SOC review sample", "Log integrity check"],
  "data-protection": ["Data classification", "Encryption attestation", "Retention policy"],
  "incident-response": ["IR playbook", "Incident review record", "Post-incident evidence"],
};

function inferEvidenceSource(title: string, controlKey: string): EvidenceSource {
  const t = title.toLowerCase();
  if (t.includes("audit") || t.includes("siem") || t.includes("log")) return "audit";
  if (t.includes("incident") || t.includes("playbook") || t.includes("tabletop") || t.includes("ir "))
    return "incident";
  if (t.includes("entra") || t.includes("access") || t.includes("rbac") || t.includes("mfa"))
    return "identity";
  if (t.includes("workflow") || t.includes("dispatch") || t.includes("route"))
    return "workflow";
  if (t.includes("policy") || t.includes("attestation")) return "policy";
  if (controlKey === "incident-response") return "incident";
  if (controlKey === "audit-logging") return "audit";
  if (controlKey === "access-control") return "identity";
  return "catalog";
}

function catalogStatus(row: ComplianceEvidence & { storageKey: string | null }): EvidenceCatalogStatus {
  if (row.storageKey) return "available";
  return "needs_review";
}

function readinessForControl(
  status: string,
  evidenceCount: number
): ReadinessLabel {
  if (evidenceCount === 0) return "needs_evidence";
  if (status === "not_assessed" || status === "at_risk") return "needs_owner";
  if (status === "compliant" && evidenceCount > 0) return "ready_for_review";
  return "advisory_only";
}

function buildControlRow(
  controlKey: string,
  status: string,
  evidenceCount: number,
  evidenceTitles: string[]
): ControlReadinessRow {
  const nca = getNcaControlDefinition(controlKey);
  const required = REQUIRED_EVIDENCE_BY_CONTROL[controlKey] ?? [
    "Operator-managed evidence title",
    "Audit trail reference",
  ];
  const missing = Math.max(0, required.length - evidenceTitles.length);
  let recommendedAction = "Review mapped evidence during periodic GRC cycle.";
  if (evidenceCount === 0) {
    recommendedAction = "Attach catalog evidence rows or document operator-managed artifacts.";
  } else if (status === "at_risk" || status === "not_assessed") {
    recommendedAction = "Update control status after evidence review — advisory only.";
  }

  return {
    controlKey,
    frameworkId: nca.frameworkId,
    title: nca.title,
    domain: nca.domain,
    readiness: readinessForControl(status, evidenceCount),
    controlStatus: status,
    evidenceCount,
    missingEvidenceCount: missing,
    requiredExamples: required,
    availableTitles: evidenceTitles,
    recommendedAction,
  };
}

export async function getEvidenceCatalog(tenantId: string): Promise<EvidenceCatalogEntry[]> {
  const rows = await listTenantComplianceEvidence(tenantId, 120);
  return rows.map((e) => {
    const nca = getNcaControlDefinition(e.control.controlKey);
    const fileBacked = Boolean(e.storageKey);
    return {
      id: e.id,
      title: e.title,
      controlKey: e.control.controlKey,
      domain: nca.domain,
      frameworkId: nca.frameworkId,
      category: nca.domain,
      source: inferEvidenceSource(e.title, e.control.controlKey),
      status: catalogStatus(e),
      owner: "Not assigned",
      lastUpdated: e.createdAt,
      storageKey: e.storageKey,
      controlStatus: e.control.status,
      fileBacked,
    };
  });
}

export async function getEvidenceGaps(
  tenantId: string,
  tenantSlug: string
): Promise<EvidenceGap[]> {
  const r = routes.tenant(tenantSlug).cybercrow;
  const [controls, events, incidents, findings, identity, grc] = await Promise.all([
    listTenantComplianceControls(tenantId),
    listTenantSecurityEvents(tenantId, { limit: 100 }),
    prisma.incident.findMany({ where: { tenantId }, select: { id: true, title: true, status: true, severity: true } }),
    listTenantGrcFindings(tenantId),
    getCybercrowIdentityTelemetrySummary(tenantId),
    getCybercrowGrcSummary(tenantId),
  ]);

  const gaps: EvidenceGap[] = [];

  for (const c of controls.filter((x) => x._count.evidence === 0)) {
    const nca = getNcaControlDefinition(c.controlKey);
    gaps.push({
      id: `control-${c.controlKey}`,
      title: `Control without evidence: ${nca.title}`,
      severity: c.status === "at_risk" ? "high" : "medium",
      whyItMatters: "Auditors expect mapped artifacts for each NCA-aligned control key.",
      suggestedEvidence: (REQUIRED_EVIDENCE_BY_CONTROL[c.controlKey] ?? ["Operator evidence note"])[0]!,
      relatedRouteLabel: "Evidence repository",
      relatedHref: r.evidence,
      status: "open",
    });
  }

  for (const i of incidents.filter((x) => {
    const s = normalizeIncidentStatus(x.status);
    return s !== INCIDENT_STATUS.resolved;
  })) {
    gaps.push({
      id: `incident-${i.id}`,
      title: `Open incident: ${i.title}`,
      severity: i.severity === "high" || i.severity === "critical" ? "high" : "medium",
      whyItMatters: "Unresolved incidents should have review notes and audit-backed status changes.",
      suggestedEvidence: "Incident status timeline + linked security event + GRC remediation note",
      relatedRouteLabel: "Incidents",
      relatedHref: r.incidents,
      status: "open",
    });
  }

  for (const e of events) {
    const review = getSecurityEventReviewStatus(e.payload);
    if (review !== "pending") continue;
    if (e.severity !== "medium" && e.severity !== "high" && e.severity !== "critical") continue;
    gaps.push({
      id: `event-${e.id}`,
      title: `Event pending review (${e.severity})`,
      severity: e.severity === "high" || e.severity === "critical" ? "high" : "medium",
      whyItMatters: "Unreviewed medium+ events weaken SOC evidence chain for auditors.",
      suggestedEvidence: "Review outcome in event payload + audit log entry",
      relatedRouteLabel: "Security events",
      relatedHref: r.securityEvents,
      status: "open",
    });
  }

  for (const f of findings.filter((x) => x.status === "open")) {
    gaps.push({
      id: `finding-${f.id}`,
      title: `Open GRC finding: ${f.title}`,
      severity: "medium",
      whyItMatters: "Findings without closure evidence leave governance gaps in readiness packs.",
      suggestedEvidence: "Finding closure note linked to control remediation",
      relatedRouteLabel: "GRC overview",
      relatedHref: r.grc,
      status: "open",
    });
  }

  if (!identity.hasStoredTelemetry) {
    gaps.push({
      id: "identity-telemetry",
      title: "Identity/session telemetry not recorded",
      severity: "advisory",
      whyItMatters: "Access reviews benefit from login and session signals when auth flows record them.",
      suggestedEvidence: "Identity telemetry summary + access review checklist",
      relatedRouteLabel: "Identity",
      relatedHref: r.identity,
      status: "advisory",
    });
  }

  if (grc.evidenceCount === 0 && grc.controlCount > 0) {
    gaps.push({
      id: "no-evidence",
      title: "No compliance evidence on file",
      severity: "high",
      whyItMatters: "Control mapping exists but catalog rows are empty — readiness review incomplete.",
      suggestedEvidence: "Seed or provision baseline evidence titles per control",
      relatedRouteLabel: "Compliance controls",
      relatedHref: r.compliance,
      status: "open",
    });
  }

  const severityOrder: Record<EvidenceGapSeverity, number> = {
    high: 0,
    medium: 1,
    advisory: 2,
  };
  return gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export async function getGrcControlReadiness(tenantId: string): Promise<GrcDomainGroup[]> {
  const controls = await listTenantComplianceControlsWithEvidence(tenantId, 8);
  const findings = await listTenantGrcFindings(tenantId);
  const openFindingTitles = new Set(
    findings.filter((f) => f.status === "open").map((f) => f.title)
  );

  const byDomain = new Map<string, ControlReadinessRow[]>();
  for (const c of controls) {
    const row = buildControlRow(
      c.controlKey,
      c.status,
      c._count.evidence,
      c.evidence.map((e) => e.title)
    );
    const list = byDomain.get(row.domain) ?? [];
    list.push(row);
    byDomain.set(row.domain, list);
  }

  return [...byDomain.entries()].map(([domainLabel, domainControls]) => {
    const evidenceCount = domainControls.reduce((n, c) => n + c.evidenceCount, 0);
    const missingEvidenceCount = domainControls.reduce((n, c) => n + c.missingEvidenceCount, 0);
    const needsEvidence = domainControls.some((c) => c.readiness === "needs_evidence");
    const needsOwner = domainControls.some((c) => c.readiness === "needs_owner");
    const readiness: ReadinessLabel = needsEvidence
      ? "needs_evidence"
      : needsOwner
        ? "needs_owner"
        : domainControls.every((c) => c.readiness === "ready_for_review")
          ? "ready_for_review"
          : "advisory_only";

    return {
      domainLabel,
      readiness,
      controlCount: domainControls.length,
      evidenceCount,
      missingEvidenceCount,
      openFindings: openFindingTitles.size > 0 && domainLabel.includes("Identity") ? 1 : 0,
      controls: domainControls,
    };
  });
}

export async function getControlEvidenceMapping(tenantId: string): Promise<ControlReadinessRow[]> {
  const controls = await listTenantComplianceControlsWithEvidence(tenantId, 12);
  return controls.map((c) =>
    buildControlRow(
      c.controlKey,
      c.status,
      c._count.evidence,
      c.evidence.map((e) => e.title)
    )
  );
}

export type ReportReadiness = {
  headline: string;
  bullets: string[];
  deferredExports: string[];
  copyableSummary: string;
};

export async function getReportReadiness(
  tenantId: string,
  tenantSlug: string
): Promise<ReportReadiness> {
  const [grc, gaps, socIncidents] = await Promise.all([
    getCybercrowGrcSummary(tenantId),
    getEvidenceGaps(tenantId, tenantSlug),
    prisma.incident.count({
      where: {
        tenantId,
        status: { in: [INCIDENT_STATUS.open, INCIDENT_STATUS.reopened, INCIDENT_STATUS.under_review] },
      },
    }),
  ]);

  const bullets = [
    `${grc.controlCount} NCA-aligned controls · ${grc.evidenceCount} catalog evidence row(s)`,
    `${grc.openFindings} open GRC finding(s) · ${gaps.length} advisory evidence gap(s)`,
    `${socIncidents} active incident(s) in workflow`,
    "Audit trail: CyberCrow audit logs (append-only, operator actions)",
    "File upload / attestation workflow: not enabled in this phase",
  ];

  const deferredExports = [
    "Evidence pack export (PDF/ZIP) — future",
    "Audit report export — future",
    "GRC readiness report for external assessors — future",
  ];

  const copyableSummary = [
    `CyberCrow GRC readiness summary (${tenantSlug})`,
    `Controls: ${grc.controlCount} | Evidence items: ${grc.evidenceCount} | Open findings: ${grc.openFindings}`,
    `Evidence gaps (advisory): ${gaps.length}`,
    `Active incidents: ${socIncidents}`,
    "Posture is operator-managed and advisory — not a certification attestation.",
  ].join("\n");

  return {
    headline: "Report readiness (advisory)",
    bullets,
    deferredExports,
    copyableSummary,
  };
}

export type EventEvidenceContext = {
  reviewStatus: SecurityEventReviewStatus;
  evidenceReady: boolean;
  hints: string[];
  auditNote: string;
};

export function getEventEvidenceContext(
  reviewStatus: SecurityEventReviewStatus,
  severity: string,
  hasLinkedIncident: boolean
): EventEvidenceContext {
  const hints = [
    "Security event row with review metadata in payload",
    "CyberCrow audit log entry when reviewed, dismissed, or escalated",
    hasLinkedIncident ? "Linked incident status timeline" : "Escalation creates incident + audit link",
    "Optional mapping to compliance control evidence titles",
  ];

  let evidenceReady = reviewStatus === "reviewed" || reviewStatus === "escalated";
  if (reviewStatus === "dismissed" && (severity === "info" || severity === "low")) {
    evidenceReady = true;
  }

  const auditNote =
    reviewStatus === "pending"
      ? "Event is not evidence-ready until review outcome is recorded."
      : reviewStatus === "escalated"
        ? "Escalated — treat linked incident workflow as primary evidence chain."
        : "Review state captured — include in SOC evidence pack as advisory.";

  return { reviewStatus, evidenceReady, hints, auditNote };
}

export type RiskGrcSignals = {
  gapCount: number;
  highGapCount: number;
  openIncidents: number;
  pendingReviewEvents: number;
  controlsWithoutEvidence: number;
  compliancePct: number | null;
  summaryLines: string[];
};

export async function getRiskGrcSignals(tenantId: string, tenantSlug: string): Promise<RiskGrcSignals> {
  const [gaps, grc, events, openIncidents] = await Promise.all([
    getEvidenceGaps(tenantId, tenantSlug),
    getCybercrowGrcSummary(tenantId),
    listTenantSecurityEvents(tenantId, { limit: 80 }),
    prisma.incident.count({
      where: {
        tenantId,
        status: { in: [INCIDENT_STATUS.open, INCIDENT_STATUS.reopened] },
      },
    }),
  ]);

  let pendingReviewEvents = 0;
  for (const e of events) {
    if (getSecurityEventReviewStatus(e.payload) === "pending") pendingReviewEvents++;
  }

  const controls = await listTenantComplianceControls(tenantId);
  const controlsWithoutEvidence = controls.filter((c) => c._count.evidence === 0).length;

  const highGapCount = gaps.filter((g) => g.severity === "high").length;

  const summaryLines: string[] = [];
  if (highGapCount > 0) summaryLines.push(`${highGapCount} high-severity evidence gap(s).`);
  if (openIncidents > 0) summaryLines.push(`${openIncidents} open incident(s) affect posture.`);
  if (pendingReviewEvents > 0) {
    summaryLines.push(`${pendingReviewEvents} security event(s) awaiting review.`);
  }
  if (controlsWithoutEvidence > 0) {
    summaryLines.push(`${controlsWithoutEvidence} control(s) lack mapped evidence.`);
  }
  if (grc.openFindings > 0) summaryLines.push(`${grc.openFindings} open GRC finding(s).`);
  if (summaryLines.length === 0) {
    summaryLines.push("No critical evidence gaps — continue periodic audit review.");
  }

  return {
    gapCount: gaps.length,
    highGapCount,
    openIncidents,
    pendingReviewEvents,
    controlsWithoutEvidence,
    compliancePct: grc.compliancePct,
    summaryLines,
  };
}

export function readinessLabelText(label: ReadinessLabel): string {
  switch (label) {
    case "ready_for_review":
      return "Ready for review";
    case "needs_evidence":
      return "Needs evidence";
    case "needs_owner":
      return "Needs owner";
    case "not_enabled":
      return "Not enabled";
    default:
      return "Advisory only";
  }
}

export function readinessLabelClass(label: ReadinessLabel): string {
  switch (label) {
    case "ready_for_review":
      return "text-teal-300 bg-teal-500/10 border-teal-500/20";
    case "needs_evidence":
      return "text-amber-300 bg-amber-500/10 border-amber-500/20";
    case "needs_owner":
      return "text-violet-300 bg-violet-500/10 border-violet-500/20";
    case "not_enabled":
      return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    default:
      return "text-slate-400 bg-indigo-500/10 border-indigo-500/20";
  }
}

export function evidenceSourceLabel(source: EvidenceSource): string {
  const labels: Record<EvidenceSource, string> = {
    incident: "Incident",
    event: "Security event",
    audit: "Audit trail",
    identity: "Identity / session",
    workflow: "Workflow",
    policy: "Policy",
    manual: "Manual",
    catalog: "Catalog",
  };
  return labels[source];
}

export function gapSeverityClass(severity: EvidenceGapSeverity): string {
  if (severity === "high") return "text-rose-300 border-rose-500/25 bg-rose-950/20";
  if (severity === "medium") return "text-amber-300 border-amber-500/20 bg-amber-950/15";
  return "text-slate-400 border-slate-500/15 bg-slate-900/30";
}
