export type BlueprintPersistenceState = "EPHEMERAL_PREVIEW";

export type BlueprintValidationSeverity = "INFO" | "RECOMMENDATION" | "WARNING" | "BLOCKING_DRAFT_ERROR";

export type EnterpriseBlueprintDraftMetadata = {
  schemaVersion: "1.0.0";
  compilerVersion: string;
  sourceModelKey: string;
  sourceModelHash: string;
  contentHash: string;
  generatedAtDisplay?: string;
  advisory: true;
  authoritative: false;
  requiresHumanApproval: true;
  persistenceState: BlueprintPersistenceState;
  previewClassification: "BLUEPRINT_PREVIEW";
};

export type EnterpriseBlueprintSection<T = unknown> = {
  key: string;
  displayName: string;
  items: readonly T[];
  provenancePaths: readonly string[];
};

export type EnterpriseBlueprintDecision = {
  key: string;
  category: string;
  question: string;
  reason: string;
  affectedPaths: readonly string[];
  options: readonly string[];
  recommendedOption: string;
  provenancePath: string;
  blocking: boolean;
  draftSelection?: string;
};

export type EnterpriseBlueprintWarning = {
  code: string;
  message: string;
  severity: BlueprintValidationSeverity;
};

export type EnterpriseBlueprintValidation = {
  valid: boolean;
  findings: readonly {
    severity: BlueprintValidationSeverity;
    code: string;
    message: string;
    path?: string;
  }[];
};

export type EnterpriseBlueprintExport = {
  format: "json" | "markdown" | "validation" | "decisions" | "provenance";
  filename: string;
  content: string;
  previewClassification: "BLUEPRINT_PREVIEW";
};

export type EnterpriseBlueprintDraft = {
  metadata: EnterpriseBlueprintDraftMetadata;
  executiveSummary: string;
  modelDNA: unknown;
  organization: EnterpriseBlueprintSection;
  departments: EnterpriseBlueprintSection;
  capabilities: EnterpriseBlueprintSection;
  entities: EnterpriseBlueprintSection;
  workPersonas: EnterpriseBlueprintSection;
  workflows: EnterpriseBlueprintSection;
  outcomes: EnterpriseBlueprintSection;
  kpis: EnterpriseBlueprintSection;
  evidence: EnterpriseBlueprintSection;
  authorityProposals: EnterpriseBlueprintSection;
  sareaExperiences: EnterpriseBlueprintSection;
  cyberCrowPolicies: EnterpriseBlueprintSection;
  integrations: EnterpriseBlueprintSection;
  complianceOverlays: EnterpriseBlueprintSection;
  scenarioProfile: {
    scalePreset: string;
    topology: string;
    variantKey?: string;
    overlays: readonly string[];
  };
  unresolvedDecisions: readonly EnterpriseBlueprintDecision[];
  warnings: readonly EnterpriseBlueprintWarning[];
  validation: EnterpriseBlueprintValidation;
  provenanceSummary: {
    recordCount: number;
    unexplainedCount: number;
  };
};

export const BLUEPRINT_COMPILER_VERSION = "1.0.0";
export const BLUEPRINT_SCHEMA_VERSION = "1.0.0" as const;

export type BlueprintCompileInput = {
  primaryIndustry: string;
  secondaryIndustries?: readonly string[];
  specialistDomains?: readonly string[];
  organizationalOverlays?: readonly string[];
  scalePreset?: string;
  topology?: string;
  variantKey?: string;
  operatorNotes?: string;
  exclusions?: readonly string[];
};

export type CompilerReadinessStatus =
  | "READY_FOR_REVIEW"
  | "PARTIAL"
  | "NEEDS_DECISION"
  | "BLOCKED"
  | "NOT_APPLICABLE";

export type CompilerReadinessEntry = {
  dimension: string;
  status: CompilerReadinessStatus;
  reason: string;
};

export type CompilerReadinessMatrix = {
  overallStatus: "READY_FOR_HUMAN_BLUEPRINT_REVIEW" | "NEEDS_DECISION" | "BLOCKED";
  entries: readonly CompilerReadinessEntry[];
};

export type BlueprintDiffChange =
  | "ADDED"
  | "REMOVED"
  | "CHANGED"
  | "MERGED"
  | "SPLIT"
  | "EXPANDED"
  | "REDUCED"
  | "UNCHANGED";

export type BlueprintDiffEntry = {
  section: string;
  change: BlueprintDiffChange;
  key: string;
  detail?: string;
};
