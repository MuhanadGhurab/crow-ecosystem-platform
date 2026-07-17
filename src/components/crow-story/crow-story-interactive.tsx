"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CROW_STORY_DEFINITION } from "@/lib/crow-story/definition";
import {
  buildSignupHandoffUrl,
  journeyLabel,
  parseJourneyUrlParam,
  persistCommittedJourney,
  persistSoftJourney,
  readCrowStorySession,
  resetJourneySelection,
  resolveJourneyState,
  writeCrowStorySession,
} from "@/lib/crow-story/journey-state";
import { deviceModeUsesStickyStage, resolveStoryDeviceMode } from "@/lib/crow-story/breakpoints";
import { motionModeFromPreference, projectFullStoryState } from "@/lib/crow-story/projection";
import type { JourneyKind } from "@/lib/crow-story/types";
import { useStoryScrollEngine } from "@/lib/crow-story/use-story-scroll-engine";
import { routes } from "@/lib/routes";
import { CrowStoryDecision } from "./crow-story-decision";
import { CrowStoryJourneyLabel } from "./crow-story-journey-label";
import { CrowStoryNavigation } from "./crow-story-navigation";
import { CrowStoryOperatingMap } from "./crow-story-operating-map";
import { CrowStoryVisualReviewPanel } from "./crow-story-visual-review-panel";

export function CrowStoryInteractive() {
  const searchParams = useSearchParams();
  const [initError, setInitError] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const [journey, setJourney] = useState<JourneyKind | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });

  const scroll = useStoryScrollEngine();

  useEffect(() => {
    try {
      const urlJourney = parseJourneyUrlParam(searchParams.get("journey"));
      const resolved = resolveJourneyState(searchParams.get("journey"));
      setJourney(urlJourney ?? resolved.journey);
    } catch {
      setInitError(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const deviceMode = resolveStoryDeviceMode({
    width: viewport.width,
    height: viewport.height,
    prefersReducedMotion: prefersReduced,
    forceReducedMotion: manualReduced,
  });

  const motionMode = motionModeFromPreference(prefersReduced, manualReduced);
  const reduced = deviceMode === "REDUCED_MOTION";
  const sticky = deviceModeUsesStickyStage(deviceMode);
  const simplified = deviceMode === "COMPACT" || deviceMode === "IPAD_PORTRAIT";

  const mapState = useMemo(
    () =>
      projectFullStoryState({
        progressByChapter: scroll.progressByChapter,
        activeChapterKey: scroll.activeChapterKey,
        journey,
        deviceMode,
        motionMode,
      }),
    [scroll.progressByChapter, scroll.activeChapterKey, journey, deviceMode, motionMode],
  );

  useEffect(() => {
    const session = readCrowStorySession();
    writeCrowStorySession({
      journey: journey ?? session?.journey ?? null,
      committed: session?.committed ?? false,
      chapterIndex: scroll.activeChapterIndex,
    });
  }, [journey, scroll.activeChapterIndex]);

  const onSoftSelect = useCallback(
    (kind: JourneyKind) => {
      setJourney(kind);
      persistSoftJourney(kind, scroll.activeChapterIndex);
      setLiveMessage(journeyLabel(kind));
      const url = new URL(window.location.href);
      url.searchParams.set("journey", kind === "NEW" ? "new" : "transform");
      window.history.replaceState({}, "", url.toString());
    },
    [scroll.activeChapterIndex],
  );

  const onResetJourney = useCallback(() => {
    resetJourneySelection();
    setJourney(null);
    setLiveMessage("Path selection cleared.");
    const url = new URL(window.location.href);
    url.searchParams.delete("journey");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const onCommit = useCallback(
    (kind: JourneyKind) => {
      persistCommittedJourney(kind, scroll.activeChapterIndex);
      window.location.href = buildSignupHandoffUrl(kind);
    },
    [scroll.activeChapterIndex],
  );

  if (initError) {
    return (
      <div className="cc-glass-card mx-auto max-w-2xl p-8 text-center">
        <p className="text-slate-300">The interactive story could not initialize.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={routes.story.architectsMapArticle} className="cc-btn-primary text-sm">
            Read as article
          </Link>
          <Link href={routes.story.start} className="cc-btn-secondary text-sm">
            Start designing
          </Link>
        </div>
      </div>
    );
  }

  const chapters = CROW_STORY_DEFINITION.chapters;

  return (
    <div className="crow-story-interactive">
      <CrowStoryNavigation
        activeIndex={scroll.activeChapterIndex}
        total={chapters.length}
        manualReduced={manualReduced}
        onToggleReduced={() => setManualReduced((v) => !v)}
        onSkip={() => {
          window.location.href = routes.story.start;
        }}
        onChapterSelect={scroll.jumpToChapter}
      />

      <div
        className={
          sticky
            ? "mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-6"
            : "mx-auto max-w-3xl px-4"
        }
      >
        <div
          className={
            sticky
              ? "sticky top-20 z-10 h-[min(52vh,520px)] self-start"
              : simplified
                ? "h-[min(38dvh,400px)]"
                : "h-[min(32dvh,320px)]"
          }
        >
          <div className="cc-glass-card h-full overflow-hidden border border-white/[0.08] p-1 sm:p-2">
            <CrowStoryOperatingMap state={mapState} simplified={simplified} />
          </div>
        </div>

        <div className="min-w-0 pb-24">
          <div aria-live="polite" className="sr-only">
            {liveMessage}
          </div>

          {journey ? (
            <CrowStoryJourneyLabel journey={journey} onChangePath={onResetJourney} />
          ) : null}

          {chapters.map((chapter, index) => {
            const isChoice = chapter.key === "choice";
            const isRuntime = chapter.key === "runtime";
            return (
              <section
                key={chapter.key}
                ref={scroll.chapterRefs[index]}
                id={`story-chapter-${chapter.key}`}
                aria-labelledby={`story-heading-${chapter.key}`}
                style={{
                  minHeight: sticky ? `${chapter.scrollHeightVhDesktop}vh` : undefined,
                }}
                className="scroll-mt-24 border-t border-white/[0.06] py-10 first:border-t-0"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
                  Chapter {index + 1}
                </p>
                <h2
                  id={`story-heading-${chapter.key}`}
                  className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl"
                >
                  {chapter.headline}
                </h2>
                <p className="mt-4 max-w-prose text-lg leading-relaxed text-slate-400">
                  {chapter.supporting}
                </p>
                {chapter.detail ? (
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-500">
                    {chapter.detail}
                  </p>
                ) : null}
                {chapter.helper ? (
                  <p className="mt-4 text-sm text-slate-500">{chapter.helper}</p>
                ) : null}

                {isChoice ? (
                  <CrowStoryDecision
                    selected={journey}
                    onSelect={onSoftSelect}
                    className="mt-8"
                  />
                ) : null}

                {isRuntime ? (
                  <div className="mt-8 space-y-4">
                    <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                      <li>What needs my attention?</li>
                      <li>What am I responsible for?</li>
                      <li>Which decisions are waiting?</li>
                      <li>What is blocked?</li>
                      <li>What evidence is missing?</li>
                      <li>What outcome am I contributing to?</li>
                    </ul>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        className="cc-btn-primary min-h-[48px] text-sm"
                        disabled={!journey}
                        onClick={() => journey && onCommit(journey)}
                      >
                        {journey === "TRANSFORM"
                          ? "Transform an Existing Organization"
                          : journey === "NEW"
                            ? "Build a New Organization"
                            : "Choose a path in Chapter 2 to continue"}
                      </button>
                      <Link href={routes.auth.login} className="cc-btn-secondary min-h-[48px] text-sm">
                        Sign In
                      </Link>
                      <Link href={routes.story.start} className="cc-btn-secondary min-h-[48px] text-sm">
                        Start Designing
                      </Link>
                    </div>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>

      <CrowStoryVisualReviewPanel
        activeChapterKey={scroll.activeChapterKey}
        chapterProgress={mapState.chapterProgress}
        journey={journey}
        crowPose={mapState.crowPose}
        deviceMode={deviceMode}
        manualReduced={manualReduced}
        onJumpToChapter={scroll.jumpToChapter}
        onPreviewProgress={scroll.setPreviewProgress}
        onClearPreview={scroll.clearPreviewOverride}
        onToggleReduced={() => setManualReduced((v) => !v)}
        onSetJourney={(k) => onSoftSelect(k)}
      />
    </div>
  );
}
