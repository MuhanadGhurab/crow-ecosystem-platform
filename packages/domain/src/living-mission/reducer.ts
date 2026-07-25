import { applyWorldDelta, hashWorldState } from "./hash";
import type {
  EmittedSignal,
  MissionRunState,
  MissionTemplate,
  SelectChoiceCommand,
} from "./types";

export function createInitialRun(args: {
  runId: string;
  learnerRef: string;
  template: MissionTemplate;
  kind?: MissionRunState["kind"];
  parentRunId?: string | null;
  echoForkNodeId?: string | null;
  world?: MissionRunState["world"];
  currentNodeId?: string;
}): MissionRunState {
  const world = args.world ?? { ...args.template.initialWorld };
  return {
    runId: args.runId,
    learnerRef: args.learnerRef,
    missionId: args.template.missionId,
    missionVersion: args.template.version,
    rulesetVersion: args.template.rulesetVersion,
    kind: args.kind ?? "CANONICAL",
    status: "IN_PROGRESS",
    currentNodeId: args.currentNodeId ?? args.template.entryNodeId,
    world,
    worldHash: hashWorldState(world),
    signals: [],
    choiceHistory: [],
    outcomeId: null,
    parentRunId: args.parentRunId ?? null,
    echoForkNodeId: args.echoForkNodeId ?? null,
    version: 0,
  };
}

export function getNode(template: MissionTemplate, nodeId: string) {
  const node = template.nodes.find((n) => n.nodeId === nodeId);
  if (!node) throw new Error(`INVALID_TRANSITION: unknown node ${nodeId}`);
  return node;
}

export function applySelectChoice(
  run: MissionRunState,
  template: MissionTemplate,
  command: SelectChoiceCommand,
): MissionRunState {
  if (run.status !== "IN_PROGRESS") {
    throw new Error("FORBIDDEN: run is not in progress");
  }
  if (command.expectedVersion !== run.version) {
    throw new Error("VERSION_CONFLICT: expectedVersion mismatch");
  }
  if (command.actorRef !== run.learnerRef) {
    throw new Error("UNAUTHORIZED: actor does not own run");
  }
  if (!run.currentNodeId || command.nodeId !== run.currentNodeId) {
    throw new Error("INVALID_TRANSITION: node mismatch");
  }
  if (
    template.missionId !== run.missionId ||
    template.version !== run.missionVersion
  ) {
    throw new Error("VALIDATION_ERROR: mission version pin mismatch");
  }

  const node = getNode(template, command.nodeId);
  const choice = node.choices.find((c) => c.choiceId === command.choiceId);
  if (!choice) {
    throw new Error("INVALID_TRANSITION: unknown choice");
  }

  const priorHash = run.worldHash;
  const nextWorld = applyWorldDelta(run.world, choice.effect.world);
  const resultingHash = hashWorldState(nextWorld);

  const emitted: EmittedSignal[] = choice.effect.signals.map((s) => ({
    ...s,
    sourceNodeId: node.nodeId,
    sourceChoiceId: choice.choiceId,
    validityStatus: "OBSERVED" as const,
    rulesetVersion: template.rulesetVersion,
  }));

  // Echo runs never append canonical Evidence Signals into a shared ledger —
  // they keep signals local to the echo run only (caller isolates persistence).
  const nextSignals =
    run.kind === "ECHO"
      ? [...run.signals, ...emitted]
      : [...run.signals, ...emitted];

  const nextNodeId = choice.effect.nextNodeId;
  let status: MissionRunState["status"] = run.status;
  let outcomeId = run.outcomeId;
  if (choice.effect.outcomeId) {
    outcomeId = choice.effect.outcomeId;
  }
  if (nextNodeId === null) {
    status = "COMPLETED";
  }

  return {
    ...run,
    world: nextWorld,
    worldHash: resultingHash,
    currentNodeId: nextNodeId,
    status,
    outcomeId,
    signals: nextSignals,
    choiceHistory: [
      ...run.choiceHistory,
      {
        nodeId: node.nodeId,
        choiceId: choice.choiceId,
        priorHash,
        resultingHash,
      },
    ],
    version: run.version + 1,
  };
}

/** Resolve outcome if not already set — based on final world tilt. */
export function resolveOutcomeIfNeeded(run: MissionRunState): MissionRunState {
  if (run.outcomeId || run.status !== "COMPLETED") return run;
  const w = run.world;
  if (w.TECHNICAL_DEBT >= 70 && w.RISK_EXPOSURE >= 55) {
    return { ...run, outcomeId: "OUTCOME_DEBT_HEAVY" };
  }
  if (w.EVIDENCE_INTEGRITY >= w.SERVICE_HEALTH + 10) {
    return { ...run, outcomeId: "OUTCOME_EVIDENCE_FIRST" };
  }
  if (w.SERVICE_HEALTH >= w.EVIDENCE_INTEGRITY + 10) {
    return { ...run, outcomeId: "OUTCOME_CONTINUITY_FIRST" };
  }
  return { ...run, outcomeId: "OUTCOME_BALANCED_CONTAINMENT" };
}
