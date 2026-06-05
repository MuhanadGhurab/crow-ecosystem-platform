import "server-only";

export type CemOperatingModelStatus =
  | "not_started"
  | "model_detected"
  | "partially_connected"
  | "operational_spine_ready"
  | "needs_data"
  | "needs_review";

export type CemOperatingEntity =
  | "tenant"
  | "department"
  | "role"
  | "user"
  | "module"
  | "workflow"
  | "task"
  | "approval"
  | "report"
  | "event";

export type CemModuleOperatingRole =
  | "system_of_record"
  | "workflow_source"
  | "task_source"
  | "approval_source"
  | "reporting_source"
  | "supporting_module";

export type CemOperationalLinkStrength = "strong" | "partial" | "inferred" | "missing";

export type CemOperationalLink = {
  fromType: CemOperatingEntity;
  fromId: string;
  fromLabel: string;
  toType: CemOperatingEntity;
  toId: string;
  toLabel: string;
  relationship: string;
  strength: CemOperationalLinkStrength;
};

export type CemOperatingFlowReadiness = "mapped" | "partial" | "advisory" | "missing_data";

export type CemOperatingFlow = {
  key: string;
  label: string;
  description: string;
  modulesInvolved: string[];
  departmentsInvolved: string[];
  rolesInvolved: string[];
  workflowKeys: string[];
  taskExamples: string[];
  reportingOutputs: string[];
  cyberCrowEvidence: string[];
  sareaExperienceImpact: string[];
  readiness: CemOperatingFlowReadiness;
};

export type CemModuleRoleAssignment = {
  moduleKey: string;
  moduleLabel: string;
  roles: CemModuleOperatingRole[];
  enabled: boolean;
  dataBacked: boolean;
  readiness: "tenant_backed" | "demo_limited" | "thin" | "not_enabled";
};

export type CemOperatingModelSnapshot = {
  tenantSlug: string;
  tenantName: string;
  status: CemOperatingModelStatus;
  entities: Partial<Record<CemOperatingEntity, number>>;
  links: CemOperationalLink[];
  flows: CemOperatingFlow[];
  moduleRoles: CemModuleRoleAssignment[];
  blockers: string[];
  warnings: string[];
  recommendedActions: string[];
  reportOutputs: string[];
  cyberCrowObservability: string[];
  sareaExperienceHooks: string[];
  businessPortalRoute: string;
  goNoGoDependency: string;
  disclaimers: readonly string[];
};

export type CemOperatingGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
  relationshipNote: string;
  spineChecks: string[];
};

export const CEM_OPERATING_MODEL_DISCLAIMERS = [
  "Operational model readiness only — staging/demo data may be used.",
  "Not production launch — ProCrow Go/No-Go required; production remains F23-gated.",
  "CEM runs the company in staging; CyberCrow observes trust/evidence; SAREA adapts experience — no permission grants.",
  "Does not approve production launch, payments, subscriptions, or certified compliance.",
] as const;

export const CEM_OPERATING_MODEL_RELATIONSHIP_COPY =
  "CEM runs operations. Workflows create tasks. Tasks belong to users, roles, and departments. Modules contribute operational data. Reports summarize operations. CyberCrow reviews trust and evidence. SAREA shapes role-based experience — RBAC controls access.";
