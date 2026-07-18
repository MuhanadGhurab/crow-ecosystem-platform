/**
 * CROW.DISCOVERY.6 — Blueprint handoff package types (local / pre-Blueprint).
 * readyForBlueprintHandoff may be true; readyForBlueprintDraft and
 * blueprintGenerationAllowed remain false. Owner + ProCrow gates always required.
 */

export const DISCOVERY_BLUEPRINT_HANDOFF_VERSION =
  "discovery-blueprint-handoff-v1" as const;

export type DiscoveryBlueprintHandoffStatus =
  | "NOT_READY"
  | "NEEDS_MORE_INFORMATION"
  | "READY_FOR_MODELING"
  | "OWNER_GATE_REQUIRED"
  | "READY_FOR_FUTURE_BLUEPRINT_DRAFTING";

export type BlueprintSectionCoverageLevel = "none" | "partial" | "adequate" | "waived";

export type BlueprintSectionCoverageItem = {
  sectionKey: string;
  label: string;
  level: BlueprintSectionCoverageLevel;
  capturedCount: number;
  missingCount: number;
  sourceQuestionKeys: string[];
  inertCatalogTags: string[];
};

export type DiscoveryBlueprintHandoffAuthority = {
  advisory: true;
  createsBlueprint: false;
  createsBlueprintDraftRecord: false;
  provisionsTenant: false;
  grantsAuthority: false;
  createsMembership: false;
  createsPlatformRole: false;
  createsPayment: false;
  invokesCroAI: false;
  readyForBlueprintDraft: false;
  blueprintGenerationAllowed: false;
  ownerGateRequired: true;
  procrowGateRequired: true;
};

export const DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY: DiscoveryBlueprintHandoffAuthority =
  {
    advisory: true,
    createsBlueprint: false,
    createsBlueprintDraftRecord: false,
    provisionsTenant: false,
    grantsAuthority: false,
    createsMembership: false,
    createsPlatformRole: false,
    createsPayment: false,
    invokesCroAI: false,
    readyForBlueprintDraft: false,
    blueprintGenerationAllowed: false,
    ownerGateRequired: true,
    procrowGateRequired: true,
  };

export type DiscoveryBlueprintHandoffPackage = {
  version: typeof DISCOVERY_BLUEPRINT_HANDOFF_VERSION;
  productLabel: "Discovery Blueprint Handoff Package";
  lifecycle: "pre_blueprint_local_handoff";
  handoffStatus: DiscoveryBlueprintHandoffStatus;
  sourceDiscoverySummary: {
    journeyKind: string | null;
    organizationContext: string | null;
    overallCompletionPercent: number;
    requiredMissingCount: number;
    answeredFieldHint: string;
  };
  operatingModelInputDraftSummary: {
    productLabel: string;
    lifecycle: string;
    purposeStatus: string;
    organizationShapeStatus: string;
    readyForProCrowReview: boolean;
    missingInformationCount: number;
  };
  procrowModelingReviewSummary: {
    reviewStatus: string;
    readyForModeling: boolean;
    criticalRiskCount: number;
    contradictionCount: number;
    recommendedNextAction: string;
  };
  requiredApprovals: string[];
  missingInformation: string[];
  riskFlags: string[];
  contradictionFlags: string[];
  evidenceReferenceSummary: {
    level: string;
    notes: string[];
  };
  sourceQuestionKeys: string[];
  blueprintSectionCoverage: BlueprintSectionCoverageItem[];
  excludedFromBlueprint: string[];
  assumptions: string[];
  ownerGateRequired: true;
  procrowGateRequired: true;
  /** True only when D5 readyForModeling and no critical handoff blockers. */
  readyForBlueprintHandoff: boolean;
  /** Always false in D6 — draft creation is a future owner-authorized milestone. */
  readyForBlueprintDraft: false;
  /** Always false in D6 — generation remains blocked. */
  blueprintGenerationAllowed: false;
  recommendedNextAction: string;
  authority: DiscoveryBlueprintHandoffAuthority;
  nonClaims: readonly string[];
};

export const DISCOVERY_BLUEPRINT_HANDOFF_NON_CLAIMS = [
  "This package is pre-Blueprint — not an approved Enterprise Blueprint.",
  "Blueprint generation remains blocked.",
  "No tenant runtime is created from this handoff.",
  "Owner authorization and ProCrow modeling review remain required before any future Blueprint drafting.",
  "This handoff does not create Blueprint draft records, payment, membership, roles, or CroAI output.",
  "GAP-004 (Preview/Production DB isolation) must be resolved before hosted Blueprint persistence.",
] as const;

/** Future Blueprint section keys for inert coverage mapping (no records created). */
export const FUTURE_BLUEPRINT_HANDOFF_SECTIONS = [
  {
    sectionKey: "intent_and_purpose",
    label: "Intent and purpose",
    omKeys: ["purpose", "operatingContext"] as const,
    catalogTags: ["overview"],
  },
  {
    sectionKey: "organization_shape",
    label: "Organization shape",
    omKeys: ["organizationShape"] as const,
    catalogTags: ["organization", "identity"],
  },
  {
    sectionKey: "operating_model",
    label: "Operating model",
    omKeys: ["peopleAndTeams", "responsibilities", "workflows"] as const,
    catalogTags: ["cem", "overview"],
  },
  {
    sectionKey: "people_and_responsibilities",
    label: "People and responsibilities",
    omKeys: ["peopleAndTeams", "responsibilities", "decisionsAndApprovals"] as const,
    catalogTags: ["organization", "cem"],
  },
  {
    sectionKey: "workflows",
    label: "Workflows",
    omKeys: ["workflows"] as const,
    catalogTags: ["workflows"],
  },
  {
    sectionKey: "systems_and_records",
    label: "Systems and records",
    omKeys: ["systemsAndTools", "dataAndRecords"] as const,
    catalogTags: ["integrations"],
  },
  {
    sectionKey: "trust_and_risk",
    label: "Trust and risk",
    omKeys: ["trustAndRiskSignals"] as const,
    catalogTags: ["cybercrow"],
  },
  {
    sectionKey: "evidence_and_assumptions",
    label: "Evidence and assumptions",
    omKeys: ["evidenceReferences"] as const,
    catalogTags: ["overview"],
  },
  {
    sectionKey: "transformation_context",
    label: "Transformation context",
    omKeys: ["transformationIntent"] as const,
    catalogTags: ["overview"],
  },
] as const;
