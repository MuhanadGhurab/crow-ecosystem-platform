/** M3.4 — CEM workflow persistence / transaction schema contract (staging / approval-gated). */

export const CEM_WORKFLOW_PERSISTENCE_DISCLAIMERS = [
  "Workflow persistence prototype — not a production ERP transaction engine.",
  "Transaction lineage uses existing tenant tables and report metadata — not certified audit evidence.",
  "Not supplier payment, accounting posting, legal PO issuance, or production stock mutation.",
  "Schema migration for stronger FK lineage requires explicit operator approval (M3.4B).",
  "ProCrow Go/No-Go review required before any production launch discussion.",
] as const;

export type CemWorkflowPersistenceMode =
  | "existing_schema"
  | "migration_required"
  | "advisory_only";

export type CemWorkflowLinkType =
  | "purchase_request_to_workflow"
  | "workflow_to_stage"
  | "stage_to_task"
  | "stage_to_approval"
  | "stage_to_receiving"
  | "receiving_to_inventory_visibility"
  | "workflow_to_report"
  | "workflow_to_cybercrow_evidence"
  | "workflow_to_sarea_experience";

export type CemWorkflowLinkStatus = "linked" | "inferred" | "missing" | "proposed";

export type CemWorkflowPersistenceLink = {
  linkType: CemWorkflowLinkType;
  sourceModel: string;
  sourceId: string | null;
  targetModel: string;
  targetId: string | null;
  status: CemWorkflowLinkStatus;
  persistenceMode: CemWorkflowPersistenceMode;
  notes: string;
};

export type CemWorkflowPersistenceAudit = {
  tenantSlug: string;
  workflowKey: "purchase_to_stock";
  persistenceMode: CemWorkflowPersistenceMode;
  existingModels: string[];
  missingLinks: CemWorkflowLinkType[];
  proposedLinks: CemWorkflowLinkType[];
  blockers: string[];
  safeToImplementWithoutMigration: boolean;
  migrationProposalRequired: boolean;
  recommendedNextAction: string;
};

export type CemWorkflowPersistenceSnapshot = {
  tenantSlug: string;
  tenantName: string;
  workflowKey: "purchase_to_stock";
  persistenceMode: CemWorkflowPersistenceMode;
  links: CemWorkflowPersistenceLink[];
  blockers: string[];
  warnings: string[];
  recommendedActions: string[];
  disclaimers: readonly string[];
  audit: CemWorkflowPersistenceAudit;
};

export type CemWorkflowPersistenceGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
  persistenceChecks: string[];
};
