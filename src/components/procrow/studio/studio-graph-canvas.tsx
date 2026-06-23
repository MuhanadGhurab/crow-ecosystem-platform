"use client";

import type { EnterpriseGraphNode, EnterpriseGraphEdge, GraphValidationFinding } from "@/lib/model-forge/domain-types";
import { studioMotion } from "./studio-motion";

const NODE_COLORS: Record<string, string> = {
  INDUSTRY: "#22d3ee",
  SPECIALIST_DOMAIN: "#a78bfa",
  DEPARTMENT: "#94a3b8",
  WORK_PERSONA: "#38bdf8",
  WORKFLOW: "#818cf8",
  WORKFLOW_STAGE: "#6366f1",
  KPI: "#34d399",
  EVIDENCE: "#fbbf24",
  AUTHORITY_PROPOSAL: "#f472b6",
  OUTCOME: "#2dd4bf",
};

type StudioGraphCanvasProps = {
  nodes: readonly EnterpriseGraphNode[];
  edges: readonly EnterpriseGraphEdge[];
  width?: number;
  height?: number;
  viewport: { x: number; y: number; zoom: number };
  selectedNodeId?: string | null;
  connectedIds?: Set<string>;
  collapsedGroups?: Set<string>;
  onSelectNode?: (id: string) => void;
  reducedMotion?: boolean;
};

export function StudioGraphCanvas({
  nodes,
  edges,
  width = 720,
  height = 480,
  viewport,
  selectedNodeId,
  connectedIds,
  collapsedGroups,
  onSelectNode,
  reducedMotion = false,
}: StudioGraphCanvasProps) {
  const transform = `translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`;
  const duration = reducedMotion ? 0 : studioMotion.layout;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="bg-[#080c12] text-white"
      role="img"
      aria-label="Enterprise operating graph"
    >
      <g transform={transform} style={{ transition: reducedMotion ? undefined : `transform ${duration}ms ease` }}>
        {edges.map((e) => {
          const s = nodes.find((n) => n.id === e.source);
          const t = nodes.find((n) => n.id === e.target);
          if (!s || !t) return null;
          if (s.group && collapsedGroups?.has(s.group)) return null;
          const highlighted = connectedIds?.has(e.source) && connectedIds?.has(e.target);
          return (
            <line
              key={e.id}
              x1={s.x + 60}
              y1={s.y + 16}
              x2={t.x + 60}
              y2={t.y + 16}
              stroke={highlighted ? "#22d3ee" : "rgba(148,163,184,0.35)"}
              strokeWidth={highlighted ? 2 : 1}
              markerEnd="url(#arrow)"
              style={{ transition: reducedMotion ? undefined : `stroke ${studioMotion.feedback}ms ease` }}
            />
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(148,163,184,0.6)" />
          </marker>
        </defs>
        {nodes.map((n) => {
          if (n.group && collapsedGroups?.has(n.group) && n.type === "WORKFLOW_STAGE") return null;
          const selected = n.id === selectedNodeId;
          const connected = connectedIds?.has(n.id);
          const fill = NODE_COLORS[n.type] ?? "#64748b";
          return (
            <g
              key={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              className="cursor-pointer"
              onClick={() => onSelectNode?.(n.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") onSelectNode?.(n.id);
              }}
              aria-label={`${n.type}: ${n.label}`}
            >
              <rect
                width={120}
                height={32}
                rx={6}
                fill={selected || connected ? `${fill}33` : "rgba(15,23,42,0.9)"}
                stroke={selected ? fill : connected ? "#22d3ee" : "rgba(255,255,255,0.12)"}
                strokeWidth={selected ? 2 : 1}
                style={{ transition: reducedMotion ? undefined : `all ${studioMotion.feedback}ms ease` }}
              />
              <text x={8} y={14} className="fill-white/50 text-[8px] uppercase">
                {n.type.replace(/_/g, " ")}
              </text>
              <text x={8} y={26} className="fill-white text-[10px]">
                {n.label.length > 16 ? `${n.label.slice(0, 14)}…` : n.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function StudioGraphControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onFit,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFit: () => void;
}) {
  const btn = "rounded border border-white/15 bg-black/40 px-2 py-1 text-xs text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400";
  return (
    <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Graph controls">
      <button type="button" className={btn} onClick={onZoomIn}>Zoom in</button>
      <button type="button" className={btn} onClick={onZoomOut}>Zoom out</button>
      <button type="button" className={btn} onClick={onReset}>Reset</button>
      <button type="button" className={btn} onClick={onFit}>Fit</button>
    </div>
  );
}

export function StudioValidationList({ findings }: { findings: readonly GraphValidationFinding[] }) {
  if (findings.length === 0) {
    return <p className="text-sm text-emerald-400/90">No validation findings.</p>;
  }
  const severityClass: Record<string, string> = {
    INFO: "text-white/60",
    RECOMMENDATION: "text-cyan-300/90",
    WARNING: "text-amber-300",
    BLOCKING_DRAFT_ERROR: "text-rose-400",
  };
  return (
    <ul className="space-y-2 text-sm">
      {findings.map((f, i) => (
        <li key={`${f.code}-${i}`} className={severityClass[f.severity] ?? "text-white/70"}>
          <span className="font-medium">[{f.severity}]</span> {f.message}
        </li>
      ))}
    </ul>
  );
}
