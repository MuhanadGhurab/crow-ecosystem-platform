/**
 * CROW.DISCOVERY.5 — ProCrow modeling review types (local / pre-Blueprint).
 * readyForModeling may be true; readyForBlueprintDraft is always false.
 */

export const PROCROW_MODELING_REVIEW_VERSION = "procrow-modeling-review-v1" as const;

export type ProCrowModelingReviewStatus =
  | "NOT_READY"
  | "NEEDS_MORE_INFORMATION"
  | "READY_FOR_MODELING_REVIEW"
  | "READY_FOR_MODELING";

export type CoverageLevel = "none" | "partial" | "adequate" | "waived";

export type CoverageSummary = {
  level: CoverageLevel;
  capturedCount: number;
  missingCount: number;
  notes: string[];
};

export type ProCrowModelingReviewAuthority = {
  advisory: true;
  createsBlueprint: false;
  provisionsTenant: false;
  grantsAuthority: false;
  createsMembership: false;
  createsPlatformRole: false;
  createsPayment: false;
  invokesCroAI: false;
  readyForBlueprintDraft: false;
};

export const PROCROW_MODELING_REVIEW_AUTHORITY: ProCrowModelingReviewAuthority = {
  advisory: true,
  createsBlueprint: false,
  provisionsTenant: false,
  grantsAuthority: false,
  createsMembership: false,
  createsPlatformRole: false,
  createsPayment: false,
  invokesCroAI: false,
  readyForBlueprintDraft: false,
};

export type ProCrowModelingReview = {
  version: typeof PROCROW_MODELING_REVIEW_VERSION;
  productLabel: "ProCrow Modeling Review";
  reviewStatus: ProCrowModelingReviewStatus;
  completenessSummary: {
    stage1Percent: number;
    stage2Percent: number;
    stage3Percent: number;
    stage4Percent: number;
    stage5Percent: number;
    stage6Percent: number;
    stage7Percent: number;
    overallCompletionPercent: number;
    requiredMissingCount: number;
    omSectionsMissingCount: number;
  };
  missingInformation: string[];
  riskFlags: string[];
  /** Risks that block READY_FOR_MODELING unless acknowledged. */
  criticalRiskFlags: string[];
  contradictionFlags: string[];
  clarificationQuestions: string[];
  operatingModelCoverage: CoverageSummary;
  trustAndRiskCoverage: CoverageSummary;
  evidenceReferenceCoverage: CoverageSummary;
  recommendedNextAction: string;
  sourceQuestionKeys: string[];
  operatorNotesDraft: string;
  readyForModeling: boolean;
  /** Always false in D5 — Blueprint handoff is D6+. */
  readyForBlueprintDraft: false;
  authority: ProCrowModelingReviewAuthority;
  /** Explicit non-claims for UI. */
  nonClaims: readonly string[];
};

export const PROCROW_MODELING_REVIEW_NON_CLAIMS = [
  "This is ProCrow modeling review support — not final Blueprint approval.",
  "Ready-for-modeling does not generate a Blueprint.",
  "Ready-for-modeling does not provision a tenant or grant authority.",
  "Ready-for-modeling does not create payment or invoke CroAI.",
  "Blueprint generation remains blocked until a future owner-authorized milestone.",
] as const;

export type ProCrowModelingReviewOptions = {
  /** Local operator notes (localStorage / component state). */
  operatorNotesDraft?: string;
  /** Risk flag strings the operator has acknowledged locally. */
  acknowledgedRiskFlags?: string[];
  /** Explicit waiver that evidence references are not available. */
  evidenceNotAvailable?: boolean;
};
