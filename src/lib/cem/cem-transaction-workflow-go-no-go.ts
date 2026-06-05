import "server-only";

import type {
  CemTransactionWorkflowGoNoGoDependency,
  CemTransactionWorkflowSummary,
} from "@/lib/cem/cem-transaction-workflow-contract";

/** Lightweight Go/No-Go advisory dependency for M3.3 — optional tenant summary for status. */
export function buildCemTransactionWorkflowGoNoGoDependency(
  summary?: CemTransactionWorkflowSummary | null
): CemTransactionWorkflowGoNoGoDependency {
  const hasPersistence = summary?.persistenceMode === "tenant_backed";
  const hasDemoFlow = summary?.hasCompletedDemoFlow === true;

  const status: CemTransactionWorkflowGoNoGoDependency["status"] =
    hasPersistence && hasDemoFlow ? "ready" : "warning";

  const persistenceNote = !summary
    ? "Walk purchase-to-stock on a tenant with ops seeding to exercise tenant-backed persistence."
    : hasPersistence
      ? hasDemoFlow
        ? "At least one purchase request reached received stage — still advisory until ProCrow review."
        : "Tenant purchase requests exist but no completed demo flow yet."
      : "No tenant purchase requests — workflow is advisory-only until ops seeding.";

  return {
    status,
    label: "CEM transaction workflow prototype (M3.3)",
    advisoryNote: `Purchase-to-stock is a staging cross-module workflow prototype using existing tenant purchase requests, tasks, workflows, and approvals. ${persistenceNote} Does not approve production launch, payments, accounting posting, or legal PO issuance. Run npm run cem-transaction:verify after M3.3 changes.`,
    workflowChecks: [
      "Purchase-to-stock workflow route and stage timeline exist",
      "Procurement, finance, warehouse, inventory, reports, tasks, and workflows link to the flow",
      "CyberCrow evidence readiness hooks and SAREA role experience copy present",
      "Stage actions guarded by tenant workflow policy when persistence is available",
      "No payment activation, stock mutation overclaims, or production launch claims",
    ],
  };
}
