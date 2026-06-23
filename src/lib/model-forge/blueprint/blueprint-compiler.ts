import type { EnterpriseBlueprintDraft, BlueprintCompileInput, EnterpriseBlueprintSection } from "./blueprint-types";
import { BLUEPRINT_COMPILER_VERSION, BLUEPRINT_SCHEMA_VERSION } from "./blueprint-types";
import { hashBlueprintContent } from "./blueprint-hash";
import { buildScaleProfile } from "../scale/tenant-scale";
import { composeEnterpriseModel } from "../composition/hybrid-composition";
import { buildOperatingGraph } from "../graph/operating-graph";
import { resolveGraphSources, getEntityDefinition, getCapabilityLabel, getSareaLabel, getCyberCrowLabel, getIntegrationLabel, getComplianceLabel } from "../graph/graph-sources";
import {
  clearProvenanceRegistry,
  createProvenanceRecord,
  listAllProvenanceRecords,
  countUnexplainedTargets,
} from "../provenance/provenance-engine";
import { validateEnterpriseBlueprintDraft } from "./blueprint-validation";
import { buildBlueprintDecisionRegister } from "./blueprint-decisions";
import type { OrganizationalTopologyKey, TenantScalePreset } from "../types";

function section<T>(key: string, displayName: string, items: T[], paths: string[]): EnterpriseBlueprintSection<T> {
  return { key, displayName, items, provenancePaths: paths };
}

export function compileEnterpriseBlueprintPreview(input: BlueprintCompileInput): EnterpriseBlueprintDraft {
  clearProvenanceRegistry();

  const scaleProfile = buildScaleProfile((input.scalePreset ?? "GROWING_ORGANIZATION") as TenantScalePreset);
  const topology = (input.topology ?? "DEPARTMENTAL_HIERARCHY") as OrganizationalTopologyKey;

  const compositionInput = {
    primaryIndustry: input.primaryIndustry,
    secondaryIndustries: input.secondaryIndustries,
    specialistDomains: input.specialistDomains,
    organizationalOverlays: input.organizationalOverlays,
    scaleProfile,
    topologies: [topology] as const,
    organizationSignals: { approval_complexity: "medium" as const },
  };

  const draft = composeEnterpriseModel(compositionInput);
  const specialistKeys = [...(input.specialistDomains ?? [])];
  const graph = buildOperatingGraph(draft, "OPERATING_MODEL", specialistKeys, { registerProvenance: true });
  const sources = resolveGraphSources(draft, specialistKeys);

  const capabilityItems = sources.capabilityKeys.map((key) => ({
    key,
    displayName: getCapabilityLabel(key),
    advisory: true as const,
  }));
  for (const c of capabilityItems) {
    createProvenanceRecord(
      { kind: "capability", key: c.key, path: `blueprint.capabilities.${c.key}` },
      c.displayName,
      "Resolved from specialist domains and domain packs",
      { sources: ["SPECIALIST_DOMAIN", "DOMAIN_PACK"], catalogRefs: [c.key], strength: "RECOMMENDED" },
    );
  }

  const entityItems = sources.entityKeys.slice(0, 32).map((key) => {
    const ent = getEntityDefinition(key);
    return {
      key,
      displayName: ent?.displayName ?? key,
      lifecycle: ent?.lifecycle ?? [],
      sensitivity: ent?.sensitivityClassification ?? "internal",
      advisory: true as const,
    };
  });

  const sareaItems = sources.sareaPatternKeys.map((key) => ({
    key,
    displayName: getSareaLabel(key),
    advisory: true as const,
  }));

  const cyberItems = sources.cyberCrowPolicyKeys.map((key) => ({
    key,
    displayName: getCyberCrowLabel(key),
    advisory: true as const,
  }));

  const integrationItems = sources.integrationKeys.map((key) => ({
    key,
    displayName: getIntegrationLabel(key),
    status: "PLANNED" as const,
    advisory: true as const,
  }));

  const complianceItems = sources.complianceOverlayKeys.map((key) => ({
    key,
    displayName: getComplianceLabel(key),
    advisoryStatus: "Advisory operational control — does not certify compliance",
    advisory: true as const,
  }));

  const departmentItems = sources.departmentKeys.map((key) => ({
    key,
    displayName: key.replace(/_/g, " "),
    grantsPermissions: false as const,
  }));

  const personaItems = draft.workPersonas.map((p) => ({
    key: p.key,
    displayName: p.displayName,
    workflowParticipation: [...p.workflowParticipation],
    grantsPermissions: false as const,
    authoritative: false as const,
  }));

  const workflowItems = draft.workflowTemplates.map((w) => ({
    key: w.key,
    displayName: w.displayName,
    states: [...w.states],
    topology: w.topology,
    advisory: true as const,
  }));

  const expectedPaths = [
    "blueprint.organization.primary",
    ...capabilityItems.map((c) => `blueprint.capabilities.${c.key}`),
    ...personaItems.map((p) => `blueprint.workPersonas.${p.key}`),
  ];

  const unexplained = countUnexplainedTargets(expectedPaths.filter((p) => p !== "blueprint.organization.primary"));

  const unresolvedDecisions = buildBlueprintDecisionRegister(draft, input);

  const previewBase = {
    metadata: {
      schemaVersion: BLUEPRINT_SCHEMA_VERSION,
      compilerVersion: BLUEPRINT_COMPILER_VERSION,
      sourceModelKey: draft.compositionKey,
      generatedAtDisplay: new Date().toISOString(),
      advisory: true as const,
      authoritative: false as const,
      requiresHumanApproval: true as const,
      persistenceState: "EPHEMERAL_PREVIEW" as const,
      previewClassification: "BLUEPRINT_PREVIEW" as const,
    },
    executiveSummary: `Advisory Blueprint preview for ${draft.dna.primaryIndustry} with ${specialistKeys.length} specialist domain(s). Requires human blueprint review before any tenant build.`,
    modelDNA: draft.dna,
    organization: section("organization", "Organization", [{ primaryIndustry: draft.dna.primaryIndustry, topology: draft.dna.operatingTopology }], ["blueprint.organization"]),
    departments: section("departments", "Departments", departmentItems, departmentItems.map((d) => `blueprint.departments.${d.key}`)),
    capabilities: section("capabilities", "Capabilities", capabilityItems, capabilityItems.map((c) => `blueprint.capabilities.${c.key}`)),
    entities: section("entities", "Entities", entityItems, entityItems.map((e) => `blueprint.entities.${e.key}`)),
    workPersonas: section("workPersonas", "Work Personas", personaItems, personaItems.map((p) => `blueprint.workPersonas.${p.key}`)),
    workflows: section("workflows", "Workflows", workflowItems, workflowItems.map((w) => `blueprint.workflows.${w.key}`)),
    outcomes: section("outcomes", "Outcomes", workflowItems.map((w) => ({ workflowKey: w.key, outcome: `${w.displayName} outcome` })), []),
    kpis: section("kpis", "KPIs", draft.kpiRecommendations.map((k) => ({ key: k.key, displayName: k.displayName })), []),
    evidence: section("evidence", "Evidence", draft.evidenceRequirements.map((e) => ({ key: e.key, displayName: e.displayName })), []),
    authorityProposals: section(
      "authorityProposals",
      "Authority proposals",
      draft.authorityProposals.map((a) => ({ ...a, advisory: true as const })),
      draft.authorityProposals.map((a) => `blueprint.authority.${a.key}`),
    ),
    sareaExperiences: section("sareaExperiences", "SAREA experiences", sareaItems, sareaItems.map((s) => `blueprint.sarea.${s.key}`)),
    cyberCrowPolicies: section("cyberCrowPolicies", "CyberCrow policies", cyberItems, cyberItems.map((c) => `blueprint.cybercrow.${c.key}`)),
    integrations: section("integrations", "Integrations", integrationItems, integrationItems.map((i) => `blueprint.integrations.${i.key}`)),
    complianceOverlays: section("complianceOverlays", "Compliance overlays", complianceItems, complianceItems.map((c) => `blueprint.compliance.${c.key}`)),
    scenarioProfile: {
      scalePreset: scaleProfile.preset,
      topology,
      variantKey: input.variantKey,
      overlays: input.organizationalOverlays ?? [],
    },
    unresolvedDecisions,
    warnings: draft.warnings.map((message, i) => ({ code: `WARN_${i}`, message, severity: "WARNING" as const })),
    provenanceSummary: {
      recordCount: listAllProvenanceRecords().length,
      unexplainedCount: unexplained.length,
    },
  };

  const contentHash = hashBlueprintContent({ ...previewBase, metadata: { ...previewBase.metadata, generatedAtDisplay: undefined } });
  const sourceModelHash = hashBlueprintContent(compositionInput);

  const full: EnterpriseBlueprintDraft = {
    ...previewBase,
    metadata: { ...previewBase.metadata, contentHash, sourceModelHash },
    validation: { valid: true, findings: [] },
  };

  full.validation = validateEnterpriseBlueprintDraft(full);
  void graph;
  return full;
}
