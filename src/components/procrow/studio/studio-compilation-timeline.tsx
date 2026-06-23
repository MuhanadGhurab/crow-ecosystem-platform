"use client";

import { COMPILATION_PHASES } from "@/lib/model-forge/graph/graph-layout";
import { studioMotion } from "./studio-motion";

type StudioCompilationTimelineProps = {
  completedPhaseCount: number;
  reducedMotion?: boolean;
};

export function StudioCompilationTimeline({ completedPhaseCount, reducedMotion = false }: StudioCompilationTimelineProps) {
  return (
    <ol className="space-y-1 text-xs" aria-label="Compilation timeline">
      {COMPILATION_PHASES.map((phase, i) => {
        const done = i < completedPhaseCount;
        return (
          <li
            key={phase}
            className={`flex items-center gap-2 rounded px-2 py-1 ${done ? "bg-emerald-500/10 text-emerald-200" : "text-white/40"}`}
            style={{ transition: reducedMotion ? undefined : `background ${studioMotion.feedback}ms ease` }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-400" : "bg-white/20"}`} aria-hidden />
            <span className="capitalize">{phase}</span>
          </li>
        );
      })}
    </ol>
  );
}
