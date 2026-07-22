import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import type {
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
  personalizationProgressionImpact,
  type Onboarding,
} from "@ghuravia/domain";
import * as schema from "./schema";
import { fingerprint, type Db, type Tx } from "./activation";

function toDomain(
  row: typeof schema.onboardingAggregates.$inferSelect,
): Onboarding {
  const goals = row.originGoalsOptions;
  return {
    id: row.id,
    state: row.state as Onboarding["state"],
    version: row.version,
    personalizationCatalogueVersion: row.personalizationCatalogueVersion,
    originCatalogueVersion: row.originCatalogueVersion,
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
    locks: explainableLocksForCosmetics(),
    allowedNextActions: allowedNextOnboardingActions(o),
    accessibleScreens: accessibleScreens(o),
    nestIntroHandoffAllowed: nestIntroHandoffAllowed(o),
    progressionImpact: personalizationProgressionImpact(),
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

export class OnboardingCommandService {
  constructor(private readonly db: Db) {}

  async get(aggregateId: string): Promise<OnboardingResource | null> {
    const rows = await this.db
      .select()
      .from(schema.onboardingAggregates)
      .where(eq(schema.onboardingAggregates.id, aggregateId))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return toOnboardingResource(
      toDomain(row),
      row.latestCorrelationId ?? undefined,
    );
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
    if (existing[0]) return toDomain(existing[0]);

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
    await this.db.insert(schema.onboardingAggregates).values({
      id: initial.id,
      state: initial.state,
      version: initial.version,
      personalizationCatalogueVersion: initial.personalizationCatalogueVersion,
      originCatalogueVersion: initial.originCatalogueVersion,
      path: null,
      crowOptionId: null,
      colorOptionId: null,
      styleOptionId: null,
      habitatOptionId: null,
      characterOptionId: null,
      accessoryOptionId: null,
      personalizationStatus: initial.personalizationStatus,
      originStatus: initial.originStatus,
      originRegionOption: null,
      originExperienceOption: null,
      originGoalsOptions: [],
      contrastOverrideAcknowledged: false,
      privacyPreviewAcknowledged: false,
      createdAt: now,
      updatedAt: now,
      latestCorrelationId: null,
    });
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
          await tx.insert(schema.onboardingAggregates).values({
            id: initial.id,
            state: initial.state,
            version: initial.version,
            personalizationCatalogueVersion:
              initial.personalizationCatalogueVersion,
            originCatalogueVersion: initial.originCatalogueVersion,
            path: null,
            personalizationStatus: initial.personalizationStatus,
            originStatus: initial.originStatus,
            originGoalsOptions: [],
            contrastOverrideAcknowledged: false,
            privacyPreviewAcknowledged: false,
            createdAt: now,
            updatedAt: now,
          });
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
          const a = toDomain(row);
          return {
            correlationId: receipt.correlationId,
            aggregateVersion: a.version,
            state: a.state,
            idempotencyResult: "replayed" as const,
            resource: toOnboardingResource(a, receipt.correlationId),
          };
        }

        const current = toDomain(row);
        const result = applyOnboardingCommand(
          current,
          input.command,
          input.expectedVersion,
        );
        const next = result.aggregate;
        const now = new Date();
        const updated = await tx
          .update(schema.onboardingAggregates)
          .set({
            state: next.state,
            version: next.version,
            personalizationCatalogueVersion:
              next.personalizationCatalogueVersion,
            originCatalogueVersion: next.originCatalogueVersion,
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
          command: input.command,
          correlationId,
          fingerprint: fp,
          eventType: result.events[0] ?? `Onboarding.${input.command.type}`,
          auditIntent: result.auditIntent,
        });

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
    // Audit metadata only — Origin response values must NOT enter audit bodies.
    // prior/resulting state refs carry status enums; field category via reason prefix when needed.
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
    // Outbox: non-sensitive status/state only — no Origin option IDs
    await tx.insert(schema.outboxEvents).values({
      eventId: randomUUID(),
      eventType: input.eventType,
      payload: {
        aggregateId: input.next.id,
        state: input.next.state,
        personalizationStatus: input.next.personalizationStatus,
        originStatus: input.next.originStatus,
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
