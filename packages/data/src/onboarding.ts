import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import type {
  NestReadinessSlice,
  OnboardingCommand,
  OnboardingResource,
} from "@ghuravia/contracts/schemas";
import {
  accessibleScreens,
  allowedNextOnboardingActions,
  applyOnboardingCommand,
  createInitialOnboarding,
  explainableLocksForCosmetics,
  nestIntroHandoffAllowed,
  nestReadinessIdentityImpact,
  nestReadinessProgressionImpact,
  nestReadinessTotalItems,
  personalizationProgressionImpact,
  type NestAnswerRecord,
  type Onboarding,
} from "@ghuravia/domain";
import * as schema from "./schema";
import { fingerprint, type Db, type Tx } from "./activation";

const TOTAL_NEST_ITEMS = nestReadinessTotalItems();

function toDomain(
  row: typeof schema.onboardingAggregates.$inferSelect,
  answers: readonly NestAnswerRecord[] = [],
): Onboarding {
  const goals = row.originGoalsOptions;
  const weak = row.nestWeakCapabilityIds;
  return {
    id: row.id,
    state: row.state as Onboarding["state"],
    version: row.version,
    personalizationCatalogueVersion: row.personalizationCatalogueVersion,
    originCatalogueVersion: row.originCatalogueVersion,
    nestReadinessCatalogueVersion: row.nestReadinessCatalogueVersion,
    path: (row.path as Onboarding["path"]) ?? null,
    crowOptionId: row.crowOptionId ?? null,
    colorOptionId: row.colorOptionId ?? null,
    styleOptionId: row.styleOptionId ?? null,
    habitatOptionId: row.habitatOptionId ?? null,
    characterOptionId: row.characterOptionId ?? null,
    accessoryOptionId: row.accessoryOptionId ?? null,
    personalizationStatus:
      row.personalizationStatus as Onboarding["personalizationStatus"],
    originStatus: row.originStatus as Onboarding["originStatus"],
    originRegionOption: row.originRegionOption ?? null,
    originExperienceOption: row.originExperienceOption ?? null,
    originGoalsOptions: Array.isArray(goals) ? goals : [],
    contrastOverrideAcknowledged: row.contrastOverrideAcknowledged,
    privacyPreviewAcknowledged: row.privacyPreviewAcknowledged,
    nestAttemptId: row.nestAttemptId ?? null,
    nestAttemptStatus: row.nestAttemptStatus as Onboarding["nestAttemptStatus"],
    nestAnswers: [...answers],
    nestScore: row.nestScore ?? null,
    nestBand: (row.nestBand as Onboarding["nestBand"]) ?? null,
    nestWeakCapabilityIds: Array.isArray(weak) ? weak : [],
    nestResultAcknowledged: row.nestResultAcknowledged,
  };
}

function toNestReadinessSlice(o: Onboarding): NestReadinessSlice {
  const answeredItemIds = o.nestAnswers.map((a) => a.itemId);
  const submitted = o.nestAttemptStatus === "SUBMITTED";
  return {
    catalogueVersion: o.nestReadinessCatalogueVersion,
    attemptId: o.nestAttemptId,
    attemptStatus: o.nestAttemptStatus,
    answeredItemIds,
    answerCount: answeredItemIds.length,
    totalItems: 10,
    canSubmit:
      o.nestAttemptStatus === "IN_PROGRESS" && answeredItemIds.length === 10,
    score: submitted ? o.nestScore : null,
    band: submitted ? o.nestBand : null,
    weakCapabilityIds: submitted ? [...o.nestWeakCapabilityIds] : [],
    resultAcknowledged: o.nestResultAcknowledged,
  };
}

export function toOnboardingResource(
  o: Onboarding,
  correlationId?: string,
): OnboardingResource {
  return {
    aggregateId: o.id,
    state: o.state,
    version: o.version,
    personalizationCatalogueVersion: o.personalizationCatalogueVersion,
    originCatalogueVersion: o.originCatalogueVersion,
    nestReadinessCatalogueVersion: o.nestReadinessCatalogueVersion,
    personalization: {
      path: o.path,
      status: o.personalizationStatus,
      crowOptionId: o.crowOptionId,
      colorOptionId: o.colorOptionId,
      styleOptionId: o.styleOptionId,
      habitatOptionId: o.habitatOptionId,
      characterOptionId: o.characterOptionId,
      accessoryOptionId: o.accessoryOptionId,
      contrastOverrideAcknowledged: o.contrastOverrideAcknowledged,
      privacyPreviewAcknowledged: o.privacyPreviewAcknowledged,
    },
    origin: {
      status: o.originStatus,
      regionOption: o.originRegionOption,
      experienceOption: o.originExperienceOption,
      goalsOptions: [...o.originGoalsOptions],
    },
    nestReadiness: toNestReadinessSlice(o),
    locks: explainableLocksForCosmetics(),
    allowedNextActions: allowedNextOnboardingActions(o),
    accessibleScreens: accessibleScreens(o),
    nestIntroHandoffAllowed: nestIntroHandoffAllowed(o),
    progressionImpact: personalizationProgressionImpact(),
    nestIdentityImpact: nestReadinessIdentityImpact(),
    localOnly: true,
    correlationId,
  };
}

export type OnboardingCommandOutcome = {
  correlationId: string;
  aggregateVersion: number;
  state: Onboarding["state"];
  idempotencyResult: "applied" | "replayed";
  resource: OnboardingResource;
};

function mapError(e: unknown): never {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("optimistic version")) {
    const err = new Error("CONFLICT");
    err.name = "CONFLICT";
    throw err;
  }
  if (msg.includes("IDEMPOTENCY")) {
    const err = new Error(msg);
    err.name = "IDEMPOTENCY_CONFLICT";
    throw err;
  }
  if (msg.includes("CATALOGUE_VERSION_CONFLICT")) {
    const err = new Error(msg);
    err.name = "CATALOGUE_VERSION_CONFLICT";
    throw err;
  }
  if (msg.includes("ORIGIN_SCHEMA_CONFLICT")) {
    const err = new Error(msg);
    err.name = "ORIGIN_SCHEMA_CONFLICT";
    throw err;
  }
  if (msg.includes("INVALID_TRANSITION")) {
    const err = new Error(msg);
    err.name = "INVALID_TRANSITION";
    throw err;
  }
  if (msg.includes("FORBIDDEN")) {
    const err = new Error(msg);
    err.name = "FORBIDDEN";
    throw err;
  }
  if (msg.includes("VALIDATION_ERROR")) {
    const err = new Error(msg);
    err.name = "VALIDATION_ERROR";
    throw err;
  }
  if (msg.includes("NOT_FOUND") || msg.includes("ACTIVATION")) {
    const err = new Error(msg);
    err.name = msg.startsWith("NOT_FOUND") ? "NOT_FOUND" : "FORBIDDEN";
    throw err;
  }
  throw e instanceof Error ? e : new Error(msg);
}

function commandFingerprint(command: OnboardingCommand): string {
  return fingerprint({
    type: command.type,
    personalizationCatalogueVersion: command.personalizationCatalogueVersion,
    originCatalogueVersion: command.originCatalogueVersion,
    nestReadinessCatalogueVersion: command.nestReadinessCatalogueVersion,
    nestAttemptId: command.nestAttemptId,
    nestItemId: command.nestItemId,
    nestOptionId: command.nestOptionId,
    crowOptionId: command.crowOptionId,
    colorOptionId: command.colorOptionId,
    styleOptionId: command.styleOptionId,
    habitatOptionId: command.habitatOptionId,
    characterOptionId: command.characterOptionId,
    accessoryOptionId: command.accessoryOptionId,
    contrastOverrideAcknowledged: command.contrastOverrideAcknowledged,
    privacyPreviewAcknowledged: command.privacyPreviewAcknowledged,
    originRegionOption: command.originRegionOption,
    originExperienceOption: command.originExperienceOption,
    originGoalsOptions: command.originGoalsOptions,
    reason: command.reason,
    authority: command.authority,
  });
}

function aggregateInsertValues(initial: Onboarding, now: Date) {
  return {
    id: initial.id,
    state: initial.state,
    version: initial.version,
    personalizationCatalogueVersion: initial.personalizationCatalogueVersion,
    originCatalogueVersion: initial.originCatalogueVersion,
    nestReadinessCatalogueVersion: initial.nestReadinessCatalogueVersion,
    path: null as string | null,
    crowOptionId: null as string | null,
    colorOptionId: null as string | null,
    styleOptionId: null as string | null,
    habitatOptionId: null as string | null,
    characterOptionId: null as string | null,
    accessoryOptionId: null as string | null,
    personalizationStatus: initial.personalizationStatus,
    originStatus: initial.originStatus,
    originRegionOption: null as string | null,
    originExperienceOption: null as string | null,
    originGoalsOptions: [] as string[],
    contrastOverrideAcknowledged: false,
    privacyPreviewAcknowledged: false,
    nestAttemptId: null as string | null,
    nestAttemptStatus: "NONE",
    nestScore: null as number | null,
    nestBand: null as string | null,
    nestWeakCapabilityIds: [] as string[],
    nestResultAcknowledged: false,
    createdAt: now,
    updatedAt: now,
    latestCorrelationId: null as string | null,
  };
}

export class OnboardingCommandService {
  constructor(private readonly db: Db) {}

  private async loadAnswers(
    db: Db | Tx,
    attemptId: string | null,
  ): Promise<NestAnswerRecord[]> {
    if (!attemptId) return [];
    const rows = await db
      .select()
      .from(schema.nestReadinessAnswers)
      .where(eq(schema.nestReadinessAnswers.attemptId, attemptId));
    return rows.map((r) => ({
      itemId: r.itemId,
      optionId: r.selectedOptionId,
      correct: r.correct,
      capabilityIds: Array.isArray(r.capabilityIds) ? r.capabilityIds : [],
    }));
  }

  private async loadDomain(
    db: Db | Tx,
    row: typeof schema.onboardingAggregates.$inferSelect,
  ): Promise<Onboarding> {
    const answers = await this.loadAnswers(db, row.nestAttemptId);
    return toDomain(row, answers);
  }

  async get(aggregateId: string): Promise<OnboardingResource | null> {
    const rows = await this.db
      .select()
      .from(schema.onboardingAggregates)
      .where(eq(schema.onboardingAggregates.id, aggregateId))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    const o = await this.loadDomain(this.db, row);
    return toOnboardingResource(o, row.latestCorrelationId ?? undefined);
  }

  /**
   * Ensures onboarding row exists when personalization begins.
   * Requires activation_aggregates.state === ACTIVATED.
   * Cross-user isolation: caller supplies aggregateId (session-enforced).
   */
  async ensureForActivated(aggregateId: string): Promise<Onboarding> {
    const existing = await this.db
      .select()
      .from(schema.onboardingAggregates)
      .where(eq(schema.onboardingAggregates.id, aggregateId))
      .limit(1);
    if (existing[0]) return this.loadDomain(this.db, existing[0]);

    const activation = await this.db
      .select()
      .from(schema.activationAggregates)
      .where(eq(schema.activationAggregates.id, aggregateId))
      .limit(1);
    const act = activation[0];
    if (!act) {
      const err = new Error("NOT_FOUND: activation aggregate");
      err.name = "NOT_FOUND";
      throw err;
    }
    if (act.state !== "ACTIVATED") {
      const err = new Error(
        "FORBIDDEN: personalization requires ACTIVATED activation",
      );
      err.name = "FORBIDDEN";
      throw err;
    }

    const initial = createInitialOnboarding(aggregateId);
    const now = new Date();
    await this.db
      .insert(schema.onboardingAggregates)
      .values(aggregateInsertValues(initial, now));
    return initial;
  }

  async execute(input: {
    aggregateId: string;
    command: OnboardingCommand;
    expectedVersion: number;
    correlationId?: string;
  }): Promise<OnboardingCommandOutcome> {
    const correlationId = input.correlationId ?? randomUUID();
    const fp = commandFingerprint(input.command);
    try {
      return await this.db.transaction(async (tx) => {
        const beginsPersonalization =
          input.command.type === "BEGIN_GUIDED_PERSONALIZATION" ||
          input.command.type === "BEGIN_QUICK_START";

        let row = (
          await tx
            .select()
            .from(schema.onboardingAggregates)
            .where(eq(schema.onboardingAggregates.id, input.aggregateId))
            .limit(1)
        )[0];

        if (!row && beginsPersonalization) {
          await this.ensureActivatedInTx(tx, input.aggregateId);
          const initial = createInitialOnboarding(input.aggregateId);
          const now = new Date();
          await tx
            .insert(schema.onboardingAggregates)
            .values(aggregateInsertValues(initial, now));
          row = (
            await tx
              .select()
              .from(schema.onboardingAggregates)
              .where(eq(schema.onboardingAggregates.id, input.aggregateId))
              .limit(1)
          )[0];
        }

        if (!row) {
          const err = new Error("NOT_FOUND");
          err.name = "NOT_FOUND";
          throw err;
        }

        const receipt = await this.findReceipt(
          tx,
          input.aggregateId,
          input.command.idempotencyKey,
        );
        if (receipt) {
          if (receipt.requestFingerprint !== fp) {
            const err = new Error(
              "IDEMPOTENCY_CONFLICT: payload mismatch",
            ) as Error & { correlationId?: string };
            err.name = "IDEMPOTENCY_CONFLICT";
            err.correlationId = receipt.correlationId;
            throw err;
          }
          const a = await this.loadDomain(tx, row);
          return {
            correlationId: receipt.correlationId,
            aggregateVersion: a.version,
            state: a.state,
            idempotencyResult: "replayed" as const,
            resource: toOnboardingResource(a, receipt.correlationId),
          };
        }

        let current = await this.loadDomain(tx, row);
        let command = { ...input.command };

        if (command.type === "START_NEST_ASSESSMENT") {
          const attemptId = command.nestAttemptId ?? randomUUID();
          command = { ...command, nestAttemptId: attemptId };
          await this.assertAttemptOwnership(tx, attemptId, input.aggregateId, {
            allowMissing: true,
          });
        }

        if (
          command.type === "SAVE_NEST_ANSWER" ||
          command.type === "SUBMIT_NEST_ASSESSMENT"
        ) {
          const attemptId = current.nestAttemptId;
          if (!attemptId) {
            const err = new Error(
              "INVALID_TRANSITION: nest assessment not in progress",
            );
            err.name = "INVALID_TRANSITION";
            throw err;
          }
          await this.assertAttemptOwnership(tx, attemptId, input.aggregateId);
          const attempt = (
            await tx
              .select()
              .from(schema.nestReadinessAttempts)
              .where(eq(schema.nestReadinessAttempts.id, attemptId))
              .limit(1)
          )[0];
          if (!attempt) {
            const err = new Error("NOT_FOUND: nest attempt");
            err.name = "NOT_FOUND";
            throw err;
          }
          if (attempt.status === "SUBMITTED") {
            const err = new Error(
              "FORBIDDEN: nest assessment immutable after submit",
            );
            err.name = "FORBIDDEN";
            throw err;
          }
          if (command.type === "SUBMIT_NEST_ASSESSMENT") {
            const dbAnswers = await this.loadAnswers(tx, attemptId);
            if (dbAnswers.length !== TOTAL_NEST_ITEMS) {
              const err = new Error(
                "VALIDATION_ERROR: incomplete assessment — all items required",
              );
              err.name = "VALIDATION_ERROR";
              throw err;
            }
            // Server-authoritative answers from DB — never trust client score/band
            current = { ...current, nestAnswers: dbAnswers };
          }
        }

        const result = applyOnboardingCommand(
          current,
          command,
          input.expectedVersion,
        );
        const next = result.aggregate;
        const now = new Date();

        if (command.type === "START_NEST_ASSESSMENT" && next.nestAttemptId) {
          await tx.insert(schema.nestReadinessAttempts).values({
            id: next.nestAttemptId,
            onboardingId: input.aggregateId,
            catalogueVersion: next.nestReadinessCatalogueVersion,
            status: "IN_PROGRESS",
            startedAt: now,
            submittedAt: null,
            score: null,
            band: null,
            weakCapabilityIds: [],
            version: 0,
            createdAt: now,
            updatedAt: now,
          });
        }

        if (command.type === "SAVE_NEST_ANSWER" && next.nestAttemptId) {
          const saved = next.nestAnswers.find(
            (a) => a.itemId === command.nestItemId,
          );
          if (!saved) {
            const err = new Error("VALIDATION_ERROR: answer not saved");
            err.name = "VALIDATION_ERROR";
            throw err;
          }
          const existing = (
            await tx
              .select()
              .from(schema.nestReadinessAnswers)
              .where(
                and(
                  eq(schema.nestReadinessAnswers.attemptId, next.nestAttemptId),
                  eq(schema.nestReadinessAnswers.itemId, saved.itemId),
                ),
              )
              .limit(1)
          )[0];
          if (existing) {
            await tx
              .update(schema.nestReadinessAnswers)
              .set({
                selectedOptionId: saved.optionId,
                capabilityIds: [...saved.capabilityIds],
                correct: saved.correct,
                savedAt: now,
              })
              .where(eq(schema.nestReadinessAnswers.id, existing.id));
          } else {
            await tx.insert(schema.nestReadinessAnswers).values({
              id: randomUUID(),
              attemptId: next.nestAttemptId,
              itemId: saved.itemId,
              selectedOptionId: saved.optionId,
              capabilityIds: [...saved.capabilityIds],
              correct: saved.correct,
              savedAt: now,
            });
          }
        }

        if (command.type === "SUBMIT_NEST_ASSESSMENT" && next.nestAttemptId) {
          await tx
            .update(schema.nestReadinessAttempts)
            .set({
              status: "SUBMITTED",
              submittedAt: now,
              score: next.nestScore,
              band: next.nestBand,
              weakCapabilityIds: [...next.nestWeakCapabilityIds],
              version: attemptVersionBump(current),
              updatedAt: now,
            })
            .where(
              and(
                eq(schema.nestReadinessAttempts.id, next.nestAttemptId),
                eq(
                  schema.nestReadinessAttempts.onboardingId,
                  input.aggregateId,
                ),
              ),
            );
        }

        const updated = await tx
          .update(schema.onboardingAggregates)
          .set({
            state: next.state,
            version: next.version,
            personalizationCatalogueVersion:
              next.personalizationCatalogueVersion,
            originCatalogueVersion: next.originCatalogueVersion,
            nestReadinessCatalogueVersion: next.nestReadinessCatalogueVersion,
            path: next.path,
            crowOptionId: next.crowOptionId,
            colorOptionId: next.colorOptionId,
            styleOptionId: next.styleOptionId,
            habitatOptionId: next.habitatOptionId,
            characterOptionId: next.characterOptionId,
            accessoryOptionId: next.accessoryOptionId,
            personalizationStatus: next.personalizationStatus,
            originStatus: next.originStatus,
            originRegionOption: next.originRegionOption,
            originExperienceOption: next.originExperienceOption,
            originGoalsOptions: [...next.originGoalsOptions],
            contrastOverrideAcknowledged: next.contrastOverrideAcknowledged,
            privacyPreviewAcknowledged: next.privacyPreviewAcknowledged,
            nestAttemptId: next.nestAttemptId,
            nestAttemptStatus: next.nestAttemptStatus,
            nestScore: next.nestScore,
            nestBand: next.nestBand,
            nestWeakCapabilityIds: [...next.nestWeakCapabilityIds],
            nestResultAcknowledged: next.nestResultAcknowledged,
            updatedAt: now,
            latestCorrelationId: correlationId,
          })
          .where(
            and(
              eq(schema.onboardingAggregates.id, input.aggregateId),
              eq(schema.onboardingAggregates.version, current.version),
            ),
          )
          .returning({ id: schema.onboardingAggregates.id });

        if (updated.length === 0) {
          const err = new Error("CONFLICT: optimistic version mismatch");
          err.name = "CONFLICT";
          throw err;
        }

        await this.writeAuditOutboxReceipt(tx, {
          prior: current,
          next,
          command,
          correlationId,
          fingerprint: fp,
          eventType: result.events[0] ?? `Onboarding.${command.type}`,
          auditIntent: result.auditIntent,
        });

        // Zero-impact invariant call site (never awards progression/identity)
        void nestReadinessProgressionImpact();
        void nestReadinessIdentityImpact();

        return {
          correlationId,
          aggregateVersion: next.version,
          state: next.state,
          idempotencyResult: "applied" as const,
          resource: toOnboardingResource(next, correlationId),
        };
      });
    } catch (e) {
      mapError(e);
    }
  }

  private async assertAttemptOwnership(
    tx: Tx,
    attemptId: string,
    aggregateId: string,
    opts?: { allowMissing?: boolean },
  ): Promise<void> {
    const rows = await tx
      .select()
      .from(schema.nestReadinessAttempts)
      .where(eq(schema.nestReadinessAttempts.id, attemptId))
      .limit(1);
    const attempt = rows[0];
    if (!attempt) {
      if (opts?.allowMissing) return;
      const err = new Error("NOT_FOUND: nest attempt");
      err.name = "NOT_FOUND";
      throw err;
    }
    if (attempt.onboardingId !== aggregateId) {
      const err = new Error(
        "FORBIDDEN: nest attempt does not belong to account",
      );
      err.name = "FORBIDDEN";
      throw err;
    }
  }

  private async ensureActivatedInTx(
    tx: Tx,
    aggregateId: string,
  ): Promise<void> {
    const activation = await tx
      .select()
      .from(schema.activationAggregates)
      .where(eq(schema.activationAggregates.id, aggregateId))
      .limit(1);
    const act = activation[0];
    if (!act) {
      const err = new Error("NOT_FOUND: activation aggregate");
      err.name = "NOT_FOUND";
      throw err;
    }
    if (act.state !== "ACTIVATED") {
      const err = new Error(
        "FORBIDDEN: personalization requires ACTIVATED activation",
      );
      err.name = "FORBIDDEN";
      throw err;
    }
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
    return rows[0];
  }

  private async writeAuditOutboxReceipt(
    tx: Tx,
    input: {
      prior: Onboarding;
      next: Onboarding;
      command: OnboardingCommand;
      correlationId: string;
      fingerprint: string;
      eventType: string;
      auditIntent: {
        action: string;
        actorRef: string;
        reason?: string;
        authority?: string;
        fieldCategory?: string;
        priorStatus?: string;
        resultingStatus?: string;
        catalogueVersion?: string;
      };
    },
  ): Promise<void> {
    const now = new Date();
    // Audit metadata only — Origin/nest option values must NOT enter audit bodies.
    const reasonParts = [
      input.auditIntent.reason,
      input.auditIntent.fieldCategory
        ? `fieldCategory=${input.auditIntent.fieldCategory}`
        : undefined,
      input.auditIntent.catalogueVersion
        ? `catalogueVersion=${input.auditIntent.catalogueVersion}`
        : undefined,
    ].filter(Boolean);
    await tx.insert(schema.auditEvents).values({
      id: randomUUID(),
      actorRef: input.command.actorRef,
      action: input.command.type,
      subject: input.next.id,
      reason: reasonParts.length > 0 ? reasonParts.join("; ") : null,
      authority: input.command.authority,
      priorStateRef: input.auditIntent.priorStatus ?? input.prior.state,
      resultingStateRef: input.auditIntent.resultingStatus ?? input.next.state,
      recordedAt: now,
      correlationId: input.correlationId,
    });
    await tx.insert(schema.outboxEvents).values({
      eventId: randomUUID(),
      eventType: input.eventType,
      payload: {
        aggregateId: input.next.id,
        state: input.next.state,
        personalizationStatus: input.next.personalizationStatus,
        originStatus: input.next.originStatus,
        nestAttemptStatus: input.next.nestAttemptStatus,
        correlationId: input.correlationId,
      },
      recordedAt: now,
      status: "pending",
      retryCount: 0,
      idempotencyKey: `${input.next.id}:${input.command.idempotencyKey}:onboarding-outbox`,
    });
    await tx.insert(schema.commandReceipts).values({
      id: randomUUID(),
      aggregateId: input.next.id,
      idempotencyKey: input.command.idempotencyKey,
      commandType: input.command.type,
      requestFingerprint: input.fingerprint,
      responseStatus: "ok",
      resultRef: input.next.state,
      recordedAt: now,
      correlationId: input.correlationId,
    });
  }
}

function attemptVersionBump(current: Onboarding): number {
  return current.version + 1;
}
