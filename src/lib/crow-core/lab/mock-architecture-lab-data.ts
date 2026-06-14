/**
 * C0 Architecture Lab — mock reference data only.
 * Never persisted; never used in production flows.
 */

import type { ProcessLifecycleStage } from "../process";
import { PROCESS_LIFECYCLE_STAGES } from "../process";
import type { SecuritySignalSeverity } from "../security";

export const ARCHITECTURE_LAB_REFERENCE = {
  isReferencePrototype: true as const,
  label: "Architecture Lab / Reference Prototype — mock data only",
  tenantId: "tenant_mock_c0_lab",
  blueprintVersion: "bpv_mock_2026_06_001",
} as const;

export const MOCK_PLATFORM_SURFACES = [
  { id: "public", label: "Public website", purpose: "Education, intake, pricing" },
  { id: "client", label: "Client Portal", purpose: "Request, discovery, proposal, onboarding" },
  { id: "procrow", label: "ProCrow", purpose: "Prepare, govern, release tenants" },
  { id: "business", label: "Business Portal", purpose: "CEM operational runtime" },
] as const;

export const MOCK_BLUEPRINT_SLICES = [
  { key: "organizational", label: "Organizational", completeness: 78 },
  { key: "operational", label: "Operational", completeness: 65 },
  { key: "securityTrust", label: "Security & trust", completeness: 72 },
  { key: "experience", label: "Experience", completeness: 58 },
  { key: "integration", label: "Integration", completeness: 44 },
  { key: "commercial", label: "Commercial", completeness: 81 },
] as const;

export const MOCK_ROI_ASSUMPTIONS = [
  {
    id: "roi_a1",
    label: "Hours saved per approval cycle",
    value: 4.5,
    unit: "hours",
    confidence: "medium" as const,
    source: "Operator estimate — MEEM pilot",
    approvalStatus: "draft" as const,
  },
  {
    id: "roi_a2",
    label: "FTE cost basis",
    value: 180,
    unit: "SAR/hour",
    confidence: "low" as const,
    source: "Finance placeholder",
    approvalStatus: "pending_review" as const,
  },
] as const;

export const MOCK_SOW_SECTIONS = [
  { key: "scope", title: "Scope of services", status: "draft" },
  { key: "deliverables", title: "Deliverables", status: "draft" },
  { key: "assumptions", title: "Assumptions", status: "advisory" },
  { key: "commercial", title: "Commercial terms", status: "pending_approval" },
] as const;

export const MOCK_ENTITY_PROFILE = {
  entityRef: { domain: "people", entityType: "Person", entityId: "person_mock_001" },
  displayName: "Sara Al-Qahtani",
  role: "Operations manager",
  department: "Logistics",
  sensitivity: "internal" as const,
  lifecycle: "active" as const,
};

export const MOCK_WORK_QUEUE = [
  { id: "wi_1", title: "Approve purchase requisition #4421", priority: "high", slaHours: 8 },
  { id: "wi_2", title: "Review security baseline delta", priority: "medium", slaHours: 24 },
  { id: "wi_3", title: "Validate experience mapping for warehouse role", priority: "low", slaHours: 48 },
] as const;

export const MOCK_DECISION = {
  id: "dec_mock_001",
  title: "Release configuration v3.2 to pilot tenant",
  status: "pending_approval" as const,
  assistanceSummary:
    "Advisory: 2 open security signals and 1 incomplete integration slice. Human approval required.",
  prohibitedAutonomous: true,
};

export const MOCK_SECURITY_SIGNALS: ReadonlyArray<{
  id: string;
  dimension: string;
  severity: SecuritySignalSeverity;
  summary: string;
  recommendedAction: string;
}> = [
  {
    id: "sig_1",
    dimension: "session_trust",
    severity: "medium",
    summary: "Elevated session risk on shared kiosk profile",
    recommendedAction: "Require step-up authentication for financial approvals",
  },
  {
    id: "sig_2",
    dimension: "least_privilege",
    severity: "low",
    summary: "Role bundle includes legacy report export permission",
    recommendedAction: "Split export permission into scoped role",
  },
];

export const MOCK_SAREA_PERSONAS = [
  { persona: "requester", primarySurface: "Work queue", density: "compact" },
  { persona: "manager", primarySurface: "Decision workspace", density: "comfortable" },
  { persona: "security_operator", primarySurface: "Evidence timeline", density: "dense" },
] as const;

export const MOCK_AI_RECOMMENDATION = {
  capability: "decision_assistance",
  riskTier: "medium" as const,
  humanInTheLoop: true,
  summary: "Suggest approval checklist based on blueprint slice completeness — not an approval.",
  prohibitedActions: ["autonomous_approval", "privileged_access_grant", "contract_execution"],
};

export const MOCK_SAUDI_CAPABILITIES = [
  {
    id: "nafath",
    label: "Nafath identity assurance",
    status: "assessment_only" as const,
    note: "Identity assurance only — never grants Crow authorization",
  },
  {
    id: "zatca",
    label: "ZATCA e-invoicing readiness",
    status: "blueprint_field" as const,
    note: "Blueprint assessment field — no live integration in C0",
  },
] as const;

export const MOCK_TRACEABILITY_CHAIN = [
  "Discovery evidence",
  "Blueprint version",
  "Commercial impact",
  "Approval",
  "Change request",
  "Configuration release",
  "Runtime deployment",
  "Verification evidence",
  "Operating history",
] as const;

export const MOCK_LIFECYCLE_HIGHLIGHTS: ReadonlyArray<{
  stage: ProcessLifecycleStage;
  label: string;
}> = PROCESS_LIFECYCLE_STAGES.slice(0, 8).map((stage) => ({
  stage,
  label: stage.replace(/_/g, " "),
}));
