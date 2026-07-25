import type {
  CrowprintSnapshot,
  FlightLogEntry,
  LineageSuggestion,
  MissionRunState,
  RouteRecommendation,
} from "./types";
import { bandLabel } from "./hash";

export function buildFlightLog(args: {
  run: MissionRunState;
  crowprint: CrowprintSnapshot;
  suggestion: LineageSuggestion | null;
  reflection: string | null;
  recommendedRouteId: string | null;
  completedAtIso: string | null;
}): FlightLogEntry {
  const w = args.run.world;
  return {
    missionId: args.run.missionId,
    missionVersion: args.run.missionVersion,
    completedAtIso: args.completedAtIso,
    majorDecisions: args.run.choiceHistory.map((c) => ({
      nodeId: c.nodeId,
      choiceId: c.choiceId,
    })),
    majorConsequences: [
      `SERVICE_HEALTH:${bandLabel(w.SERVICE_HEALTH)}`,
      `EVIDENCE_INTEGRITY:${bandLabel(w.EVIDENCE_INTEGRITY)}`,
      `RISK_EXPOSURE:${bandLabel(w.RISK_EXPOSURE)}`,
      `TECHNICAL_DEBT:${bandLabel(w.TECHNICAL_DEBT)}`,
    ],
    outcomeId: args.run.outcomeId,
    signalFamilies: [...new Set(args.run.signals.map((s) => s.family))],
    crowprintSummary: `${args.crowprint.confidence}:${args.crowprint.emergingPattern}`,
    suggestionSummary: args.suggestion
      ? `${args.suggestion.lineageId}:${args.suggestion.status}`
      : "NONE",
    unresolvedUncertainty: args.crowprint.contradictions.join(",") || "NONE",
    reflection: args.reflection,
    recommendedRouteId: args.recommendedRouteId,
    echoAvailable:
      args.run.kind === "CANONICAL" && args.run.status === "COMPLETED",
  };
}

export function recommendRoute(args: {
  outcomeId: string | null;
  crowprint: CrowprintSnapshot;
  interestHint?: "OPERATE" | "BUILD" | "UNSURE";
}): RouteRecommendation {
  const ops =
    args.interestHint === "OPERATE" ||
    args.crowprint.emergingPattern.startsWith("OPERATE");
  const recommended = ops
    ? "ROUTE_OPERATE_INCIDENT_BASICS"
    : "ROUTE_BUILD_SYSTEMS_BASICS";
  const alternative = ops
    ? "ROUTE_BUILD_SYSTEMS_BASICS"
    : "ROUTE_OPERATE_INCIDENT_BASICS";
  return {
    recommendedRouteId: recommended,
    explanationAr:
      "توصية إرشادية قابلة للتجاوز — ليست قدراً مهنياً وليست تسجيلاً صامتاً.",
    explanationEn:
      "Advisory and overridable — not career destiny; no silent enrollment.",
    alternativeRouteId: alternative,
    overridable: true,
    enrolled: false,
  };
}

export function forkEchoRun(args: {
  canonical: MissionRunState;
  templateEntryWorld: MissionRunState["world"];
  echoRunId: string;
  forkNodeId: string;
  /** Snapshot world/hash/history up to but not including fork node choice. */
  snapshot: {
    world: MissionRunState["world"];
    worldHash: string;
    choiceHistory: MissionRunState["choiceHistory"];
    signals: MissionRunState["signals"];
    version: number;
  };
}): MissionRunState {
  if (
    args.canonical.status !== "COMPLETED" ||
    args.canonical.kind !== "CANONICAL"
  ) {
    throw new Error("FORBIDDEN: Echo requires completed canonical run");
  }
  return {
    runId: args.echoRunId,
    learnerRef: args.canonical.learnerRef,
    missionId: args.canonical.missionId,
    missionVersion: args.canonical.missionVersion,
    rulesetVersion: args.canonical.rulesetVersion,
    kind: "ECHO",
    status: "IN_PROGRESS",
    currentNodeId: args.forkNodeId,
    world: { ...args.snapshot.world },
    worldHash: args.snapshot.worldHash,
    signals: [...args.snapshot.signals],
    choiceHistory: [...args.snapshot.choiceHistory],
    outcomeId: null,
    parentRunId: args.canonical.runId,
    echoForkNodeId: args.forkNodeId,
    version: args.snapshot.version,
  };
}
