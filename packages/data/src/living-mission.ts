import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import {
  BLACK_SIGNAL_V010,
  applySelectChoice,
  bandLabel,
  buildFlightLog,
  computeCrowprint,
  createInitialRun,
  forkEchoRun,
  getNode,
  recommendRoute,
  resolveOutcomeIfNeeded,
  suggestLineage,
  type CrowprintSnapshot,
  type FlightLogEntry,
  type LineageSuggestion,
  type MissionRunState,
  type RouteRecommendation,
  type WorldState,
} from "@ghuravia/domain";
import * as schema from "./schema";
import { fingerprint, type Db, type Tx } from "./activation";

export type MissionResource = {
  run: MissionRunState;
  node: ReturnType<typeof getNode> | null;
  worldBands: Record<string, string>;
  crowprint: CrowprintSnapshot | null;
  suggestion: LineageSuggestion | null;
  flightLog: FlightLogEntry | null;
  routeRecommendation: RouteRecommendation | null;
  reflection: string | null;
  routeOverride: string | null;
  localOnly: true;
  echoNoticeAr: string;
  echoNoticeEn: string;
};

function toRun(row: typeof schema.missionRuns.$inferSelect): MissionRunState {
  return {
    runId: row.id,
    learnerRef: row.learnerRef,
    missionId: row.missionId,
    missionVersion: row.missionVersion,
    rulesetVersion: row.rulesetVersion,
    kind: row.kind as MissionRunState["kind"],
    status: row.status as MissionRunState["status"],
    currentNodeId: row.currentNodeId,
    world: row.world as WorldState,
    worldHash: row.worldHash,
    signals: (row.signals ?? []) as MissionRunState["signals"],
    choiceHistory: (row.choiceHistory ??
      []) as MissionRunState["choiceHistory"],
    outcomeId: row.outcomeId,
    parentRunId: row.parentRunId,
    echoForkNodeId: row.echoForkNodeId,
    version: row.version,
  };
}

function bands(world: WorldState): Record<string, string> {
  return Object.fromEntries(
    Object.entries(world).map(([k, v]) => [k, bandLabel(v as number)]),
  );
}

function toResource(
  row: typeof schema.missionRuns.$inferSelect,
): MissionResource {
  const run = toRun(row);
  const node =
    run.currentNodeId && run.status === "IN_PROGRESS"
      ? getNode(BLACK_SIGNAL_V010, run.currentNodeId)
      : null;
  return {
    run,
    node,
    worldBands: bands(run.world),
    crowprint: (row.crowprint as CrowprintSnapshot | null) ?? null,
    suggestion: (row.suggestion as LineageSuggestion | null) ?? null,
    flightLog: (row.flightLog as FlightLogEntry | null) ?? null,
    routeRecommendation:
      (row.routeRecommendation as RouteRecommendation | null) ?? null,
    reflection: row.reflection ?? null,
    routeOverride: row.routeOverride ?? null,
    localOnly: true,
    echoNoticeAr:
      run.kind === "ECHO"
        ? "هذا استكشاف بديل، وليس إعادة كتابة لرحلتك الأصلية."
        : "",
    echoNoticeEn:
      run.kind === "ECHO"
        ? "This is an alternate exploration, not a rewrite of your original Flight."
        : "",
  };
}

function mapError(e: unknown): never {
  const msg = e instanceof Error ? e.message : String(e);
  for (const name of [
    "VERSION_CONFLICT",
    "INVALID_TRANSITION",
    "FORBIDDEN",
    "UNAUTHORIZED",
    "VALIDATION_ERROR",
    "IDEMPOTENCY_CONFLICT",
    "NOT_FOUND",
  ] as const) {
    if (msg.includes(name) || msg.startsWith(name)) {
      const err = new Error(msg);
      err.name = name;
      throw err;
    }
  }
  throw e instanceof Error ? e : new Error(msg);
}

export class LivingMissionService {
  constructor(private readonly db: Db) {}

  async getRun(
    runId: string,
    learnerRef: string,
  ): Promise<MissionResource | null> {
    const rows = await this.db
      .select()
      .from(schema.missionRuns)
      .where(eq(schema.missionRuns.id, runId))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    if (row.learnerRef !== learnerRef) {
      const err = new Error("UNAUTHORIZED: not run owner");
      err.name = "UNAUTHORIZED";
      throw err;
    }
    return toResource(row);
  }

  async listActiveCanonical(
    learnerRef: string,
  ): Promise<MissionResource | null> {
    const rows = await this.db
      .select()
      .from(schema.missionRuns)
      .where(
        and(
          eq(schema.missionRuns.learnerRef, learnerRef),
          eq(schema.missionRuns.missionId, BLACK_SIGNAL_V010.missionId),
          eq(schema.missionRuns.kind, "CANONICAL"),
          eq(schema.missionRuns.status, "IN_PROGRESS"),
        ),
      )
      .orderBy(desc(schema.missionRuns.updatedAt))
      .limit(1);
    return rows[0] ? toResource(rows[0]) : null;
  }

  async startCanonical(input: {
    learnerRef: string;
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<{
    resource: MissionResource;
    idempotencyResult: "applied" | "replayed";
  }> {
    const correlationId = input.correlationId ?? randomUUID();
    // command_receipts.aggregate_id FK → activation_aggregates.id
    const aggregateId = input.learnerRef;
    const fp = fingerprint({
      type: "START_BLACK_SIGNAL",
      learnerRef: input.learnerRef,
    });
    try {
      return await this.db.transaction(async (tx) => {
        const receipt = await this.findReceipt(
          tx,
          aggregateId,
          input.idempotencyKey,
        );
        if (receipt) {
          if (receipt.requestFingerprint !== fp) {
            throw Object.assign(new Error("IDEMPOTENCY_CONFLICT"), {
              name: "IDEMPOTENCY_CONFLICT",
            });
          }
          const active = await this.listActiveCanonical(input.learnerRef);
          if (active) {
            return { resource: active, idempotencyResult: "replayed" as const };
          }
        }
        const active = await this.listActiveCanonical(input.learnerRef);
        if (active) {
          await this.writeReceipt(tx, {
            aggregateId,
            idempotencyKey: input.idempotencyKey,
            fp,
            correlationId,
            commandType: "START_BLACK_SIGNAL",
          });
          return { resource: active, idempotencyResult: "replayed" as const };
        }

        const runId = randomUUID();
        const now = new Date();
        const run = createInitialRun({
          runId,
          learnerRef: input.learnerRef,
          template: BLACK_SIGNAL_V010,
        });
        await tx.insert(schema.missionRuns).values({
          id: run.runId,
          learnerRef: run.learnerRef,
          missionId: run.missionId,
          missionVersion: run.missionVersion,
          rulesetVersion: run.rulesetVersion,
          kind: run.kind,
          status: run.status,
          currentNodeId: run.currentNodeId,
          world: run.world,
          worldHash: run.worldHash,
          signals: run.signals,
          choiceHistory: run.choiceHistory,
          outcomeId: null,
          parentRunId: null,
          echoForkNodeId: null,
          version: run.version,
          createdAt: now,
          updatedAt: now,
          latestCorrelationId: correlationId,
        });
        await this.appendEvent(tx, {
          runId,
          seq: 0,
          eventType: "RUN_STARTED",
          actorRef: input.learnerRef,
          priorHash: null,
          resultingHash: run.worldHash,
          nodeId: run.currentNodeId,
          choiceId: null,
          effects: null,
          signals: [],
          idempotencyKey: input.idempotencyKey,
          correlationId,
        });
        await this.writeSnapshot(tx, run, 0);
        await this.writeReceipt(tx, {
          aggregateId,
          idempotencyKey: input.idempotencyKey,
          fp,
          correlationId,
          commandType: "START_BLACK_SIGNAL",
        });
        const row = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, runId))
            .limit(1)
        )[0]!;
        return {
          resource: toResource(row),
          idempotencyResult: "applied" as const,
        };
      });
    } catch (e) {
      mapError(e);
    }
  }

  async selectChoice(input: {
    runId: string;
    learnerRef: string;
    nodeId: string;
    choiceId: string;
    expectedVersion: number;
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<{
    resource: MissionResource;
    idempotencyResult: "applied" | "replayed";
  }> {
    const correlationId = input.correlationId ?? randomUUID();
    const fp = fingerprint({
      type: "SELECT_CHOICE",
      nodeId: input.nodeId,
      choiceId: input.choiceId,
      expectedVersion: input.expectedVersion,
    });
    try {
      return await this.db.transaction(async (tx) => {
        const receipt = await this.findReceipt(
          tx,
          input.learnerRef,
          input.idempotencyKey,
        );
        if (receipt) {
          if (receipt.requestFingerprint !== fp) {
            throw Object.assign(new Error("IDEMPOTENCY_CONFLICT"), {
              name: "IDEMPOTENCY_CONFLICT",
            });
          }
          const row = (
            await tx
              .select()
              .from(schema.missionRuns)
              .where(eq(schema.missionRuns.id, input.runId))
              .limit(1)
          )[0];
          if (!row)
            throw Object.assign(new Error("NOT_FOUND"), { name: "NOT_FOUND" });
          return {
            resource: toResource(row),
            idempotencyResult: "replayed" as const,
          };
        }

        const row = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, input.runId))
            .limit(1)
        )[0];
        if (!row)
          throw Object.assign(new Error("NOT_FOUND"), { name: "NOT_FOUND" });
        if (row.learnerRef !== input.learnerRef) {
          throw Object.assign(new Error("UNAUTHORIZED"), {
            name: "UNAUTHORIZED",
          });
        }
        const prior = toRun(row);
        const next = applySelectChoice(prior, BLACK_SIGNAL_V010, {
          type: "SELECT_CHOICE",
          nodeId: input.nodeId,
          choiceId: input.choiceId,
          idempotencyKey: input.idempotencyKey,
          correlationId,
          actorRef: input.learnerRef,
          expectedVersion: input.expectedVersion,
        });
        const finalized =
          next.status === "COMPLETED" ? resolveOutcomeIfNeeded(next) : next;
        const now = new Date();
        await tx
          .update(schema.missionRuns)
          .set({
            currentNodeId: finalized.currentNodeId,
            world: finalized.world,
            worldHash: finalized.worldHash,
            signals: finalized.signals,
            choiceHistory: finalized.choiceHistory,
            outcomeId: finalized.outcomeId,
            status: finalized.status,
            version: finalized.version,
            updatedAt: now,
            completedAt:
              finalized.status === "COMPLETED" ? now : row.completedAt,
            latestCorrelationId: correlationId,
          })
          .where(eq(schema.missionRuns.id, input.runId));

        const last =
          finalized.choiceHistory[finalized.choiceHistory.length - 1]!;
        await this.appendEvent(tx, {
          runId: input.runId,
          seq: finalized.choiceHistory.length,
          eventType: "CHOICE_APPLIED",
          actorRef: input.learnerRef,
          priorHash: last.priorHash,
          resultingHash: last.resultingHash,
          nodeId: input.nodeId,
          choiceId: input.choiceId,
          effects: BLACK_SIGNAL_V010.nodes
            .find((n) => n.nodeId === input.nodeId)
            ?.choices.find((c) => c.choiceId === input.choiceId)?.effect.world,
          signals: finalized.signals.filter(
            (s) =>
              s.sourceNodeId === input.nodeId &&
              s.sourceChoiceId === input.choiceId,
          ),
          idempotencyKey: input.idempotencyKey,
          correlationId,
        });
        await this.writeSnapshot(tx, finalized, finalized.choiceHistory.length);
        await this.writeReceipt(tx, {
          aggregateId: input.learnerRef,
          idempotencyKey: input.idempotencyKey,
          fp,
          correlationId,
          commandType: "SELECT_CHOICE",
        });
        const updated = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, input.runId))
            .limit(1)
        )[0]!;
        return {
          resource: toResource(updated),
          idempotencyResult: "applied" as const,
        };
      });
    } catch (e) {
      mapError(e);
    }
  }

  async completeDebrief(input: {
    runId: string;
    learnerRef: string;
    expectedVersion: number;
    reflection?: string;
    interestHint?: "OPERATE" | "BUILD" | "UNSURE";
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<{
    resource: MissionResource;
    idempotencyResult: "applied" | "replayed";
  }> {
    const correlationId = input.correlationId ?? randomUUID();
    const fp = fingerprint({
      type: "COMPLETE_DEBRIEF",
      expectedVersion: input.expectedVersion,
      interestHint: input.interestHint ?? null,
    });
    try {
      return await this.db.transaction(async (tx) => {
        const receipt = await this.findReceipt(
          tx,
          input.learnerRef,
          input.idempotencyKey,
        );
        if (receipt) {
          const row = (
            await tx
              .select()
              .from(schema.missionRuns)
              .where(eq(schema.missionRuns.id, input.runId))
              .limit(1)
          )[0];
          if (!row)
            throw Object.assign(new Error("NOT_FOUND"), { name: "NOT_FOUND" });
          return {
            resource: toResource(row),
            idempotencyResult: "replayed" as const,
          };
        }
        const row = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, input.runId))
            .limit(1)
        )[0];
        if (!row)
          throw Object.assign(new Error("NOT_FOUND"), { name: "NOT_FOUND" });
        if (row.learnerRef !== input.learnerRef) {
          throw Object.assign(new Error("UNAUTHORIZED"), {
            name: "UNAUTHORIZED",
          });
        }
        const run = toRun(row);
        if (run.status !== "COMPLETED") {
          throw Object.assign(new Error("FORBIDDEN: run not completed"), {
            name: "FORBIDDEN",
          });
        }
        if (run.version !== input.expectedVersion) {
          throw Object.assign(new Error("VERSION_CONFLICT"), {
            name: "VERSION_CONFLICT",
          });
        }
        if (run.kind !== "CANONICAL") {
          throw Object.assign(
            new Error("FORBIDDEN: debrief for canonical only"),
            {
              name: "FORBIDDEN",
            },
          );
        }
        const crowprint = computeCrowprint(run, {
          signals: run.signals,
          outcomeId: run.outcomeId,
          reflectionTag: input.interestHint,
        });
        const suggestion = suggestLineage({
          run,
          signals: run.signals,
          crowprint,
          suggestionId: randomUUID(),
          generatedAtIso: new Date().toISOString(),
        });
        suggestion.status = "PRESENTED";
        const route = recommendRoute({
          outcomeId: run.outcomeId,
          crowprint,
          interestHint: input.interestHint,
        });
        const flightLog = buildFlightLog({
          run,
          crowprint,
          suggestion,
          reflection: input.reflection ?? null,
          recommendedRouteId: route.recommendedRouteId,
          completedAtIso:
            row.completedAt?.toISOString() ?? new Date().toISOString(),
        });
        const now = new Date();
        await tx
          .update(schema.missionRuns)
          .set({
            crowprint,
            suggestion,
            flightLog,
            routeRecommendation: route,
            reflection: input.reflection ?? null,
            version: run.version + 1,
            updatedAt: now,
            latestCorrelationId: correlationId,
          })
          .where(eq(schema.missionRuns.id, input.runId));
        await this.writeReceipt(tx, {
          aggregateId: input.learnerRef,
          idempotencyKey: input.idempotencyKey,
          fp,
          correlationId,
          commandType: "COMPLETE_DEBRIEF",
        });
        const updated = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, input.runId))
            .limit(1)
        )[0]!;
        return {
          resource: toResource(updated),
          idempotencyResult: "applied" as const,
        };
      });
    } catch (e) {
      mapError(e);
    }
  }

  async startEcho(input: {
    canonicalRunId: string;
    learnerRef: string;
    forkNodeId: string;
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<{
    resource: MissionResource;
    idempotencyResult: "applied" | "replayed";
  }> {
    const correlationId = input.correlationId ?? randomUUID();
    const fp = fingerprint({
      type: "START_ECHO",
      canonicalRunId: input.canonicalRunId,
      forkNodeId: input.forkNodeId,
    });
    try {
      return await this.db.transaction(async (tx) => {
        const receipt = await this.findReceipt(
          tx,
          input.learnerRef,
          input.idempotencyKey,
        );
        if (receipt) {
          const echoes = await tx
            .select()
            .from(schema.missionRuns)
            .where(
              and(
                eq(schema.missionRuns.parentRunId, input.canonicalRunId),
                eq(schema.missionRuns.kind, "ECHO"),
              ),
            )
            .orderBy(desc(schema.missionRuns.createdAt))
            .limit(1);
          if (echoes[0]) {
            return {
              resource: toResource(echoes[0]),
              idempotencyResult: "replayed" as const,
            };
          }
        }
        const row = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, input.canonicalRunId))
            .limit(1)
        )[0];
        if (!row)
          throw Object.assign(new Error("NOT_FOUND"), { name: "NOT_FOUND" });
        if (row.learnerRef !== input.learnerRef) {
          throw Object.assign(new Error("UNAUTHORIZED"), {
            name: "UNAUTHORIZED",
          });
        }
        const canonical = toRun(row);
        if (
          !BLACK_SIGNAL_V010.echoCandidateNodeIds.includes(input.forkNodeId)
        ) {
          throw Object.assign(
            new Error("VALIDATION_ERROR: not echo candidate"),
            {
              name: "VALIDATION_ERROR",
            },
          );
        }
        // Rebuild snapshot by replaying canonical choices until fork node
        let snap = createInitialRun({
          runId: "snap",
          learnerRef: input.learnerRef,
          template: BLACK_SIGNAL_V010,
        });
        for (const step of canonical.choiceHistory) {
          if (step.nodeId === input.forkNodeId) break;
          snap = applySelectChoice(snap, BLACK_SIGNAL_V010, {
            type: "SELECT_CHOICE",
            nodeId: step.nodeId,
            choiceId: step.choiceId,
            idempotencyKey: `rebuild-${step.nodeId}-${step.choiceId}`,
            correlationId,
            actorRef: input.learnerRef,
            expectedVersion: snap.version,
          });
        }
        const echoRunId = randomUUID();
        const echo = forkEchoRun({
          canonical,
          templateEntryWorld: BLACK_SIGNAL_V010.initialWorld,
          echoRunId,
          forkNodeId: input.forkNodeId,
          snapshot: {
            world: snap.world,
            worldHash: snap.worldHash,
            choiceHistory: snap.choiceHistory,
            signals: snap.signals,
            version: snap.version,
          },
        });
        const now = new Date();
        await tx.insert(schema.missionRuns).values({
          id: echo.runId,
          learnerRef: echo.learnerRef,
          missionId: echo.missionId,
          missionVersion: echo.missionVersion,
          rulesetVersion: echo.rulesetVersion,
          kind: echo.kind,
          status: echo.status,
          currentNodeId: echo.currentNodeId,
          world: echo.world,
          worldHash: echo.worldHash,
          signals: echo.signals,
          choiceHistory: echo.choiceHistory,
          outcomeId: null,
          parentRunId: echo.parentRunId,
          echoForkNodeId: echo.echoForkNodeId,
          version: echo.version,
          createdAt: now,
          updatedAt: now,
          latestCorrelationId: correlationId,
        });
        await this.writeReceipt(tx, {
          aggregateId: input.learnerRef,
          idempotencyKey: input.idempotencyKey,
          fp,
          correlationId,
          commandType: "START_ECHO",
        });
        const created = (
          await tx
            .select()
            .from(schema.missionRuns)
            .where(eq(schema.missionRuns.id, echoRunId))
            .limit(1)
        )[0]!;
        return {
          resource: toResource(created),
          idempotencyResult: "applied" as const,
        };
      });
    } catch (e) {
      mapError(e);
    }
  }

  async dismissSuggestion(input: {
    runId: string;
    learnerRef: string;
    expectedVersion: number;
    idempotencyKey: string;
  }): Promise<MissionResource> {
    const row = (
      await this.db
        .select()
        .from(schema.missionRuns)
        .where(eq(schema.missionRuns.id, input.runId))
        .limit(1)
    )[0];
    if (!row || row.learnerRef !== input.learnerRef) {
      throw Object.assign(new Error("UNAUTHORIZED"), { name: "UNAUTHORIZED" });
    }
    const suggestion = row.suggestion as LineageSuggestion | null;
    if (!suggestion) {
      throw Object.assign(new Error("NOT_FOUND: suggestion"), {
        name: "NOT_FOUND",
      });
    }
    const next = { ...suggestion, status: "DISMISSED" as const };
    await this.db
      .update(schema.missionRuns)
      .set({
        suggestion: next,
        version: row.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(schema.missionRuns.id, input.runId));
    const updated = (
      await this.db
        .select()
        .from(schema.missionRuns)
        .where(eq(schema.missionRuns.id, input.runId))
        .limit(1)
    )[0]!;
    return toResource(updated);
  }

  async overrideRoute(input: {
    runId: string;
    learnerRef: string;
    routeId: string;
    idempotencyKey: string;
  }): Promise<MissionResource> {
    const row = (
      await this.db
        .select()
        .from(schema.missionRuns)
        .where(eq(schema.missionRuns.id, input.runId))
        .limit(1)
    )[0];
    if (!row || row.learnerRef !== input.learnerRef) {
      throw Object.assign(new Error("UNAUTHORIZED"), { name: "UNAUTHORIZED" });
    }
    const rec = row.routeRecommendation as RouteRecommendation | null;
    const nextRec = rec ? { ...rec, recommendedRouteId: input.routeId } : null;
    await this.db
      .update(schema.missionRuns)
      .set({
        routeOverride: input.routeId,
        routeRecommendation: nextRec,
        version: row.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(schema.missionRuns.id, input.runId));
    const updated = (
      await this.db
        .select()
        .from(schema.missionRuns)
        .where(eq(schema.missionRuns.id, input.runId))
        .limit(1)
    )[0]!;
    return toResource(updated);
  }

  private async findReceipt(
    tx: Tx,
    aggregateId: string,
    idempotencyKey: string,
  ) {
    const rows = await tx
      .select()
      .from(schema.commandReceipts)
      .where(
        and(
          eq(schema.commandReceipts.aggregateId, aggregateId),
          eq(schema.commandReceipts.idempotencyKey, idempotencyKey),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }

  private async writeReceipt(
    tx: Tx,
    args: {
      aggregateId: string;
      idempotencyKey: string;
      fp: string;
      correlationId: string;
      commandType: string;
    },
  ) {
    await tx.insert(schema.commandReceipts).values({
      id: randomUUID(),
      aggregateId: args.aggregateId,
      idempotencyKey: args.idempotencyKey,
      commandType: args.commandType,
      requestFingerprint: args.fp,
      responseStatus: "ok",
      resultRef: null,
      recordedAt: new Date(),
      correlationId: args.correlationId,
    });
  }

  private async appendEvent(
    tx: Tx,
    args: {
      runId: string;
      seq: number;
      eventType: string;
      actorRef: string;
      priorHash: string | null;
      resultingHash: string;
      nodeId: string | null;
      choiceId: string | null;
      effects: unknown;
      signals: unknown;
      idempotencyKey: string;
      correlationId: string;
    },
  ) {
    await tx.insert(schema.missionEvents).values({
      id: randomUUID(),
      runId: args.runId,
      seq: args.seq,
      eventType: args.eventType,
      actorRef: args.actorRef,
      missionVersion: BLACK_SIGNAL_V010.version,
      nodeId: args.nodeId,
      choiceId: args.choiceId,
      priorStateHash: args.priorHash,
      resultingStateHash: args.resultingHash,
      stateEffects: args.effects,
      signalsEmitted: args.signals,
      idempotencyKey: args.idempotencyKey,
      correlationId: args.correlationId,
      rulesetVersion: BLACK_SIGNAL_V010.rulesetVersion,
      recordedAt: new Date(),
    });
  }

  private async writeSnapshot(tx: Tx, run: MissionRunState, seq: number) {
    await tx.insert(schema.missionSnapshots).values({
      id: randomUUID(),
      runId: run.runId,
      seq,
      nodeId: run.currentNodeId,
      world: run.world,
      worldHash: run.worldHash,
      signals: run.signals,
      choiceHistory: run.choiceHistory,
      version: run.version,
      recordedAt: new Date(),
    });
  }
}
