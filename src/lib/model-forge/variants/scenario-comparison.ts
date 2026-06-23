import type { OperatingModelVariant, OperatingModelVariantKey, ScenarioComparisonResult, ScenarioDiffEntry } from "../domain-types";
import type { EnterpriseModelDraft, HybridCompositionInput } from "../types";
import { composeEnterpriseModel } from "../composition/hybrid-composition";
import { buildScaleProfile } from "../scale/tenant-scale";

export const OPERATING_MODEL_VARIANTS: readonly OperatingModelVariant[] = [
  { key: "MICRO", displayName: "Micro", description: "Solo or micro team", scalePreset: "MICRO", overlayKeys: [], advisoryDifferences: ["Merged departments", "Fewer approval layers"] },
  { key: "GROWING", displayName: "Growing", description: "Growing organization", scalePreset: "GROWING_ORGANIZATION", overlayKeys: ["mid_market"], advisoryDifferences: ["Emerging department splits"] },
  { key: "ENTERPRISE", displayName: "Enterprise", description: "Enterprise scale", scalePreset: "ENTERPRISE", overlayKeys: ["enterprise"], advisoryDifferences: ["Full department lattice", "Deeper approvals"] },
  { key: "CENTRALIZED", displayName: "Centralized", description: "Central command", scalePreset: "ENTERPRISE", topologyKey: "COMMAND_CENTER", overlayKeys: [], advisoryDifferences: ["Central approval hub"] },
  { key: "DISTRIBUTED", displayName: "Distributed", description: "Distributed branches", scalePreset: "GROWING_ORGANIZATION", topologyKey: "FRANCHISE_NETWORK", overlayKeys: [], advisoryDifferences: ["Branch autonomy"] },
  { key: "DEPARTMENTAL", displayName: "Departmental", description: "Department hierarchy", scalePreset: "ENTERPRISE", topologyKey: "DEPARTMENTAL_HIERARCHY", overlayKeys: [], advisoryDifferences: ["Department ownership"] },
  { key: "OUTCOME_POD", displayName: "Outcome pod", description: "Outcome-oriented pods", scalePreset: "GROWING_ORGANIZATION", topologyKey: "OUTCOME_PODS", overlayKeys: [], advisoryDifferences: ["Cross-functional pods"] },
  { key: "COMMAND_CENTER", displayName: "Command center", description: "Operations command center", scalePreset: "ENTERPRISE", topologyKey: "COMMAND_CENTER", overlayKeys: [], advisoryDifferences: ["Central ops visibility"] },
  { key: "HIGH_REGULATION", displayName: "High regulation", description: "Enhanced compliance overlays", scalePreset: "ENTERPRISE", overlayKeys: ["high_regulation"], advisoryDifferences: ["More evidence and audit controls"] },
  { key: "AUTOMATION_FORWARD", displayName: "Automation forward", description: "Automation-first operations", scalePreset: "GROWING_ORGANIZATION", overlayKeys: ["automation_forward"], advisoryDifferences: ["Automation supervisor persona"] },
] as const;

function variantInput(base: HybridCompositionInput, variant: OperatingModelVariant): HybridCompositionInput {
  return {
    ...base,
    scaleProfile: buildScaleProfile(variant.scalePreset),
    topologies: variant.topologyKey
      ? ([variant.topologyKey] as HybridCompositionInput["topologies"])
      : base.topologies,
    organizationalOverlays: [...new Set([...(base.organizationalOverlays ?? []), ...variant.overlayKeys])],
  };
}

export function composeVariantDraft(base: HybridCompositionInput, variantKey: OperatingModelVariantKey): EnterpriseModelDraft {
  const variant = OPERATING_MODEL_VARIANTS.find((v) => v.key === variantKey);
  if (!variant) throw new Error(`Unknown variant: ${variantKey}`);
  return composeEnterpriseModel(variantInput(base, variant));
}

function diffLists(a: string[], b: string[]): ScenarioDiffEntry[] {
  const entries: ScenarioDiffEntry[] = [];
  for (const x of b.filter((k) => !a.includes(k))) entries.push({ category: "composition", change: "added", label: x });
  for (const x of a.filter((k) => !b.includes(k))) entries.push({ category: "composition", change: "removed", label: x });
  for (const x of a.filter((k) => b.includes(k))) entries.push({ category: "composition", change: "unchanged", label: x });
  return entries;
}

export function compareOperatingModelVariants(
  base: HybridCompositionInput,
  variantA: OperatingModelVariantKey,
  variantB: OperatingModelVariantKey,
): ScenarioComparisonResult {
  const draftA = composeVariantDraft(base, variantA);
  const draftB = composeVariantDraft(base, variantB);

  const diffs: ScenarioDiffEntry[] = [
    ...diffLists(
      (draftA.dna.departmentKeys ?? []).map(String),
      (draftB.dna.departmentKeys ?? []).map(String),
    ).map((d) => ({ ...d, category: "departments" })),
    ...diffLists(
      draftA.workPersonas.map((p) => p.key),
      draftB.workPersonas.map((p) => p.key),
    ).map((d) => ({ ...d, category: "work_personas" })),
    ...diffLists(
      draftA.workflowTemplates.map((w) => w.key),
      draftB.workflowTemplates.map((w) => w.key),
    ).map((d) => ({ ...d, category: "workflows" })),
    ...diffLists(
      draftA.kpiRecommendations.map((k) => k.key),
      draftB.kpiRecommendations.map((k) => k.key),
    ).map((d) => ({ ...d, category: "kpis" })),
    ...diffLists(
      draftA.evidenceRequirements.map((e) => e.key),
      draftB.evidenceRequirements.map((e) => e.key),
    ).map((d) => ({ ...d, category: "evidence" })),
  ];

  if (draftB.workPersonas.length > draftA.workPersonas.length) {
    diffs.push({ category: "personas", change: "expanded", label: "Persona count", detail: `${draftA.workPersonas.length} → ${draftB.workPersonas.length}` });
  } else if (draftB.workPersonas.length < draftA.workPersonas.length) {
    diffs.push({ category: "personas", change: "reduced", label: "Persona count", detail: `${draftA.workPersonas.length} → ${draftB.workPersonas.length}` });
  }

  const depthA = draftA.workflowTemplates.reduce((s, w) => s + w.states.length, 0);
  const depthB = draftB.workflowTemplates.reduce((s, w) => s + w.states.length, 0);
  if (depthB !== depthA) {
    diffs.push({
      category: "workflows",
      change: depthB > depthA ? "expanded" : "reduced",
      label: "Workflow depth",
      detail: `${depthA} → ${depthB} total stages`,
    });
  }

  return { variantA, variantB, diffs, deterministic: true };
}
