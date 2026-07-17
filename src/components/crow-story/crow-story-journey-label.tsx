"use client";

import type { JourneyKind } from "@/lib/crow-story/types";
import { journeyLabel } from "@/lib/crow-story/journey-state";

export function CrowStoryJourneyLabel({
  journey,
  onChangePath,
}: {
  journey: JourneyKind;
  onChangePath: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
      <span className="text-sm font-medium text-cyan-200">{journeyLabel(journey)}</span>
      <button
        type="button"
        onClick={onChangePath}
        className="text-sm text-violet-400 underline-offset-2 hover:text-violet-300 hover:underline"
      >
        Change path
      </button>
    </div>
  );
}
