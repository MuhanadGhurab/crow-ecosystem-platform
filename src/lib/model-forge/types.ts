import type { CatalogEntryStatus, CatalogProvenance } from "@/lib/tenant-composition/types";

export type { CatalogEntryStatus, CatalogProvenance };

export type CatalogEntryBase = {
  key: string;
  displayName: string;
  description: string;
  status: CatalogEntryStatus;
  version: string;
  provenance: CatalogProvenance;
  applicableIndustries?: readonly string[];
  dependencies?: readonly string[];
  conflicts?: readonly string[];
};

export type WorkflowTopology =
  | "LINEAR"
  | "PARALLEL"
  | "CONDITIONAL"
  | "ITERATIVE"
  | "RECURRING"
  | "EVENT_DRIVEN"
  | "CASE_BASED"
  | "PROJECT_BASED"
  | "MISSION_BASED"
  | "COLLABORATIVE"
  | "EMERGENCY"
  | "CROSS_BRANCH"
  | "CROSS_COMPANY"
  | "HUMAN_AND_AI"
  | "LONG_RUNNING"
  | "HIGH_VOLUME";

export type WorkflowPosition =
  | "REQUESTER"
  | "OWNER"
  | "COORDINATOR"
  | "CONTRIBUTOR"
  | "REVIEWER"
  | "APPROVER"
  | "EXECUTOR"
  | "INSPECTOR"
  | "OBSERVER"
  | "ESCALATION_OWNER"
  | "EVIDENCE_CUSTODIAN"
  | "FINAL_SIGNATORY";

export type OrganizationalTopologyKey =
  | "DEPARTMENTAL_HIERARCHY"
  | "MATRIX"
  | "PROJECT_BASED"
  | "PRODUCT_TEAMS"
  | "OUTCOME_PODS"
  | "CASE_TEAMS"
  | "MISSION_TEAMS"
  | "COMMAND_CENTER"
  | "SHARED_SERVICES"
  | "FRANCHISE_NETWORK"
  | "SEASONAL_POP_UP"
  | "FOLLOW_THE_SUN"
  | "HUMAN_AGENT_HYBRID"
  | "HOLDING_GROUP";

export type TenantScalePreset =
  | "SOLO"
  | "MICRO"
  | "SMALL_TEAM"
  | "GROWING_ORGANIZATION"
  | "MULTI_DEPARTMENT"
  | "MULTI_BRANCH"
  | "ENTERPRISE"
  | "GROUP_OR_ECOSYSTEM";

export type SpecialistDomainDefinition = CatalogEntryBase & {
  applicableIndustryKeys: readonly string[];
  recommendedCapabilityKeys: readonly string[];
  workflowFamilyKeys: readonly string[];
  jobFamilyKeys: readonly string[];
  personaSuggestionKeys: readonly string[];
  entitySuggestionKeys: readonly string[];
  recommendedSareaPatternKeys: readonly string[];
  recommendedCyberCrowPolicyPackKeys: readonly string[];
  complianceNotes: readonly string[];
};

export type WorkPersonaDefinition = CatalogEntryBase & {
  purpose: string;
  responsibilities: readonly string[];
  expectedOutcomes: readonly string[];
  workflowParticipation: readonly string[];
  workflowPositions: readonly WorkflowPosition[];
  decisionRights: readonly string[];
  approvalLimits: readonly string[];
  dataVisibilityRecommendations: readonly string[];
  evidenceObligations: readonly string[];
  escalationDuties: readonly string[];
  kpiRecommendationKeys: readonly string[];
  recommendedSareaPatternKey?: string;
  recommendedCyberCrowPolicyPackKeys: readonly string[];
  organizationalScope: string;
  sourceRoleArchetypeKeys: readonly string[];
  grantsPermissions: false;
  authoritative: false;
};

export type WorkflowTemplate = CatalogEntryBase & {
  purpose: string;
  topology: WorkflowTopology;
  trigger: string;
  states: readonly string[];
  transitions: readonly string[];
  workflowPositions: readonly WorkflowPosition[];
  conditions: readonly string[];
  approvalSteps: readonly string[];
  exceptionPaths: readonly string[];
  escalationPoints: readonly string[];
  evidenceRequirementKeys: readonly string[];
  auditEventKeys: readonly string[];
  kpiKeys: readonly string[];
  cyberCrowCheckKeys: readonly string[];
  sareaPresentationHints: readonly string[];
  primitiveKeys: readonly string[];
  scaleVariantHints: readonly string[];
};

export type TenantScaleDimensions = {
  workforceScale: number;
  branchScale: number;
  workflowVolume: number;
  workflowComplexity: number;
  approvalDepth: number;
  externalActorVolume: number;
  assetIntensity: number;
  projectIntensity: number;
  dataSensitivity: number;
  regulatoryIntensity: number;
  geographicDistribution: number;
  automationMaturity: number;
  fieldWorkforceIntensity: number;
};

export type TenantScaleProfile = {
  preset: TenantScalePreset;
  dimensions: TenantScaleDimensions;
  displayName: string;
  description: string;
};

export type OrganizationalTopologyDefinition = CatalogEntryBase & {
  structure: string;
  reportingBehavior: string;
  workflowOwnership: string;
  authorityImplications: string;
  coordinationRisks: readonly string[];
  recommendedSareaPatternKeys: readonly string[];
  recommendedCyberCrowPolicyPackKeys: readonly string[];
};

export type OutcomeDefinition = CatalogEntryBase & {
  successCriteria: readonly string[];
  measurableEvents: readonly string[];
};

export type KpiDefinition = CatalogEntryBase & {
  category: "workflow_health" | "outcome_quality" | "service_level" | "capacity" | "risk" | "bottleneck";
  measurementEvent: string;
  avoidsSurveillance: true;
};

export type EvidenceRequirement = CatalogEntryBase & {
  mandatoryForWorkflowKeys: readonly string[];
  retentionHint: string;
};

export type AuditRecommendation = CatalogEntryBase & {
  immutableEvents: readonly string[];
  rationaleRequired: boolean;
};

export type TrustControlRecommendation = CatalogEntryBase & {
  cyberCrowPolicyPackKey: string;
  trigger: string;
};

export type AuthorityProposal = {
  key: string;
  displayName: string;
  description: string;
  recommendedRoleArchetypeKeys: readonly string[];
  recommendedPermissionBundleKeys: readonly string[];
  workflowPositionPermissions: readonly { position: WorkflowPosition; bundleKey: string }[];
  approvalThresholds: readonly string[];
  delegationRules: readonly string[];
  segregationOfDuties: readonly string[];
  authoritative: false;
  requiresApproval: true;
};

export type OrganizationalModelDNA = {
  primaryIndustry: string;
  secondaryIndustries: readonly string[];
  specialistDomains: readonly string[];
  operatingTopology: OrganizationalTopologyKey;
  scaleProfile: TenantScaleProfile;
  workforceModel: string;
  externalActors: readonly string[];
  authorityStyle: string;
  workflowIntensity: string;
  trustProfile: readonly string[];
  experienceStrategy: readonly string[];
  modelRationale: readonly string[];
  departmentKeys: readonly string[];
  provenance: readonly { field: string; source: string }[];
};

export type HybridCompositionInput = {
  primaryIndustry: string;
  secondaryIndustries?: readonly string[];
  specialistDomains?: readonly string[];
  organizationalOverlays?: readonly string[];
  scaleProfile?: TenantScaleProfile;
  topologies?: readonly OrganizationalTopologyKey[];
  selectedCapabilities?: readonly string[];
  organizationSignals?: Record<string, string | number | boolean | string[]>;
};

export type EnterpriseModelDraft = {
  compositionKey: string;
  dna: OrganizationalModelDNA;
  workPersonas: readonly WorkPersonaDefinition[];
  workflowTemplates: readonly WorkflowTemplate[];
  authorityProposals: readonly AuthorityProposal[];
  kpiRecommendations: readonly KpiDefinition[];
  evidenceRequirements: readonly EvidenceRequirement[];
  auditRecommendations: readonly AuditRecommendation[];
  trustControls: readonly TrustControlRecommendation[];
  warnings: readonly string[];
  unresolvedDecisions: readonly string[];
};

export type PersonaMergeSuggestion = {
  recommendation: string;
  reason: string;
  sourcePersonaKeys: readonly string[];
  targetPersonaKey: string;
  workflowImpact: readonly string[];
  riskWarning: string;
};

export type PersonaSplitSuggestion = {
  recommendation: string;
  reason: string;
  sourcePersonaKey: string;
  targetPersonaKeys: readonly string[];
  workflowImpact: readonly string[];
  riskWarning: string;
};

export type ResponsibilityDistribution = {
  personaKey: string;
  responsibilities: readonly string[];
  rationale: string;
};

export type ScaledWorkflowVariant = {
  templateKey: string;
  scalePreset: TenantScalePreset;
  states: readonly string[];
  approvalDepth: number;
  evidenceKeys: readonly string[];
  rationale: string;
};
