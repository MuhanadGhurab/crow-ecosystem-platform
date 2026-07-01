"use client";

import { CrowStoryActor } from "./crow-story-actor";
import { isFtgpCertificationHostGateEnabled } from "@/lib/ftgp/ftgp-certification-host-gate";
import type { CrowCrowPose } from "@/lib/crow-story/types";

const REVIEW_POSES: Array<{ pose: CrowCrowPose; label: string; x: number; y: number; scale: number }> = [
  { pose: "perch", label: "Perch", x: 200, y: 200, scale: 1 },
  { pose: "observer", label: "Observer", x: 400, y: 200, scale: 1 },
  { pose: "center-choice", label: "Center choice", x: 600, y: 200, scale: 1 },
  { pose: "trust-silhouette", label: "Trust silhouette", x: 800, y: 200, scale: 0.9 },
  { pose: "glyph", label: "Glyph", x: 1000, y: 200, scale: 0.35 },
  { pose: "workflow-trace", label: "Workflow trace (scaffold)", x: 600, y: 420, scale: 1 },
];

export function CrowStoryVisualReviewPanel() {
  if (!isFtgpCertificationHostGateEnabled()) return null;

  return (
    <details className="mx-auto mt-12 max-w-7xl border border-amber-500/30 bg-slate-950/80 px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-amber-200">
        Certification — Crow visual quality review
      </summary>
      <p className="mt-2 text-xs text-slate-500">
        Internal review only. Not shown on live Production.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {(["desktop", "ipad", "mobile"] as const).map((label) => (
          <div key={label} className="cc-glass-card p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{label}</p>
            <svg viewBox="0 0 1200 400" className="h-32 w-full bg-[#080c12]">
              {REVIEW_POSES.map((p) => (
                <CrowStoryActor
                  key={`${label}-${p.pose}`}
                  pose={p.pose}
                  x={p.x}
                  y={p.y}
                  scale={label === "mobile" ? p.scale * 0.75 : p.scale}
                  reducedMotion={label === "mobile"}
                />
              ))}
            </svg>
          </div>
        ))}
      </div>
    </details>
  );
}
