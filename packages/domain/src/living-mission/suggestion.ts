import type {
  CrowprintSnapshot,
  EmittedSignal,
  LineageSuggestion,
  MissionRunState,
} from "./types";

const ELIGIBLE = new Set([
  "CRW-OPR-01",
  "CRW-OPR-02",
  "CRW-OPR-03",
  "CRW-OPR-04",
  "CRW-OPR-05",
  "CRW-BLD-01",
  "CRW-BLD-02",
  "CRW-BLD-03",
  "CRW-BLD-04",
  "CRW-BLD-05",
]);

export function suggestLineage(args: {
  run: MissionRunState;
  signals: readonly EmittedSignal[];
  crowprint: CrowprintSnapshot;
  suggestionId: string;
  generatedAtIso: string;
}): LineageSuggestion {
  const counts = new Map<string, number>();
  for (const s of args.signals) {
    for (const lid of s.lineageHints) {
      if (!ELIGIBLE.has(lid)) continue;
      const w =
        s.direction === "SUPPORTING"
          ? s.strength
          : s.direction === "CONFLICTING"
            ? -1
            : 0;
      counts.set(lid, (counts.get(lid) ?? 0) + w);
    }
  }
  if (args.crowprint.emergingPattern.startsWith("OPERATE")) {
    counts.set("CRW-OPR-03", (counts.get("CRW-OPR-03") ?? 0) + 2);
  }
  if (args.crowprint.emergingPattern.startsWith("BUILD")) {
    counts.set("CRW-BLD-01", (counts.get("CRW-BLD-01") ?? 0) + 2);
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const lineageId = ranked[0]?.[0] ?? "CRW-OPR-05";
  const categories = [...new Set(args.signals.map((s) => s.family))].slice(
    0,
    5,
  );

  const decisionCite = args.run.choiceHistory
    .slice(-3)
    .map((c) => `${c.nodeId}/${c.choiceId}`)
    .join(", ");

  return {
    suggestionId: args.suggestionId,
    lineageId,
    taxonomyVersion: "1.0.0",
    status: "GENERATED",
    reasonFamily: "SUGGESTION",
    primaryReason: "SYSTEM_SUGGESTED",
    reasonCodes: ["SYSTEM_SUGGESTED", "SIGNAL_AFFINITY", "SINGLE_MISSION_ONLY"],
    signalCategories: categories,
    explanationAr: `اقتراح خاص بناءً على قراراتك (${decisionCite}) — ليس سلالة مكتسبة وليس عاماً.`,
    explanationEn: `Private suggestion from your decisions (${decisionCite}) — not Earned Lineage, not public.`,
    generatedAtIso: args.generatedAtIso,
    reviewOrExpiry: "EXPIRES_AFTER_NEXT_CANONICAL_MISSION",
    correctionRoute: "DISMISS_OR_CORRECTION_SUGGESTION",
  };
}
