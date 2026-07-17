import type {
  EnterpriseGraphEdge,
  EnterpriseGraphNode,
  EnterpriseOperatingGraph,
  GraphLayoutMode,
  GraphValidationFinding,
} from "../domain-types";
import type { EnterpriseModelDraft } from "../types";
import { listSpecialistDomains } from "../specialist-domains/index";
import { DEPARTMENT_ARCHETYPE_CATALOG } from "../departments/department-archetype-catalog";
import {
  resolveGraphSources,
  getEntityDefinition,
  getCapabilityLabel,
  getSareaLabel,
  getCyberCrowLabel,
  getDepartmentLabel,
  getDomainPackLabel,
  getIntegrationLabel,
  getComplianceLabel,
} from "./graph-sources";
import { createProvenanceRecord, clearProvenanceRegistry } from "../provenance/provenance-engine";

function node(
  id: string,
  type: EnterpriseGraphNode["type"],
  key: string,
  label: string,
  x: number,
  y: number,
  group?: string,
  meta?: Record<string, string>,
): EnterpriseGraphNode {
  return { id, type, key, label, x, y, group, metadata: { advisory: "true", ...meta } };
}

function edge(
  id: string,
  type: EnterpriseGraphEdge["type"],
  source: string,
  target: string,
  reason: string,
  ruleKey: string,
): EnterpriseGraphEdge {
  return { id, type, source, target, reason, provenance: `rule:${ruleKey}`, advisory: true };
}

const LAYOUT_COLUMNS: Record<GraphLayoutMode, number> = {
  OPERATING_MODEL: 6,
  PERSONA_WORKFLOW: 5,
  WORKFLOW_DETAIL: 4,
  INFORMATION_FLOW: 5,
  AUTHORITY_IMPACT: 5,
  OUTCOME_AND_KPI: 4,
  TRUST_AND_EVIDENCE: 4,
};

function place(index: number, cols: number, rowHeight = 88, colWidth = 150): { x: number; y: number } {
  return { x: (index % cols) * colWidth + 32, y: Math.floor(index / cols) * rowHeight + 32 };
}

function ensureNode(
  nodes: EnterpriseGraphNode[],
  id: string,
  type: EnterpriseGraphNode["type"],
  key: string,
  label: string,
  idx: { v: number },
  cols: number,
  group?: string,
): string {
  if (!nodes.some((n) => n.id === id)) {
    const pos = place(++idx.v, cols);
    nodes.push(node(id, type, key, label, pos.x, pos.y, group));
  }
  return id;
}

export type GraphBuildOptions = {
  specialistKeys?: string[];
  registerProvenance?: boolean;
};

export function buildOperatingGraph(
  draft: EnterpriseModelDraft,
  layoutMode: GraphLayoutMode = "OPERATING_MODEL",
  specialistKeys: string[] = [],
  options: GraphBuildOptions = {},
): EnterpriseOperatingGraph {
  if (options.registerProvenance !== false) clearProvenanceRegistry();

  const nodes: EnterpriseGraphNode[] = [];
  const edges: EnterpriseGraphEdge[] = [];
  const cols = LAYOUT_COLUMNS[layoutMode];
  const idx = { v: 0 };
  const sources = resolveGraphSources(draft, specialistKeys.length > 0 ? specialistKeys : undefined);
  const sk = sources.specialistKeys;

  const industryId = ensureNode(
    nodes,
    "industry:primary",
    "INDUSTRY",
    draft.dna.primaryIndustry,
    draft.dna.primaryIndustry.replace(/_/g, " "),
    idx,
    cols,
    "organization",
  );

  if (options.registerProvenance !== false) {
    createProvenanceRecord(
      { kind: "industry", key: draft.dna.primaryIndustry, path: "blueprint.organization.primary" },
      `Primary industry: ${draft.dna.primaryIndustry}`,
      "User-selected primary industry archetype",
      { sources: ["USER_SELECTION", "INDUSTRY_ARCHETYPE"], userInputs: ["primaryIndustry"], strength: "REQUIRED" },
    );
  }

  for (const s of sk) {
    const spec = listSpecialistDomains().find((d) => d.key === s);
    const id = ensureNode(nodes, `specialist:${s}`, "SPECIALIST_DOMAIN", s, spec?.displayName ?? s, idx, cols, "specialist");
    edges.push(edge(`e-ind-sp-${s}`, "CONTAINS", industryId, id, "Industry contains specialist domain", "industry_contains_specialist_domain"));
  }

  for (const pk of sources.domainPackKeys) {
    const id = ensureNode(nodes, `domain_pack:${pk}`, "DOMAIN_PACK", pk, getDomainPackLabel(pk), idx, cols, "domain_pack");
    for (const s of sk) {
      const spId = `specialist:${s}`;
      if (nodes.some((n) => n.id === spId)) {
        edges.push(edge(`e-sp-dp-${s}-${pk}`, "DEPENDS_ON", spId, id, "Specialist domain recommends domain pack", "specialist_recommends_domain_pack"));
      }
    }
  }

  for (const dept of sources.departmentKeys) {
    const deptDef = DEPARTMENT_ARCHETYPE_CATALOG.find((d) => d.key === dept);
    const id = ensureNode(nodes, `dept:${dept}`, "DEPARTMENT", dept, getDepartmentLabel(dept), idx, cols, "department");
    edges.push(edge(`e-org-dept-${dept}`, "CONTAINS", industryId, id, "Organization contains department", "organization_contains_department"));
    for (const wf of deptDef?.workflowOwnership ?? []) {
      const wfId = `workflow:${wf}`;
      if (nodes.some((n) => n.id === wfId)) {
        edges.push(edge(`e-dept-own-wf-${dept}-${wf}`, "OWNS", id, wfId, "Department owns workflow", "department_owns_workflow"));
      }
    }
    for (const ent of deptDef?.entityOwnership ?? []) {
      const entId = `entity:${ent}`;
      if (nodes.some((n) => n.id === entId)) {
        edges.push(edge(`e-dept-own-ent-${dept}-${ent}`, "OWNS", id, entId, "Department owns entity", "department_owns_entity"));
      }
    }
  }

  for (const cap of sources.capabilityKeys) {
    const id = ensureNode(nodes, `capability:${cap}`, "CAPABILITY", cap, getCapabilityLabel(cap), idx, cols, "capability");
    for (const pk of sources.domainPackKeys) {
      const dpId = `domain_pack:${pk}`;
      if (nodes.some((n) => n.id === dpId)) {
        edges.push(edge(`e-dp-cap-${pk}-${cap}`, "CONTAINS", dpId, id, "Domain pack contains capability", "domain_pack_contains_capability"));
      }
    }
  }

  for (const ek of sources.entityKeys.slice(0, 28)) {
    const ent = getEntityDefinition(ek);
    const id = ensureNode(nodes, `entity:${ek}`, "ENTITY", ek, ent?.displayName ?? ek.replace(/_/g, " "), idx, cols, "entity");
    for (const wf of ent?.relatedWorkflowKeys ?? []) {
      const wfId = `workflow:${wf}`;
      if (nodes.some((n) => n.id === wfId)) {
        edges.push(edge(`e-wf-consume-${wf}-${ek}`, "CONSUMES", wfId, id, "Workflow consumes entity", "workflow_consumes_entity"));
      }
    }
    for (const pol of ent?.cyberCrowPolicyPackKeys ?? []) {
      const polId = `cybercrow:${pol}`;
      if (nodes.some((n) => n.id === polId)) {
        edges.push(edge(`e-ent-prot-${ek}-${pol}`, "PROTECTED_BY", id, polId, "Entity protected by CyberCrow policy", "entity_protected_by_cybercrow"));
      }
    }
  }

  for (const persona of draft.workPersonas) {
    const id = ensureNode(nodes, `persona:${persona.key}`, "WORK_PERSONA", persona.key, persona.displayName, idx, cols, "persona");
    const wfs = persona.workflowParticipation.length > 0 ? persona.workflowParticipation : draft.workflowTemplates.slice(0, 1).map((w) => w.key);
    for (const wf of wfs.slice(0, 5)) {
      const wfId = ensureNode(nodes, `workflow:${wf}`, "WORKFLOW", wf, wf.replace(/_/g, " "), idx, cols, "workflow");
      edges.push(edge(`e-pw-${persona.key}-${wf}`, "PARTICIPATES_IN", id, wfId, "Persona participates in workflow", persona.workflowParticipation.length > 0 ? "persona_participates_workflow" : "legacy_persona_default_workflow"));
      if (persona.workflowPositions.includes("COORDINATOR")) {
        edges.push(edge(`e-pc-${persona.key}-${wf}`, "COORDINATES", id, wfId, "Persona coordinates workflow", "persona_coordinates_workflow"));
      }
      if (persona.workflowPositions.includes("REVIEWER") || persona.workflowPositions.includes("APPROVER")) {
        edges.push(edge(`e-pr-${persona.key}-${wf}`, "REVIEWS", id, wfId, "Persona reviews workflow", "persona_reviews_workflow"));
      }
    }
    if (persona.recommendedSareaPatternKey) {
      const sareaId = ensureNode(
        nodes,
        `sarea:${persona.recommendedSareaPatternKey}`,
        "SAREA_EXPERIENCE",
        persona.recommendedSareaPatternKey,
        getSareaLabel(persona.recommendedSareaPatternKey),
        idx,
        cols,
        "sarea",
      );
      edges.push(edge(`e-ps-${persona.key}-${persona.recommendedSareaPatternKey}`, "PRESENTED_THROUGH", id, sareaId, "Persona presented through SAREA", "persona_presented_through_sarea"));
    }
  }

  for (const wf of draft.workflowTemplates) {
    const wfId = ensureNode(nodes, `workflow:${wf.key}`, "WORKFLOW", wf.key, wf.displayName, idx, cols, wf.key);
    wf.states.forEach((state, si) => {
      const stageId = ensureNode(nodes, `stage:${wf.key}:${state}`, "WORKFLOW_STAGE", state, state, idx, cols, wf.key);
      edges.push(edge(`e-ws-${wf.key}-${state}`, "CONTAINS", wfId, stageId, "Workflow contains stage", "workflow_contains_stage"));
      if (si === wf.states.length - 1) {
        const outId = ensureNode(nodes, `outcome:${wf.key}`, "OUTCOME", wf.key, `${wf.displayName} outcome`, idx, cols, "outcome");
        edges.push(edge(`e-wf-out-${wf.key}`, "PRODUCES", stageId, outId, "Workflow produces outcome", "workflow_produces_outcome"));
        edges.push(edge(`e-wf-gov-${wf.key}`, "GOVERNS", wfId, outId, "Workflow governs outcome", "workflow_governs_outcome"));
      }
    });
    for (const evKey of wf.evidenceRequirementKeys) {
      const evId = ensureNode(nodes, `evidence:${evKey}`, "EVIDENCE", evKey, evKey.replace(/_/g, " "), idx, cols, "evidence");
      edges.push(edge(`e-wf-ev-${wf.key}-${evKey}`, "REQUIRES_EVIDENCE", wfId, evId, "Workflow requires evidence", "workflow_requires_evidence"));
      edges.push(edge(`e-wf-prod-ev-${wf.key}-${evKey}`, "PRODUCES", wfId, evId, "Workflow produces evidence artifacts", "workflow_produces_evidence"));
    }
    for (const k of wf.kpiKeys) {
      const kpiId = ensureNode(nodes, `kpi:${k}`, "KPI", k, k.replace(/_/g, " "), idx, cols, "kpi");
      edges.push(edge(`e-kpi-${wf.key}-${k}`, "MEASURED_BY", wfId, kpiId, "Workflow measured by KPI", "workflow_measured_by_kpi"));
    }
    for (const pol of wf.cyberCrowCheckKeys) {
      const polId = ensureNode(nodes, `cybercrow:${pol}`, "CYBERCROW_POLICY", pol, getCyberCrowLabel(pol), idx, cols, "cybercrow");
      edges.push(edge(`e-wf-pol-${wf.key}-${pol}`, "PROTECTED_BY", wfId, polId, "Workflow protected by CyberCrow", "workflow_protected_by_cybercrow"));
    }
  }

  for (const kpi of draft.kpiRecommendations) {
    ensureNode(nodes, `kpi:${kpi.key}`, "KPI", kpi.key, kpi.displayName, idx, cols, "kpi");
  }

  for (const ev of draft.evidenceRequirements) {
    ensureNode(nodes, `evidence:${ev.key}`, "EVIDENCE", ev.key, ev.displayName, idx, cols, "evidence");
  }

  for (const proposal of draft.authorityProposals) {
    const id = ensureNode(nodes, `authority:${proposal.key}`, "AUTHORITY_PROPOSAL", proposal.key, proposal.displayName, idx, cols, "authority");
    edges.push(edge(`e-auth-gov-${proposal.key}`, "GOVERNS", id, industryId, "Advisory authority proposal governs operating model", "authority_governs_persona_position"));
    for (const p of draft.workPersonas.slice(0, 2)) {
      const pId = `persona:${p.key}`;
      if (nodes.some((n) => n.id === pId)) {
        edges.push(edge(`e-auth-persona-${proposal.key}-${p.key}`, "GOVERNS", id, pId, "Authority proposal governs persona-workflow position", "authority_governs_persona_position"));
      }
    }
  }

  for (const s of sources.sareaPatternKeys) {
    ensureNode(nodes, `sarea:${s}`, "SAREA_EXPERIENCE", s, getSareaLabel(s), idx, cols, "sarea");
  }

  for (const pol of sources.cyberCrowPolicyKeys) {
    ensureNode(nodes, `cybercrow:${pol}`, "CYBERCROW_POLICY", pol, getCyberCrowLabel(pol), idx, cols, "cybercrow");
  }

  for (const ik of sources.integrationKeys) {
    const id = ensureNode(nodes, `integration:${ik}`, "INTEGRATION", ik, getIntegrationLabel(ik), idx, cols, "integration");
    for (const wf of draft.workflowTemplates.slice(0, 3)) {
      const wfId = `workflow:${wf.key}`;
      if (nodes.some((n) => n.id === wfId)) {
        edges.push(edge(`e-wf-int-${wf.key}-${ik}`, "INTEGRATES_WITH", wfId, id, "Workflow integrates with external system", "legacy_workflow_integration_slice"));
      }
    }
  }

  for (const ck of sources.complianceOverlayKeys) {
    const id = ensureNode(nodes, `compliance:${ck}`, "COMPLIANCE_OVERLAY", ck, getComplianceLabel(ck), idx, cols, "compliance");
    for (const ek of sources.entityKeys.slice(0, 5)) {
      const entId = `entity:${ek}`;
      if (nodes.some((n) => n.id === entId)) {
        edges.push(edge(`e-comp-ent-${ck}-${ek}`, "GOVERNS", id, entId, "Compliance overlay governs entity", "legacy_compliance_entity_slice"));
      }
    }
    for (const wf of draft.workflowTemplates.slice(0, 3)) {
      const wfId = `workflow:${wf.key}`;
      if (nodes.some((n) => n.id === wfId)) {
        edges.push(edge(`e-comp-wf-${ck}-${wf.key}`, "GOVERNS", id, wfId, "Compliance overlay governs workflow", "compliance_governs_workflow"));
      }
    }
  }

  const findings = validateOperatingGraph({ layoutMode, nodes, edges });
  return { layoutMode, nodes, edges, findings };
}

export function validateOperatingGraph(graph: Omit<EnterpriseOperatingGraph, "findings">): GraphValidationFinding[] {
  const findings: GraphValidationFinding[] = [];
  const nodeIds = new Set(graph.nodes.map((n) => n.id));

  for (const e of graph.edges) {
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
      findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "ORPHAN_EDGE", message: `Orphan edge ${e.id}`, edgeId: e.id });
    }
  }

  const nodeIdList = graph.nodes.map((n) => n.id);
  if (new Set(nodeIdList).size !== nodeIdList.length) {
    findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "DUPLICATE_NODE_ID", message: "Duplicate graph node IDs detected" });
  }

  const workflows = graph.nodes.filter((n) => n.type === "WORKFLOW");
  for (const wf of workflows) {
    const hasOwner = graph.edges.some(
      (e) => e.target === wf.id && ["OWNS", "PARTICIPATES_IN", "COORDINATES"].includes(e.type),
    );
    if (!hasOwner) {
      findings.push({ severity: "WARNING", code: "WORKFLOW_WITHOUT_OWNER", message: `Workflow ${wf.key} has no owner edge`, nodeId: wf.id });
    }
    const hasOutcome = graph.edges.some((e) => e.source === wf.id && e.type === "GOVERNS");
    if (!hasOutcome) {
      findings.push({ severity: "RECOMMENDATION", code: "WORKFLOW_WITHOUT_OUTCOME", message: `Workflow ${wf.key} missing outcome link`, nodeId: wf.id });
    }
  }

  const personas = graph.nodes.filter((n) => n.type === "WORK_PERSONA");
  for (const p of personas) {
    const participates = graph.edges.some((e) => e.source === p.id && ["PARTICIPATES_IN", "COORDINATES", "EXECUTES"].includes(e.type));
    if (!participates) {
      findings.push({ severity: "WARNING", code: "PERSONA_WITHOUT_WORKFLOW", message: `Persona ${p.key} not linked to workflows`, nodeId: p.id });
    }
  }

  const platformLeak = graph.nodes.filter((n) => n.key.includes("platform_admin") || n.key.includes("PLATFORM_ADMIN"));
  for (const n of platformLeak) {
    findings.push({ severity: "BLOCKING_DRAFT_ERROR", code: "PLATFORM_ROLE_LEAKAGE", message: `Platform role in graph: ${n.key}`, nodeId: n.id });
  }

  return findings;
}

export function filterGraph(
  graph: EnterpriseOperatingGraph,
  nodeTypes?: Set<string>,
  edgeTypes?: Set<string>,
): EnterpriseOperatingGraph {
  const nodes = nodeTypes ? graph.nodes.filter((n) => nodeTypes.has(n.type)) : graph.nodes;
  const nodeIdSet = new Set(nodes.map((n) => n.id));
  const edges = graph.edges.filter((e) => {
    if (edgeTypes && !edgeTypes.has(e.type)) return false;
    return nodeIdSet.has(e.source) && nodeIdSet.has(e.target);
  });
  return { ...graph, nodes, edges, findings: graph.findings };
}

export function getConnectedNodeIds(graph: EnterpriseOperatingGraph, focusId: string): Set<string> {
  const connected = new Set<string>([focusId]);
  for (const e of graph.edges) {
    if (e.source === focusId) connected.add(e.target);
    if (e.target === focusId) connected.add(e.source);
  }
  return connected;
}

export function filterGraphByLayerPreset(
  graph: EnterpriseOperatingGraph,
  preset: string,
): EnterpriseOperatingGraph {
  const presets: Record<string, Set<string>> = {
    ORGANIZATION: new Set(["INDUSTRY", "SPECIALIST_DOMAIN", "DOMAIN_PACK", "DEPARTMENT"]),
    OPERATIONS: new Set(["WORK_PERSONA", "WORKFLOW", "WORKFLOW_STAGE", "OUTCOME", "DEPARTMENT"]),
    INFORMATION: new Set(["ENTITY", "CAPABILITY"]),
    AUTHORITY: new Set(["AUTHORITY_PROPOSAL", "WORK_PERSONA", "WORKFLOW"]),
    EXPERIENCE: new Set(["SAREA_EXPERIENCE", "WORK_PERSONA"]),
    TRUST: new Set(["CYBERCROW_POLICY", "EVIDENCE", "COMPLIANCE_OVERLAY"]),
    INTEGRATIONS: new Set(["INTEGRATION", "WORKFLOW", "ENTITY"]),
    COMPLIANCE: new Set(["COMPLIANCE_OVERLAY", "ENTITY", "WORKFLOW", "EVIDENCE"]),
    FULL_BLUEPRINT: new Set(graph.nodes.map((n) => n.type)),
  };
  const types = presets[preset];
  if (!types) return graph;
  return filterGraph(graph, types);
}
