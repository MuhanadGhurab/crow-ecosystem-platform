import type { EnterpriseOperatingGraph, GraphLayoutMode } from "../domain-types";

export type GraphViewport = {
  x: number;
  y: number;
  zoom: number;
};

export const DEFAULT_VIEWPORT: GraphViewport = { x: 0, y: 0, zoom: 1 };

export function computeGraphBounds(graph: EnterpriseOperatingGraph): { minX: number; minY: number; maxX: number; maxY: number } {
  if (graph.nodes.length === 0) return { minX: 0, minY: 0, maxX: 400, maxY: 300 };
  const xs = graph.nodes.map((n) => n.x);
  const ys = graph.nodes.map((n) => n.y);
  return {
    minX: Math.min(...xs) - 40,
    minY: Math.min(...ys) - 40,
    maxX: Math.max(...xs) + 160,
    maxY: Math.max(...ys) + 80,
  };
}

export function fitViewportToBounds(
  bounds: ReturnType<typeof computeGraphBounds>,
  width: number,
  height: number,
): GraphViewport {
  const graphW = bounds.maxX - bounds.minX;
  const graphH = bounds.maxY - bounds.minY;
  const zoom = Math.min(width / graphW, height / graphH, 1.2) * 0.9;
  return {
    x: -bounds.minX * zoom + (width - graphW * zoom) / 2,
    y: -bounds.minY * zoom + (height - graphH * zoom) / 2,
    zoom,
  };
}

export function applyLayoutModeOffset(mode: GraphLayoutMode, x: number, y: number): { x: number; y: number } {
  const offsets: Record<GraphLayoutMode, { dx: number; dy: number }> = {
    OPERATING_MODEL: { dx: 0, dy: 0 },
    PERSONA_WORKFLOW: { dx: 20, dy: 0 },
    WORKFLOW_DETAIL: { dx: 40, dy: 10 },
    INFORMATION_FLOW: { dx: 0, dy: 30 },
    AUTHORITY_IMPACT: { dx: 30, dy: 20 },
    OUTCOME_AND_KPI: { dx: 10, dy: 40 },
    TRUST_AND_EVIDENCE: { dx: 50, dy: 10 },
  };
  const o = offsets[mode];
  return { x: x + o.dx, y: y + o.dy };
}

export const GRAPH_LAYER_PRESETS = [
  { key: "ORGANIZATION", label: "Organization" },
  { key: "OPERATIONS", label: "Operations" },
  { key: "INFORMATION", label: "Information" },
  { key: "AUTHORITY", label: "Authority" },
  { key: "EXPERIENCE", label: "Experience" },
  { key: "TRUST", label: "Trust" },
  { key: "INTEGRATIONS", label: "Integrations" },
  { key: "COMPLIANCE", label: "Compliance" },
  { key: "FULL_BLUEPRINT", label: "Full blueprint" },
] as const;

export const COMPILATION_PHASES = [
  "normalize input",
  "resolve industry and domains",
  "resolve domain packs",
  "resolve departments",
  "resolve capabilities",
  "resolve entities",
  "resolve personas",
  "resolve workflows",
  "resolve outcomes and KPIs",
  "resolve evidence",
  "resolve authority proposals",
  "resolve SAREA",
  "resolve CyberCrow",
  "resolve integrations",
  "resolve compliance",
  "validate",
  "compile draft",
] as const;

export const GRAPH_LAYOUT_MODES: readonly { key: GraphLayoutMode; label: string }[] = [
  { key: "OPERATING_MODEL", label: "Operating model" },
  { key: "PERSONA_WORKFLOW", label: "Persona & workflow" },
  { key: "WORKFLOW_DETAIL", label: "Workflow detail" },
  { key: "INFORMATION_FLOW", label: "Information flow" },
  { key: "AUTHORITY_IMPACT", label: "Authority impact" },
  { key: "OUTCOME_AND_KPI", label: "Outcome & KPI" },
  { key: "TRUST_AND_EVIDENCE", label: "Trust & evidence" },
] as const;
