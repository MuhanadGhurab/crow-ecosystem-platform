"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { motionModeFromPreference, projectCrowStoryState } from "@/lib/crow-story/projection";
import type { CrowStoryChapterKey, JourneyKind } from "@/lib/crow-story/types";
import { routes } from "@/lib/routes";
import { CrowStoryDecision } from "./crow-story-decision";
import { CrowStoryJourneyLabel } from "./crow-story-journey-label";
import { CrowStoryNavigation } from "./crow-story-navigation";
import { CrowStoryOperatingMap } from "./crow-story-operating-map";
import { CrowStoryVisualReviewPanel } from "./crow-story-visual-review-panel";

const P1A_ACTIVE_CHAPTERS: CrowStoryChapterKey[] = ["idea", "choice"];

function useChapterProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(scrolled / total);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return progress;
}

export function CrowStoryInteractive() {
  const searchParams = useSearchParams();
  const [initError, setInitError] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const [journey, setJourney] = useState<JourneyKind | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");

  const ideaRef = useRef<HTMLElement>(null);
  const choiceRef = useRef<HTMLElement>(null);
  const ideaProgress = useChapterProgress(ideaRef);
  const choiceProgress = useChapterProgress(choiceRef);

  const [viewport, setViewport] = useState({ width: 1280, height: 800 });

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

  const mapState = useMemo(() => {
    const chapterProgressMap: Record<string, number> = {
      idea: ideaProgress,
      choice: choiceProgress,
    };
    const key: CrowStoryChapterKey =
      activeChapter === 0 ? "idea" : activeChapter === 1 ? "choice" : "signals";
    return projectCrowStoryState({
      chapterKey: key,
      chapterProgress: chapterProgressMap[key] ?? 0,
      journey,
      deviceMode,
      motionMode,
    });
  }, [activeChapter, ideaProgress, choiceProgress, journey, deviceMode, motionMode]);

  useEffect(() => {
    const chapters = [ideaRef, choiceRef];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            const idx = chapters.findIndex((r) => r.current === entry.target);
            if (idx >= 0) {
              setActiveChapter(idx);
              const session = readCrowStorySession();
              writeCrowStorySession({
                journey: journey ?? session?.journey ?? null,
                committed: session?.committed ?? false,
                chapterIndex: idx,
              });
            }
          }
        }
      },
      { threshold: [0.35, 0.55] },
    );
    chapters.forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  }, [journey]);

  const onSoftSelect = useCallback((kind: JourneyKind) => {
    setJourney(kind);
    persistSoftJourney(kind, activeChapter);
    setLiveMessage(journeyLabel(kind));
    const url = new URL(window.location.href);
    url.searchParams.set("journey", kind === "NEW" ? "new" : "transform");
    window.history.replaceState({}, "", url.toString());
  }, [activeChapter]);

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
      persistCommittedJourney(kind, activeChapter);
      window.location.href = buildSignupHandoffUrl(kind);
    },
    [activeChapter],
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
  const idea = chapters[0]!;
  const choice = chapters[1]!;

  return (
    <div className="crow-story-interactive">
      <CrowStoryNavigation
        activeIndex={activeChapter}
        total={chapters.length}
        manualReduced={manualReduced}
        onToggleReduced={() => setManualReduced((v) => !v)}
        onSkip={() => {
          window.location.href = routes.story.start;
        }}
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
              ? "sticky top-20 z-10 h-[min(52vh,480px)] self-start"
              : simplified
                ? "h-[min(38dvh,360px)]"
                : "h-[min(28dvh,280px)]"
          }
        >
          <div className="cc-glass-card h-full overflow-hidden p-2 sm:p-3">
            <CrowStoryOperatingMap
              state={mapState}
              reducedMotion={reduced}
              simplified={simplified}
            />
          </div>
        </div>

        <div className="min-w-0 pb-24">
          <div aria-live="polite" className="sr-only">
            {liveMessage}
          </div>

          {journey ? (
            <CrowStoryJourneyLabel journey={journey} onChangePath={onResetJourney} />
          ) : null}

          <section
            ref={ideaRef}
            id="story-chapter-idea"
            aria-labelledby="story-heading-idea"
            style={{ minHeight: sticky ? `${idea.scrollHeightVhDesktop}vh` : undefined }}
            className="scroll-mt-24 py-10"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
              Chapter 1
            </p>
            <h2 id="story-heading-idea" className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {idea.headline}
            </h2>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-slate-400">{idea.supporting}</p>
            {idea.detail ? (
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-500">{idea.detail}</p>
            ) : null}
          </section>

          <section
            ref={choiceRef}
            id="story-chapter-choice"
            aria-labelledby="story-heading-choice"
            style={{ minHeight: sticky ? `${choice.scrollHeightVhDesktop}vh` : undefined }}
            className="scroll-mt-24 border-t border-white/[0.06] py-10"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
              Chapter 2
            </p>
            <h2 id="story-heading-choice" className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {choice.headline}
            </h2>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-slate-400">{choice.supporting}</p>
            {choice.detail ? (
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-500">{choice.detail}</p>
            ) : null}
            {choice.helper ? (
              <p className="mt-4 text-sm text-slate-500">{choice.helper}</p>
            ) : null}

            <CrowStoryDecision
              selected={journey}
              onSelect={onSoftSelect}
              className="mt-8"
            />
          </section>

          <section
            id="story-preview-boundary"
            className="scroll-mt-24 border-t border-amber-500/20 py-10"
            aria-labelledby="story-preview-heading"
          >
            <h2 id="story-preview-heading" className="font-display text-xl font-semibold text-white">
              Additional chapters — certification preview
            </h2>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-400">
              Chapters 3–7 (Signals, People and Work Personas, Work and Foundation, Trust and
              Blueprint, Runtime) are defined in the authoritative story model and will activate
              after owner visual-direction approval. You can continue to account creation or path
              selection now.
            </p>
            <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-500">
              {chapters.slice(2).map((ch) => (
                <li key={ch.key}>
                  {ch.title} — {ch.headline}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
                    : "Choose a path above to continue"}
              </button>
              <Link href={routes.auth.login} className="cc-btn-secondary min-h-[48px] text-sm">
                Sign In
              </Link>
              <Link href={routes.story.start} className="cc-btn-secondary min-h-[48px] text-sm">
                Start Designing
              </Link>
            </div>
          </section>
        </div>
      </div>

      <CrowStoryVisualReviewPanel />
    </div>
  );
}
