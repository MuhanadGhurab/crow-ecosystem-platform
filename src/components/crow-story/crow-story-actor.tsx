"use client";

import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import type { CrowCrowPose } from "@/lib/crow-story/types";
import { CROW_STORY_EASE, CROW_STORY_MOTION } from "@/lib/crow-story/motion-tokens";

export type CrowStoryActorProps = {
  pose: CrowCrowPose;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  reducedMotion?: boolean;
};

const POSE_VARIANT: Record<CrowCrowPose, "primary" | "hero" | "motion" | "monochrome"> = {
  hidden: "primary",
  entering: "motion",
  perch: "hero",
  observer: "hero",
  "center-choice": "hero",
  "signal-hop": "hero",
  "land-personas": "hero",
  "workflow-trace": "motion",
  "trust-silhouette": "monochrome",
  glyph: "primary",
};

export function CrowStoryActor({
  pose,
  x,
  y,
  scale = 1,
  rotation = 0,
  opacity = 1,
  reducedMotion = false,
}: CrowStoryActorProps) {
  if (pose === "hidden" || opacity <= 0.01) return null;

  const isGlyph = pose === "glyph";
  const size = isGlyph ? 48 : 160;
  const duration =
    pose === "entering" && !reducedMotion ? CROW_STORY_MOTION.crowEnterMs : CROW_STORY_MOTION.selectMs;

  return (
    <g
      aria-hidden="true"
      opacity={opacity}
      style={{
        transition: reducedMotion ? "opacity 200ms ease" : `opacity 280ms ease`,
      }}
    >
      <foreignObject
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        style={{
          transition: reducedMotion
            ? undefined
            : `transform ${duration}ms ${CROW_STORY_EASE}`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <CrowMarkSvg
            variant={POSE_VARIANT[pose]}
            className={`h-full w-full ${pose === "trust-silhouette" ? "[&_.crow-armor-eye]:fill-amber-400" : ""}`}
          />
        </div>
      </foreignObject>
    </g>
  );
}
