import type {
  CrowprintConfidence,
  CrowprintSnapshot,
  EmittedSignal,
  MissionRunState,
} from "./types";

/** Forbidden Crowprint inputs — must never influence calculation. */
export const CROWPRINT_DENYLIST = [
  "origin",
  "nestScore",
  "region",
  "nationality",
  "age",
  "gender",
  "health",
  "disability",
  "trust",
  "payment",
  "plan",
  "meritAccess",
  "popularity",
  "leaderboard",
  "socialGraph",
  "privateMessages",
  "deviceFingerprint",
  "rawUploads",
  "secrets",
  "credentials",
] as const;

export type CrowprintInputBag = {
  signals: readonly EmittedSignal[];
  outcomeId: string | null;
  reflectionTag?: "OPERATE" | "BUILD" | "UNSURE";
  /** Any extra bag is scanned for denylist keys. */
  extras?: Record<string, unknown>;
};

export function assertCrowprintInputsSafe(bag: Record<string, unknown>): void {
  for (const key of CROWPRINT_DENYLIST) {
    if (
      Object.prototype.hasOwnProperty.call(bag, key) &&
      bag[key] !== undefined
    ) {
      throw new Error(`FORBIDDEN_INPUT: Crowprint denies ${key}`);
    }
  }
}

function familyScore(signals: readonly EmittedSignal[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of signals) {
    const delta =
      s.direction === "SUPPORTING"
        ? s.strength
        : s.direction === "CONFLICTING"
          ? -s.strength
          : 0;
    map.set(s.family, (map.get(s.family) ?? 0) + delta);
  }
  return map;
}

function confidenceFor(
  signalCount: number,
  diversity: number,
): CrowprintConfidence {
  if (signalCount < 4 || diversity < 2) return "INSUFFICIENT";
  if (signalCount < 10 || diversity < 4) return "EMERGING";
  return "DEVELOPING"; // never CONSISTENT+ from one Mission
}

export function computeCrowprint(
  run: MissionRunState,
  input: CrowprintInputBag,
): CrowprintSnapshot {
  assertCrowprintInputsSafe({
    ...(input.extras ?? {}),
    // Explicitly only allowlisted fields are read below.
  });

  const signals = input.signals;
  const scores = familyScore(signals);
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const strengths = ranked
    .filter(([, v]) => v > 0)
    .slice(0, 3)
    .map(([k]) => k);
  const weak = ranked
    .filter(([, v]) => v < 0)
    .slice(0, 2)
    .map(([k]) => k);
  const diversity = new Set(signals.map((s) => s.family)).size;

  const operateTilt = signals.filter((s) => s.horizon === "OPERATE").length;
  const buildTilt = signals.filter((s) => s.horizon === "BUILD").length;
  let emerging =
    buildTilt > operateTilt + 2
      ? "BUILD_STRUCTURE_PATTERN"
      : operateTilt > buildTilt + 2
        ? "OPERATE_RECOVERY_PATTERN"
        : "MIXED_INCIDENT_RESPONSE";
  if (input.reflectionTag === "OPERATE") emerging = "OPERATE_RECOVERY_PATTERN";
  if (input.reflectionTag === "BUILD") emerging = "BUILD_STRUCTURE_PATTERN";

  const topSupporting = signals
    .filter((s) => s.direction === "SUPPORTING")
    .slice(-5)
    .map((s) => ({
      nodeId: s.sourceNodeId,
      choiceId: s.sourceChoiceId,
      family: s.family,
    }));

  const conf = confidenceFor(signals.length, diversity);

  return {
    rulesetVersion: run.rulesetVersion,
    confidence: conf,
    observedStrengths: strengths,
    emergingPattern: emerging,
    developmentArea: weak[0] ?? "UNCERTAINTY_HANDLING",
    topSupportingDecisions: topSupporting,
    contradictions: weak,
    explanationAr:
      "بصمة غراب مؤقتة من إشارات هذه الرحلة فقط — ليست إتقاناً وليست سلالة مكتسبة.",
    explanationEn:
      "Provisional Crowprint from this flight's signals only — not Mastery, not Earned Lineage.",
    correctionRoute: "SETTINGS_CORRECTION_CROWPRINT",
  };
}
