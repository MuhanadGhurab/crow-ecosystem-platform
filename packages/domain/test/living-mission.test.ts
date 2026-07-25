import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BLACK_SIGNAL_V010,
  applySelectChoice,
  assertCrowprintInputsSafe,
  computeCrowprint,
  createInitialRun,
  forkEchoRun,
  recommendRoute,
  resolveOutcomeIfNeeded,
  suggestLineage,
  validateMissionTemplate,
  hashWorldState,
  CROWPRINT_DENYLIST,
} from "../src/index.ts";

function play(
  choices: { nodeId: string; choiceId: string }[],
  runId = "run-1",
) {
  let run = createInitialRun({
    runId,
    learnerRef: "learner-1",
    template: BLACK_SIGNAL_V010,
  });
  let i = 0;
  for (const step of choices) {
    run = applySelectChoice(run, BLACK_SIGNAL_V010, {
      type: "SELECT_CHOICE",
      nodeId: step.nodeId,
      choiceId: step.choiceId,
      idempotencyKey: `k-${i}`,
      correlationId: `c-${i}`,
      actorRef: "learner-1",
      expectedVersion: run.version,
    });
    i += 1;
  }
  return resolveOutcomeIfNeeded(run);
}

const continuityPath = [
  { nodeId: "N01_signal_arrival", choiceId: "C01_restore_now" },
  { nodeId: "N02_scope_blast", choiceId: "C02_hot_path" },
  { nodeId: "N03_conflicting_reports", choiceId: "C03_treat_security" },
  { nodeId: "N04_triage_priority", choiceId: "C04_continuity" },
  { nodeId: "N05_diagnostic_path", choiceId: "C05_guess_patch" },
  { nodeId: "N06_experiment", choiceId: "C06_prod_probe" },
  { nodeId: "N07_interop", choiceId: "C07_force_sync" },
  { nodeId: "N08_structure", choiceId: "C08_transient" },
  { nodeId: "N09_containment_mode", choiceId: "C09_live_patch" },
  { nodeId: "N10_recovery_plan", choiceId: "C10_all_at_once" },
  { nodeId: "N11_debt_choice", choiceId: "C11_ignore_debt" },
  { nodeId: "N12_comms_stance", choiceId: "C12_minimize" },
  { nodeId: "N13_stakeholder", choiceId: "C13_promise" },
  { nodeId: "N14_final_balance", choiceId: "C14_continuity_close" },
  { nodeId: "N15_debrief_prompt", choiceId: "C15_reflect_ops" },
  { nodeId: "N16_complete", choiceId: "C16_complete" },
];

const buildPath = [
  { nodeId: "N01_signal_arrival", choiceId: "C01_map_deps" },
  { nodeId: "N02_scope_blast", choiceId: "C02_broad_survey" },
  { nodeId: "N03_conflicting_reports", choiceId: "C03_hold_judgment" },
  { nodeId: "N04_triage_priority", choiceId: "C04_evidence" },
  { nodeId: "N05_diagnostic_path", choiceId: "C05_layered" },
  { nodeId: "N06_experiment", choiceId: "C06_sandbox" },
  { nodeId: "N07_interop", choiceId: "C07_contract_check" },
  { nodeId: "N08_structure", choiceId: "C08_structural" },
  { nodeId: "N09_containment_mode", choiceId: "C09_isolate" },
  { nodeId: "N10_recovery_plan", choiceId: "C10_staged" },
  { nodeId: "N11_debt_choice", choiceId: "C11_schedule_debt" },
  { nodeId: "N12_comms_stance", choiceId: "C12_transparent" },
  { nodeId: "N13_stakeholder", choiceId: "C13_honest_risk" },
  { nodeId: "N14_final_balance", choiceId: "C14_balanced_close" },
  { nodeId: "N15_debrief_prompt", choiceId: "C15_reflect_build" },
  { nodeId: "N16_complete", choiceId: "C16_complete" },
];

describe("Black Signal Living Mission", () => {
  it("validates mission schema", () => {
    assert.deepEqual(validateMissionTemplate(BLACK_SIGNAL_V010), []);
  });

  it("is deterministic for same ordered choices", () => {
    const a = play(continuityPath, "a");
    const b = play(continuityPath, "b");
    assert.equal(a.worldHash, b.worldHash);
    assert.equal(a.outcomeId, b.outcomeId);
    assert.equal(hashWorldState(a.world), a.worldHash);
  });

  it("produces materially different outcomes for different paths", () => {
    const a = play(continuityPath, "c1");
    const b = play(buildPath, "c2");
    assert.notEqual(a.outcomeId, b.outcomeId);
    assert.notEqual(a.worldHash, b.worldHash);
  });

  it("rejects invalid transitions", () => {
    const run = createInitialRun({
      runId: "r",
      learnerRef: "learner-1",
      template: BLACK_SIGNAL_V010,
    });
    assert.throws(
      () =>
        applySelectChoice(run, BLACK_SIGNAL_V010, {
          type: "SELECT_CHOICE",
          nodeId: "N01_signal_arrival",
          choiceId: "NOPE",
          idempotencyKey: "k",
          correlationId: "c",
          actorRef: "learner-1",
          expectedVersion: 0,
        }),
      /INVALID_TRANSITION/,
    );
  });

  it("rejects denylisted Crowprint inputs", () => {
    assert.throws(
      () => assertCrowprintInputsSafe({ nestScore: 90 }),
      /FORBIDDEN_INPUT/,
    );
    assert.ok(CROWPRINT_DENYLIST.includes("payment"));
  });

  it("computes Crowprint with max DEVELOPING confidence", () => {
    const run = play(buildPath, "cp");
    const cp = computeCrowprint(run, {
      signals: run.signals,
      outcomeId: run.outcomeId,
    });
    assert.ok(
      ["INSUFFICIENT", "EMERGING", "DEVELOPING"].includes(cp.confidence),
    );
  });

  it("can suggest Operate-oriented and Build-oriented Lineages", () => {
    const ops = play(continuityPath, "ops");
    const bld = play(buildPath, "bld");
    const cpOps = computeCrowprint(ops, {
      signals: ops.signals,
      outcomeId: ops.outcomeId,
      reflectionTag: "OPERATE",
    });
    const cpBld = computeCrowprint(bld, {
      signals: bld.signals,
      outcomeId: bld.outcomeId,
      reflectionTag: "BUILD",
    });
    const sOps = suggestLineage({
      run: ops,
      signals: ops.signals,
      crowprint: cpOps,
      suggestionId: "s1",
      generatedAtIso: "2026-07-25T00:00:00.000Z",
    });
    const sBld = suggestLineage({
      run: bld,
      signals: bld.signals,
      crowprint: cpBld,
      suggestionId: "s2",
      generatedAtIso: "2026-07-25T00:00:00.000Z",
    });
    assert.ok(sOps.lineageId.startsWith("CRW-OPR-"));
    assert.ok(sBld.lineageId.startsWith("CRW-BLD-"));
    assert.match(sOps.explanationEn, /Private suggestion/);
    assert.equal(sOps.primaryReason, "SYSTEM_SUGGESTED");
  });

  it("Echo fork leaves canonical unchanged", () => {
    const canonical = play(continuityPath, "canon");
    const forkIdx = canonical.choiceHistory.findIndex(
      (c) => c.nodeId === "N04_triage_priority",
    );
    assert.ok(forkIdx > 0);
    const prior = canonical.choiceHistory[forkIdx - 1]!;
    const snapshotHistory = canonical.choiceHistory.slice(0, forkIdx);
    const echo = forkEchoRun({
      canonical,
      templateEntryWorld: BLACK_SIGNAL_V010.initialWorld,
      echoRunId: "echo-1",
      forkNodeId: "N04_triage_priority",
      snapshot: {
        world: { ...BLACK_SIGNAL_V010.initialWorld },
        worldHash: prior.resultingHash,
        choiceHistory: snapshotHistory,
        signals: canonical.signals.filter((s) =>
          snapshotHistory.some(
            (h) =>
              h.nodeId === s.sourceNodeId && h.choiceId === s.sourceChoiceId,
          ),
        ),
        version: snapshotHistory.length,
      },
    });
    assert.equal(echo.kind, "ECHO");
    assert.equal(echo.parentRunId, canonical.runId);
    assert.equal(canonical.kind, "CANONICAL");
    assert.equal(canonical.status, "COMPLETED");
    const signalCountBefore = canonical.signals.length;
    applySelectChoice(echo, BLACK_SIGNAL_V010, {
      type: "SELECT_CHOICE",
      nodeId: "N04_triage_priority",
      choiceId: "C04_evidence",
      idempotencyKey: "e1",
      correlationId: "ec",
      actorRef: "learner-1",
      expectedVersion: echo.version,
    });
    assert.equal(canonical.signals.length, signalCountBefore);
  });

  it("route recommendation is advisory and overridable", () => {
    const run = play(buildPath, "route");
    const cp = computeCrowprint(run, {
      signals: run.signals,
      outcomeId: run.outcomeId,
    });
    const rec = recommendRoute({ outcomeId: run.outcomeId, crowprint: cp });
    assert.equal(rec.overridable, true);
    assert.equal(rec.enrolled, false);
    assert.notEqual(rec.alternativeRouteId, rec.recommendedRouteId);
  });
});
