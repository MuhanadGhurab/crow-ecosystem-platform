/**
 * J4 — CyberCrow Evidence / GRC / Risk UX depth model.
 * Advisory copy and enums only — no runtime writes.
 */

export const CYBERCROW_UX_AREAS = [
  "dashboard",
  "security_events",
  "evidence",
  "grc",
  "risk",
  "audit_logs",
] as const;

export type CyberCrowUXArea = (typeof CYBERCROW_UX_AREAS)[number];

export const CYBERCROW_EVIDENCE_CATEGORIES = [
  "client_approval",
  "request_review",
  "onboarding",
  "access_review",
  "workflow_review",
  "runtime_event",
  "module_handoff",
  "tenant_change",
  "security_event",
  "grc_mapping",
] as const;

export type CyberCrowEvidenceCategory = (typeof CYBERCROW_EVIDENCE_CATEGORIES)[number];

export const CYBERCROW_EVIDENCE_READINESS_STATUSES = [
  "ready",
  "needs_review",
  "missing",
  "advisory",
  "not_applicable",
] as const;

export type CyberCrowEvidenceReadinessStatus =
  (typeof CYBERCROW_EVIDENCE_READINESS_STATUSES)[number];

export const CYBERCROW_RISK_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
] as const;

export type CyberCrowRiskLevel = (typeof CYBERCROW_RISK_LEVELS)[number];

export const CYBERCROW_OPERATOR_ACTIONS = [
  "review_event",
  "collect_evidence",
  "map_control",
  "validate_access",
  "review_risk",
  "confirm_runtime_safety",
  "document_exception",
] as const;

export type CyberCrowOperatorAction = (typeof CYBERCROW_OPERATOR_ACTIONS)[number];

export const CYBERCROW_IDENTITY = {
  shortName: "CyberCrow",
  procrowCapability: "ProCrow Trust & Security capability",
  tagline: "Evidence readiness, GRC mapping, and operator-reviewed risk signals.",
} as const;

export const CYBERCROW_SCOPE = {
  whatItIs: [
    "Audit trail visibility and evidence readiness catalog for operators.",
    "Advisory GRC control mapping (NCA-aware, ISO-aligned readiness language).",
    "Rule-based risk posture from live incidents, events, and control counts.",
    "Human-governed security event review — not autonomous remediation.",
  ],
  whatItIsNot: [
    "Not a SIEM replacement or production-grade SOC product.",
    "Not certified compliance, regulatory approval, or legal audit certification.",
    "Not autonomous detection, AI scoring, or guaranteed prevention.",
    "Not automatic remediation or unattended tenant provisioning.",
  ],
} as const;

export const CYBERCROW_COPY = {
  evidencePurpose:
    "Evidence readiness shows what artifacts operators can reference before external review — metadata and trails, not legal certification.",
  grcPurpose:
    "GRC mapping is advisory internal control preparation — map evidence to control domains and close gaps before assessor packs.",
  riskPurpose:
    "Risk posture is a transparent, rule-based score from open incidents, events, and control/evidence gaps — operator-reviewed.",
  auditPurpose:
    "Audit logs record platform, policy, and workflow actions for traceability — correlate with evidence and incidents when triaging.",
  eventsPurpose:
    "Security events are observed activity awaiting analyst review — escalate to incidents when warranted.",
  procrowOwnership:
    "CyberCrow operates under ProCrow. Tenant admins and delivery leads use this console; production launch remains F23-gated.",
  legalDisclaimer:
    "Catalog rows and posture summaries do not constitute legal evidence, certified audit readiness, or regulator attestation.",
} as const;

export const CYBERCROW_EVIDENCE_CATEGORY_LABELS: Record<CyberCrowEvidenceCategory, string> = {
  client_approval: "Client scope approval",
  request_review: "Review notes / request changes",
  onboarding: "Onboarding readiness",
  access_review: "Access / role review",
  workflow_review: "Workflow review",
  runtime_event: "Runtime event",
  module_handoff: "Module handoff",
  tenant_change: "Tenant change",
  security_event: "Security event",
  grc_mapping: "GRC control mapping",
};

export const CYBERCROW_READINESS_STATUS_LABELS: Record<
  CyberCrowEvidenceReadinessStatus,
  string
> = {
  ready: "Ready for review",
  needs_review: "Needs review",
  missing: "Missing",
  advisory: "Advisory",
  not_applicable: "N/A",
};

export const CYBERCROW_OPERATOR_ACTION_LABELS: Record<CyberCrowOperatorAction, string> = {
  review_event: "Review security event",
  collect_evidence: "Collect evidence",
  map_control: "Map control to evidence",
  validate_access: "Validate access",
  review_risk: "Review risk signal",
  confirm_runtime_safety: "Confirm runtime safety",
  document_exception: "Document exception",
};
