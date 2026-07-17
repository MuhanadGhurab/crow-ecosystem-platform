"use client";

import type { CrowCrowPose } from "@/lib/crow-story/types";
import { CrowStoryCrowSvg } from "./crow-story-crow-svg";

export type CrowStoryActorProps = {
  pose: CrowCrowPose;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  headRotation?: number;
  wingAdjust?: number;
  opacity?: number;
  scrubbed?: boolean;
};

export function CrowStoryActor({
  pose,
  x,
  y,
  scale = 1,
  rotation = 0,
  headRotation = 0,
  wingAdjust = 0,
  opacity = 1,
  scrubbed = true,
}: CrowStoryActorProps) {
  if (pose === "hidden" || opacity <= 0.01) return null;

  const isGlyph = pose === "glyph" || pose === "runtime-glyph";
  const isTrust = pose === "trust-silhouette" || pose === "trust-sentinel";
  const crowScale = isGlyph ? scale * 0.45 : scale;
  const offsetX = isGlyph ? 0 : -100;
  const offsetY = isGlyph ? 0 : -90;

  return (
    <g
      aria-hidden="true"
      opacity={opacity}
      transform={`translate(${x},${y}) rotate(${rotation}) scale(${crowScale})`}
      style={{
        willChange: scrubbed ? "transform, opacity" : undefined,
        transition: scrubbed ? undefined : "opacity 220ms ease",
      }}
    >
      <g transform={`translate(${offsetX},${offsetY})`}>
        <CrowStoryCrowSvg
          pose={pose}
          wingAdjust={wingAdjust}
          headRotation={headRotation}
          monochrome={isTrust}
          glyph={isGlyph}
        />
      </g>
    </g>
  );
}
