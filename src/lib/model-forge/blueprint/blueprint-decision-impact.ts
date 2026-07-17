import type { EnterpriseBlueprintDraft } from "./blueprint-types";
import type { EnterpriseBlueprintDecision } from "./blueprint-types";

export type DecisionImpactScope = {
  departments: readonly string[];
  capabilities: readonly string[];
  entities: readonly string[];
  personas: readonly string[];
  workflows: readonly string[];
  authorityProposals: readonly string[];
  kpis: readonly string[];
  evidence: readonly string[];
  sareaExperiences: readonly string[];
  cyberCrowPolicies: readonly string[];
  integrations: readonly string[];
  complianceOverlays: readonly string[];
  newWarnings: readonly string[];
  resolvedWarnings: readonly string[];
  newUnresolvedDecisions: readonly string[];
};

export type DecisionImpactResult = {
  decisionKey: string;
  selectedOption: string;
  recommendedOption: string;
  impact: DecisionImpactScope;
  deterministic: true;
};

const CATEGORY_IMPACT: Record<string, Partial<DecisionImpactScope>> = {
  SCALE: { departments: ["scale_derived"], workflows: ["approval_depth"], personas: ["role_density"] },
  TOPOLOGY: { departments: ["topology_structure"], workflows: ["routing_pattern"], personas: ["coordination_pattern"] },
  PERSONA: { personas: ["selected_persona"], workflows: ["participation"], authorityProposals: ["advisory_positions"] },
  WORKFLOW: { workflows: ["selected_workflow"], evidence: ["workflow_evidence"], kpis: ["workflow_kpis"] },
  ENTITY: { entities: ["selected_entity"], cyberCrowPolicies: ["entity_trust"], complianceOverlays: ["entity_compliance"] },
  AUTHORITY: { authorityProposals: ["selected_proposal"], personas: ["governed_positions"] },
  INTEGRATION: { integrations: ["selected_integration"], workflows: ["integration_touchpoints"] },
  COMPLIANCE: { complianceOverlays: ["selected_overlay"], evidence: ["compliance_evidence"] },
  SECURITY: { cyberCrowPolicies: ["selected_policy"], entities: ["protected_entities"] },
  EXPERIENCE: { sareaExperiences: ["selected_pattern"], personas: ["presentation"] },
};

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort();
}

export function analyzeBlueprintDecisionImpact(
  blueprint: EnterpriseBlueprintDraft,
  decision: EnterpriseBlueprintDecision,
  selectedOption: string,
): DecisionImpactResult {
  const base = CATEGORY_IMPACT[decision.category] ?? {};
  const recommended = decision.recommendedOption;

  const impact: DecisionImpactScope = {
    departments: uniqueSorted([...(base.departments ?? []), ...decision.affectedPaths.filter((p) => p.includes("departments")).map((p) => p.split(".").pop()!).filter(Boolean)]),
    capabilities: uniqueSorted(base.capabilities ?? []),
    entities: uniqueSorted(base.entities ?? []),
    personas: uniqueSorted([...(base.personas ?? []), ...blueprint.workPersonas.items.map((p) => (p as { key: string }).key).slice(0, 3)]),
    workflows: uniqueSorted([...(base.workflows ?? []), ...blueprint.workflows.items.map((w) => (w as { key: string }).key).slice(0, 3)]),
    authorityProposals: uniqueSorted(base.authorityProposals ?? []),
    kpis: uniqueSorted(base.kpis ?? []),
    evidence: uniqueSorted(base.evidence ?? []),
    sareaExperiences: uniqueSorted(base.sareaExperiences ?? []),
    cyberCrowPolicies: uniqueSorted(base.cyberCrowPolicies ?? []),
    integrations: uniqueSorted(base.integrations ?? []),
    complianceOverlays: uniqueSorted(base.complianceOverlays ?? []),
    newWarnings: selectedOption !== recommended ? [`Decision ${decision.key}: non-recommended option selected`] : [],
    resolvedWarnings: selectedOption === recommended ? [`Decision ${decision.key}: aligned with recommendation`] : [],
    newUnresolvedDecisions: selectedOption !== recommended && decision.blocking ? [decision.key] : [],
  };

  void blueprint;
  return {
    decisionKey: decision.key,
    selectedOption,
    recommendedOption: recommended,
    impact,
    deterministic: true,
  };
}

export function applyDecisionToSessionDraft(
  blueprint: EnterpriseBlueprintDraft,
  decisionKey: string,
  option: string,
): EnterpriseBlueprintDraft {
  return {
    ...blueprint,
    unresolvedDecisions: blueprint.unresolvedDecisions.map((d) =>
      d.key === decisionKey ? { ...d, draftSelection: option } : d,
    ),
  };
}

export function revertSessionDecision(
  blueprint: EnterpriseBlueprintDraft,
  decisionKey: string,
): EnterpriseBlueprintDraft {
  return {
    ...blueprint,
    unresolvedDecisions: blueprint.unresolvedDecisions.map((d) =>
      d.key === decisionKey ? { ...d, draftSelection: undefined } : d,
    ),
  };
}
