/**
 * M3 — CEM runtime handoff & Business Portal operational readiness (advisory only).
 */

export type CemRuntimeHandoffStatus =
  | "not_started"
  | "needs_tenant"
  | "needs_modules"
  | "needs_users_roles"
  | "needs_workflows"
  | "needs_cybercrow"
  | "needs_sarea"
  | "ready_for_staging_handoff"
  | "blocked";

export type CemOperationalArea =
  | "modules"
  | "departments"
  | "roles"
  | "users"
  | "tasks"
  | "workflows"
  | "reports"
  | "hr"
  | "finance"
  | "procurement"
  | "logistics"
  | "inventory"
  | "warehouse"
  | "crm"
  | "sales";

export type CemOperationalAreaStatus =
  | "ready"
  | "warning"
  | "blocked"
  | "thin"
  | "not_applicable";

export type CemOperationalAreaReadiness = {
  area: CemOperationalArea;
  label: string;
  status: CemOperationalAreaStatus;
  route: string;
  summary: string;
  missingItems: string[];
  recommendedAction: string;
  demoReady: boolean;
};

export type CemRuntimeDependencySummary = {
  label: string;
  status: string;
  summary: string;
  blockers: string[];
  warnings: string[];
};

export type CemRuntimeHandoffSnapshot = {
  tenantSlug: string;
  tenantName: string;
  status: CemRuntimeHandoffStatus;
  operationalAreas: CemOperationalAreaReadiness[];
  moduleCount: number;
  departmentCount: number;
  roleCount: number;
  userCount: number;
  taskCount: number;
  workflowCount: number;
  reportCount: number;
  cyberCrowDependency: CemRuntimeDependencySummary;
  sareaDependency: CemRuntimeDependencySummary;
  blockers: string[];
  warnings: string[];
  recommendedActions: string[];
  businessPortalEntryRoute: string;
  goNoGoDependency: string;
  disclaimers: readonly string[];
};

export const CEM_RUNTIME_HANDOFF_DISCLAIMERS = [
  "CEM runtime handoff does not approve production launch.",
  "Staging/runtime readiness only — not production launch approval.",
  "No payment or subscription activation is implied.",
  "ProCrow Go/No-Go and F23 production gate still control any production path.",
  "CyberCrow and SAREA dependencies remain advisory readiness layers.",
] as const;

export const CEM_CYBERCROW_SAREA_RELATIONSHIP_COPY =
  "CEM runs operations; CyberCrow reviews trust around operations; SAREA shapes the role-based experience." as const;

export const CEM_CLIENT_BUSINESS_PROCROW_DISTINCTION = {
  clientPortal:
    "Client Portal — request Crow, guided discovery, proposal review, and onboarding (not day-to-day operations).",
  businessPortal:
    "Business Portal — tenant operational workspace powered by CEM after ProCrow prepares the runtime.",
  procrow:
    "ProCrow — internal operator control tower for discovery, blueprint, tenant prep, and Go/No-Go.",
} as const;

export type CemRuntimeGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
  relationshipNote: string;
};
