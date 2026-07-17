import type { BlueprintCompileInput } from "../blueprint/blueprint-types";
import type { EnterpriseModelDraft } from "../types";
import type { GraphResolvedSources } from "../graph/graph-sources";
import { createProvenanceRecord } from "./provenance-engine";
import type { ProvenanceSource } from "./provenance-types";

export function registerOrganizationProvenance(
  draft: EnterpriseModelDraft,
  input: BlueprintCompileInput,
): void {
  createProvenanceRecord(
    { kind: "organization", key: draft.dna.primaryIndustry, path: "blueprint.organization.primary" },
    `Primary industry: ${draft.dna.primaryIndustry}`,
    "User-selected primary industry archetype drives composition",
    {
      sources: ["USER_SELECTION", "INDUSTRY_ARCHETYPE"],
      userInputs: ["primaryIndustry"],
      catalogRefs: [draft.dna.primaryIndustry],
      rules: [{ ruleId: "industry_contains_specialist_domain", description: "Industry scopes specialist domains" }],
      strength: "REQUIRED",
    },
  );

  createProvenanceRecord(
    { kind: "topology", key: draft.dna.operatingTopology, path: "blueprint.organization.topology" },
    `Operating topology: ${draft.dna.operatingTopology}`,
    "User-selected organizational topology",
    {
      sources: ["USER_SELECTION", "TOPOLOGY"],
      userInputs: ["topology"],
      catalogRefs: [draft.dna.operatingTopology],
      strength: "RECOMMENDED",
    },
  );

  if (input.scalePreset) {
    createProvenanceRecord(
      { kind: "scale", key: input.scalePreset, path: "blueprint.scenarioProfile.scale" },
      `Scale preset: ${input.scalePreset}`,
      "Tenant scale profile influences departments and workflow depth",
      { sources: ["USER_SELECTION", "SCALE_PROFILE"], userInputs: ["scalePreset"], catalogRefs: [input.scalePreset] },
    );
  }
}

export function registerDepartmentProvenance(sources: GraphResolvedSources): void {
  for (const key of sources.departmentKeys) {
    createProvenanceRecord(
      { kind: "department", key, path: `blueprint.departments.${key}` },
      `Department archetype: ${key}`,
      "Resolved from domain packs and scale profile",
      {
        sources: ["DOMAIN_PACK", "SCALE_PROFILE"],
        catalogRefs: [key],
        rules: [{ ruleId: "organization_contains_department", description: "Organization contains department" }],
      },
    );
  }
}

export function registerCapabilityProvenance(sources: GraphResolvedSources, getLabel: (k: string) => string): void {
  for (const key of sources.capabilityKeys) {
    createProvenanceRecord(
      { kind: "capability", key, path: `blueprint.capabilities.${key}` },
      getLabel(key),
      "Resolved from specialist domains and domain packs",
      {
        sources: ["SPECIALIST_DOMAIN", "DOMAIN_PACK"],
        catalogRefs: [key],
        rules: [{ ruleId: "domain_pack_contains_capability", description: "Domain pack contains capability" }],
      },
    );
  }
}

export function registerEntityProvenance(
  entityKeys: string[],
  getLabel: (k: string) => string,
  specialistKeys: string[],
): void {
  for (const key of entityKeys) {
    createProvenanceRecord(
      { kind: "entity", key, path: `blueprint.entities.${key}` },
      getLabel(key),
      "Entity pack definitions linked to domain packs",
      {
        sources: ["DOMAIN_PACK", "ENTITY_RULE"],
        catalogRefs: [key, ...specialistKeys],
        rules: [{ ruleId: "domain_pack_recommends_entity", description: "Domain pack recommends entity" }],
      },
    );
  }
}

export function registerPersonaProvenance(draft: EnterpriseModelDraft, specialistKeys: string[]): void {
  for (const p of draft.workPersonas) {
    createProvenanceRecord(
      { kind: "work_persona", key: p.key, path: `blueprint.workPersonas.${p.key}` },
      p.displayName,
      "Work persona derived from domain pack and composition rules",
      {
        sources: ["DOMAIN_PACK", "PERSONA_RULE"],
        catalogRefs: [p.key, ...specialistKeys],
        rules: [{ ruleId: "composition_derives_work_persona", description: "Composition derives work persona" }],
        strength: "RECOMMENDED",
      },
    );
    for (const wf of p.workflowParticipation) {
      createProvenanceRecord(
        { kind: "workflow_position", key: `${p.key}:${wf}`, path: `blueprint.workPersonas.${p.key}.positions.${wf}` },
        `${p.displayName} participates in ${wf}`,
        `Persona workflow positions: ${p.workflowPositions.join(", ") || "participant"}`,
        {
          sources: ["PERSONA_RULE", "WORKFLOW_RULE"],
          catalogRefs: [p.key, wf],
          rules: [{ ruleId: "persona_participates_workflow", description: "Persona participates in workflow" }],
        },
      );
    }
  }
}

export function registerWorkflowProvenance(draft: EnterpriseModelDraft): void {
  for (const w of draft.workflowTemplates) {
    createProvenanceRecord(
      { kind: "workflow", key: w.key, path: `blueprint.workflows.${w.key}` },
      w.displayName,
      "Workflow template from domain pack and composition",
      {
        sources: ["DOMAIN_PACK", "WORKFLOW_RULE"],
        catalogRefs: [w.key],
        rules: [{ ruleId: "composition_derives_workflow", description: "Composition derives workflow" }],
      },
    );
    for (const state of w.states) {
      createProvenanceRecord(
        { kind: "workflow_stage", key: `${w.key}:${state}`, path: `blueprint.workflows.${w.key}.stages.${state}` },
        `Stage ${state} in ${w.displayName}`,
        "Workflow template state machine",
        {
          sources: ["WORKFLOW_RULE", "CATALOG_ENTRY"],
          catalogRefs: [w.key, state],
          rules: [{ ruleId: "workflow_contains_stage", description: "Workflow contains stage" }],
        },
      );
    }
    createProvenanceRecord(
      { kind: "outcome", key: w.key, path: `blueprint.outcomes.${w.key}` },
      `${w.displayName} outcome`,
      "Outcome derived from workflow completion",
      {
        sources: ["WORKFLOW_RULE"],
        catalogRefs: [w.key],
        rules: [{ ruleId: "workflow_governs_outcome", description: "Workflow governs outcome" }],
      },
    );
  }
}

export function registerKpiProvenance(draft: EnterpriseModelDraft): void {
  for (const k of draft.kpiRecommendations) {
    createProvenanceRecord(
      { kind: "kpi", key: k.key, path: `blueprint.kpis.${k.key}` },
      k.displayName,
      "KPI recommendation from metrics catalog and workflow linkage",
      {
        sources: ["WORKFLOW_RULE", "CATALOG_ENTRY"],
        catalogRefs: [k.key],
        rules: [{ ruleId: "composition_derives_kpi", description: "Composition derives KPI" }, { ruleId: "workflow_measured_by_kpi", description: "Workflow measured by KPI" }],
      },
    );
  }
}

export function registerEvidenceProvenance(draft: EnterpriseModelDraft): void {
  for (const e of draft.evidenceRequirements) {
    createProvenanceRecord(
      { kind: "evidence", key: e.key, path: `blueprint.evidence.${e.key}` },
      e.displayName,
      "Evidence requirement from workflow and compliance rules",
      {
        sources: ["COMPLIANCE_RULE", "WORKFLOW_RULE"],
        catalogRefs: [e.key],
        rules: [{ ruleId: "composition_derives_evidence", description: "Composition derives evidence" }, { ruleId: "workflow_requires_evidence", description: "Workflow requires evidence" }],
      },
    );
  }
}

export function registerAuthorityProvenance(draft: EnterpriseModelDraft): void {
  for (const a of draft.authorityProposals) {
    createProvenanceRecord(
      { kind: "authority_proposal", key: a.key, path: `blueprint.authority.${a.key}` },
      a.displayName,
      "Advisory authority proposal — does not grant permissions",
      {
        sources: ["PERSONA_RULE", "WORKFLOW_RULE"],
        catalogRefs: [a.key],
        rules: [{ ruleId: "authority_governs_persona_position", description: "Authority proposal governs persona position" }],
        strength: "OPTIONAL",
      },
    );
  }
}

export function registerSareaProvenance(keys: string[], getLabel: (k: string) => string, specialistKeys: string[]): void {
  for (const key of keys) {
    createProvenanceRecord(
      { kind: "sarea_experience", key, path: `blueprint.sarea.${key}` },
      getLabel(key),
      "SAREA experience pattern from domain pack",
      {
        sources: ["DOMAIN_PACK", "CATALOG_ENTRY"],
        catalogRefs: [key, ...specialistKeys],
        rules: [{ ruleId: "persona_presented_through_sarea", description: "Persona presented through SAREA" }],
      },
    );
  }
}

export function registerCyberCrowProvenance(keys: string[], getLabel: (k: string) => string): void {
  for (const key of keys) {
    createProvenanceRecord(
      { kind: "cybercrow_policy", key, path: `blueprint.cybercrow.${key}` },
      getLabel(key),
      "CyberCrow trust control from entity/workflow sensitivity",
      {
        sources: ["SECURITY_RULE", "ENTITY_RULE"],
        catalogRefs: [key],
        rules: [{ ruleId: "entity_protected_by_cybercrow", description: "Entity protected by CyberCrow" }, { ruleId: "workflow_protected_by_cybercrow", description: "Workflow protected by CyberCrow" }],
      },
    );
  }
}

export function registerIntegrationProvenance(keys: string[], getLabel: (k: string) => string): void {
  for (const key of keys) {
    createProvenanceRecord(
      { kind: "integration", key, path: `blueprint.integrations.${key}` },
      getLabel(key),
      "Integration pack from domain composition",
      {
        sources: ["INTEGRATION_RULE", "DOMAIN_PACK"],
        catalogRefs: [key],
        rules: [{ ruleId: "workflow_integrates_with_integration", description: "Workflow integrates with system" }],
      },
    );
  }
}

export function registerComplianceProvenance(keys: string[], getLabel: (k: string) => string): void {
  for (const key of keys) {
    createProvenanceRecord(
      { kind: "compliance_overlay", key, path: `blueprint.compliance.${key}` },
      getLabel(key),
      "Advisory compliance overlay — does not certify compliance",
      {
        sources: ["COMPLIANCE_RULE", "ORGANIZATIONAL_OVERLAY"],
        catalogRefs: [key],
        rules: [{ ruleId: "compliance_governs_entity", description: "Compliance governs entity" }, { ruleId: "compliance_governs_workflow", description: "Compliance governs workflow" }],
        strength: "RECOMMENDED",
      },
    );
  }
}

export function collectAllBlueprintProvenancePaths(draft: EnterpriseModelDraft, sources: GraphResolvedSources): string[] {
  const paths: string[] = [
    "blueprint.organization.primary",
    "blueprint.organization.topology",
    "blueprint.scenarioProfile.scale",
    ...sources.departmentKeys.map((k) => `blueprint.departments.${k}`),
    ...sources.capabilityKeys.map((k) => `blueprint.capabilities.${k}`),
    ...sources.entityKeys.slice(0, 32).map((k) => `blueprint.entities.${k}`),
    ...draft.workPersonas.map((p) => `blueprint.workPersonas.${p.key}`),
    ...draft.workPersonas.flatMap((p) => p.workflowParticipation.map((wf) => `blueprint.workPersonas.${p.key}.positions.${wf}`)),
    ...draft.workflowTemplates.map((w) => `blueprint.workflows.${w.key}`),
    ...draft.workflowTemplates.flatMap((w) => w.states.map((s) => `blueprint.workflows.${w.key}.stages.${s}`)),
    ...draft.workflowTemplates.map((w) => `blueprint.outcomes.${w.key}`),
    ...draft.kpiRecommendations.map((k) => `blueprint.kpis.${k.key}`),
    ...draft.evidenceRequirements.map((e) => `blueprint.evidence.${e.key}`),
    ...draft.authorityProposals.map((a) => `blueprint.authority.${a.key}`),
    ...sources.sareaPatternKeys.map((k) => `blueprint.sarea.${k}`),
    ...sources.cyberCrowPolicyKeys.map((k) => `blueprint.cybercrow.${k}`),
    ...sources.integrationKeys.map((k) => `blueprint.integrations.${k}`),
    ...sources.complianceOverlayKeys.map((k) => `blueprint.compliance.${k}`),
  ];
  return [...new Set(paths)];
}

export function registerAllBlueprintProvenance(
  draft: EnterpriseModelDraft,
  sources: GraphResolvedSources,
  input: BlueprintCompileInput,
  labels: {
    capability: (k: string) => string;
    entity: (k: string) => string;
    sarea: (k: string) => string;
    cyber: (k: string) => string;
    integration: (k: string) => string;
    compliance: (k: string) => string;
  },
): string[] {
  const specialistKeys = [...(input.specialistDomains ?? [])];
  registerOrganizationProvenance(draft, input);
  registerDepartmentProvenance(sources);
  registerCapabilityProvenance(sources, labels.capability);
  registerEntityProvenance(sources.entityKeys.slice(0, 32), labels.entity, specialistKeys);
  registerPersonaProvenance(draft, specialistKeys);
  registerWorkflowProvenance(draft);
  registerKpiProvenance(draft);
  registerEvidenceProvenance(draft);
  registerAuthorityProvenance(draft);
  registerSareaProvenance(sources.sareaPatternKeys, labels.sarea, specialistKeys);
  registerCyberCrowProvenance(sources.cyberCrowPolicyKeys, labels.cyber);
  registerIntegrationProvenance(sources.integrationKeys, labels.integration);
  registerComplianceProvenance(sources.complianceOverlayKeys, labels.compliance);
  return collectAllBlueprintProvenancePaths(draft, sources);
}
