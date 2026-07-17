"use client";

import { useId } from "react";

import { CROW_ARMOR_PLATES, type CrowArmorPlateFill } from "@/components/brand/crow-svg-paths";
import type { CrowCrowPose } from "@/lib/crow-story/types";

const PLATE_FILLS: Record<CrowArmorPlateFill, string> = {
  highlight: "#67e8f9",
  mid: "#3b82f6",
  shadow: "#1e3a8a",
  deep: "#0f172a",
  beak: "#1e3a8a",
  beakHighlight: "#22d3ee",
  eye: "#22d3ee",
};

const GLYPH_FILLS: Record<CrowArmorPlateFill, string> = {
  highlight: "#22d3ee",
  mid: "#0891b2",
  shadow: "#0e7490",
  deep: "#164e63",
  beak: "#155e75",
  beakHighlight: "#67e8f9",
  eye: "#a5f3fc",
};

export type CrowStoryCrowSvgProps = {
  pose: CrowCrowPose;
  wingAdjust?: number;
  headRotation?: number;
  monochrome?: boolean;
  glyph?: boolean;
};

function poseTransforms(pose: CrowCrowPose, wingAdjust: number): { body: string; wing: string } {
  switch (pose) {
    case "entering":
      return { body: "translate(0,-4)", wing: `rotate(${-12 + wingAdjust * 40})` };
    case "observing-new":
      return { body: "translate(-2,0)", wing: "rotate(-6)" };
    case "observing-transform":
      return { body: "translate(2,0)", wing: "rotate(6)" };
    case "signal-travel":
    case "signal-hop":
      return { body: "translate(0,-2)", wing: "rotate(-4)" };
    case "workflow-trace":
      return { body: "translate(4,2)", wing: "rotate(8)" };
    case "persona-observer":
    case "land-personas":
      return { body: "translate(0,-6)", wing: "rotate(-3)" };
    case "trust-sentinel":
    case "trust-silhouette":
      return { body: "translate(0,2)", wing: "rotate(0)" };
    case "blueprint-observer":
      return { body: "translate(0,4)", wing: "rotate(2)" };
    case "runtime-glyph":
    case "glyph":
      return { body: "", wing: "" };
    case "center-choice":
    case "observer":
    case "perch":
    case "perched":
    default:
      return { body: "", wing: "rotate(-2)" };
  }
}

export function CrowStoryCrowSvg({
  pose,
  wingAdjust = 0,
  headRotation = 0,
  monochrome = false,
  glyph = false,
}: CrowStoryCrowSvgProps) {
  const uid = useId().replace(/:/g, "");
  const fills = glyph || monochrome ? GLYPH_FILLS : PLATE_FILLS;
  const { body, wing } = poseTransforms(pose, wingAdjust);
  const scale = glyph ? 0.55 : 1;

  return (
    <g transform={`scale(${scale})`} opacity={monochrome ? 0.85 : 1}>
      <g transform={body}>
        {CROW_ARMOR_PLATES.map((plate) => (
          <path
            key={plate.id}
            d={plate.d}
            fill={fills[plate.fill]}
            opacity={plate.fill === "eye" ? 1 : 0.95}
          />
        ))}
        <g transform={`translate(88,78) rotate(${headRotation})`}>
          <path d="M 86 76 L 104 74 L 106 78 L 88 80 Z" fill={fills.eye} />
        </g>
        <g transform={`translate(42,108) ${wing}`} style={{ transformOrigin: "42px 108px" }}>
          <path
            d="M 30 108 L 14 142 L 44 138 L 58 118 Z"
            fill={fills.shadow}
            opacity={0.9}
          />
        </g>
        <path d="M 48 148 L 56 156 L 64 148 L 56 140 Z" fill={fills.deep} opacity={0.8} />
      </g>
      <defs>
        <filter id={`crow-eye-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </g>
  );
}
