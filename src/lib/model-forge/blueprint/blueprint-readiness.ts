import type { CompilerReadinessMatrix, EnterpriseBlueprintDraft } from "./blueprint-types";

export function buildCompilerReadinessMatrix(draft: EnterpriseBlueprintDraft): CompilerReadinessMatrix {
  const entries = [
    dim("organization", draft.organization.items.length > 0, draft.unresolvedDecisions.some((d) => d.category === "ORGANIZATION")),
    dim("work model", draft.departments.items.length > 0, false),
    dim("personas", draft.workPersonas.items.length > 0, false),
    dim("workflows", draft.workflows.items.length > 0, draft.unresolvedDecisions.some((d) => d.category === "WORKFLOW")),
    dim("information", draft.entities.items.length > 0, false),
    dim("authority proposals", draft.authorityProposals.items.length > 0, draft.unresolvedDecisions.some((d) => d.category === "AUTHORITY")),
    dim("outcomes and metrics", draft.kpis.items.length > 0, false),
    dim("evidence and audit", draft.evidence.items.length > 0, false),
    dim("experience", draft.sareaExperiences.items.length > 0, false),
    dim("security", draft.cyberCrowPolicies.items.length > 0, false),
    dim("integrations", draft.integrations.items.length > 0, false),
    dim("compliance", draft.complianceOverlays.items.length > 0, false),
  ];

  const needsDecision = entries.some((e) => e.status === "NEEDS_DECISION") || draft.unresolvedDecisions.some((d) => d.blocking);

  return {
    overallStatus: needsDecision ? "NEEDS_DECISION" : "READY_FOR_HUMAN_BLUEPRINT_REVIEW",
    entries,
  };
}

function dim(dimension: string, hasContent: boolean, needsDecision: boolean) {
  let status: CompilerReadinessMatrix["entries"][number]["status"] = "READY_FOR_REVIEW";
  if (!hasContent) status = "PARTIAL";
  if (needsDecision) status = "NEEDS_DECISION";
  return {
    dimension,
    status,
    reason: needsDecision ? "Unresolved decisions remain" : hasContent ? "Section populated" : "Section partially populated",
  };
}
