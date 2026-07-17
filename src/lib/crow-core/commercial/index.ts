/**
 * C0 — ROI model and SOW generation (advisory until approved).
 */

import type { ApprovalStatus, ConfidenceLevel, VersionLabel } from "../common";

export type RoiAssumptionSource =
  | "discovery_interview"
  | "client_submitted"
  | "benchmark"
  | "operator_estimate"
  | "historical_data"
  | "ai_assisted_draft";

export type RoiAssumption = {
  key: string;
  label: string;
  source: RoiAssumptionSource;
  value: number;
  unit: string;
  confidence: ConfidenceLevel;
  owner: string;
  approvalStatus: ApprovalStatus;
  /** Reference to formula or sibling assumption keys used in calculation. */
  formulaRelationship: string | null;
};

export const ROI_DIMENSION_KEYS = [
  "manual_process_cost",
  "duplicate_work",
  "processing_delays",
  "approval_delays",
  "rework",
  "error_correction",
  "downtime_exposure",
  "security_exposure",
  "compliance_effort",
  "audit_preparation",
  "user_administration",
  "software_consolidation",
  "productivity_gains",
  "onboarding_time_reduction",
] as const;

export type RoiDimensionKey = (typeof ROI_DIMENSION_KEYS)[number];

export type RoiModel = {
  blueprintVersion: VersionLabel;
  assumptions: readonly RoiAssumption[];
  currentAnnualCostEstimate: number | null;
  implementationCostEstimate: number | null;
  subscriptionAnnualEstimate: number | null;
  projectedAnnualSavings: number | null;
  paybackPeriodMonths: number | null;
  threeYearValue: number | null;
  riskReductionValue: number | null;
  confidenceRange: { low: number; high: number } | null;
  exclusions: readonly string[];
  /** ROI values must not be invented without sourced assumptions. */
  advisoryOnly: true;
};

export const SOW_SECTION_KEYS = [
  "title_page",
  "objective",
  "scope",
  "organization_coverage",
  "departments",
  "branches",
  "account_volume",
  "capabilities",
  "workflows",
  "integrations",
  "security_controls",
  "sarea_experiences",
  "ai_capabilities",
  "migration_responsibilities",
  "implementation_phases",
  "deliverables",
  "responsibilities",
  "exclusions",
  "milestones",
  "acceptance_criteria",
  "support",
  "change_control",
  "pricing_and_payment",
  "assumptions_and_dependencies",
] as const;

export type SowSectionKey = (typeof SOW_SECTION_KEYS)[number];

export type RoiScenario = "CONSERVATIVE" | "BASE" | "OPTIMISTIC";

export type RoiConfidence = "LOW" | "MEDIUM" | "HIGH";

export type RoiEvidenceSource = {
  id: string;
  label: string;
  sourceType: "discovery" | "assumption" | "blueprint" | "manual";
  referenceId?: string;
};

export type RoiCalculation = {
  scenario: RoiScenario;
  annualBenefitSar: number;
  annualCostSar: number;
  netAnnualBenefitSar: number;
  paybackMonths: number | null;
  threeYearRoiPercent: number | null;
  assumptionIds: string[];
  formulaInputs: Record<string, number>;
};

export type RoiResult = {
  model: RoiModel;
  calculations: RoiCalculation[];
  confidence: RoiConfidence;
  evidenceSources: RoiEvidenceSource[];
  advisoryFooter: string;
};

export type SowSection = {
  key: SowSectionKey;
  title: string;
  body: string;
};

export type SowDraft = {
  blueprintVersion: VersionLabel;
  title: string;
  sections: readonly SowSection[];
  generatedAtIso: string;
  approvalStatus: ApprovalStatus;
  advisoryDisclaimer: "Generated SOW remains advisory until reviewed and approved by ProCrow and client.";
};
