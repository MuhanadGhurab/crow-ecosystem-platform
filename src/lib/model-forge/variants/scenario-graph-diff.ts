import type { EnterpriseGraphEdge, EnterpriseGraphNode, EnterpriseOperatingGraph, GraphNodeType, OperatingModelVariantKey } from "../domain-types";
import type { HybridCompositionInput } from "../types";
import { buildOperatingGraph } from "../graph/operating-graph";
import { composeVariantDraft } from "../variants/scenario-comparison";

export type ScenarioNodeChange =
  | "ADDED"
  | "REMOVED"
  | "CHANGED"
  | "MERGED"
  | "SPLIT"
  | "EXPANDED"
  | "REDUCED"
  | "UNCHANGED";

export type ScenarioNodeDiff = {
  nodeType: GraphNodeType;
  key: string;
  change: ScenarioNodeChange;
  whatChanged: string;
  whyChanged: string;
  sourceVariant: OperatingModelVariantKey;
  targetVariant: OperatingModelVariantKey;
  trigger?: string;
  blueprintPaths: readonly string[];
  provenanceRef?: string;
  advisory: true;
};

export type ScenarioEdgeChange =
  | "EDGE_ADDED"
  | "EDGE_REMOVED"
  | "EDGE_CHANGED"
  | "RESPONSIBILITY_TRANSFERRED"
  | "OWNERSHIP_RECOMMENDATION_CHANGED"
  | "APPROVAL_PATH_CHANGED"
  | "INTEGRATION_PATH_CHANGED"
  | "TRUST_CONTROL_CHANGED"
  | "EVIDENCE_REQUIREMENT_CHANGED";

export type ScenarioEdgeDiff = {
  change: ScenarioEdgeChange;
  edgeType: string;
  sourceKey: string;
  targetKey: string;
  whatChanged: string;
  whyChanged: string;
  sourceVariant: OperatingModelVariantKey;
  targetVariant: OperatingModelVariantKey;
  trigger?: string;
  blueprintPaths: readonly string[];
  advisory: true;
};

export type ScenarioGraphComparison = {
  variantA: OperatingModelVariantKey;
  variantB: OperatingModelVariantKey;
  nodeDiffs: readonly ScenarioNodeDiff[];
  edgeDiffs: readonly ScenarioEdgeDiff[];
  nodeTypeCoverage: Record<GraphNodeType, boolean>;
  deterministic: true;
};

const ALL_NODE_TYPES: GraphNodeType[] = [
  "INDUSTRY", "SPECIALIST_DOMAIN", "DOMAIN_PACK", "DEPARTMENT", "CAPABILITY", "ENTITY",
  "WORK_PERSONA", "WORKFLOW", "WORKFLOW_STAGE", "OUTCOME", "KPI", "EVIDENCE",
  "AUTHORITY_PROPOSAL", "SAREA_EXPERIENCE", "CYBERCROW_POLICY", "INTEGRATION", "COMPLIANCE_OVERLAY",
];

function nodeKeysByType(nodes: readonly EnterpriseGraphNode[], type: GraphNodeType): string[] {
  return nodes.filter((n) => n.type === type).map((n) => n.key).sort();
}

function classifyListDiff(a: string[], b: string[]): ScenarioNodeChange[] {
  const changes: ScenarioNodeChange[] = [];
  for (const k of b.filter((x) => !a.includes(x))) changes.push("ADDED");
  for (const k of a.filter((x) => !b.includes(x))) changes.push("REMOVED");
  for (const k of a.filter((x) => b.includes(x))) changes.push("UNCHANGED");
  return changes;
}

function blueprintPathFor(type: GraphNodeType, key: string): string[] {
  const map: Partial<Record<GraphNodeType, string>> = {
    DEPARTMENT: `blueprint.departments.${key}`,
    CAPABILITY: `blueprint.capabilities.${key}`,
    ENTITY: `blueprint.entities.${key}`,
    WORK_PERSONA: `blueprint.workPersonas.${key}`,
    WORKFLOW: `blueprint.workflows.${key}`,
    KPI: `blueprint.kpis.${key}`,
    EVIDENCE: `blueprint.evidence.${key}`,
    AUTHORITY_PROPOSAL: `blueprint.authority.${key}`,
    SAREA_EXPERIENCE: `blueprint.sarea.${key}`,
    CYBERCROW_POLICY: `blueprint.cybercrow.${key}`,
    INTEGRATION: `blueprint.integrations.${key}`,
    COMPLIANCE_OVERLAY: `blueprint.compliance.${key}`,
    OUTCOME: `blueprint.outcomes.${key}`,
    INDUSTRY: "blueprint.organization.primary",
    SPECIALIST_DOMAIN: `blueprint.specialist.${key}`,
    DOMAIN_PACK: `blueprint.domainPack.${key}`,
    WORKFLOW_STAGE: `blueprint.workflows.${key.split(":")[0]}.stages.${key.split(":")[1] ?? key}`,
  };
  const p = map[type];
  return p ? [p] : [];
}

function edgeSignature(e: EnterpriseGraphEdge): string {
  return `${e.type}:${e.source}:${e.target}`;
}

function classifyEdgeChange(
  edge: EnterpriseGraphEdge,
  removed: boolean,
  variantA: OperatingModelVariantKey,
  variantB: OperatingModelVariantKey,
): ScenarioEdgeDiff {
  let change: ScenarioEdgeChange = removed ? "EDGE_REMOVED" : "EDGE_ADDED";
  if (edge.type === "OWNS") change = "OWNERSHIP_RECOMMENDATION_CHANGED";
  else if (edge.type === "REVIEWS" || edge.type === "APPROVES") change = "APPROVAL_PATH_CHANGED";
  else if (edge.type === "INTEGRATES_WITH") change = "INTEGRATION_PATH_CHANGED";
  else if (edge.type === "PROTECTED_BY") change = "TRUST_CONTROL_CHANGED";
  else if (edge.type === "REQUIRES_EVIDENCE" || edge.type === "PRODUCES") change = "EVIDENCE_REQUIREMENT_CHANGED";
  else if (edge.type === "PARTICIPATES_IN" || edge.type === "COORDINATES") change = "RESPONSIBILITY_TRANSFERRED";

  return {
    change,
    edgeType: edge.type,
    sourceKey: edge.source,
    targetKey: edge.target,
    whatChanged: `${edge.type} ${removed ? "removed" : "added"} between ${edge.source} and ${edge.target}`,
    whyChanged: edge.reason,
    sourceVariant: variantA,
    targetVariant: variantB,
    trigger: "scale_topology_or_domain_variant",
    blueprintPaths: [],
    advisory: true,
  };
}

export function compareOperatingGraphEdges(
  graphA: EnterpriseOperatingGraph,
  graphB: EnterpriseOperatingGraph,
  variantA: OperatingModelVariantKey,
  variantB: OperatingModelVariantKey,
): ScenarioEdgeDiff[] {
  const sigA = new Set(graphA.edges.map(edgeSignature));
  const sigB = new Set(graphB.edges.map(edgeSignature));
  const diffs: ScenarioEdgeDiff[] = [];

  for (const e of graphB.edges) {
    if (!sigA.has(edgeSignature(e))) diffs.push(classifyEdgeChange(e, false, variantA, variantB));
  }
  for (const e of graphA.edges) {
    if (!sigB.has(edgeSignature(e))) diffs.push(classifyEdgeChange(e, true, variantA, variantB));
  }
  return diffs.sort((a, b) => a.change.localeCompare(b.change));
}

export function compareScenarioGraphs(
  base: HybridCompositionInput,
  variantA: OperatingModelVariantKey,
  variantB: OperatingModelVariantKey,
  specialistKeys: string[] = [],
): ScenarioGraphComparison {
  const draftA = composeVariantDraft(base, variantA);
  const draftB = composeVariantDraft(base, variantB);
  const graphA = buildOperatingGraph(draftA, "OPERATING_MODEL", specialistKeys, { registerProvenance: false });
  const graphB = buildOperatingGraph(draftB, "OPERATING_MODEL", specialistKeys, { registerProvenance: false });

  const nodeDiffs: ScenarioNodeDiff[] = [];
  const nodeTypeCoverage = Object.fromEntries(ALL_NODE_TYPES.map((t) => [t, false])) as Record<GraphNodeType, boolean>;

  for (const type of ALL_NODE_TYPES) {
    nodeTypeCoverage[type] = true;
    const keysA = nodeKeysByType(graphA.nodes, type);
    const keysB = nodeKeysByType(graphB.nodes, type);

    const allKeys = [...new Set([...keysA, ...keysB])].sort();
    for (const key of allKeys) {
      const inA = keysA.includes(key);
      const inB = keysB.includes(key);
      let change: ScenarioNodeChange = "UNCHANGED";
      if (inA && !inB) change = "REMOVED";
      else if (!inA && inB) change = "ADDED";
      else if (inA && inB && type === "WORKFLOW") {
        const stagesA = graphA.nodes.filter((n) => n.type === "WORKFLOW_STAGE" && n.key.startsWith(`${key}:`)).length;
        const stagesB = graphB.nodes.filter((n) => n.type === "WORKFLOW_STAGE" && n.key.startsWith(`${key}:`)).length;
        if (stagesB > stagesA) change = "EXPANDED";
        else if (stagesB < stagesA) change = "REDUCED";
      }
      if (change === "UNCHANGED" && inA && inB) continue;

      nodeDiffs.push({
        nodeType: type,
        key,
        change,
        whatChanged: `${type} ${key} ${change.toLowerCase().replace(/_/g, " ")}`,
        whyChanged: `Variant ${variantA} → ${variantB} affects ${type} resolution via scale, topology, or domain packs`,
        sourceVariant: variantA,
        targetVariant: variantB,
        trigger: "variant_comparison",
        blueprintPaths: blueprintPathFor(type, key),
        provenanceRef: `rule:composition_variant`,
        advisory: true,
      });
    }

    if (keysB.length > keysA.length && keysA.length > 0 && type === "WORK_PERSONA") {
      nodeDiffs.push({
        nodeType: type,
        key: "persona_count",
        change: "SPLIT",
        whatChanged: `Persona count ${keysA.length} → ${keysB.length}`,
        whyChanged: "Scale variant increases persona specialization",
        sourceVariant: variantA,
        targetVariant: variantB,
        blueprintPaths: keysB.map((k) => `blueprint.workPersonas.${k}`),
        advisory: true,
      });
    } else if (keysB.length < keysA.length && keysB.length > 0 && type === "WORK_PERSONA") {
      nodeDiffs.push({
        nodeType: type,
        key: "persona_count",
        change: "MERGED",
        whatChanged: `Persona count ${keysA.length} → ${keysB.length}`,
        whyChanged: "Micro scale merges persona roles",
        sourceVariant: variantA,
        targetVariant: variantB,
        blueprintPaths: keysB.map((k) => `blueprint.workPersonas.${k}`),
        advisory: true,
      });
    }
  }

  const edgeDiffs = compareOperatingGraphEdges(graphA, graphB, variantA, variantB);

  return {
    variantA,
    variantB,
    nodeDiffs: nodeDiffs.sort((a, b) => a.nodeType.localeCompare(b.nodeType) || a.key.localeCompare(b.key)),
    edgeDiffs,
    nodeTypeCoverage,
    deterministic: true,
  };
}

export function scenarioDiffNodeTypeCoverageCount(comparison: ScenarioGraphComparison): number {
  return Object.values(comparison.nodeTypeCoverage).filter(Boolean).length;
}
