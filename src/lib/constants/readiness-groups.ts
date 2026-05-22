/** Pre-provision readiness groups — Phase 4 blueprint → go-live gate. */

export type ReadinessGroupKey =
  | "modules"
  | "workflows"
  | "rbac"
  | "cybercrow"
  | "sarea"
  | "integrations"
  | "org_structure"
  | "operations";

export const READINESS_GROUP_META: Record<
  ReadinessGroupKey,
  { title: string; description: string; entity?: "cem" | "cybercrow" | "sarea" }
> = {
  modules: {
    title: "CEM modules",
    description: "Enabled modules on the blueprint match discovery commitments.",
    entity: "cem",
  },
  workflows: {
    title: "Workflows",
    description: "Operational workflows captured in discovery and seeded at provision.",
    entity: "cem",
  },
  rbac: {
    title: "RBAC & roles",
    description: "Roles and permissions defined before tenant CEM structure is seeded.",
    entity: "cem",
  },
  cybercrow: {
    title: "CyberCrow baseline",
    description: "Security package and NCA-oriented controls ready for initializeCyberCrow.",
    entity: "cybercrow",
  },
  sarea: {
    title: "SAREA mappings",
    description: "Experience personas and role mappings for adaptive tenant dashboards.",
    entity: "sarea",
  },
  integrations: {
    title: "Integrations",
    description: "ERP, IdP, and messaging connectors recorded for blueprint slots.",
    entity: "cem",
  },
  org_structure: {
    title: "Organization structure",
    description: "Departments and branches from discovery feed CEM seed.",
    entity: "cem",
  },
  operations: {
    title: "Platform operations",
    description: "Infrastructure, smoke test, and support sign-offs.",
  },
};

export const READINESS_GROUP_ORDER: ReadinessGroupKey[] = [
  "modules",
  "org_structure",
  "rbac",
  "workflows",
  "cybercrow",
  "sarea",
  "integrations",
  "operations",
];
