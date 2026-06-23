/** Canonical lifecycle status for catalog entries — never imply runtime implementation. */
export type CatalogEntryStatus = "CURRENT" | "PARTIAL" | "PLANNED" | "CONCEPT" | "DEPRECATED";

export type CatalogProvenance = "crow_core" | "org_intelligence" | "ftgp" | "operator" | "legacy";

export type CatalogEntryBase = {
  key: string;
  displayName: string;
  description: string;
  status: CatalogEntryStatus;
  version: string;
  applicableIndustries?: readonly string[];
  dependencies?: readonly string[];
  conflicts?: readonly string[];
  provenance: CatalogProvenance;
};

export type IndustryArchetype = CatalogEntryBase & {
  commonOperatingModel: string;
  commonDepartments: readonly string[];
  recommendedCapabilityKeys: readonly string[];
  commonWorkflowPatternKeys: readonly string[];
  commonJobFamilyKeys: readonly string[];
  commonRoleArchetypeKeys: readonly string[];
  recommendedSareaPatternKeys: readonly string[];
  recommendedCyberCrowPolicyPackKeys: readonly string[];
  commonIntegrationNeeds: readonly string[];
  discoveryQuestionHints: readonly string[];
};

export type OrganizationalOverlay = CatalogEntryBase & {
  adjustsRecommendations: readonly string[];
};

export type CapabilityDefinition = CatalogEntryBase & {
  group: string;
  purpose: string;
  coreEntities: readonly string[];
  typicalWorkflowPatternKeys: readonly string[];
  recommendedRoleArchetypeKeys: readonly string[];
  recommendedSareaPatternKeys: readonly string[];
  securityConsiderations: readonly string[];
  industryRelevance: readonly string[];
};

export type WorkflowPrimitive =
  | "submit"
  | "review"
  | "approve"
  | "reject"
  | "return_for_revision"
  | "assign"
  | "schedule"
  | "dispatch"
  | "accept"
  | "start"
  | "pause"
  | "complete"
  | "inspect"
  | "verify"
  | "escalate"
  | "sign_off"
  | "invoice"
  | "close"
  | "cancel"
  | "archive";

export type WorkflowPattern = CatalogEntryBase & {
  primitives: readonly WorkflowPrimitive[];
  actors: readonly string[];
  states: readonly string[];
  transitions: readonly string[];
  requiredPermissionBundleKeys: readonly string[];
  optionalApprovalSteps: readonly string[];
  evidenceRequirements: readonly string[];
  escalationPoints: readonly string[];
  auditEvents: readonly string[];
  sareaPresentationHints: readonly string[];
  cyberCrowTrustChecks: readonly string[];
};

export type RoleArchetype = CatalogEntryBase & {
  responsibilitySummary: string;
  suggestedJobFamilyKeys: readonly string[];
  suggestedPermissionBundleKeys: readonly string[];
  suggestedSareaPatternKeys: readonly string[];
  /** Advisory only — never authoritative grants. */
  grantsPermissions: false;
};

export type JobFamily = CatalogEntryBase & {
  domain: string;
  exampleTitles: readonly string[];
  recommendedRoleArchetypeKeys: readonly string[];
};

export type JobDefinition = CatalogEntryBase & {
  jobFamilyKey: string;
  recommendedRoleArchetypeKeys: readonly string[];
  departmentArchetypeKey?: string;
  seniority?: string;
  responsibilities: readonly string[];
  workflowParticipation: readonly string[];
  recommendedSareaPatternKey?: string;
  /** Advisory only — never authoritative grants. */
  grantsPermissions: false;
};

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "submit"
  | "assign"
  | "approve"
  | "reject"
  | "execute"
  | "complete"
  | "export"
  | "archive"
  | "administer";

export type PermissionScope =
  | "own"
  | "team"
  | "department"
  | "branch"
  | "tenant"
  | "assigned"
  | "managed"
  | "explicit";

export type PermissionBundle = CatalogEntryBase & {
  resource: string;
  actions: readonly PermissionAction[];
  scope: PermissionScope;
  conditions: readonly string[];
  /** Tenant-scoped only — never platform ProCrow authority. */
  platformAuthority: false;
};

export type SareaExperiencePattern = CatalogEntryBase & {
  targetRoleArchetypeKeys: readonly string[];
  navigationDensity: "minimal" | "balanced" | "dense";
  primaryWidgets: readonly string[];
  primaryActions: readonly string[];
  mobileSuitability: "low" | "medium" | "high";
  informationComplexity: "simple" | "moderate" | "complex";
  alertStrategy: string;
  accessibilityNotes: readonly string[];
  /** Presentation only — never grants permissions. */
  grantsPermissions: false;
};

export type CyberCrowPolicyPack = CatalogEntryBase & {
  purpose: string;
  applicableCapabilityKeys: readonly string[];
  protectedResources: readonly string[];
  requiredTrustSignals: readonly string[];
  auditRequirements: readonly string[];
  recommendedEntitlementTier: "crow_shield" | "crow_sentinel" | "crow_fortress";
};

export type IntegrationPack = CatalogEntryBase & {
  integrationType: string;
  typicalSystems: readonly string[];
};

export type ComplianceOverlay = CatalogEntryBase & {
  regulatoryDomains: readonly string[];
  additionalPolicyPackKeys: readonly string[];
};

export type TenantBlueprintComposition = {
  industryArchetypeKey: string;
  overlayKeys: readonly string[];
  selectedCapabilityKeys: readonly string[];
  organizationSignals: Record<string, string | number | boolean | string[]>;
  recommendedDepartments: readonly string[];
  recommendedCapabilities: readonly string[];
  recommendedWorkflows: readonly string[];
  recommendedRoles: readonly string[];
  recommendedJobFamilies: readonly string[];
  recommendedPermissionBundles: readonly string[];
  recommendedSareaPatterns: readonly string[];
  recommendedCyberCrowPolicyPacks: readonly string[];
  warnings: readonly string[];
  unresolvedDecisions: readonly string[];
};

export type ComposeTenantBlueprintInput = {
  industryArchetype: string;
  overlays?: readonly string[];
  selectedCapabilities?: readonly string[];
  organizationSignals?: Record<string, string | number | boolean | string[]>;
};
