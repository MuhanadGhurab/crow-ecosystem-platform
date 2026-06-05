/**
 * M2 — SAREA blueprint-to-experience mapping (advisory — RBAC unchanged).
 */

export type SareaExperienceMappingStatus =
  | "not_started"
  | "needs_blueprint"
  | "needs_roles"
  | "needs_cybercrow_boundaries"
  | "mapping_ready"
  | "ready_for_go_no_go"
  | "blocked";

export type SareaExperienceDensity = "simple" | "standard" | "advanced" | "executive";

export type SareaExperiencePersona = {
  key: string;
  label: string;
  department: string;
  roleType: string;
  responsibilities: string;
  recommendedLandingRoute: string;
  modulesVisible: string[];
  navigationKeys: string[];
  widgetsVisible: string[];
  reportViews: string[];
  workflowViews: string[];
  experienceDensity: SareaExperienceDensity;
  cyberCrowBoundaryNotes: string;
  rbacNotes: string;
};

export type SareaBlueprintExperienceInput = {
  requestId: string | null;
  blueprintId: string | null;
  tenantSlug: string | null;
  industryTemplate: string | null;
  companyStageTemplate: string | null;
  departments: string[];
  roles: { name: string; slug: string }[];
  modules: string[];
  workflows: string[];
  cyberCrowTrustStatus: string | null;
  identityReadiness: string | null;
  accessReviewStatus: string | null;
  discoveryAccepted: boolean;
};

export type SareaExperienceMappingSnapshot = {
  tenantSlug: string | null;
  tenantName: string;
  status: SareaExperienceMappingStatus;
  personas: SareaExperiencePersona[];
  missingInputs: string[];
  warnings: string[];
  blockers: string[];
  recommendedActions: string[];
  cyberCrowDependencies: string[];
  goNoGoDependencies: string[];
  previewRoutes: string[];
  fallbackUsed: boolean;
  tenantBackedPersonaCount: number;
  disclaimers: readonly string[];
};

export const SAREA_EXPERIENCE_MAPPING_DISCLAIMERS = [
  "Role-based experience mapping — advisory until ProCrow validates. RBAC controls access; SAREA controls experience.",
  "SAREA does not grant permissions or replace RBAC.",
  "No autonomous personalization or production-ready experience without operator review.",
] as const;

export const SAREA_CYBERCROW_DEPENDENCY_COPY =
  "CyberCrow validates trust and access boundaries; SAREA uses those boundaries to shape role-based experience." as const;

export type SareaExperienceGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
};
