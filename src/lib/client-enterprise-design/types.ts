/** CROW.DISCOVERY.2 — client enterprise design aggregate (advisory, non-authoritative). */

export const CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION = "client-enterprise-design-v1.0.0" as const;

export type ClientEnterpriseDesignAuthority = {
  advisory: true;
  authoritative: false;
  provisionsTenant: false;
  grantsPermissions: false;
  createsBlueprint: false;
};

export const CLIENT_ENTERPRISE_DESIGN_AUTHORITY: ClientEnterpriseDesignAuthority = {
  advisory: true,
  authoritative: false,
  provisionsTenant: false,
  grantsPermissions: false,
  createsBlueprint: false,
};

export type ClientOperatingPriority =
  | "LEAN_RESPONSIBLE"
  | "BALANCED_GROWTH"
  | "CONTROL_FIRST"
  | "AUTOMATION_FORWARD"
  | "CUSTOM";

export type ClientOperatingModelVariantKey = "STARTER" | "GROWTH" | "ENTERPRISE" | "CUSTOM";

export type ClientEnterpriseDesignStatus = "DRAFT" | "READY_FOR_REVIEW" | "SUBMITTED";

export type ClientDesignGuardrail =
  | "SUPPORTED"
  | "SUPPORTED_WITH_WARNING"
  | "REQUIRES_ADDITIONAL_CONTROL"
  | "NOT_RECOMMENDED"
  | "INCOMPATIBLE"
  | "REQUIRES_HUMAN_REVIEW";

export type ClientEnterpriseDesignDraft = {
  designVersion: typeof CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION;
  requestId: string;
  status: ClientEnterpriseDesignStatus;
  primaryIndustry: string | null;
  secondaryIndustries: string[];
  specialistDomains: string[];
  businessPurposes: string[];
  primaryPurposeKey: string | null;
  currentScale: string | null;
  targetScale: string | null;
  scaleDimensions: Record<string, number>;
  operatingPriority: ClientOperatingPriority;
  selectedCapabilities: string[];
  selectedDomainPacks: string[];
  organizationalPreferences: Record<string, string | boolean>;
  workforceConstraints: string[];
  automationPreferences: string[];
  riskPreferences: string[];
  selectedModelVariant: ClientOperatingModelVariantKey;
  customizations: ClientDesignCustomization[];
  unresolvedDecisions: string[];
  clientNotes: string | null;
  recommendationSnapshot: ClientEnterpriseDesignSnapshot | null;
  updatedAt: string | null;
  submittedAt: string | null;
};

export type ClientDesignCustomization = {
  id: string;
  kind:
    | "add_capability"
    | "remove_capability"
    | "add_domain"
    | "remove_domain"
    | "merge_responsibility"
    | "split_persona"
    | "change_approval_depth"
    | "change_automation"
    | "change_scale"
    | "hybrid_variant";
  targetKey: string;
  value?: string | number | boolean;
  note?: string;
};

export type ClientEnterpriseDesignInput = {
  primaryIndustry: string | null;
  secondaryIndustries: string[];
  specialistDomains: string[];
  businessPurposes: string[];
  primaryPurposeKey: string | null;
  currentScale: string | null;
  targetScale: string | null;
  scaleDimensions: Record<string, number>;
  operatingPriority: ClientOperatingPriority;
  selectedCapabilities: string[];
  organizationalPreferences?: Record<string, string | boolean>;
  workforceConstraints?: string[];
  automationPreferences?: string[];
  riskPreferences?: string[];
  selectedModelVariant: ClientOperatingModelVariantKey;
  customizations?: ClientDesignCustomization[];
};

export type LeanResponsibleOperatingModel = {
  estimatedCoreTeamRange: { min: number; max: number };
  workloadAssumptions: string[];
  requiredPersonaResponsibilities: string[];
  mergeRecommendations: Array<{ personaKeys: string[]; rationale: string }>;
  separationRequirements: Array<{ personaKeys: string[]; rationale: string }>;
  automationOpportunities: string[];
  capacityWarnings: string[];
  singlePointOfFailureWarnings: string[];
  segregationOfDutiesWarnings: string[];
  nextHiringTriggers: string[];
  nextPersonaSplitTriggers: string[];
  confidenceLimitations: string[];
  disclaimer: string;
};

export type ClientOperatingModelVariant = {
  key: ClientOperatingModelVariantKey;
  displayName: string;
  description: string;
  organizationalStructure: string;
  estimatedCoreTeamRange: { min: number; max: number };
  personaKeys: string[];
  mergeRecommendations: string[];
  separationRequirements: string[];
  departmentKeys: string[];
  capabilityKeys: string[];
  workflowDepth: "light" | "standard" | "deep";
  approvalDepth: "minimal" | "balanced" | "strict";
  automationLevel: "low" | "medium" | "high";
  evidenceExpectations: string[];
  cyberCrowRecommendations: string[];
  sareaRecommendations: string[];
  integrationRecommendations: string[];
  nextGrowthTriggers: string[];
  assumptions: string[];
  warnings: string[];
};

export type ClientRecommendationProvenance = {
  recommendationKey: string;
  essentiality: "essential" | "recommended" | "optional";
  causedBySelection: string;
  catalogSource: string;
  ruleApplied: string;
  simpleExplanation: string;
  advancedExplanation: string;
};

export type ClientEnterpriseDesignSnapshot = {
  schemaVersion: typeof CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION;
  variants: ClientOperatingModelVariant[];
  recommendedVariant: ClientOperatingModelVariantKey;
  recommendedCapabilities: string[];
  recommendedPersonaKeys: string[];
  workflowSummaries: Array<{
    key: string;
    displayName: string;
    purpose: string;
    trigger: string;
    stages: string[];
    responsiblePersonas: string[];
    approvals: string[];
    evidence: string[];
    automationOpportunities: string[];
  }>;
  leanModel: LeanResponsibleOperatingModel;
  warnings: string[];
  unresolvedDecisions: string[];
  provenance: ClientRecommendationProvenance[];
};

export type ClientDesignImpactAnalysis = {
  action: string;
  guardrail: ClientDesignGuardrail;
  workforceImpact: string[];
  workflowImpact: string[];
  approvalImpact: string[];
  automationImpact: string[];
  securityImpact: string[];
  scalabilityImpact: string[];
  riskImpact: string[];
  simpleSummary: string;
  advancedSummary: string;
};
