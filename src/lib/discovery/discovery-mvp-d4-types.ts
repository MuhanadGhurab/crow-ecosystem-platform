/**
 * CROW.DISCOVERY.4 — Operating Model input draft types (local / pre-Blueprint).
 * Never creates Blueprint, tenant, membership, roles, payment, or CroAI.
 */

export const OPERATING_MODEL_INPUT_DRAFT_VERSION = "operating-model-input-draft-v1" as const;

export type OperatingModelDraftSectionStatus = "captured" | "missing" | "not_applicable";

export type OperatingModelDraftSection = {
  content: string | null;
  sourceQuestionKeys: string[];
  status: OperatingModelDraftSectionStatus;
};

export type OperatingModelDraftAuthority = {
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

export const OPERATING_MODEL_DRAFT_AUTHORITY: OperatingModelDraftAuthority = {
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

export type OperatingModelStageCompletenessPercent = {
  stage1: number;
  stage2: number;
  stage3: number;
  stage4: number;
  stage5: number;
  stage6: number;
  stage7: number;
};

export type OperatingModelReadinessSignals = {
  stageCompletenessPercent: OperatingModelStageCompletenessPercent;
  overallCompletionPercent: number;
  missingCoreFieldCount: number;
  missingOperatingModelFieldCount: number;
  riskFlagCount: number;
  readyForProCrowReview: boolean;
  /** Always false in D4 — Blueprint handoff is D6+. */
  readyForBlueprintDraft: false;
};

export type OperatingModelInputDraft = {
  version: typeof OPERATING_MODEL_INPUT_DRAFT_VERSION;
  /** Explicit product labels for UI / ProCrow. */
  productLabel: "Draft Operating Model Input";
  lifecycle: "draft_local_pre_blueprint";
  approved: false;
  tenantRuntime: false;
  forProCrowReview: true;
  purpose: OperatingModelDraftSection;
  operatingContext: OperatingModelDraftSection;
  organizationShape: OperatingModelDraftSection;
  peopleAndTeams: OperatingModelDraftSection;
  responsibilities: OperatingModelDraftSection;
  workflows: OperatingModelDraftSection;
  decisionsAndApprovals: OperatingModelDraftSection;
  systemsAndTools: OperatingModelDraftSection;
  dataAndRecords: OperatingModelDraftSection;
  trustAndRiskSignals: OperatingModelDraftSection;
  transformationIntent: OperatingModelDraftSection;
  evidenceReferences: OperatingModelDraftSection;
  missingInformation: string[];
  assumptions: string[];
  riskFlags: string[];
  readinessSignals: OperatingModelReadinessSignals;
  /** Union of all source keys used across sections. */
  sourceQuestionKeys: string[];
  authority: OperatingModelDraftAuthority;
  /** Operator-facing clarification prompts (D5 approval still pending). */
  clarificationPrompts: string[];
};
