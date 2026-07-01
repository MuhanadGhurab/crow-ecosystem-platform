"use client";

import { CROW_STORY_CHAPTER_ORDER } from "@/lib/crow-story/chapter-order";
import { CROW_STORY_DEFINITION } from "@/lib/crow-story/definition";
import { isFtgpCertificationHostGateEnabled } from "@/lib/ftgp/ftgp-certification-host-gate";
import type { CrowCrowPose, CrowDeviceMode, CrowStoryChapterKey, JourneyKind } from "@/lib/crow-story/types";
import { CrowStoryActor } from "./crow-story-actor";

export type CrowStoryVisualReviewPanelProps = {
  activeChapterKey: CrowStoryChapterKey;
  chapterProgress: number;
  journey: JourneyKind | null;
  crowPose: CrowCrowPose;
  deviceMode: CrowDeviceMode;
  manualReduced: boolean;
  onJumpToChapter: (index: number) => void;
  onPreviewProgress: (chapterKey: CrowStoryChapterKey, progress: number) => void;
  onClearPreview: () => void;
  onToggleReduced: () => void;
  onSetJourney: (journey: JourneyKind) => void;
};

export function CrowStoryVisualReviewPanel(props: CrowStoryVisualReviewPanelProps) {
  if (!isFtgpCertificationHostGateEnabled()) return null;

  const chapters = CROW_STORY_DEFINITION.chapters;

  return (
    <details className="mx-auto mt-12 max-w-7xl border border-amber-500/30 bg-slate-950/90 px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-amber-200">
        Certification — visual review controls
      </summary>
      <p className="mt-2 text-xs text-slate-500">
        Internal review only. Jump chapters, scrub progress, preview layouts. Not shown on live Production.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 text-xs text-slate-400">
          <p>
            <span className="text-slate-500">Active chapter:</span> {props.activeChapterKey} ·{" "}
            <span className="text-slate-500">progress:</span> {props.chapterProgress.toFixed(3)}
          </p>
          <p>
            <span className="text-slate-500">Crow pose:</span> {props.crowPose} ·{" "}
            <span className="text-slate-500">device:</span> {props.deviceMode}
          </p>

          <div className="flex flex-wrap gap-2">
            {chapters.map((ch, i) => (
              <button
                key={ch.key}
                type="button"
                className="rounded border border-slate-700 px-2 py-1 text-slate-300 hover:border-amber-500/50"
                onClick={() => props.onJumpToChapter(i)}
              >
                Ch{i + 1}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1">
            Scrub chapter progress
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(props.chapterProgress * 100)}
              onChange={(e) =>
                props.onPreviewProgress(props.activeChapterKey, Number(e.target.value) / 100)
              }
              className="w-full"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-slate-700 px-2 py-1"
              onClick={() => props.onSetJourney("NEW")}
            >
              NEW
            </button>
            <button
              type="button"
              className="rounded border border-slate-700 px-2 py-1"
              onClick={() => props.onSetJourney("TRANSFORM")}
            >
              TRANSFORM
            </button>
            <button type="button" className="rounded border border-slate-700 px-2 py-1" onClick={props.onToggleReduced}>
              Toggle reduced motion
            </button>
            <button type="button" className="rounded border border-slate-700 px-2 py-1" onClick={props.onClearPreview}>
              Clear scrub override
            </button>
          </div>
        </div>

        <div className="cc-glass-card p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Crow at story scale</p>
          <svg viewBox="0 0 1200 400" className="h-36 w-full bg-[#080c12]">
            <CrowStoryActor pose={props.crowPose} x={600} y={200} scale={1.1} scrubbed={false} />
          </svg>
          <p className="mt-2 text-[10px] text-slate-600">
            Chapters: {CROW_STORY_CHAPTER_ORDER.join(" → ")}
          </p>
        </div>
      </div>
    </details>
  );
}
