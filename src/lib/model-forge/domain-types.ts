import type { CatalogEntryStatus, CatalogProvenance } from "@/lib/tenant-composition/types";
import type { CatalogEntryBase, TenantScalePreset, WorkflowPosition } from "./types";

export type IntegrationAvailabilityStatus =
  | CatalogEntryStatus
  | "REQUIRES_PROVIDER_APPROVAL";

export type DepartmentArchetypeDefinition = CatalogEntryBase & {
  purpose: string;
  commonResponsibilities: readonly string[];
  recommendedWorkPersonaKeys: readonly string[];
  workflowOwnership: readonly string[];
  entityOwnership: readonly string[];
  typicalKpiKeys: readonly string[];
  recommendedSareaPatternKey?: string;
  recommendedCyberCrowPolicyPackKeys: readonly string[];
  scaleBehavior: string;
  mergeCandidateKeys: readonly string[];
  splitCandidateKeys: readonly string[];
  grantsPermissions: false;
};

export type EntityDefinition = CatalogEntryBase & {
  lifecycle: readonly string[];
  ownerPersonaRecommendations: readonly string[];
  relatedWorkflowKeys: readonly string[];
  relationships: readonly string[];
  sensitivityClassification: "public" | "internal" | "confidential" | "restricted";
  evidenceRequirementKeys: readonly string[];
  auditRequirementKeys: readonly string[];
  retentionConsideration: string;
  sareaPresentationHint?: string;
  cyberCrowPolicyPackKeys: readonly string[];
};

export type EntityPackDefinition = CatalogEntryBase & {
  coreEntityKeys: readonly string[];
  specialistEntityKeys: readonly string[];
};

export type IntegrationPackDefinition = CatalogEntryBase & {
  integrationType: string;
  dataFlowDirection: "inbound" | "outbound" | "bidirectional";
  identityMethod: string;
  dataSensitivity: string;
  consentRequirements: readonly string[];
  auditRequirements: readonly string[];
  tenantConfigurationNeeds: readonly string[];
  availabilityStatus: IntegrationAvailabilityStatus;
  riskNotes: readonly string[];
  createsIdentity: false;
};

export type ComplianceOverlayDefinition = CatalogEntryBase & {
  operationalConcern: string;
  affectedEntityKeys: readonly string[];
  affectedWorkflowKeys: readonly string[];
  recommendedEvidenceKeys: readonly string[];
  recommendedAuditKeys: readonly string[];
  recommendedApprovalControls: readonly string[];
  recommendedCyberCrowPolicyPackKeys: readonly string[];
  requiresSourceReview: true;
  grantsAuthority: false;
  certificationClaim: false;
};

export type DomainPackDefinition = CatalogEntryBase & {
  applicableIndustryKeys: readonly string[];
  specialistDomainKeys: readonly string[];
  recommendedDepartmentKeys: readonly string[];
  entityPackKeys: readonly string[];
  capabilityKeys: readonly string[];
  workflowTemplateKeys: readonly string[];
  workPersonaKeys: readonly string[];
  jobFamilyKeys: readonly string[];
  permissionBundleRecommendationKeys: readonly string[];
  sareaPatternKeys: readonly string[];
  cyberCrowPolicyPackKeys: readonly string[];
  integrationPackKeys: readonly string[];
  complianceOverlayKeys: readonly string[];
  scaleBehavior: string;
  topologyCompatibility: readonly string[];
  dependencies?: readonly string[];
  conflicts?: readonly string[];
  authoritative: false;
  grantsPermissions: false;
  provisionsTenant: false;
};

export type GraphNodeType =
  | "INDUSTRY"
  | "SPECIALIST_DOMAIN"
  | "DOMAIN_PACK"
  | "DEPARTMENT"
  | "CAPABILITY"
  | "ENTITY"
  | "WORK_PERSONA"
  | "WORKFLOW"
  | "WORKFLOW_STAGE"
  | "OUTCOME"
  | "KPI"
  | "EVIDENCE"
  | "AUTHORITY_PROPOSAL"
  | "SAREA_EXPERIENCE"
  | "CYBERCROW_POLICY"
  | "INTEGRATION"
  | "COMPLIANCE_OVERLAY";

export type GraphEdgeType =
  | "CONTAINS"
  | "OWNS"
  | "PARTICIPATES_IN"
  | "COORDINATES"
  | "EXECUTES"
  | "REVIEWS"
  | "APPROVES"
  | "ESCALATES_TO"
  | "PRODUCES"
  | "CONSUMES"
  | "GOVERNS"
  | "MEASURED_BY"
  | "REQUIRES_EVIDENCE"
  | "PROTECTED_BY"
  | "PRESENTED_THROUGH"
  | "INTEGRATES_WITH"
  | "DEPENDS_ON"
  | "CONFLICTS_WITH";

export type GraphLayoutMode =
  | "OPERATING_MODEL"
  | "PERSONA_WORKFLOW"
  | "WORKFLOW_DETAIL"
  | "INFORMATION_FLOW"
  | "AUTHORITY_IMPACT"
  | "OUTCOME_AND_KPI"
  | "TRUST_AND_EVIDENCE";

export type ValidationSeverity = "INFO" | "RECOMMENDATION" | "WARNING" | "BLOCKING_DRAFT_ERROR";

export type GraphValidationFinding = {
  severity: ValidationSeverity;
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
};

export type EnterpriseGraphNode = {
  id: string;
  type: GraphNodeType;
  key: string;
  label: string;
  x: number;
  y: number;
  group?: string;
  metadata?: Record<string, string>;
};

export type EnterpriseGraphEdge = {
  id: string;
  type: GraphEdgeType;
  source: string;
  target: string;
  reason: string;
  provenance: string;
  advisory: true;
};

export type EnterpriseOperatingGraph = {
  layoutMode: GraphLayoutMode;
  nodes: readonly EnterpriseGraphNode[];
  edges: readonly EnterpriseGraphEdge[];
  findings: readonly GraphValidationFinding[];
};

export type OperatingModelVariantKey =
  | "MICRO"
  | "GROWING"
  | "ENTERPRISE"
  | "CENTRALIZED"
  | "DISTRIBUTED"
  | "DEPARTMENTAL"
  | "OUTCOME_POD"
  | "COMMAND_CENTER"
  | "HIGH_REGULATION"
  | "AUTOMATION_FORWARD";

export type OperatingModelVariant = {
  key: OperatingModelVariantKey;
  displayName: string;
  description: string;
  scalePreset: TenantScalePreset;
  topologyKey?: string;
  overlayKeys: readonly string[];
  advisoryDifferences: readonly string[];
};

export type ScenarioDiffEntry = {
  category: string;
  change: "added" | "removed" | "merged" | "split" | "expanded" | "reduced" | "unchanged";
  label: string;
  detail?: string;
};

export type ScenarioComparisonResult = {
  variantA: OperatingModelVariantKey;
  variantB: OperatingModelVariantKey;
  diffs: readonly ScenarioDiffEntry[];
  deterministic: true;
};

export type DraftWorkPersona = {
  key: string;
  displayName: string;
  purpose: string;
  responsibilities: readonly string[];
  workflowParticipation: readonly string[];
  workflowPositions: readonly WorkflowPosition[];
  buildingBlockKeys: readonly string[];
  advisory: true;
  grantsPermissions: false;
  authoritative: false;
};

export type DraftWorkflowStage = {
  key: string;
  label: string;
  positions: readonly WorkflowPosition[];
};

export type DraftWorkflow = {
  key: string;
  displayName: string;
  templateKey?: string;
  topology: string;
  stages: readonly DraftWorkflowStage[];
  advisory: true;
};
