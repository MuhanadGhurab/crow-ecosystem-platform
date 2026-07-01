"use client";

import type { CrowVisualState } from "@/lib/crow-story/types";
import { STORY_VIEWBOX } from "@/lib/crow-story/projection";
import { CrowStoryActor } from "./crow-story-actor";

const NODE_COLORS: Record<string, string> = {
  OUTCOME: "#22d3ee",
  SIGNAL: "#22d3ee",
  PERSONA: "#38bdf8",
  WORKFLOW: "#818cf8",
  CAPABILITY: "#94a3b8",
  WATCH: "#fbbf24",
  PATH_NEW: "#22d3ee",
  PATH_TRANSFORM: "#a78bfa",
  FRICTION: "#fbbf24",
};

export type CrowStoryOperatingMapProps = {
  state: CrowVisualState;
  reducedMotion?: boolean;
  simplified?: boolean;
  className?: string;
};

export function CrowStoryOperatingMap({
  state,
  reducedMotion = false,
  simplified = false,
  className = "",
}: CrowStoryOperatingMapProps) {
  const vb = `0 0 ${STORY_VIEWBOX.width} ${STORY_VIEWBOX.height}`;

  return (
    <svg
      viewBox={vb}
      className={`h-full w-full ${className}`}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="story-bg-plane" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d1117" />
          <stop offset="100%" stopColor="#080c12" />
        </linearGradient>
        <pattern id="story-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#story-bg-plane)" />
      <rect
        width="100%"
        height="100%"
        fill="url(#story-grid)"
        opacity={state.gridOpacity}
        style={{ transition: reducedMotion ? "none" : "opacity 360ms ease" }}
      />

      <line
        x1="80"
        y1="620"
        x2="1120"
        y2="620"
        stroke="rgba(148,163,184,0.2)"
        strokeWidth="1"
      />

      {/* Structural path guides */}
      <path
        d="M 280 420 Q 400 360 600 280"
        fill="none"
        stroke="#a78bfa"
        strokeOpacity={0.12 + state.newPathEmphasis * 0.2}
        strokeWidth="2"
        strokeDasharray={simplified ? "0" : "6 4"}
      />
      <path
        d="M 920 380 Q 760 340 600 280"
        fill="none"
        stroke="#a78bfa"
        strokeOpacity={0.12 + state.transformPathEmphasis * 0.2}
        strokeWidth="2"
        strokeDasharray={simplified ? "0" : "6 4"}
      />

      {state.edges.map((edge) => (
        <line
          key={edge.id}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke={edge.kind === "FRICTION" ? "#fbbf24" : "#a78bfa"}
          strokeOpacity={edge.opacity}
          strokeWidth={edge.kind === "FRICTION" ? 1.5 : 2}
          strokeDasharray={edge.dashed ? "4 6" : undefined}
          style={{ transition: reducedMotion ? "none" : "stroke-opacity 300ms ease" }}
        />
      ))}

      {state.nodes.map((node) => {
        const color = NODE_COLORS[node.kind] ?? "#94a3b8";
        const r = node.kind === "OUTCOME" ? 16 : node.kind === "FRICTION" ? 10 : 8;
        return (
          <g
            key={node.id}
            style={{
              opacity: node.opacity,
              transform: `scale(${node.scale})`,
              transformOrigin: `${node.x}px ${node.y}px`,
              transition: reducedMotion ? "none" : "opacity 280ms ease, transform 220ms ease",
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={r}
              fill={color}
              fillOpacity={node.emphasis ? 0.55 : 0.35}
              stroke={node.emphasis ? color : "transparent"}
              strokeWidth={2}
              strokeOpacity={0.8}
            />
            {node.kind === "OUTCOME" && node.opacity > 0.5 ? (
              <circle cx={node.x} cy={node.y} r={r + 10} fill="none" stroke="#22d3ee" strokeOpacity={0.15} />
            ) : null}
          </g>
        );
      })}

      {state.blueprintFrame !== "none" ? (
        <rect
          x="140"
          y="120"
          width="920"
          height="520"
          rx="16"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity={state.blueprintFrame === "complete" ? 0.35 : 0.2}
          strokeWidth="2"
          strokeDasharray="8 6"
        />
      ) : null}

      {state.runtimeActivity ? (
        <g className="motion-safe:animate-[cc-pulse-soft_2s_ease-in-out_infinite]">
          <circle cx="600" cy="400" r="6" fill="#22d3ee" fillOpacity={0.5} />
        </g>
      ) : null}

      <CrowStoryActor
        pose={state.crowPose}
        x={state.crowX}
        y={state.crowY}
        scale={state.crowScale}
        rotation={state.crowRotation}
        opacity={state.crowOpacity}
        reducedMotion={reducedMotion}
      />
    </svg>
  );
}
