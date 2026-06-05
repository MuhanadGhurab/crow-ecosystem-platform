/** M3.3 — CEM transaction workflow prototype contract (staging / demo-safe). */

export const CEM_TRANSACTION_WORKFLOW_DISCLAIMERS = [
  "Staging transaction workflow prototype — not a production ERP engine.",
  "Not supplier payment, accounting posting, or legal purchase order issuance.",
  "Not production stock mutation — inventory visibility is advisory unless tenant data exists.",
  "ProCrow Go/No-Go review required before any production launch discussion.",
] as const;

export type CemTransactionWorkflowKey = "purchase_to_stock";

export type CemTransactionStatus =
  | "draft"
  | "submitted"
  | "procurement_review"
  | "finance_approval"
  | "warehouse_receiving"
  | "inventory_visible"
  | "completed"
  | "blocked"
  | "cancelled";

export type CemTransactionStage =
  | "department_request"
  | "procurement_review"
  | "finance_approval"
  | "warehouse_receiving"
  | "inventory_visibility"
  | "report_output";

export type CemTransactionActorRole =
  | "requester"
  | "procurement_owner"
  | "finance_approver"
  | "warehouse_receiver"
  | "operations_manager"
  | "procrow_observer";

export type CemTransactionStepStatus = "pending" | "active" | "completed" | "blocked";

export type CemTransactionRecordSource = "tenant_backed" | "mock" | "advisory";

export type CemPurchaseToStockRequest = {
  id: string;
  tenantSlug: string;
  title: string;
  itemName: string;
  quantity: number;
  department: string;
  requestedByRole: CemTransactionActorRole;
  businessReason: string;
  status: CemTransactionStatus;
  currentStage: CemTransactionStage;
  createdAt: string;
  updatedAt: string;
  source: CemTransactionRecordSource;
  referenceCode?: string | null;
  linkedFinanceRef?: string | null;
  linkedInventoryRef?: string | null;
};

export type CemTransactionStep = {
  stage: CemTransactionStage;
  label: string;
  status: CemTransactionStepStatus;
  ownerRole: CemTransactionActorRole;
  moduleKey: string;
  route: string;
  description: string;
  evidenceHook: string;
  reportImpact: string;
  sareaView: string;
};

export type CemTransactionTaskRef = {
  id: string;
  title: string;
  status: string;
  workflowName?: string | null;
};

export type CemTransactionReportRef = {
  id: string;
  name: string;
  summary: string;
};

export type CemTransactionModuleImpact = {
  moduleKey: string;
  label: string;
  impact: string;
  route: string;
};

export type CemTransactionEvidenceHook = {
  key: string;
  label: string;
  description: string;
  route?: string;
  readiness: "ready" | "partial" | "advisory";
};

export type CemTransactionSareaRoleView = {
  role: CemTransactionActorRole;
  label: string;
  focus: string;
  widgets: string[];
};

export type CemTransactionNextAction = {
  id: string;
  label: string;
  description: string;
  actionKey?:
    | "submit_request"
    | "send_finance_approval"
    | "approve_finance"
    | "mark_warehouse_received"
    | "confirm_inventory_visibility";
  allowed: boolean;
  blockedReason?: string;
};

export type CemTransactionWorkflowSnapshot = {
  tenantSlug: string;
  tenantName: string;
  workflowKey: CemTransactionWorkflowKey;
  status: CemTransactionStatus;
  request: CemPurchaseToStockRequest;
  steps: CemTransactionStep[];
  relatedTasks: CemTransactionTaskRef[];
  relatedReports: CemTransactionReportRef[];
  moduleImpacts: CemTransactionModuleImpact[];
  cyberCrowEvidence: CemTransactionEvidenceHook[];
  sareaExperienceImpact: CemTransactionSareaRoleView[];
  blockers: string[];
  warnings: string[];
  nextActions: CemTransactionNextAction[];
  disclaimers: readonly string[];
  persistenceMode: "tenant_backed" | "advisory_only";
  actionsEnabled: boolean;
};

export type CemTransactionWorkflowSummary = {
  workflowKey: CemTransactionWorkflowKey;
  status: CemTransactionStatus;
  requestCount: number;
  activeRequestTitle?: string;
  persistenceMode: "tenant_backed" | "advisory_only";
  hasCompletedDemoFlow: boolean;
  warnings: string[];
};

export type CemTransactionWorkflowGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
  workflowChecks: string[];
};
