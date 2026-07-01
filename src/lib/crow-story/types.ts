/** CROW.STORY.P1A — Architect's Map story types (no database enums). */

export type JourneyKind = "NEW" | "TRANSFORM";

export type JourneyUrlValue = "new" | "transform";

export type CrowStoryChapterKey =
  | "idea"
  | "choice"
  | "signals"
  | "people"
  | "work"
  | "trust"
  | "runtime";

export type CrowCrowPose =
  | "hidden"
  | "entering"
  | "perch"
  | "observer"
  | "center-choice"
  | "signal-hop"
  | "land-personas"
  | "workflow-trace"
  | "trust-silhouette"
  | "glyph";

export type CrowDeviceMode =
  | "DESKTOP_STICKY"
  | "IPAD_LANDSCAPE_STICKY"
  | "IPAD_PORTRAIT"
  | "COMPACT"
  | "REDUCED_MOTION";

export type CrowMotionMode = "FULL" | "REDUCED" | "STATIC";

export type CrowMapNodeKind =
  | "OUTCOME"
  | "SIGNAL"
  | "PERSONA"
  | "WORKFLOW"
  | "CAPABILITY"
  | "WATCH"
  | "PATH_NEW"
  | "PATH_TRANSFORM"
  | "FRICTION";

export type CrowMapNode = {
  id: string;
  kind: CrowMapNodeKind;
  x: number;
  y: number;
  label?: string;
  opacity: number;
  scale: number;
  emphasis?: boolean;
};

export type CrowMapEdge = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: "STRUCTURAL" | "WORKFLOW" | "FRICTION" | "PATH";
  opacity: number;
  dashed?: boolean;
};

export type CrowVisualState = {
  chapterKey: CrowStoryChapterKey;
  chapterProgress: number;
  gridOpacity: number;
  nodes: CrowMapNode[];
  edges: CrowMapEdge[];
  crowPose: CrowCrowPose;
  crowX: number;
  crowY: number;
  crowScale: number;
  crowRotation: number;
  crowOpacity: number;
  newPathEmphasis: number;
  transformPathEmphasis: number;
  blueprintFrame: "none" | "forming" | "complete";
  runtimeActivity: boolean;
};

export type CrowStoryBeat = {
  progressStart: number;
  progressEnd: number;
  visualPatch: Partial<CrowVisualState>;
};

export type CrowStoryChapter = {
  key: CrowStoryChapterKey;
  index: number;
  title: string;
  headline: string;
  supporting: string;
  detail?: string;
  helper?: string;
  scrollHeightVhDesktop: number;
  a11ySummary: string;
  prohibitedTerms: readonly string[];
  beats: CrowStoryBeat[];
};

export type CrowStoryVariantCopy = {
  headline?: string;
  supporting?: string;
  detail?: string;
};

export type CrowStoryVariant = {
  journey: JourneyKind;
  copyOverrides: Partial<Record<CrowStoryChapterKey, CrowStoryVariantCopy>>;
};

export type CrowStoryDefinition = {
  version: string;
  chapters: CrowStoryChapter[];
  variants: Record<JourneyKind, CrowStoryVariant>;
};

export type CrowStorySession = {
  journey: JourneyKind | null;
  committed: boolean;
  chapterIndex: number;
};

export type CrowStoryDecision = {
  softJourney: JourneyKind | null;
  committed: boolean;
};

export type CrowAccessibilitySummary = {
  chapterKey: CrowStoryChapterKey;
  plainSummary: string;
};
