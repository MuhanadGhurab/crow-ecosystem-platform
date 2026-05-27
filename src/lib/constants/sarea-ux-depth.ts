/**
 * J5 — SAREA Studio UX depth model.
 * Experience orchestration copy and enums only — no RBAC or permission writes.
 */

export const SAREA_UX_AREAS = [
  "overview",
  "profiles",
  "role_mapping",
  "preview",
  "navigation",
  "widgets",
] as const;

export type SareaUXArea = (typeof SAREA_UX_AREAS)[number];

export const SAREA_PROFILE_READINESS_STATUSES = [
  "tenant_backed",
  "fallback",
  "needs_mapping",
  "needs_review",
  "incomplete",
] as const;

export type SareaProfileReadinessStatus = (typeof SAREA_PROFILE_READINESS_STATUSES)[number];

export const SAREA_EXPERIENCE_SCOPES = [
  "dashboard",
  "navigation",
  "widgets",
  "workflow_visibility",
  "report_density",
  "task_focus",
  "executive_summary",
  "frontline_simplification",
] as const;

export type SareaExperienceScope = (typeof SAREA_EXPERIENCE_SCOPES)[number];

export const SAREA_OPERATOR_ACTIONS = [
  "review_profiles",
  "map_roles",
  "preview_experience",
  "validate_navigation",
  "validate_widgets",
  "compare_rbac_boundary",
  "document_exception",
  "confirm_tenant_backed_state",
] as const;

export type SareaOperatorAction = (typeof SAREA_OPERATOR_ACTIONS)[number];

export const SAREA_IDENTITY = {
  shortName: "SAREA",
  procrowCapability: "ProCrow Experience Studio capability",
  tagline: "Role-based experience orchestration — navigation, widgets, and layout under operator review.",
} as const;

export const SAREA_SCOPE = {
  whatItIs: [
    "Experience orchestration for mapped RBAC roles — density, navigation emphasis, and widget visibility.",
    "Profile readiness across tenant-backed personas and recommended fallbacks.",
    "Operator-reviewed preview of shell presentation without changing permissions.",
    "ProCrow-controlled studio surfaces linked from the control tower.",
  ],
  whatItIsNot: [
    "Not an RBAC editor or permission management console.",
    "Not autonomous personalization or AI-driven role assignment.",
    "Not a drag-and-drop page builder or full experience automation.",
    "Not production-ready tenant customization without operator review.",
  ],
} as const;

export const SAREA_COPY = {
  rbacBoundary:
    "RBAC controls access. SAREA controls experience. Hiding navigation or widgets does not grant module access.",
  tenantBacked:
    "Tenant-backed profiles are materialized from lighthouse tenant data — preferred for demos and validation.",
  fallback:
    "Fallback profiles use recommended defaults when tenant rows are partial or missing — operator-reviewed before external claims.",
  previewPurpose:
    "Preview applies presentation cookies for a persona on a tenant route — it does not change roles, permissions, or entitlements.",
  navigationPurpose:
    "Navigation visibility shapes which links appear in the shell for a mapped role — users still need RBAC permission for each module.",
  widgetsPurpose:
    "Widget rules shape dashboard surfaces and density — hidden widgets do not remove authorization to underlying modules.",
  procrowOwnership:
    "SAREA operates under ProCrow. Studio changes are operator-reviewed; production launch and paid infra remain gated.",
  mappingPurpose:
    "Role mapping connects RBAC role slugs to experience profiles — unmapped roles keep platform defaults until assigned.",
} as const;

export const SAREA_UX_AREA_LABELS: Record<SareaUXArea, string> = {
  overview: "Studio overview",
  profiles: "Experience profiles",
  role_mapping: "Role mapping",
  preview: "Experience preview",
  navigation: "Navigation readiness",
  widgets: "Widget readiness",
};

export const SAREA_PROFILE_READINESS_LABELS: Record<SareaProfileReadinessStatus, string> = {
  tenant_backed: "Tenant-backed",
  fallback: "Fallback profile",
  needs_mapping: "Needs role mapping",
  needs_review: "Needs operator review",
  incomplete: "Incomplete materialization",
};

export const SAREA_EXPERIENCE_SCOPE_LABELS: Record<SareaExperienceScope, string> = {
  dashboard: "Dashboard layout",
  navigation: "Primary navigation",
  widgets: "Widget visibility",
  workflow_visibility: "Workflow visibility",
  report_density: "Report density",
  task_focus: "Task focus",
  executive_summary: "Executive summary",
  frontline_simplification: "Frontline simplification",
};

export const SAREA_OPERATOR_ACTION_LABELS: Record<SareaOperatorAction, string> = {
  review_profiles: "Review experience profiles",
  map_roles: "Map RBAC roles to profiles",
  preview_experience: "Preview mapped experience",
  validate_navigation: "Validate navigation readiness",
  validate_widgets: "Validate widget readiness",
  compare_rbac_boundary: "Compare RBAC vs SAREA boundary",
  document_exception: "Document exception",
  confirm_tenant_backed_state: "Confirm tenant-backed state",
};
