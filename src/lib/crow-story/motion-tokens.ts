/** CROW.STORY.P1A — motion tokens aligned with existing Crow curves. */

export const CROW_STORY_EASE = "cubic-bezier(0.22, 1, 0.36, 1)" as const;

export const CROW_STORY_MOTION = {
  microMs: 140,
  selectMs: 220,
  nodeActivateMs: 280,
  mapTransitionMs: 360,
  crowEnterMs: 480,
  edgeDrawMs: 600,
  routeFadeMs: 200,
  maxRotationDeg: 3,
  maxCrowTranslatePct: 36,
  selectedScale: 1.02,
} as const;
