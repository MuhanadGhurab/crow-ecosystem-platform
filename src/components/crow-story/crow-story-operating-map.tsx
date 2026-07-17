"use client";

import type { CrowVisualState, SareaRoleLens } from "@/lib/crow-story/types";
import { STORY_VIEWBOX } from "@/lib/crow-story/projection";
import { CrowStoryActor } from "./crow-story-actor";

const NODE_COLORS: Record<string, string> = {
  OUTCOME: "#22d3ee",
  SIGNAL: "#22d3ee",
  PERSONA: "#38bdf8",
  JOB_TITLE: "#94a3b8",
  AUTHORIZED_ROLE: "#818cf8",
  WORK_PERSONA: "#22d3ee",
  WORKFLOW: "#818cf8",
  TRIGGER: "#a78bfa",
  DECISION: "#fbbf24",
  EVIDENCE: "#34d399",
  CAPABILITY: "#64748b",
  WATCH: "#fbbf24",
  PATH_NEW: "#22d3ee",
  PATH_TRANSFORM: "#a78bfa",
  FRICTION: "#fbbf24",
  ATTENTION: "#22d3ee",
  BLOCKED: "#f87171",
};

const LENS_LABELS: Record<SareaRoleLens, string> = {
  unified: "Unified model",
  executive: "Executive lens",
  manager: "Manager lens",
  specialist: "Specialist lens",
  frontline: "Frontline lens",
  analyst: "Analyst lens",
};

const WATCH_LABELS: Record<string, string> = {
  identity: "Identity",
  approval: "Approval",
  boundary: "Information boundary",
  sod: "Segregation of duties",
  audit: "Audit evidence",
  risk: "Risk",
};

export type CrowStoryOperatingMapProps = {
  state: CrowVisualState;
  simplified?: boolean;
  className?: string;
};

export function CrowStoryOperatingMap({
  state,
  simplified = false,
  className = "",
}: CrowStoryOperatingMapProps) {
  const vb = `0 0 ${STORY_VIEWBOX.width} ${STORY_VIEWBOX.height}`;
  const pathLen = 520;
  const dashOffset = pathLen * (1 - state.workflowPathProgress);

  return (
    <svg
      viewBox={vb}
      className={`h-full w-full ${className}`}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="story-bg-atmosphere" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a0f18" />
          <stop offset="50%" stopColor="#0d1117" />
          <stop offset="100%" stopColor="#060a10" />
        </linearGradient>
        <radialGradient id="story-outcome-glow" cx="50%" cy="38%" r="45%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={state.outcomeRingOpacity * 0.4} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
        </radialGradient>
        <pattern id="story-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* 01 atmosphere */}
      <rect width="100%" height="100%" fill="url(#story-bg-atmosphere)" opacity={state.atmosphereOpacity} />
      <rect width="100%" height="100%" fill="url(#story-outcome-glow)" />

      {/* 02 grid */}
      <rect width="100%" height="100%" fill="url(#story-grid)" opacity={state.gridOpacity} />

      {/* 03 structural guides */}
      <path
        d="M 240 440 Q 420 320 600 300"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity={0.08 + state.newPathEmphasis * 0.28}
        strokeWidth="2.5"
        strokeDasharray={simplified ? undefined : "8 6"}
      />
      <path
        d="M 960 400 Q 780 320 600 300"
        fill="none"
        stroke="#a78bfa"
        strokeOpacity={0.08 + state.transformPathEmphasis * 0.28}
        strokeWidth="2.5"
        strokeDasharray={simplified ? undefined : "8 6"}
      />

      {/* 07 capability foundation */}
      {state.capabilityOpacity > 0.05 ? (
        <g opacity={state.capabilityOpacity}>
          <rect x="320" y="560" width="560" height="48" rx="8" fill="#1e293b" fillOpacity={0.5} />
          <line x1="360" y1="584" x2="840" y2="584" stroke="#64748b" strokeOpacity={0.4} strokeWidth="1" />
          {!simplified ? (
            <text x="600" y="592" textAnchor="middle" fill="#94a3b8" fontSize="11" opacity={0.7}>
              Capability foundation
            </text>
          ) : null}
        </g>
      ) : null}

      {/* 06 workflow path */}
      {state.workflowPathProgress > 0.02 ? (
        <path
          d={state.workflowPathD}
          fill="none"
          stroke="#818cf8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={dashOffset}
          opacity={0.55 + state.workflowPathProgress * 0.4}
        />
      ) : null}

      {/* edges */}
      {state.edges.map((edge) => (
        <line
          key={edge.id}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke={edge.kind === "FRICTION" ? "#fbbf24" : edge.kind === "RESPONSIBILITY" ? "#38bdf8" : "#a78bfa"}
          strokeOpacity={edge.opacity}
          strokeWidth={edge.kind === "FRICTION" ? 1.5 : 2}
          strokeDasharray={edge.dashed ? "5 7" : undefined}
        />
      ))}

      {/* 04–05 nodes */}
      {state.nodes.map((node) => {
        const color = NODE_COLORS[node.kind] ?? "#94a3b8";
        const r =
          node.kind === "OUTCOME"
            ? 20
            : node.kind === "WORK_PERSONA" || node.kind === "AUTHORIZED_ROLE"
              ? 14
              : node.kind === "FRICTION"
                ? 11
                : 10;
        return (
          <g key={node.id} opacity={node.opacity} transform={`translate(${node.x},${node.y}) scale(${node.scale})`}>
            {node.kind === "OUTCOME" ? (
              <circle r={r + 14} fill="none" stroke="#22d3ee" strokeOpacity={state.outcomeRingOpacity} strokeWidth="1.5" />
            ) : null}
            <circle
              r={r}
              fill={color}
              fillOpacity={node.emphasis ? 0.65 : 0.4}
              stroke={node.emphasis ? color : "rgba(148,163,184,0.3)"}
              strokeWidth={node.emphasis ? 2.5 : 1}
            />
            {node.label && !simplified && node.opacity > 0.4 ? (
              <text y={r + 14} textAnchor="middle" fill="#cbd5e1" fontSize="10" opacity={0.85}>
                {node.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* 08 trust overlay */}
      {state.watchPoints.map((w) =>
        w.opacity > 0.05 ? (
          <g key={w.id} opacity={w.opacity} transform={`translate(${w.x},${w.y})`}>
            <polygon points="0,-10 9,6 -9,6" fill="#fbbf24" fillOpacity={0.55} stroke="#f59e0b" strokeWidth="1" />
            {!simplified ? (
              <text y="22" textAnchor="middle" fill="#fcd34d" fontSize="9" opacity={0.8}>
                {WATCH_LABELS[w.type] ?? w.type}
              </text>
            ) : null}
          </g>
        ) : null,
      )}

      {/* 09 SAREA lens */}
      {state.sareaLensOpacity > 0.05 ? (
        <g opacity={state.sareaLensOpacity}>
          <rect x="160" y="100" width="880" height="560" rx="20" fill="#3b82f6" fillOpacity={0.04} stroke="#38bdf8" strokeOpacity={0.15} strokeWidth="1" />
          <text x="600" y="130" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="600">
            {LENS_LABELS[state.sareaLens]}
          </text>
        </g>
      ) : null}

      {/* 10 Blueprint frame */}
      {state.blueprintFrame !== "none" ? (
        <g opacity={0.35 + state.blueprintProgress * 0.5}>
          <rect
            x="120"
            y="100"
            width="960"
            height="560"
            rx="18"
            fill="none"
            stroke="#22d3ee"
            strokeWidth={state.blueprintFrame === "complete" ? 2.5 : 1.5}
            strokeDasharray={state.blueprintFrame === "complete" ? undefined : "10 8"}
            strokeDashoffset={state.blueprintFrame === "forming" ? (1 - state.blueprintProgress) * 80 : 0}
          />
          {state.blueprintLabels.map((lbl) => (
            <text
              key={lbl.id}
              x={lbl.x}
              y={lbl.y}
              fill="#67e8f9"
              fontSize="11"
              opacity={lbl.opacity}
            >
              {lbl.text}
            </text>
          ))}
        </g>
      ) : null}

      {/* 11 runtime indicators */}
      {state.runtimeItems.map((item) =>
        item.opacity > 0.05 ? (
          <g key={item.id} opacity={item.opacity} transform={`translate(${item.x},${item.y})`}>
            <rect x="-36" y="-10" width="72" height="20" rx="4" fill="#0f172a" fillOpacity={0.85} stroke={NODE_COLORS[item.kind === "blocked" ? "BLOCKED" : "OUTCOME"]} strokeOpacity={0.5} />
            <text textAnchor="middle" y="4" fill="#e2e8f0" fontSize="9">
              {item.kind}
            </text>
          </g>
        ) : null,
      )}

      {state.caption ? (
        <text x="600" y="720" textAnchor="middle" fill="#94a3b8" fontSize="13" opacity={0.85}>
          {state.caption}
        </text>
      ) : null}

      {/* 12 Crow actor — scrubbed transforms, no CSS transition */}
      <CrowStoryActor
        pose={state.crowPose}
        x={state.crowX}
        y={state.crowY}
        scale={state.crowScale}
        rotation={state.crowRotation}
        headRotation={state.crowHeadRotation}
        wingAdjust={state.crowWingAdjust}
        opacity={state.crowOpacity}
        scrubbed
      />
    </svg>
  );
}
