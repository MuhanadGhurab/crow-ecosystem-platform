import type {
  EnterpriseModelDraft,
  HybridCompositionInput,
  OrganizationalModelDNA,
  PersonaMergeSuggestion,
  PersonaSplitSuggestion,
  ResponsibilityDistribution,
  ScaledWorkflowVariant,
  TenantScaleProfile,
} from "../types";
import { composeTenantBlueprint } from "@/lib/tenant-composition/registry";
import { SPECIALIST_DOMAIN_CATALOG } from "../specialist-domains/specialist-domain-catalog";
import { WORK_PERSONA_CATALOG } from "../work-personas/work-persona-catalog";
import { WORKFLOW_TEMPLATE_CATALOG } from "../workflows/workflow-template-catalog";
import { ORGANIZATIONAL_TOPOLOGY_CATALOG } from "../topology/organizational-topology";
import { buildScaleProfile, recommendApprovalDepth, scaleAffectsPersonaGranularity } from "../scale/tenant-scale";
import { KPI_CATALOG, EVIDENCE_CATALOG, AUDIT_RECOMMENDATION_CATALOG, TRUST_CONTROL_CATALOG } from "../metrics/kpi-outcomes";
import { createAuthorityProposal, validateAuthorityProposal } from "../authority-proposals/authority-proposal";

const specialistByKey = new Map(SPECIALIST_DOMAIN_CATALOG.map((d) => [d.key, d]));
const personaByKey = new Map(WORK_PERSONA_CATALOG.map((p) => [p.key, p]));
const workflowByKey = new Map(WORKFLOW_TEMPLATE_CATALOG.map((w) => [w.key, w]));

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort();
}

export function suggestPersonaMerge(personaKeys: readonly string[], scale: TenantScaleProfile): PersonaMergeSuggestion[] {
  if (scaleAffectsPersonaGranularity(scale) !== "merged") return [];
  if (personaKeys.length < 2) return [];
  return [
    {
      recommendation: "Merge coordinator personas into Operations Lead",
      reason: `Scale preset ${scale.preset} favors consolidated responsibilities`,
      sourcePersonaKeys: personaKeys.filter((k) => k.includes("coordinator") || k.includes("allocator")),
      targetPersonaKey: "workflow_coordinator",
      workflowImpact: ["Reduced handoff friction"],
      riskWarning: "Merged persona may overload single individual — advisory only",
    },
  ];
}

export function suggestPersonaSplit(basePersonaKey: string, scale: TenantScaleProfile): PersonaSplitSuggestion[] {
  if (scaleAffectsPersonaGranularity(scale) !== "split") return [];
  if (basePersonaKey !== "workflow_coordinator" && basePersonaKey !== "resource_allocator") return [];
  return [
    {
      recommendation: "Split operations coordination into specialized personas",
      reason: `Enterprise scale (${scale.preset}) benefits from specialized coordination`,
      sourcePersonaKey: basePersonaKey,
      targetPersonaKeys: ["workflow_coordinator", "resource_allocator", "capacity_planner", "cross_branch_resource_balancer"],
      workflowImpact: ["Clearer dispatch vs planning ownership"],
      riskWarning: "Requires explicit role assignment at tenant build — not automatic",
    },
  ];
}

export function suggestResponsibilityDistribution(personaKeys: readonly string[]): ResponsibilityDistribution[] {
  return personaKeys
    .map((key) => personaByKey.get(key))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      personaKey: p.key,
      responsibilities: [...p.responsibilities],
      rationale: `Derived from Work Persona ${p.displayName} — non-authoritative`,
    }));
}

export function scaleWorkflowTemplate(templateKey: string, scale: TenantScaleProfile): ScaledWorkflowVariant | null {
  const template = workflowByKey.get(templateKey);
  if (!template) return null;
  const depth = recommendApprovalDepth(scale);
  const baseStates = [...template.states];
  const enterpriseExtras = depth >= 6 ? ["budget_validation", "compliance_review", "audit_closure"] : depth >= 4 ? ["manager_approval", "finance_review"] : [];
  return {
    templateKey,
    scalePreset: scale.preset,
    states: uniqueSorted([...baseStates, ...enterpriseExtras]),
    approvalDepth: depth,
    evidenceKeys: depth >= 5 ? [...template.evidenceRequirementKeys, "approval_rationale"] : [...template.evidenceRequirementKeys],
    rationale: `Scaled for ${scale.preset} with approval depth ${depth}`,
  };
}

export function recommendEvidenceRequirements(workflowKeys: readonly string[]): string[] {
  const keys = new Set<string>();
  for (const wf of workflowKeys) {
    const t = workflowByKey.get(wf);
    if (t) for (const e of t.evidenceRequirementKeys) keys.add(e);
  }
  if (keys.size === 0) keys.add("approval_rationale");
  return uniqueSorted(keys);
}

export function buildOrganizationalModelDNA(
  input: HybridCompositionInput,
  draft: EnterpriseModelDraft,
): OrganizationalModelDNA {
  const topology = input.topologies?.[0] ?? "DEPARTMENTAL_HIERARCHY";
  const scale = input.scaleProfile ?? buildScaleProfile("GROWING_ORGANIZATION");
  const provenance: OrganizationalModelDNA["provenance"] = [
    { field: "primaryIndustry", source: input.primaryIndustry },
    ...input.specialistDomains?.map((d) => ({ field: "specialistDomain", source: d })) ?? [],
    { field: "scalePreset", source: scale.preset },
    { field: "topology", source: topology },
  ];
  return {
    primaryIndustry: input.primaryIndustry,
    secondaryIndustries: input.secondaryIndustries ?? [],
    specialistDomains: input.specialistDomains ?? [],
    operatingTopology: topology,
    scaleProfile: scale,
    workforceModel: scale.dimensions.fieldWorkforceIntensity >= 6 ? "field_heavy" : "office_centric",
    externalActors: scale.dimensions.externalActorVolume >= 6 ? ["customer", "supplier", "contractor"] : ["customer"],
    authorityStyle: recommendApprovalDepth(scale) >= 5 ? "segregated_approvals" : "lightweight_approvals",
    workflowIntensity: scale.dimensions.workflowVolume >= 7 ? "high_volume" : "moderate",
    trustProfile: uniqueSorted(draft.trustControls.map((t) => t.cyberCrowPolicyPackKey)),
    experienceStrategy: uniqueSorted(draft.workPersonas.map((p) => p.recommendedSareaPatternKey).filter((x): x is string => !!x)),
    modelRationale: [
      "Hybrid composition from industry archetypes, specialist domains, scale, and topology",
      "All recommendations are advisory and require human blueprint approval",
    ],
    provenance,
  };
}

/** Deterministic enterprise model draft — no provisioning, no authority grants. */
export function composeEnterpriseModel(input: HybridCompositionInput): EnterpriseModelDraft {
  const warnings: string[] = [];
  const unresolved: string[] = [];
  const scale = input.scaleProfile ?? buildScaleProfile("GROWING_ORGANIZATION");

  const baseComposition = composeTenantBlueprint({
    industryArchetype: input.primaryIndustry,
    overlays: input.organizationalOverlays,
    selectedCapabilities: input.selectedCapabilities,
    organizationSignals: input.organizationSignals,
  });

  const capabilitySet = new Set(baseComposition.recommendedCapabilities);
  const workflowSet = new Set(baseComposition.recommendedWorkflows);
  const personaSet = new Set<string>();

  for (const domainKey of input.specialistDomains ?? []) {
    const domain = specialistByKey.get(domainKey);
    if (!domain) {
      warnings.push(`Unknown specialist domain: ${domainKey}`);
      continue;
    }
    for (const cap of domain.recommendedCapabilityKeys) capabilitySet.add(cap);
    for (const wf of domain.workflowFamilyKeys) workflowSet.add(wf);
    for (const p of domain.personaSuggestionKeys) personaSet.add(p);
  }

  for (const industry of input.secondaryIndustries ?? []) {
    const secondary = composeTenantBlueprint({ industryArchetype: industry, organizationSignals: input.organizationSignals });
    for (const cap of secondary.recommendedCapabilities) capabilitySet.add(cap);
    for (const wf of secondary.recommendedWorkflows) workflowSet.add(wf);
  }

  if (scaleAffectsPersonaGranularity(scale) === "merged") {
    personaSet.add("workflow_coordinator");
    personaSet.add("outcome_owner");
  } else if (scaleAffectsPersonaGranularity(scale) === "split") {
    for (const p of WORK_PERSONA_CATALOG.slice(0, 12)) personaSet.add(p.key);
  } else {
    personaSet.add("workflow_coordinator");
    personaSet.add("case_lead");
    personaSet.add("project_controller");
  }

  const topology = input.topologies?.[0];
  if (topology === "COMMAND_CENTER") personaSet.add("cross_branch_resource_balancer");
  if (topology === "CASE_TEAMS") personaSet.add("case_lead");

  const workflowKeys = uniqueSorted(workflowSet);
  const personaKeys = uniqueSorted(personaSet);
  const workPersonas = personaKeys.map((k) => personaByKey.get(k)).filter((p): p is NonNullable<typeof p> => !!p);
  const workflowTemplates = workflowKeys.map((k) => workflowByKey.get(k)).filter((w): w is NonNullable<typeof w> => !!w);

  const kpiKeys = new Set<string>();
  for (const p of workPersonas) for (const k of p.kpiRecommendationKeys) kpiKeys.add(k);
  for (const w of workflowTemplates) for (const k of w.kpiKeys) kpiKeys.add(k);
  kpiKeys.add("workflow_cycle_time");

  const authorityProposals = [
    createAuthorityProposal("department_operations", "Department operations", "Advisory department operator access", ["department_operator"], ["coordinator", "specialist"]),
    createAuthorityProposal("workflow_approval", "Workflow approval", "Advisory approver bundles for workflows", ["workflow_approver"], ["approver", "department_manager"]),
  ];
  for (const proposal of authorityProposals) {
    warnings.push(...validateAuthorityProposal(proposal).map((e) => `Authority: ${e}`));
  }

  warnings.push(...baseComposition.warnings);
  warnings.push("Specialist domains and Work Personas do not grant permissions.");
  warnings.push("SAREA patterns consume authority; they never create it.");
  warnings.push("Human approval required before any tenant build.");

  if (!input.organizationSignals?.approval_complexity) {
    unresolved.push("Define approval complexity for final blueprint");
  }

  const draft: EnterpriseModelDraft = {
    compositionKey: `${input.primaryIndustry}:${(input.specialistDomains ?? []).join("+")}:${scale.preset}`,
    dna: {} as OrganizationalModelDNA,
    workPersonas,
    workflowTemplates,
    authorityProposals,
    kpiRecommendations: KPI_CATALOG.filter((k) => kpiKeys.has(k.key)),
    evidenceRequirements: EVIDENCE_CATALOG.filter((e) => recommendEvidenceRequirements(workflowKeys).includes(e.key)),
    auditRecommendations: [...AUDIT_RECOMMENDATION_CATALOG],
    trustControls: TRUST_CONTROL_CATALOG,
    warnings: uniqueSorted(warnings),
    unresolvedDecisions: uniqueSorted([...unresolved, ...baseComposition.unresolvedDecisions]),
  };

  draft.dna = buildOrganizationalModelDNA(input, draft);
  return draft;
}

export function listSpecialistDomains() {
  return [...SPECIALIST_DOMAIN_CATALOG];
}

export function listWorkPersonas() {
  return [...WORK_PERSONA_CATALOG];
}

export function listWorkflowTemplates() {
  return [...WORKFLOW_TEMPLATE_CATALOG];
}

export function listOrganizationalTopologies() {
  return [...ORGANIZATIONAL_TOPOLOGY_CATALOG];
}
