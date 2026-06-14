import type { EnterpriseBlueprintDocument } from "@/lib/crow-core/blueprint";
import type { RoiAssumption, RoiModel } from "@/lib/crow-core/commercial";
import { MEEM_BLUEPRINT_ID } from "@/lib/constants/meem";
import { getMeemMockBlueprint } from "@/lib/mock/meem-global";
import { adaptEnterpriseBlueprintDetail } from "../blueprint-adapter";

export const MEEM_REFERENCE_ASSUMPTION_LABEL =
  "Reference assumptions — not client-validated";

const REFERENCE_ROI_ASSUMPTIONS: readonly RoiAssumption[] = [
  {
    key: "manual_process_cost",
    label: "Manual procurement & dispatch coordination",
    source: "benchmark",
    value: 420_000,
    unit: "SAR/year",
    confidence: "medium",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_benefit_base",
  },
  {
    key: "duplicate_work",
    label: "Duplicate data entry across hubs",
    source: "operator_estimate",
    value: 95_000,
    unit: "SAR/year",
    confidence: "low",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_benefit_base",
  },
  {
    key: "processing_delays",
    label: "Approval & receiving delays",
    source: "benchmark",
    value: 180_000,
    unit: "SAR/year",
    confidence: "medium",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_benefit_base",
  },
  {
    key: "productivity_gains",
    label: "Fleet & warehouse productivity uplift",
    source: "ai_assisted_draft",
    value: 260_000,
    unit: "SAR/year",
    confidence: "low",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_benefit_base",
  },
  {
    key: "error_correction",
    label: "Shipment & asset tagging errors",
    source: "operator_estimate",
    value: 48_000,
    unit: "SAR/year",
    confidence: "low",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_cost_base",
  },
  {
    key: "compliance_effort",
    label: "NCA-aligned audit preparation",
    source: "benchmark",
    value: 72_000,
    unit: "SAR/year",
    confidence: "medium",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_cost_base",
  },
  {
    key: "user_administration",
    label: "Identity & access administration",
    source: "operator_estimate",
    value: 55_000,
    unit: "SAR/year",
    confidence: "medium",
    owner: "ProCrow commercial",
    approvalStatus: "draft",
    formulaRelationship: "annual_cost_base",
  },
  {
    key: "implementation",
    label: "Implementation services (one-time)",
    source: "operator_estimate",
    value: 850_000,
    unit: "SAR",
    confidence: "medium",
    owner: "ProCrow delivery",
    approvalStatus: "draft",
    formulaRelationship: "payback_denominator",
  },
  {
    key: "subscription_annual",
    label: "Annual platform subscription",
    source: "benchmark",
    value: 312_000,
    unit: "SAR/year",
    confidence: "high",
    owner: "ProCrow commercial",
    approvalStatus: "approved",
    formulaRelationship: "annual_cost_base",
  },
] as const;

export function buildMeemGlobalReferenceDocument(): EnterpriseBlueprintDocument | null {
  const detail = getMeemMockBlueprint(MEEM_BLUEPRINT_ID);
  if (!detail) return null;

  const document = adaptEnterpriseBlueprintDetail(detail);
  return {
    ...document,
    assumptions: [
      MEEM_REFERENCE_ASSUMPTION_LABEL,
      "Vertical slice: Operations equipment request → Procurement → Finance approval → CyberCrow supplier risk → Warehouse receiving → IT asset assignment.",
      ...document.assumptions,
    ],
  };
}

export function buildMeemGlobalReferenceRoiModel(): RoiModel {
  const document = buildMeemGlobalReferenceDocument();
  return {
    blueprintVersion: document?.ref.version ?? "1",
    assumptions: REFERENCE_ROI_ASSUMPTIONS.map((a) => ({ ...a })),
    currentAnnualCostEstimate: 655_000,
    implementationCostEstimate: 850_000,
    subscriptionAnnualEstimate: 312_000,
    projectedAnnualSavings: null,
    paybackPeriodMonths: null,
    threeYearValue: null,
    riskReductionValue: 120_000,
    confidenceRange: { low: 180_000, high: 520_000 },
    exclusions: [
      "Fleet fuel savings not modeled",
      "Third-party TMS migration costs excluded",
      MEEM_REFERENCE_ASSUMPTION_LABEL,
    ],
    advisoryOnly: true,
  };
}

export function isMeemReferenceBlueprint(blueprintId: string): boolean {
  return blueprintId === MEEM_BLUEPRINT_ID || blueprintId.includes("meem");
}
