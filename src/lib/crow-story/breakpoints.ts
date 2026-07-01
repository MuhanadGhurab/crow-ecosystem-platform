/** CROW.STORY.P1A — capability-aware layout modes (not a single <900px rule). */

import type { CrowDeviceMode } from "./types";

export const STORY_BREAKPOINTS = {
  /** Two-column sticky desktop */
  desktopStickyMin: 1280,
  /** iPad landscape sticky */
  ipadLandscapeStickyMin: 1024,
  /** iPad portrait interactive card */
  ipadPortraitMin: 768,
  /** Phone / compact */
  compactMax: 639,
  /** Narrow split view — width only; combined with aspect in resolver */
  narrowSplitMax: 899,
} as const;

export type StoryLayoutInput = {
  width: number;
  height: number;
  prefersReducedMotion: boolean;
  forceReducedMotion?: boolean;
  forceCompact?: boolean;
};

export function resolveStoryDeviceMode(input: StoryLayoutInput): CrowDeviceMode {
  if (input.prefersReducedMotion || input.forceReducedMotion) {
    return "REDUCED_MOTION";
  }
  if (input.forceCompact || input.width <= STORY_BREAKPOINTS.compactMax) {
    return "COMPACT";
  }

  const isPortrait = input.height > input.width;

  if (
    isPortrait &&
    input.width >= STORY_BREAKPOINTS.ipadPortraitMin &&
    input.width < STORY_BREAKPOINTS.ipadLandscapeStickyMin
  ) {
    return "IPAD_PORTRAIT";
  }

  const isNarrowSplit =
    input.width <= STORY_BREAKPOINTS.narrowSplitMax &&
    input.width / Math.max(input.height, 1) < 0.85;

  if (isNarrowSplit) {
    return "COMPACT";
  }

  if (
    !isPortrait &&
    input.width >= STORY_BREAKPOINTS.ipadLandscapeStickyMin &&
    input.width < STORY_BREAKPOINTS.desktopStickyMin
  ) {
    return "IPAD_LANDSCAPE_STICKY";
  }

  if (input.width >= STORY_BREAKPOINTS.desktopStickyMin) {
    return "DESKTOP_STICKY";
  }

  if (input.width >= STORY_BREAKPOINTS.ipadPortraitMin) {
    return isPortrait ? "IPAD_PORTRAIT" : "IPAD_LANDSCAPE_STICKY";
  }

  return "COMPACT";
}

export function deviceModeUsesStickyStage(mode: CrowDeviceMode): boolean {
  return mode === "DESKTOP_STICKY" || mode === "IPAD_LANDSCAPE_STICKY";
}
