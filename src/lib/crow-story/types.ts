/** CROW.STORY — Architect's Map story types (no database enums). */

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
  | "perched"
  | "perch"
  | "observing-new"
  | "observing-transform"
  | "observer"
  | "center-choice"
  | "signal-travel"
  | "signal-hop"
  | "persona-observer"
  | "land-personas"
  | "workflow-trace"
  | "trust-sentinel"
  | "trust-silhouette"
  | "blueprint-observer"
  | "runtime-glyph"
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
  | "JOB_TITLE"
  | "AUTHORIZED_ROLE"
  | "WORK_PERSONA"
  | "WORKFLOW"
  | "TRIGGER"
  | "DECISION"
  | "EVIDENCE"
  | "CAPABILITY"
  | "WATCH"
  | "ATTENTION"
  | "BLOCKED"
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
  kind: "STRUCTURAL" | "WORKFLOW" | "FRICTION" | "PATH" | "RESPONSIBILITY";
  opacity: number;
  dashed?: boolean;
  drawProgress?: number;
};

export type CrowWatchPoint = {
  id: string;
  type: "identity" | "approval" | "boundary" | "sod" | "audit" | "risk";
  x: number;
  y: number;
  opacity: number;
};

export type SareaRoleLens =
  | "unified"
  | "executive"
  | "manager"
  | "specialist"
  | "frontline"
  | "analyst";

export type CrowRuntimeItem = {
  id: string;
  kind: "attention" | "decision" | "blocked" | "evidence" | "outcome";
  x: number;
  y: number;
  opacity: number;
};

export type CrowVisualState = {
  chapterKey: CrowStoryChapterKey;
  chapterProgress: number;
  atmosphereOpacity: number;
  gridOpacity: number;
  nodes: CrowMapNode[];
  edges: CrowMapEdge[];
  watchPoints: CrowWatchPoint[];
  sareaLens: SareaRoleLens;
  sareaLensOpacity: number;
  workflowPathProgress: number;
  workflowPathD: string;
  capabilityOpacity: number;
  blueprintProgress: number;
  blueprintFrame: "none" | "forming" | "complete";
  blueprintLabels: Array<{ id: string; text: string; x: number; y: number; opacity: number }>;
  runtimeActivity: boolean;
  runtimeItems: CrowRuntimeItem[];
  signalCoreProgress: number;
  outcomeRingOpacity: number;
  crowPose: CrowCrowPose;
  crowX: number;
  crowY: number;
  crowScale: number;
  crowRotation: number;
  crowHeadRotation: number;
  crowOpacity: number;
  crowWingAdjust: number;
  newPathEmphasis: number;
  transformPathEmphasis: number;
  caption?: string;
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

export type StoryProgressMap = Partial<Record<CrowStoryChapterKey, number>>;

export type ProjectCrowStoryInput = {
  progressByChapter: StoryProgressMap;
  activeChapterKey: CrowStoryChapterKey;
  journey: JourneyKind | null;
  deviceMode: CrowDeviceMode;
  motionMode: CrowMotionMode;
};

/** Legacy single-chapter projection input (tests). */
export type LegacyProjectInput = {
  chapterKey: CrowStoryChapterKey;
  chapterProgress: number;
  journey: JourneyKind | null;
  deviceMode: CrowDeviceMode;
  motionMode: CrowMotionMode;
};
