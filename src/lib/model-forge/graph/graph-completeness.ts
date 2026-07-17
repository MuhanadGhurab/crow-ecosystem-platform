import type { EnterpriseOperatingGraph, GraphNodeType } from "../domain-types";
import type { EnterpriseModelDraft } from "../types";
import { resolveGraphSources } from "./graph-sources";

export type GraphLayerStatus = "COMPLETE" | "PARTIAL" | "UNRESOLVED" | "NOT_APPLICABLE" | "BLOCKED";

export type GraphLayerCoverage = {
  layer: string;
  status: GraphLayerStatus;
  populatedCount: number;
  expectedCount: number;
  missingItems: readonly string[];
  reason: string;
  sourceRule: string;
  recommendedResolution: string;
  blocking: boolean;
};

export type GraphCompletenessReport = {
  layers: readonly GraphLayerCoverage[];
  nodeTypeCounts: Record<GraphNodeType, number>;
  coverageNotes: Record<string, string>;
};

const ALL_NODE_TYPES: GraphNodeType[] = [
  "INDUSTRY", "SPECIALIST_DOMAIN", "DOMAIN_PACK", "DEPARTMENT", "CAPABILITY", "ENTITY",
  "WORK_PERSONA", "WORKFLOW", "WORKFLOW_STAGE", "OUTCOME", "KPI", "EVIDENCE",
  "AUTHORITY_PROPOSAL", "SAREA_EXPERIENCE", "CYBERCROW_POLICY", "INTEGRATION", "COMPLIANCE_OVERLAY",
];

export function analyzeOperatingGraphCompleteness(
  graph: EnterpriseOperatingGraph,
  draft: EnterpriseModelDraft,
  specialistKeys: string[] = [],
): GraphCompletenessReport {
  const sources = resolveGraphSources(draft, specialistKeys);
  const counts = Object.fromEntries(ALL_NODE_TYPES.map((t) => [t, 0])) as Record<GraphNodeType, number>;
  for (const n of graph.nodes) counts[n.type] = (counts[n.type] ?? 0) + 1;

  function layer(
    name: string,
    nodeType: GraphNodeType,
    expectedKeys: string[],
    reasonNA: string,
  ): GraphLayerCoverage {
    const populated = graph.nodes.filter((n) => n.type === nodeType).map((n) => n.key);
    const missing = expectedKeys.filter((k) => !populated.includes(k));
    let status: GraphLayerStatus = "COMPLETE";
    if (expectedKeys.length === 0) status = "NOT_APPLICABLE";
    else if (missing.length === expectedKeys.length) status = sources.coverageNotes[name] ? "NOT_APPLICABLE" : "UNRESOLVED";
    else if (missing.length > 0) status = "PARTIAL";
    return {
      layer: name,
      status,
      populatedCount: populated.length,
      expectedCount: expectedKeys.length,
      missingItems: missing,
      reason: expectedKeys.length === 0 ? reasonNA : missing.length ? `${missing.length} items not in graph` : "All expected items present",
      sourceRule: `graph.node.${nodeType}`,
      recommendedResolution: missing.length ? `Populate ${nodeType} nodes for: ${missing.slice(0, 3).join(", ")}` : "None",
      blocking: false,
    };
  }

  const layers: GraphLayerCoverage[] = [
    layer("organization", "INDUSTRY", [draft.dna.primaryIndustry], "Primary industry always present"),
    layer("specialist_domains", "SPECIALIST_DOMAIN", sources.specialistKeys, "No specialist domains selected"),
    layer("domain_packs", "DOMAIN_PACK", sources.domainPackKeys, sources.coverageNotes.domain_pack ?? "No matching domain packs"),
    layer("departments", "DEPARTMENT", sources.departmentKeys, "Departments derived from scale"),
    layer("capabilities", "CAPABILITY", sources.capabilityKeys, sources.coverageNotes.capability ?? "No capabilities resolved"),
    layer("entities", "ENTITY", sources.entityKeys.slice(0, 24), "Entity packs provide definitions"),
    layer("personas", "WORK_PERSONA", draft.workPersonas.map((p) => p.key), "Composition personas"),
    layer("workflows", "WORKFLOW", draft.workflowTemplates.map((w) => w.key), "Workflow templates"),
    layer("metrics", "KPI", draft.kpiRecommendations.map((k) => k.key), "KPI recommendations"),
    layer("evidence", "EVIDENCE", draft.evidenceRequirements.map((e) => e.key), "Evidence requirements"),
    layer("authority", "AUTHORITY_PROPOSAL", draft.authorityProposals.map((a) => a.key), "Advisory authority proposals"),
    layer("experience", "SAREA_EXPERIENCE", sources.sareaPatternKeys, sources.coverageNotes.sarea ?? "No SAREA patterns"),
    layer("trust", "CYBERCROW_POLICY", sources.cyberCrowPolicyKeys, "Trust controls from composition"),
    layer("integrations", "INTEGRATION", sources.integrationKeys, sources.coverageNotes.integration ?? "No integrations selected"),
    layer("compliance", "COMPLIANCE_OVERLAY", sources.complianceOverlayKeys, "Compliance from domain packs"),
  ];

  return { layers, nodeTypeCounts: counts, coverageNotes: sources.coverageNotes };
}

export function auditGraphNodeTypeCoverage(
  graph: EnterpriseOperatingGraph,
  draft: EnterpriseModelDraft,
  specialistKeys: string[] = [],
): Record<GraphNodeType, { typed: boolean; catalogAvailable: boolean; populated: boolean; count: number }> {
  const sources = resolveGraphSources(draft, specialistKeys);
  const result = {} as Record<GraphNodeType, { typed: boolean; catalogAvailable: boolean; populated: boolean; count: number }>;

  const catalogAvailable: Partial<Record<GraphNodeType, boolean>> = {
    INDUSTRY: true,
    SPECIALIST_DOMAIN: sources.specialistKeys.length > 0,
    DOMAIN_PACK: sources.domainPackKeys.length > 0,
    DEPARTMENT: sources.departmentKeys.length > 0,
    CAPABILITY: sources.capabilityKeys.length > 0,
    ENTITY: sources.entityKeys.length > 0,
    WORK_PERSONA: draft.workPersonas.length > 0,
    WORKFLOW: draft.workflowTemplates.length > 0,
    WORKFLOW_STAGE: draft.workflowTemplates.some((w) => w.states.length > 0),
    OUTCOME: draft.workflowTemplates.length > 0,
    KPI: draft.kpiRecommendations.length > 0,
    EVIDENCE: draft.evidenceRequirements.length > 0,
    AUTHORITY_PROPOSAL: draft.authorityProposals.length > 0,
    SAREA_EXPERIENCE: sources.sareaPatternKeys.length > 0,
    CYBERCROW_POLICY: sources.cyberCrowPolicyKeys.length > 0,
    INTEGRATION: sources.integrationKeys.length > 0,
    COMPLIANCE_OVERLAY: sources.complianceOverlayKeys.length > 0,
  };

  for (const t of ALL_NODE_TYPES) {
    const count = graph.nodes.filter((n) => n.type === t).length;
    result[t] = {
      typed: true,
      catalogAvailable: catalogAvailable[t] ?? false,
      populated: count > 0,
      count,
    };
  }
  return result;
}
