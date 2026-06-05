import "server-only";

import type {
  CemWorkflowPersistenceAudit,
  CemWorkflowPersistenceGoNoGoDependency,
} from "@/lib/cem/cem-workflow-persistence-contract";

export function buildCemWorkflowPersistenceGoNoGoDependency(
  audit?: CemWorkflowPersistenceAudit | null
): CemWorkflowPersistenceGoNoGoDependency {
  const mode = audit?.persistenceMode ?? "advisory_only";
  const migrationRequired = audit?.migrationProposalRequired === true;
  const linkedCount =
    audit == null
      ? 0
      : 9 - (audit.missingLinks?.length ?? 0) - (audit.proposedLinks?.length ?? 0);

  let status: CemWorkflowPersistenceGoNoGoDependency["status"] = "warning";
  if (migrationRequired) {
    status = "blocked";
  } else if (mode === "existing_schema" && linkedCount >= 5) {
    status = "ready";
  }

  const advisoryNote = migrationRequired
    ? "Workflow prototype is functional, but stable transaction lineage requires schema approval (M3.4B). Does not approve production launch, payment, accounting, or inventory mutation."
    : mode === "advisory_only"
      ? "No tenant purchase requests — persistence audit is advisory until ops seeding exercises tenant-backed lineage."
      : "Workflow persistence confirms transaction lineage for staging operations using existing schema and report lineage metadata. Does not approve production launch, payment, accounting, or inventory mutation.";

  return {
    status,
    label: "CEM workflow persistence (M3.4)",
    advisoryNote,
    persistenceChecks: [
      "Purchase-to-stock persistence contract and audit service exist",
      "ProCrow tenant panel shows stable, inferred, and missing links",
      "Business Portal workflow UI shows persisted vs advisory lineage",
      "Reports and CyberCrow hooks label persisted/inferred/advisory state",
      "No schema migration applied without explicit operator approval",
      "No payment activation, accounting posting, legal PO, or stock mutation claims",
    ],
  };
}
