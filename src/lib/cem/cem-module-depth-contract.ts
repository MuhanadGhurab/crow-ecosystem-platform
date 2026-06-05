import "server-only";

export type CemModuleDepthStatus =
  | "not_available"
  | "thin"
  | "demo_ready"
  | "operational_model_ready"
  | "needs_data"
  | "needs_review";

export type CemModuleRecordType =
  | "employee"
  | "invoice"
  | "purchase_request"
  | "purchase_order"
  | "inventory_item"
  | "stock_movement"
  | "warehouse_receipt"
  | "shipment"
  | "customer"
  | "sales_opportunity"
  | "task"
  | "workflow"
  | "report";

export type CemModuleRecordSource = "tenant_backed" | "mock" | "inferred" | "advisory";

export type CemModuleOperationalRecord = {
  id: string;
  label: string;
  type: CemModuleRecordType;
  status: string;
  ownerRole?: string;
  department?: string;
  relatedWorkflow?: string;
  relatedTask?: string;
  relatedReport?: string;
  source: CemModuleRecordSource;
};

export type CemModuleDepthKey =
  | "hr"
  | "finance"
  | "procurement"
  | "inventory"
  | "warehouse"
  | "logistics"
  | "crm"
  | "sales"
  | "reports";

export type CemModuleDepthWorkflowRef = {
  id: string;
  label: string;
  status: string;
  source: CemModuleRecordSource;
};

export type CemModuleDepthTaskRef = {
  id: string;
  label: string;
  status: string;
  source: CemModuleRecordSource;
};

export type CemModuleDepthCrossLink = {
  flowKey: string;
  flowLabel: string;
  readiness: string;
  roleInFlow: string;
};

export type CemModuleDepthSnapshot = {
  tenantSlug: string;
  tenantName: string;
  moduleKey: CemModuleDepthKey;
  cemModuleKey: string;
  moduleLabel: string;
  status: CemModuleDepthStatus;
  purpose: string;
  records: CemModuleOperationalRecord[];
  workflows: CemModuleDepthWorkflowRef[];
  tasks: CemModuleDepthTaskRef[];
  departments: string[];
  roles: string[];
  reports: string[];
  cyberCrowHooks: string[];
  sareaHooks: string[];
  crossModuleLinks: CemModuleDepthCrossLink[];
  nextActions: string[];
  blockers: string[];
  warnings: string[];
  demoLimitations: string[];
  disclaimers: readonly string[];
};

export type CemModuleDepthSummaryItem = {
  moduleKey: CemModuleDepthKey;
  moduleLabel: string;
  status: CemModuleDepthStatus;
  recordCount: number;
  flowCount: number;
};

export type CemModuleDepthGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
  depthChecks: string[];
};

export const CEM_MODULE_DEPTH_DISCLAIMERS = [
  "M3.2 module depth — staging/demo operational areas, not a full transactional ERP engine.",
  "Records may be tenant-backed, inferred, or advisory — ProCrow Go/No-Go still required before any production launch.",
  "No payment activation, subscription billing, payroll, legal HR compliance, or certified compliance claims.",
  "Production commercial launch remains F23-gated; CyberCrow and SAREA hooks are observability/experience only.",
] as const;

export const CEM_MODULE_DEPTH_RELATIONSHIP_COPY =
  "Module depth connects each ERP area to workflows, tasks, departments, roles, reports, CyberCrow trust, and SAREA experience — read-only derived view.";
