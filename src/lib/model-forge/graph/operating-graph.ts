import type {
  EnterpriseGraphEdge,
  EnterpriseGraphNode,
  EnterpriseOperatingGraph,
  GraphLayoutMode,
  GraphValidationFinding,
} from "../domain-types";
import type { EnterpriseModelDraft } from "../types";
import { listSpecialistDomains } from "../specialist-domains/index";

function node(
  id: string,
  type: EnterpriseGraphNode["type"],
  key: string,
  label: string,
  x: number,
  y: number,
  group?: string,
): EnterpriseGraphNode {
  return { id, type, key, label, x, y, group, metadata: { advisory: "true" } };
}

function edge(
  id: string,
  type: EnterpriseGraphEdge["type"],
  source: string,
  target: string,
  reason: string,
): EnterpriseGraphEdge {
  return { id, type, source, target, reason, provenance: "crow_core", advisory: true };
}

const LAYOUT_COLUMNS: Record<GraphLayoutMode, number> = {
  OPERATING_MODEL: 5,
  PERSONA_WORKFLOW: 4,
  WORKFLOW_DETAIL: 3,
  INFORMATION_FLOW: 4,
  AUTHORITY_IMPACT: 4,
  OUTCOME_AND_KPI: 3,
  TRUST_AND_EVIDENCE: 3,
};

function place(index: number, cols: number, rowHeight = 90, colWidth = 160): { x: number; y: number } {
  return { x: (index % cols) * colWidth + 40, y: Math.floor(index / cols) * rowHeight + 40 };
}

export function buildOperatingGraph(
  draft: EnterpriseModelDraft,
  layoutMode: GraphLayoutMode = "OPERATING_MODEL",
  specialistKeys: string[] = [],
): EnterpriseOperatingGraph {
  const nodes: EnterpriseGraphNode[] = [];
  const edges: EnterpriseGraphEdge[] = [];
  const cols = LAYOUT_COLUMNS[layoutMode];
  let idx = 0;

  const industryNode = node("industry:primary", "INDUSTRY", draft.dna.primaryIndustry, draft.dna.primaryIndustry, 20, 20);
  nodes.push(industryNode);

  for (const sk of specialistKeys) {
    const spec = listSpecialistDomains().find((d) => d.key === sk);
    const id = `specialist:${sk}`;
    const pos = place(++idx, cols);
    nodes.push(node(id, "SPECIALIST_DOMAIN", sk, spec?.displayName ?? sk, pos.x, pos.y, "specialist"));
    edges.push(edge(`e-ind-${sk}`, "CONTAINS", industryNode.id, id, "Industry composes specialist domain"));
  }

  for (const dept of draft.dna.departmentKeys ?? []) {
    const id = `dept:${dept}`;
    const pos = place(++idx, cols);
    nodes.push(node(id, "DEPARTMENT", dept, dept.replace(/_/g, " "), pos.x, pos.y, "department"));
    edges.push(edge(`e-dept-${dept}`, "CONTAINS", industryNode.id, id, "Operating model contains department"));
  }

  for (const persona of draft.workPersonas) {
    const id = `persona:${persona.key}`;
    const pos = place(++idx, cols);
    nodes.push(node(id, "WORK_PERSONA", persona.key, persona.displayName, pos.x, pos.y, "persona"));
    for (const wf of persona.workflowParticipation.slice(0, 3)) {
      const wfId = `workflow:${wf}`;
      if (!nodes.some((n) => n.id === wfId)) {
        const wfPos = place(++idx, cols);
        nodes.push(node(wfId, "WORKFLOW", wf, wf.replace(/_/g, " "), wfPos.x, wfPos.y, "workflow"));
      }
      edges.push(edge(`e-pw-${persona.key}-${wf}`, "PARTICIPATES_IN", id, wfId, "Persona participates in workflow"));
    }
  }

  for (const wf of draft.workflowTemplates) {
    const wfId = `workflow:${wf.key}`;
    if (!nodes.some((n) => n.id === wfId)) {
      const pos = place(++idx, cols);
      nodes.push(node(wfId, "WORKFLOW", wf.key, wf.displayName, pos.x, pos.y, "workflow"));
    }
    wf.states.forEach((state, si) => {
      const stageId = `stage:${wf.key}:${state}`;
      const pos = place(++idx, cols);
      nodes.push(node(stageId, "WORKFLOW_STAGE", state, state, pos.x, pos.y, wf.key));
      edges.push(edge(`e-ws-${wf.key}-${state}`, "CONTAINS", wfId, stageId, "Workflow contains stage"));
      if (si === wf.states.length - 1) {
        edges.push(edge(`e-wf-out-${wf.key}`, "PRODUCES", stageId, `outcome:${wf.key}`, "Final stage produces outcome"));
        const outPos = place(++idx, cols);
        nodes.push(node(`outcome:${wf.key}`, "OUTCOME", wf.key, `${wf.displayName} outcome`, outPos.x, outPos.y));
      }
    });
    for (const k of wf.kpiKeys) {
      const kpiId = `kpi:${k}`;
      if (!nodes.some((n) => n.id === kpiId)) {
        const pos = place(++idx, cols);
        nodes.push(node(kpiId, "KPI", k, k, pos.x, pos.y, "kpi"));
      }
      edges.push(edge(`e-kpi-${wf.key}-${k}`, "MEASURED_BY", wfId, kpiId, "Workflow measured by KPI"));
    }
  }

  for (const kpi of draft.kpiRecommendations) {
    const id = `kpi:${kpi.key}`;
    if (!nodes.some((n) => n.id === id)) {
      const pos = place(++idx, cols);
      nodes.push(node(id, "KPI", kpi.key, kpi.displayName, pos.x, pos.y, "kpi"));
    }
  }

  for (const ev of draft.evidenceRequirements) {
    const id = `evidence:${ev.key}`;
    const pos = place(++idx, cols);
    nodes.push(node(id, "EVIDENCE", ev.key, ev.displayName, pos.x, pos.y, "evidence"));
  }

  for (const proposal of draft.authorityProposals) {
    const id = `authority:${proposal.key}`;
    const pos = place(++idx, cols);
    nodes.push(node(id, "AUTHORITY_PROPOSAL", proposal.key, proposal.displayName, pos.x, pos.y, "authority"));
    edges.push(edge(`e-auth-${proposal.key}`, "GOVERNS", id, industryNode.id, "Advisory authority proposal"));
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

  const workflows = graph.nodes.filter((n) => n.type === "WORKFLOW");
  for (const wf of workflows) {
    const hasOwner = graph.edges.some((e) => e.target === wf.id && (e.type === "OWNS" || e.type === "PARTICIPATES_IN"));
    if (!hasOwner) {
      findings.push({ severity: "WARNING", code: "WORKFLOW_WITHOUT_OWNER", message: `Workflow ${wf.key} has no owner edge`, nodeId: wf.id });
    }
    const hasOutcome = graph.edges.some((e) => e.source.startsWith(`stage:${wf.key}:`) && e.type === "PRODUCES");
    if (!hasOutcome) {
      findings.push({ severity: "RECOMMENDATION", code: "WORKFLOW_WITHOUT_OUTCOME", message: `Workflow ${wf.key} missing outcome link`, nodeId: wf.id });
    }
  }

  const personas = graph.nodes.filter((n) => n.type === "WORK_PERSONA");
  for (const p of personas) {
    const participates = graph.edges.some((e) => e.source === p.id && e.type === "PARTICIPATES_IN");
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
  return { ...graph, nodes, edges };
}

export function getConnectedNodeIds(graph: EnterpriseOperatingGraph, focusId: string): Set<string> {
  const connected = new Set<string>([focusId]);
  for (const e of graph.edges) {
    if (e.source === focusId) connected.add(e.target);
    if (e.target === focusId) connected.add(e.source);
  }
  return connected;
}
