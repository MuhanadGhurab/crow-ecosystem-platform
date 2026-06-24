"use client";

import type { EnterpriseBlueprintDecision } from "@/lib/model-forge/blueprint/blueprint-types";
import type { DecisionImpactResult } from "@/lib/model-forge/blueprint/blueprint-decision-impact";

type TimelineEntry = {
  decision: EnterpriseBlueprintDecision;
  impact?: DecisionImpactResult;
  reverted?: boolean;
};

type Props = {
  entries: TimelineEntry[];
  reducedMotion?: boolean;
};

export function StudioDecisionTimeline({ entries, reducedMotion }: Props) {
  return (
    <div className="space-y-2 text-xs">
      <p className="text-amber-200/90">PREVIEW ONLY · NOT PERSISTED · DOES NOT APPLY AUTHORITY</p>
      {entries.length === 0 && <p className="text-white/40">No draft-only decision selections in this session.</p>}
      {entries.map(({ decision, impact, reverted }) => (
        <div
          key={decision.key}
          className="rounded border border-white/10 bg-black/30 p-2"
          style={{ transition: reducedMotion ? undefined : "opacity 180ms ease" }}
        >
          <p className="font-medium text-white">{decision.question}</p>
          <p className="text-white/50">Recommended: {decision.recommendedOption}</p>
          {decision.draftSelection && (
            <p className="text-cyan-200">Draft selection: {decision.draftSelection}{reverted ? " (reverted)" : ""}</p>
          )}
          {impact && (
            <p className="mt-1 text-white/40">
              Affects workflows: {impact.impact.workflows.slice(0, 3).join(", ") || "—"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
