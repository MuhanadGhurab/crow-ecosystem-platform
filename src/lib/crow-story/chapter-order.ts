/** Chapter ordering for accumulation and scroll engine. */

import type { CrowStoryChapterKey } from "./types";

export const CROW_STORY_CHAPTER_ORDER: CrowStoryChapterKey[] = [
  "idea",
  "choice",
  "signals",
  "people",
  "work",
  "trust",
  "runtime",
];

export function chapterIndex(key: CrowStoryChapterKey): number {
  return CROW_STORY_CHAPTER_ORDER.indexOf(key);
}

export function effectiveChapterProgress(
  chapterKey: CrowStoryChapterKey,
  activeChapterKey: CrowStoryChapterKey,
  progressByChapter: Partial<Record<CrowStoryChapterKey, number>>,
): number {
  const ai = chapterIndex(activeChapterKey);
  const ci = chapterIndex(chapterKey);
  if (ci < ai) return 1;
  if (ci === ai) {
    const raw = progressByChapter[chapterKey] ?? 0;
    return Math.max(0, Math.min(1, raw));
  }
  return 0;
}
