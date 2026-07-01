/** CROW.STORY.P1A — deterministic visual state projection (pure, side-effect free). */

import type {
  CrowCrowPose,
  CrowDeviceMode,
  CrowMapEdge,
  CrowMapNode,
  CrowMotionMode,
  CrowStoryChapterKey,
  CrowVisualState,
  JourneyKind,
} from "./types";

export const STORY_VIEWBOX = { width: 1200, height: 800 } as const;

const OUTCOME: CrowMapNode = {
  id: "outcome",
  kind: "OUTCOME",
  x: 600,
  y: 280,
  opacity: 0,
  scale: 1,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function progressInRange(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function crowEnterPosition(progress: number): { x: number; y: number; pose: CrowCrowPose; opacity: number } {
  const startX = 1280;
  const startY = 336;
  const endX = 864;
  const endY = 464;
  const t = progressInRange(progress, 0.55, 0.85);
  if (progress < 0.55) {
    return { x: startX, y: startY, pose: "hidden", opacity: 0 };
  }
  if (t < 1) {
    return {
      x: lerp(startX, endX, t),
      y: lerp(startY, endY, t),
      pose: "entering",
      opacity: lerp(0, 1, Math.min(1, t * 1.4)),
    };
  }
  return { x: endX, y: endY, pose: "perch", opacity: 1 };
}

function buildNewPathNodes(emphasis: number): CrowMapNode[] {
  const e = Math.max(0, Math.min(1, emphasis));
  return [
    { id: "new-a", kind: "PATH_NEW", x: 320, y: 420, opacity: 0.35 + e * 0.5, scale: 1 + e * 0.02, emphasis: e > 0.5 },
    { id: "new-b", kind: "PATH_NEW", x: 380, y: 480, opacity: 0.2 + e * 0.55, scale: 1, emphasis: e > 0.5 },
    { id: "new-c", kind: "PATH_NEW", x: 340, y: 540, opacity: 0.15 + e * 0.45, scale: 1, emphasis: e > 0.5 },
  ];
}

function buildTransformPathNodes(emphasis: number): CrowMapNode[] {
  const e = Math.max(0, Math.min(1, emphasis));
  return [
    { id: "tx-a", kind: "PATH_TRANSFORM", x: 820, y: 380, opacity: 0.55 + e * 0.35, scale: 1, emphasis: e > 0.5 },
    { id: "tx-b", kind: "PATH_TRANSFORM", x: 880, y: 440, opacity: 0.5 + e * 0.4, scale: 1, emphasis: e > 0.5 },
    { id: "tx-c", kind: "PATH_TRANSFORM", x: 840, y: 500, opacity: 0.45 + e * 0.4, scale: 1, emphasis: e > 0.5 },
    { id: "tx-d", kind: "PATH_TRANSFORM", x: 900, y: 520, opacity: 0.4 + e * 0.45, scale: 1, emphasis: e > 0.5 },
    {
      id: "tx-friction",
      kind: "FRICTION",
      x: 860,
      y: 460,
      opacity: e * 0.85,
      scale: 1,
      emphasis: e > 0.5,
    },
  ];
}

function buildTransformEdges(emphasis: number): CrowMapEdge[] {
  const o = 0.25 + emphasis * 0.45;
  return [
    { id: "te1", x1: 820, y1: 380, x2: 880, y2: 440, kind: "PATH", opacity: o },
    { id: "te2", x1: 880, y1: 440, x2: 840, y2: 500, kind: "PATH", opacity: o },
    { id: "te3", x1: 840, y1: 500, x2: 900, y2: 520, kind: "PATH", opacity: o * 0.9 },
    {
      id: "te4",
      x1: 880,
      y1: 440,
      x2: 860,
      y2: 460,
      kind: "FRICTION",
      opacity: emphasis * 0.7,
      dashed: true,
    },
  ];
}

function projectIdeaChapter(progress: number, motionMode: CrowMotionMode): Partial<CrowVisualState> {
  const outcomeOpacity = progressInRange(progress, 0, 0.25);
  const gridOpacity = progress < 0.25 ? 0 : progress < 0.85 ? 0.04 : 0.08;
  const crow =
    motionMode === "REDUCED" || motionMode === "STATIC"
      ? { x: 864, y: 464, pose: "perch" as const, opacity: 1 }
      : crowEnterPosition(progress);

  return {
    gridOpacity,
    nodes: [{ ...OUTCOME, opacity: outcomeOpacity, scale: 0.9 + outcomeOpacity * 0.1 }],
    edges: [],
    crowPose: crow.pose,
    crowX: crow.x,
    crowY: crow.y,
    crowScale: 1,
    crowRotation: 0,
    crowOpacity: crow.opacity,
    newPathEmphasis: 0,
    transformPathEmphasis: 0,
  };
}

function projectChoiceChapter(
  progress: number,
  journey: JourneyKind | null,
  motionMode: CrowMotionMode,
): Partial<CrowVisualState> {
  const newE =
    journey === "NEW" ? 0.85 : journey === "TRANSFORM" ? 0.35 : 0.35 + progressInRange(progress, 0.3, 0.7) * 0.1;
  const transformE =
    journey === "TRANSFORM"
      ? 0.85
      : journey === "NEW"
        ? 0.35
        : 0.35 + progressInRange(progress, 0.3, 0.7) * 0.1;

  const headTilt =
    journey === "NEW" ? -3 : journey === "TRANSFORM" ? 3 : motionMode === "FULL" ? 0 : 0;

  return {
    gridOpacity: 0.08,
    nodes: [
      { ...OUTCOME, opacity: 1, scale: 1 },
      ...buildNewPathNodes(newE),
      ...buildTransformPathNodes(transformE),
    ],
    edges: buildTransformEdges(transformE),
    crowPose: "center-choice",
    crowX: 600,
    crowY: 416,
    crowScale: 1,
    crowRotation: headTilt,
    crowOpacity: 1,
    newPathEmphasis: newE,
    transformPathEmphasis: transformE,
  };
}

function projectDormantChapter(
  chapterKey: CrowStoryChapterKey,
  journey: JourneyKind | null,
): Partial<CrowVisualState> {
  const base = projectChoiceChapter(1, journey, "STATIC");
  return {
    ...base,
    chapterKey,
    crowPose: chapterKey === "runtime" ? "glyph" : "trust-silhouette",
    crowX: chapterKey === "runtime" ? 1104 : 1008,
    crowY: chapterKey === "runtime" ? 704 : 224,
    crowScale: chapterKey === "runtime" ? 0.28 : 0.9,
    crowOpacity: chapterKey === "runtime" ? 0.75 : 0.85,
    blueprintFrame: chapterKey === "trust" || chapterKey === "runtime" ? "forming" : "none",
    runtimeActivity: chapterKey === "runtime",
  };
}

export function projectCrowStoryState(args: {
  chapterKey: CrowStoryChapterKey;
  chapterProgress: number;
  journey: JourneyKind | null;
  deviceMode: CrowDeviceMode;
  motionMode: CrowMotionMode;
}): CrowVisualState {
  const progress = Math.max(0, Math.min(1, args.chapterProgress));
  const motionMode =
    args.deviceMode === "REDUCED_MOTION" || args.motionMode === "REDUCED"
      ? "REDUCED"
      : args.motionMode;

  let patch: Partial<CrowVisualState>;
  switch (args.chapterKey) {
    case "idea":
      patch = projectIdeaChapter(progress, motionMode);
      break;
    case "choice":
      patch = projectChoiceChapter(progress, args.journey, motionMode);
      break;
    default:
      patch = projectDormantChapter(args.chapterKey, args.journey);
      break;
  }

  return {
    chapterKey: args.chapterKey,
    chapterProgress: progress,
    gridOpacity: patch.gridOpacity ?? 0.08,
    nodes: patch.nodes ?? [],
    edges: patch.edges ?? [],
    crowPose: patch.crowPose ?? "perch",
    crowX: patch.crowX ?? 600,
    crowY: patch.crowY ?? 416,
    crowScale: patch.crowScale ?? 1,
    crowRotation: patch.crowRotation ?? 0,
    crowOpacity: patch.crowOpacity ?? 1,
    newPathEmphasis: patch.newPathEmphasis ?? 0,
    transformPathEmphasis: patch.transformPathEmphasis ?? 0,
    blueprintFrame: patch.blueprintFrame ?? "none",
    runtimeActivity: patch.runtimeActivity ?? false,
  };
}

export function motionModeFromPreference(
  prefersReducedMotion: boolean,
  manualReduced: boolean,
): CrowMotionMode {
  if (prefersReducedMotion || manualReduced) return "REDUCED";
  return "FULL";
}
