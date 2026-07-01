"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CROW_STORY_CHAPTER_ORDER } from "./chapter-order";
import type { CrowStoryChapterKey, StoryProgressMap } from "./types";

const PROGRESS_EPSILON = 0.002;

export type StoryScrollEngine = {
  chapterRefs: React.RefObject<HTMLElement | null>[];
  activeChapterIndex: number;
  activeChapterKey: CrowStoryChapterKey;
  progressByChapter: StoryProgressMap;
  jumpToChapter: (index: number) => void;
  setPreviewProgress: (chapterKey: CrowStoryChapterKey, progress: number) => void;
  clearPreviewOverride: () => void;
};

function measureChapterProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = rect.height - vh;
  if (total <= 0) return 0;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  return scrolled / total;
}

export function useStoryScrollEngine(): StoryScrollEngine {
  const ref0 = useRef<HTMLElement | null>(null);
  const ref1 = useRef<HTMLElement | null>(null);
  const ref2 = useRef<HTMLElement | null>(null);
  const ref3 = useRef<HTMLElement | null>(null);
  const ref4 = useRef<HTMLElement | null>(null);
  const ref5 = useRef<HTMLElement | null>(null);
  const ref6 = useRef<HTMLElement | null>(null);

  const chapterRefs = useMemo(
    () => [ref0, ref1, ref2, ref3, ref4, ref5, ref6],
    [ref0, ref1, ref2, ref3, ref4, ref5, ref6],
  );

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [progressByChapter, setProgressByChapter] = useState<StoryProgressMap>({});
  const rafRef = useRef<number | null>(null);
  const dirtyRef = useRef(true);
  const previewOverrideRef = useRef<StoryProgressMap | null>(null);

  const measure = useCallback(() => {
    const override = previewOverrideRef.current;
    if (override) {
      setProgressByChapter(override);
      return;
    }

    const next: StoryProgressMap = {};
    chapterRefs.forEach((ref, i) => {
      const el = ref.current;
      const key = CROW_STORY_CHAPTER_ORDER[i];
      if (!el || !key) return;
      next[key] = measureChapterProgress(el);
    });

    setProgressByChapter((prev) => {
      let changed = false;
      for (const key of CROW_STORY_CHAPTER_ORDER) {
        const a = prev[key] ?? 0;
        const b = next[key] ?? 0;
        if (Math.abs(a - b) > PROGRESS_EPSILON) {
          changed = true;
          break;
        }
      }
      return changed ? next : prev;
    });
  }, [chapterRefs]);

  const scheduleMeasure = useCallback(() => {
    dirtyRef.current = true;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (dirtyRef.current) {
        dirtyRef.current = false;
        measure();
      }
    });
  }, [measure]);

  useEffect(() => {
    scheduleMeasure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleMeasure]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = chapterRefs.findIndex((r) => r.current === entry.target);
          if (idx >= 0 && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = idx;
          }
        }
        if (bestIdx >= 0 && bestRatio > 0.2) {
          setActiveChapterIndex(bestIdx);
        }
      },
      { threshold: [0.15, 0.35, 0.55, 0.75] },
    );

    chapterRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [chapterRefs, progressByChapter]);

  const jumpToChapter = useCallback(
    (index: number) => {
      const ref = chapterRefs[index];
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveChapterIndex(index);
      previewOverrideRef.current = null;
    },
    [chapterRefs],
  );

  const setPreviewProgress = useCallback((chapterKey: CrowStoryChapterKey, progress: number) => {
    const idx = CROW_STORY_CHAPTER_ORDER.indexOf(chapterKey);
    const map: StoryProgressMap = {};
    CROW_STORY_CHAPTER_ORDER.forEach((key, i) => {
      if (i < idx) map[key] = 1;
      else if (i === idx) map[key] = Math.max(0, Math.min(1, progress));
      else map[key] = 0;
    });
    previewOverrideRef.current = map;
    setProgressByChapter(map);
    setActiveChapterIndex(idx);
  }, []);

  const clearPreviewOverride = useCallback(() => {
    previewOverrideRef.current = null;
    scheduleMeasure();
  }, [scheduleMeasure]);

  return {
    chapterRefs,
    activeChapterIndex,
    activeChapterKey: CROW_STORY_CHAPTER_ORDER[activeChapterIndex] ?? "idea",
    progressByChapter,
    jumpToChapter,
    setPreviewProgress,
    clearPreviewOverride,
  };
}
