/** CROW.STORY.VISUAL.1 — deterministic visual state projection (pure, side-effect free). */

import { CROW_STORY_CHAPTER_ORDER, chapterIndex, effectiveChapterProgress } from "./chapter-order";
import {
  applyEasing,
  interpolatePosition,
  progressInRange,
  quadraticBezierPoint,
  sampleWorkflowPath,
  STORY_WORKFLOW_PATH_D,
} from "./interpolation";
import type {
  CrowDeviceMode,
  CrowMapEdge,
  CrowMapNode,
  CrowMotionMode,
  CrowStoryChapterKey,
  CrowVisualState,
  CrowWatchPoint,
  JourneyKind,
  ProjectCrowStoryInput,
  SareaRoleLens,
  StoryProgressMap,
} from "./types";

export const STORY_VIEWBOX = { width: 1200, height: 800 } as const;

const OUTCOME: CrowMapNode = {
  id: "outcome",
  kind: "OUTCOME",
  x: 600,
  y: 300,
  opacity: 0,
  scale: 1,
};

function simplified(deviceMode: CrowDeviceMode): boolean {
  return deviceMode === "COMPACT" || deviceMode === "IPAD_PORTRAIT";
}

function buildNewPathNodes(emphasis: number, sparse: boolean): CrowMapNode[] {
  const e = Math.max(0, Math.min(1, emphasis));
  const nodes: CrowMapNode[] = [
    { id: "new-purpose", kind: "PATH_NEW", x: 280, y: 400, opacity: 0.3 + e * 0.6, scale: 1 + e * 0.02, emphasis: e > 0.5, label: sparse ? undefined : "Purpose" },
    { id: "new-a", kind: "PATH_NEW", x: 320, y: 460, opacity: 0.25 + e * 0.55, scale: 1, emphasis: e > 0.5 },
    { id: "new-b", kind: "PATH_NEW", x: 360, y: 520, opacity: 0.2 + e * 0.5, scale: 1, emphasis: e > 0.55 },
  ];
  if (!sparse) {
    nodes.push({ id: "new-c", kind: "PATH_NEW", x: 300, y: 540, opacity: 0.15 + e * 0.45, scale: 1, emphasis: e > 0.6 });
  }
  return nodes;
}

function buildTransformPathNodes(emphasis: number, sparse: boolean): CrowMapNode[] {
  const e = Math.max(0, Math.min(1, emphasis));
  const nodes: CrowMapNode[] = [
    { id: "tx-a", kind: "PATH_TRANSFORM", x: 820, y: 360, opacity: 0.5 + e * 0.4, scale: 1, emphasis: e > 0.5 },
    { id: "tx-b", kind: "PATH_TRANSFORM", x: 880, y: 420, opacity: 0.45 + e * 0.45, scale: 1, emphasis: e > 0.5 },
    { id: "tx-c", kind: "PATH_TRANSFORM", x: 840, y: 480, opacity: 0.4 + e * 0.45, scale: 1, emphasis: e > 0.5 },
    { id: "tx-friction-1", kind: "FRICTION", x: 860, y: 400, opacity: e * 0.85, scale: 1, emphasis: e > 0.5 },
    { id: "tx-friction-2", kind: "FRICTION", x: 900, y: 460, opacity: e * 0.75, scale: 1, emphasis: e > 0.55 },
  ];
  if (!sparse) {
    nodes.push({ id: "tx-d", kind: "PATH_TRANSFORM", x: 920, y: 500, opacity: 0.35 + e * 0.45, scale: 1, emphasis: e > 0.5 });
  }
  return nodes;
}

function buildTransformEdges(emphasis: number): CrowMapEdge[] {
  const o = 0.2 + emphasis * 0.5;
  return [
    { id: "te1", x1: 820, y1: 360, x2: 880, y2: 420, kind: "PATH", opacity: o },
    { id: "te2", x1: 880, y1: 420, x2: 840, y2: 480, kind: "PATH", opacity: o },
    { id: "te3", x1: 880, y1: 420, x2: 860, y2: 400, kind: "FRICTION", opacity: emphasis * 0.65, dashed: true },
    { id: "te4", x1: 840, y1: 480, x2: 900, y2: 460, kind: "PATH", opacity: o * 0.85, dashed: emphasis > 0.5 },
  ];
}

function projectIdea(p: number, motionMode: CrowMotionMode): Partial<CrowVisualState> {
  const atmosphere = progressInRange(p, 0, 0.18);
  const outcomeOpacity = progressInRange(p, 0.18, 0.32);
  const ringOpacity = progressInRange(p, 0.32, 0.5);
  const enterT = progressInRange(p, 0.5, 0.72);
  const landT = progressInRange(p, 0.72, 0.86);
  const gridOpacity = progressInRange(p, 0.86, 1) * 0.12;

  let crowX = 1080;
  let crowY = 380;
  let crowPose: CrowVisualState["crowPose"] = "hidden";
  let crowOpacity = 0;
  let wingAdjust = 0;

  if (motionMode === "REDUCED" || motionMode === "STATIC") {
    crowX = 780;
    crowY = 380;
    crowPose = "perched";
    crowOpacity = 1;
  } else if (enterT > 0 && enterT < 1) {
    const eased = applyEasing(enterT, "easeOut");
    const pt = quadraticBezierPoint(
      eased,
      { x: 1080, y: 380 },
      { x: 940, y: 300 },
      { x: 780, y: 360 },
    );
    crowX = pt.x;
    crowY = pt.y;
    crowPose = "entering";
    crowOpacity = Math.min(1, eased * 1.2);
    wingAdjust = Math.sin(eased * Math.PI) * 0.15;
  } else if (landT > 0 || enterT >= 1) {
    const t = enterT >= 1 ? landT : 0;
    crowX = 780 + (1 - t) * 20;
    crowY = 360 + t * 20;
    crowPose = t >= 0.95 ? "perched" : "entering";
    crowOpacity = 1;
    wingAdjust = (1 - t) * 0.08;
  }

  return {
    atmosphereOpacity: 0.4 + atmosphere * 0.6,
    gridOpacity,
    outcomeRingOpacity: ringOpacity * 0.35,
    nodes: [{ ...OUTCOME, opacity: outcomeOpacity, scale: 0.85 + outcomeOpacity * 0.15 }],
    edges: [],
    crowPose,
    crowX,
    crowY,
    crowScale: 1.15,
    crowRotation: -2 + enterT * 2,
    crowHeadRotation: 0,
    crowOpacity,
    crowWingAdjust: wingAdjust,
    newPathEmphasis: 0,
    transformPathEmphasis: 0,
  };
}

function projectChoice(
  p: number,
  journey: JourneyKind | null,
  sparse: boolean,
): Partial<CrowVisualState> {
  if (p <= 0) return {};
  const newE =
    journey === "NEW" ? 0.92 : journey === "TRANSFORM" ? 0.32 : 0.35 + progressInRange(p, 0.2, 0.6) * 0.08;
  const transformE =
    journey === "TRANSFORM" ? 0.92 : journey === "NEW" ? 0.32 : 0.35 + progressInRange(p, 0.2, 0.6) * 0.08;

  const headTilt = journey === "NEW" ? -4 : journey === "TRANSFORM" ? 4 : 0;
  const pose =
    journey === "NEW"
      ? "observing-new"
      : journey === "TRANSFORM"
        ? "observing-transform"
        : "center-choice";

  return {
    gridOpacity: 0.1,
    nodes: [
      { ...OUTCOME, opacity: 1, scale: 1 },
      ...buildNewPathNodes(newE, sparse),
      ...buildTransformPathNodes(transformE, sparse),
    ],
    edges: buildTransformEdges(transformE),
    crowPose: pose,
    crowX: 600,
    crowY: 400,
    crowScale: 1.1,
    crowRotation: headTilt * 0.5,
    crowHeadRotation: headTilt,
    crowOpacity: 1,
    crowWingAdjust: 0,
    newPathEmphasis: newE,
    transformPathEmphasis: transformE,
    outcomeRingOpacity: 0.2,
  };
}

const SIGNAL_DEFS: Array<{ id: string; label: string; x: number; y: number; start: number; end: number }> = [
  { id: "sig-field", label: "Field", x: 340, y: 340, start: 0, end: 0.16 },
  { id: "sig-purpose", label: "Purpose", x: 480, y: 280, start: 0.16, end: 0.32 },
  { id: "sig-scale", label: "Scale", x: 600, y: 260, start: 0.32, end: 0.48 },
  { id: "sig-situation", label: "Situation", x: 720, y: 300, start: 0.48, end: 0.64 },
  { id: "sig-constraint", label: "Constraints", x: 820, y: 380, start: 0.64, end: 0.8 },
];

function projectSignals(
  p: number,
  journey: JourneyKind | null,
  motionMode: CrowMotionMode,
  sparse: boolean,
): Partial<CrowVisualState> {
  if (p <= 0) return {};
  const nodes: CrowMapNode[] = [{ ...OUTCOME, opacity: 1, scale: 1 }];
  const edges: CrowMapEdge[] = [];
  let activeIdx = 0;

  for (let i = 0; i < SIGNAL_DEFS.length; i++) {
    const sig = SIGNAL_DEFS[i]!;
    const opacity = progressInRange(p, sig.start, sig.end);
    const emphasize =
      journey === "NEW"
        ? sig.id === "sig-purpose" || sig.id === "sig-scale"
        : journey === "TRANSFORM"
          ? sig.id === "sig-situation" || sig.id === "sig-constraint"
          : false;
    if (opacity > 0.05) activeIdx = i;
    if (sparse && i > 2 && opacity < 0.5) continue;
    nodes.push({
      id: sig.id,
      kind: "SIGNAL",
      x: sig.x,
      y: sig.y,
      label: sparse ? undefined : sig.label,
      opacity: opacity * (emphasize ? 1 : 0.75),
      scale: 0.9 + opacity * 0.15,
      emphasis: emphasize && opacity > 0.6,
    });
    if (i > 0 && opacity > 0.2) {
      const prev = SIGNAL_DEFS[i - 1]!;
      edges.push({
        id: `se-${i}`,
        x1: prev.x,
        y1: prev.y,
        x2: sig.x,
        y2: sig.y,
        kind: "STRUCTURAL",
        opacity: opacity * 0.5,
      });
    }
  }

  const coreProgress = progressInRange(p, 0.8, 1);
  const activeIdxSafe = activeIdx;
  const crowPos =
    motionMode === "REDUCED" || motionMode === "STATIC"
      ? { x: 600, y: 340 }
      : interpolatePosition(p, [
          { at: 0, value: { x: 720, y: 360 } },
          { at: 0.32, value: { x: 520, y: 320 } },
          { at: 0.64, value: { x: 680, y: 300 } },
          { at: 1, value: { x: 600, y: 340 } },
        ]);

  return {
    signalCoreProgress: coreProgress,
    gridOpacity: 0.1 + coreProgress * 0.04,
    nodes,
    edges,
    crowPose: "signal-travel",
    crowX: crowPos.x,
    crowY: crowPos.y,
    crowScale: 1.05,
    crowOpacity: 1,
    crowRotation: 0,
    crowHeadRotation: activeIdxSafe % 2 === 0 ? -3 : 3,
    outcomeRingOpacity: 0.15 + coreProgress * 0.2,
  };
}

function projectPeople(p: number, sparse: boolean): Partial<CrowVisualState> {
  if (p <= 0) return {};
  const personOpacity = progressInRange(p, 0, 0.2);
  const titleOpacity = progressInRange(p, 0.2, 0.4);
  const roleOpacity = progressInRange(p, 0.4, 0.6);
  const personaOpacity = progressInRange(p, 0.6, 0.8);
  const connectOpacity = progressInRange(p, 0.8, 1);

  const nodes: CrowMapNode[] = [
    { id: "person", kind: "PERSONA", x: 520, y: 380, opacity: personOpacity, scale: 1, label: sparse ? undefined : "Person" },
    { id: "job-title", kind: "JOB_TITLE", x: 520, y: 320, opacity: titleOpacity, scale: 1, label: sparse ? undefined : "Job Title" },
    { id: "auth-role", kind: "AUTHORIZED_ROLE", x: 620, y: 360, opacity: roleOpacity, scale: 1, label: sparse ? undefined : "Authorized Role" },
    { id: "work-persona", kind: "WORK_PERSONA", x: 680, y: 420, opacity: personaOpacity, scale: 1 + personaOpacity * 0.04, emphasis: personaOpacity > 0.5, label: sparse ? undefined : "Work Persona" },
  ];

  const edges: CrowMapEdge[] = [
    { id: "pe1", x1: 520, y1: 380, x2: 520, y2: 320, kind: "RESPONSIBILITY", opacity: titleOpacity * 0.6 },
    { id: "pe2", x1: 520, y1: 380, x2: 620, y2: 360, kind: "RESPONSIBILITY", opacity: roleOpacity * 0.6 },
    { id: "pe3", x1: 620, y1: 360, x2: 680, y2: 420, kind: "RESPONSIBILITY", opacity: personaOpacity * 0.7 },
    { id: "pe4", x1: 520, y1: 380, x2: 680, y2: 420, kind: "RESPONSIBILITY", opacity: connectOpacity * 0.5, dashed: true },
  ];

  return {
    nodes,
    edges,
    crowPose: "persona-observer",
    crowX: 560,
    crowY: 280,
    crowScale: 1.1,
    crowOpacity: 0.95 + personaOpacity * 0.05,
    crowRotation: -2,
    crowHeadRotation: -5,
    gridOpacity: 0.12,
  };
}

function projectWork(p: number, motionMode: CrowMotionMode, sparse: boolean): Partial<CrowVisualState> {
  if (p <= 0) return {};
  const trigger = progressInRange(p, 0, 0.12);
  const stages = progressInRange(p, 0.12, 0.45);
  const route = progressInRange(p, 0.45, 0.72);
  const decision = progressInRange(p, 0.6, 0.78);
  const evidence = progressInRange(p, 0.72, 0.88);
  const outcome = progressInRange(p, 0.85, 1);
  const capability = progressInRange(p, 0.55, 1);

  const nodes: CrowMapNode[] = [
    { id: "wf-trigger", kind: "TRIGGER", x: 360, y: 520, opacity: trigger, scale: 1, label: sparse ? undefined : "Trigger" },
    { id: "wf-decision", kind: "DECISION", x: 600, y: 420, opacity: decision, scale: 1, label: sparse ? undefined : "Decision" },
    { id: "wf-evidence", kind: "EVIDENCE", x: 720, y: 440, opacity: evidence, scale: 1, label: sparse ? undefined : "Evidence" },
    { id: "wf-outcome", kind: "OUTCOME", x: 840, y: 380, opacity: outcome, scale: 1, label: sparse ? undefined : "Outcome" },
  ];

  if (!sparse) {
    nodes.push(
      { id: "wf-r1", kind: "WORKFLOW", x: 480, y: 460, opacity: stages, scale: 1 },
      { id: "wf-r2", kind: "WORKFLOW", x: 720, y: 400, opacity: stages * 0.9, scale: 1 },
    );
  }

  const capNodes: CrowMapNode[] = [
    { id: "cap-1", kind: "CAPABILITY", x: 440, y: 580, opacity: capability * 0.7, scale: 1 },
    { id: "cap-2", kind: "CAPABILITY", x: 600, y: 600, opacity: capability * 0.8, scale: 1 },
    { id: "cap-3", kind: "CAPABILITY", x: 760, y: 580, opacity: capability * 0.7, scale: 1 },
  ];

  const crowPos =
    motionMode === "REDUCED" || motionMode === "STATIC"
      ? sampleWorkflowPath(0.85)
      : sampleWorkflowPath(route);

  return {
    nodes: [...nodes, ...capNodes],
    edges: [],
    workflowPathProgress: route,
    workflowPathD: STORY_WORKFLOW_PATH_D,
    capabilityOpacity: capability * 0.65,
    crowPose: "workflow-trace",
    crowX: crowPos.x,
    crowY: crowPos.y - 40,
    crowScale: 0.95,
    crowOpacity: 0.9 + route * 0.1,
    crowRotation: 3,
    crowHeadRotation: 2,
    gridOpacity: 0.12,
  };
}

const WATCH_DEFS: Array<{ id: string; type: CrowWatchPoint["type"]; x: number; y: number; start: number }> = [
  { id: "w-identity", type: "identity", x: 380, y: 260, start: 0.05 },
  { id: "w-approval", type: "approval", x: 520, y: 240, start: 0.12 },
  { id: "w-boundary", type: "boundary", x: 660, y: 250, start: 0.19 },
  { id: "w-sod", type: "sod", x: 780, y: 280, start: 0.26 },
  { id: "w-audit", type: "audit", x: 860, y: 340, start: 0.33 },
  { id: "w-risk", type: "risk", x: 720, y: 380, start: 0.4 },
];

function lensFromProgress(p: number): SareaRoleLens {
  if (p < 0.42) return "unified";
  if (p < 0.52) return "executive";
  if (p < 0.62) return "manager";
  if (p < 0.72) return "specialist";
  if (p < 0.82) return "frontline";
  if (p < 0.9) return "analyst";
  return "unified";
}

function projectTrust(p: number, sparse: boolean): Partial<CrowVisualState> {
  if (p <= 0) return {};
  const trustPhase = Math.min(1, p / 0.42);
  const sareaPhase = progressInRange(p, 0.38, 0.88);
  const blueprintPhase = progressInRange(p, 0.72, 1);

  const watchPoints: CrowWatchPoint[] = WATCH_DEFS.map((w) => ({
    id: w.id,
    type: w.type,
    x: w.x,
    y: w.y,
    opacity: progressInRange(trustPhase, w.start, w.start + 0.12) * 0.85,
  }));

  const lens = lensFromProgress(p);
  const labels = sparse
    ? []
    : [
        { id: "bl-work", text: "Work", x: 200, y: 160, opacity: blueprintPhase * 0.8 },
        { id: "bl-people", text: "People", x: 200, y: 220, opacity: blueprintPhase * 0.75 },
        { id: "bl-trust", text: "Trust", x: 200, y: 280, opacity: blueprintPhase * 0.7 },
        { id: "bl-cap", text: "Capabilities", x: 200, y: 340, opacity: blueprintPhase * 0.65 },
      ];

  return {
    watchPoints,
    sareaLens: lens,
    sareaLensOpacity: sareaPhase > 0 ? 0.35 + sareaPhase * 0.4 : 0,
    blueprintProgress: blueprintPhase,
    blueprintFrame: blueprintPhase > 0.15 ? (blueprintPhase > 0.85 ? "complete" : "forming") : "none",
    blueprintLabels: labels,
    crowPose: "blueprint-observer",
    crowX: 980,
    crowY: 200,
    crowScale: 0.75,
    crowOpacity: 0.55 + (1 - blueprintPhase) * 0.25,
    crowRotation: 0,
    crowHeadRotation: 0,
    gridOpacity: 0.14,
    caption: blueprintPhase > 0.7 ? "Your operating model, ready to review." : undefined,
  };
}

function projectRuntime(p: number, sparse: boolean): Partial<CrowVisualState> {
  if (p <= 0) return {};
  const shell = progressInRange(p, 0, 0.2);
  const active = progressInRange(p, 0.2, 0.55);
  const items = progressInRange(p, 0.45, 1);

  const runtimeItems = [
    { id: "rt-attn", kind: "attention" as const, x: 420, y: 320, opacity: progressInRange(items, 0, 0.2) },
    { id: "rt-dec", kind: "decision" as const, x: 560, y: 300, opacity: progressInRange(items, 0.15, 0.35) },
    { id: "rt-block", kind: "blocked" as const, x: 680, y: 340, opacity: progressInRange(items, 0.3, 0.5) },
    { id: "rt-ev", kind: "evidence" as const, x: 760, y: 400, opacity: progressInRange(items, 0.45, 0.65) },
    { id: "rt-out", kind: "outcome" as const, x: 600, y: 260, opacity: progressInRange(items, 0.6, 0.85) },
  ].filter((it) => !sparse || it.id === "rt-attn" || it.id === "rt-out");

  return {
    blueprintFrame: shell > 0.1 ? "complete" : "forming",
    blueprintProgress: 1,
    runtimeActivity: active > 0.3,
    runtimeItems,
    workflowPathProgress: 1,
    workflowPathD: STORY_WORKFLOW_PATH_D,
    crowPose: "runtime-glyph",
    crowX: 1080,
    crowY: 680,
    crowScale: 0.32,
    crowOpacity: 0.7 + items * 0.25,
    crowRotation: 0,
    crowHeadRotation: 0,
    gridOpacity: 0.1,
    capabilityOpacity: 0.5,
  };
}

function mergeNodes(existing: CrowMapNode[], incoming: CrowMapNode[]): CrowMapNode[] {
  const map = new Map(existing.map((n) => [n.id, n]));
  for (const n of incoming) {
    const prev = map.get(n.id);
    if (!prev || n.opacity > prev.opacity) map.set(n.id, n);
    else map.set(n.id, { ...prev, opacity: Math.max(prev.opacity, n.opacity) });
  }
  return [...map.values()];
}

function mergeEdges(existing: CrowMapEdge[], incoming: CrowMapEdge[]): CrowMapEdge[] {
  const map = new Map(existing.map((e) => [e.id, e]));
  for (const e of incoming) {
    const prev = map.get(e.id);
    if (!prev || e.opacity > prev.opacity) map.set(e.id, e);
  }
  return [...map.values()];
}

function mergeWatch(existing: CrowWatchPoint[], incoming: CrowWatchPoint[]): CrowWatchPoint[] {
  const map = new Map(existing.map((w) => [w.id, w]));
  for (const w of incoming) {
    const prev = map.get(w.id);
    if (!prev || w.opacity > prev.opacity) map.set(w.id, w);
  }
  return [...map.values()];
}

export function projectFullStoryState(input: ProjectCrowStoryInput): CrowVisualState {
  const { progressByChapter, activeChapterKey, journey, deviceMode, motionMode } = input;
  const sparse = simplified(deviceMode);
  const motion =
    deviceMode === "REDUCED_MOTION" || motionMode === "REDUCED" ? "REDUCED" : motionMode;

  const eff = (key: CrowStoryChapterKey) =>
    effectiveChapterProgress(key, activeChapterKey, progressByChapter);

  const patches = [
    projectIdea(eff("idea"), motion),
    projectChoice(eff("choice"), journey, sparse),
    projectSignals(eff("signals"), journey, motion, sparse),
    projectPeople(eff("people"), sparse),
    projectWork(eff("work"), motion, sparse),
    projectTrust(eff("trust"), sparse),
    projectRuntime(eff("runtime"), sparse),
  ];

  let nodes: CrowMapNode[] = [];
  let edges: CrowMapEdge[] = [];
  let watchPoints: CrowWatchPoint[] = [];
  let merged: Partial<CrowVisualState> = {
    atmosphereOpacity: 0,
    gridOpacity: 0,
    outcomeRingOpacity: 0,
    workflowPathProgress: 0,
    workflowPathD: STORY_WORKFLOW_PATH_D,
    capabilityOpacity: 0,
    blueprintProgress: 0,
    blueprintFrame: "none",
    blueprintLabels: [],
    runtimeActivity: false,
    runtimeItems: [],
    signalCoreProgress: 0,
    watchPoints: [],
    sareaLens: "unified",
    sareaLensOpacity: 0,
    crowPose: "hidden",
    crowX: 600,
    crowY: 400,
    crowScale: 1,
    crowRotation: 0,
    crowHeadRotation: 0,
    crowOpacity: 0,
    crowWingAdjust: 0,
    newPathEmphasis: 0,
    transformPathEmphasis: 0,
  };

  for (const patch of patches) {
    if (patch.nodes) nodes = mergeNodes(nodes, patch.nodes);
    if (patch.edges) edges = mergeEdges(edges, patch.edges);
    if (patch.watchPoints) watchPoints = mergeWatch(watchPoints, patch.watchPoints);
    merged = { ...merged, ...patch, nodes, edges, watchPoints };
  }

  const activeIdx = chapterIndex(activeChapterKey);
  const activeEff = eff(activeChapterKey);
  let crowPatch: Partial<CrowVisualState> = patches[activeIdx] ?? {};
  if (activeEff <= 0) {
    for (let i = activeIdx - 1; i >= 0; i--) {
      const key = CROW_STORY_CHAPTER_ORDER[i]!;
      if (eff(key) > 0) {
        crowPatch = patches[i] ?? {};
        break;
      }
    }
  }

  const activeProgress = eff(activeChapterKey);

  return {
    chapterKey: activeChapterKey,
    chapterProgress: activeProgress,
    atmosphereOpacity: merged.atmosphereOpacity ?? 0.5,
    gridOpacity: merged.gridOpacity ?? 0.08,
    nodes,
    edges,
    watchPoints,
    sareaLens: merged.sareaLens ?? "unified",
    sareaLensOpacity: merged.sareaLensOpacity ?? 0,
    workflowPathProgress: merged.workflowPathProgress ?? 0,
    workflowPathD: merged.workflowPathD ?? STORY_WORKFLOW_PATH_D,
    capabilityOpacity: merged.capabilityOpacity ?? 0,
    blueprintProgress: merged.blueprintProgress ?? 0,
    blueprintFrame: merged.blueprintFrame ?? "none",
    blueprintLabels: merged.blueprintLabels ?? [],
    runtimeActivity: merged.runtimeActivity ?? false,
    runtimeItems: merged.runtimeItems ?? [],
    signalCoreProgress: merged.signalCoreProgress ?? 0,
    outcomeRingOpacity: merged.outcomeRingOpacity ?? 0,
    crowPose: crowPatch.crowPose ?? merged.crowPose ?? "perched",
    crowX: crowPatch.crowX ?? merged.crowX ?? 600,
    crowY: crowPatch.crowY ?? merged.crowY ?? 400,
    crowScale: crowPatch.crowScale ?? merged.crowScale ?? 1,
    crowRotation: crowPatch.crowRotation ?? merged.crowRotation ?? 0,
    crowHeadRotation: crowPatch.crowHeadRotation ?? merged.crowHeadRotation ?? 0,
    crowOpacity: crowPatch.crowOpacity ?? merged.crowOpacity ?? 1,
    crowWingAdjust: crowPatch.crowWingAdjust ?? merged.crowWingAdjust ?? 0,
    newPathEmphasis: merged.newPathEmphasis ?? 0,
    transformPathEmphasis: merged.transformPathEmphasis ?? 0,
    caption: merged.caption,
  };
}

export function projectCrowStoryState(
  args:
    | ProjectCrowStoryInput
    | {
        chapterKey: CrowStoryChapterKey;
        chapterProgress: number;
        journey: JourneyKind | null;
        deviceMode: CrowDeviceMode;
        motionMode: CrowMotionMode;
      },
): CrowVisualState {
  if ("progressByChapter" in args) {
    return projectFullStoryState(args);
  }
  const progressByChapter: StoryProgressMap = { [args.chapterKey]: args.chapterProgress };
  return projectFullStoryState({
    progressByChapter,
    activeChapterKey: args.chapterKey,
    journey: args.journey,
    deviceMode: args.deviceMode,
    motionMode: args.motionMode,
  });
}

export function motionModeFromPreference(
  prefersReducedMotion: boolean,
  manualReduced: boolean,
): CrowMotionMode {
  if (prefersReducedMotion || manualReduced) return "REDUCED";
  return "FULL";
}

export function isCrowVisible(state: CrowVisualState): boolean {
  return state.crowOpacity > 0.05 && state.crowPose !== "hidden";
}

export function isCrowGlyphPhase(chapterKey: CrowStoryChapterKey, progress: number): boolean {
  if (chapterKey === "runtime") return progress > 0.15;
  if (chapterKey === "trust") return progress > 0.88;
  return false;
}
