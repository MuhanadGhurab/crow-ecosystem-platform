import { createHash, randomBytes, randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import postgres from "postgres";
import type { ActivationCommand } from "@ghuravia/contracts/schemas";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import {
  applyActivationCommand,
  explainableLocksFor,
  gatesOf,
  allowedNextActions,
  type Activation,
} from "@ghuravia/domain";
import * as schema from "./schema";

const CHALLENGE_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export type Db = ReturnType<typeof drizzle<typeof schema>>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export function createDb(databaseUrl: string): {
  db: Db;
  sql: ReturnType<typeof postgres>;
} {
  const sql = postgres(databaseUrl, { max: 5 });
  const db = drizzle(sql, { schema });
  return { db, sql };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function fingerprint(input: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex")
    .slice(0, 32);
}

function toDomain(
  row: typeof schema.activationAggregates.$inferSelect,
): Activation {
  return {
    id: row.id,
    state: row.state as Activation["state"],
    version: row.version,
    emailVerified: row.emailVerified,
    termsAccepted: row.termsAccepted,
    accountRiskAcceptable: row.accountRiskAcceptable,
    termsVersion: row.termsVersion ?? undefined,
    riskDisclosureVersion: row.riskDisclosureVersion ?? undefined,
    contactRef: row.contactRef ?? undefined,
  };
}

export function toResource(
  a: Activation,
  correlationId?: string,
): ActivationResource {
  const gates = gatesOf(a);
  const locks = explainableLocksFor(a);
  const satisfied: string[] = [];
  const unsatisfied: string[] = [];
  if (gates.emailVerified) satisfied.push("email_verified");
  else unsatisfied.push("email_verified");
  if (gates.termsAccepted) satisfied.push("current_terms_accepted");
  else unsatisfied.push("current_terms_accepted");
  if (gates.accountRiskAcceptable)
    satisfied.push("account_risk_status=acceptable");
  else unsatisfied.push("account_risk_status=acceptable");
  return {
    aggregateId: a.id,
    state: a.state,
    version: a.version,
    gates,
    satisfiedGates: satisfied,
    unsatisfiedGates: unsatisfied,
    locks,
    allowedNextActions: allowedNextActions(a),
    recoveryAvailable: locks.some((l) => l.recoveryAvailable),
    localOnly: true,
    correlationId,
  };
}

export type CommandOutcome = {
  correlationId: string;
  aggregateVersion: number;
  state: Activation["state"];
  idempotencyResult: "applied" | "replayed";
  resource: ActivationResource;
  /** Returned once for mock delivery — never persist */
  issuedToken?: string;
  contactRef?: string;
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
  if (msg.includes("CHALLENGE_EXPIRED") || msg.includes("expired")) {
    const err = new Error(msg);
    err.name = "CHALLENGE_EXPIRED";
    throw err;
  }
  throw e instanceof Error ? e : new Error(msg);
}

export class ActivationCommandService {
  constructor(private readonly db: Db) {}

  async get(aggregateId: string): Promise<ActivationResource | null> {
    const rows = await this.db
      .select()
      .from(schema.activationAggregates)
      .where(eq(schema.activationAggregates.id, aggregateId))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return toResource(toDomain(row), row.latestCorrelationId ?? undefined);
  }

  async claimSyntheticAccount(input: {
    aggregateId: string;
    contactRef: string;
    actorRef: string;
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<CommandOutcome> {
    const correlationId = input.correlationId ?? randomUUID();
    const fp = fingerprint({
      type: "CLAIM_SYNTHETIC_ACCOUNT",
      contactRef: input.contactRef,
    });
    return this.db.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(schema.activationAggregates)
        .where(eq(schema.activationAggregates.id, input.aggregateId))
        .limit(1);
      if (existing[0]) {
        const receipt = await this.findReceipt(
          tx,
          input.aggregateId,
          input.idempotencyKey,
        );
        if (receipt) {
          if (receipt.requestFingerprint !== fp) {
            const err = new Error("IDEMPOTENCY_CONFLICT: payload mismatch");
            err.name = "IDEMPOTENCY_CONFLICT";
            throw err;
          }
          const a = toDomain(existing[0]);
          return {
            correlationId: receipt.correlationId,
            aggregateVersion: a.version,
            state: a.state,
            idempotencyResult: "replayed" as const,
            resource: toResource(a, receipt.correlationId),
            contactRef: a.contactRef,
          };
        }
        const err = new Error("CONFLICT: aggregate exists");
        err.name = "CONFLICT";
        throw err;
      }
      const now = new Date();
      const aggregate: Activation = {
        id: input.aggregateId,
        state: "ACCOUNT_CLAIMED",
        version: 0,
        emailVerified: false,
        termsAccepted: false,
        accountRiskAcceptable: false,
        contactRef: input.contactRef,
      };
      await tx.insert(schema.activationAggregates).values({
        id: aggregate.id,
        state: aggregate.state,
        version: aggregate.version,
        createdAt: now,
        updatedAt: now,
        emailVerified: false,
        termsAccepted: false,
        accountRiskAcceptable: false,
        contactRef: input.contactRef,
        latestCorrelationId: correlationId,
      });
      await this.writeAuditOutboxReceipt(tx, {
        prior: null,
        next: aggregate,
        command: {
          type: "CLAIM_SYNTHETIC_ACCOUNT",
          idempotencyKey: input.idempotencyKey,
          actorRef: input.actorRef,
        },
        correlationId,
        fingerprint: fp,
        eventType: "ActivationClaimed",
      });
      return {
        correlationId,
        aggregateVersion: 0,
        state: "ACCOUNT_CLAIMED",
        idempotencyResult: "applied",
        resource: toResource(aggregate, correlationId),
        contactRef: input.contactRef,
      };
    });
  }

  async execute(input: {
    aggregateId: string;
    command: ActivationCommand;
    expectedVersion: number;
    correlationId?: string;
  }): Promise<CommandOutcome> {
    const correlationId = input.correlationId ?? randomUUID();
    const fp = fingerprint({
      type: input.command.type,
      termsVersion: input.command.termsVersion,
      riskDisclosureVersion: input.command.riskDisclosureVersion,
      hasToken: Boolean(input.command.token),
      reason: input.command.reason,
      authority: input.command.authority,
    });
    try {
      return await this.db.transaction(async (tx) => {
        const rows = await tx
          .select()
          .from(schema.activationAggregates)
          .where(eq(schema.activationAggregates.id, input.aggregateId))
          .limit(1);
        const row = rows[0];
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
            resource: toResource(a, receipt.correlationId),
            contactRef: a.contactRef,
          };
        }

        let issuedToken: string | undefined;
        const current = toDomain(row);

        if (
          input.command.type === "CONFIRM_EMAIL_VERIFICATION" &&
          input.command.token
        ) {
          await this.consumeChallenge(
            tx,
            input.aggregateId,
            input.command.token,
          );
        }

        if (
          input.command.type === "REQUEST_EMAIL_VERIFICATION" ||
          input.command.type === "REQUEST_REPLACEMENT_VERIFICATION"
        ) {
          issuedToken = await this.issueChallenge(
            tx,
            input.aggregateId,
            correlationId,
          );
        }

        const result = applyActivationCommand(
          current,
          input.command,
          input.expectedVersion,
        );
        const next = result.aggregate;
        const now = new Date();
        await tx
          .update(schema.activationAggregates)
          .set({
            state: next.state,
            version: next.version,
            updatedAt: now,
            emailVerified: next.emailVerified,
            termsAccepted: next.termsAccepted,
            accountRiskAcceptable: next.accountRiskAcceptable,
            emailVerifiedAt: next.emailVerified
              ? (row.emailVerifiedAt ?? now)
              : row.emailVerifiedAt,
            termsAcceptedAt: next.termsAccepted
              ? (row.termsAcceptedAt ?? now)
              : row.termsAcceptedAt,
            riskAcceptedAt: next.accountRiskAcceptable
              ? (row.riskAcceptedAt ?? now)
              : row.riskAcceptedAt,
            termsVersion: next.termsVersion ?? null,
            riskDisclosureVersion: next.riskDisclosureVersion ?? null,
            latestCorrelationId: correlationId,
          })
          .where(
            and(
              eq(schema.activationAggregates.id, input.aggregateId),
              eq(schema.activationAggregates.version, current.version),
            ),
          );

        await this.writeAuditOutboxReceipt(tx, {
          prior: current,
          next,
          command: input.command,
          correlationId,
          fingerprint: fp,
          eventType: result.events[0] ?? `Activation.${input.command.type}`,
        });

        return {
          correlationId,
          aggregateVersion: next.version,
          state: next.state,
          idempotencyResult: "applied" as const,
          resource: toResource(next, correlationId),
          issuedToken,
          contactRef: next.contactRef,
        };
      });
    } catch (e) {
      mapError(e);
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

  private async issueChallenge(
    tx: Tx,
    aggregateId: string,
    correlationId: string,
  ): Promise<string> {
    const now = new Date();
    const active = await tx
      .select()
      .from(schema.verificationChallenges)
      .where(
        and(
          eq(schema.verificationChallenges.aggregateId, aggregateId),
          eq(schema.verificationChallenges.status, "active"),
        ),
      );
    for (const c of active) {
      await tx
        .update(schema.verificationChallenges)
        .set({ status: "superseded", supersededAt: now })
        .where(eq(schema.verificationChallenges.id, c.id));
    }
    const token = randomBytes(32).toString("base64url");
    await tx.insert(schema.verificationChallenges).values({
      id: randomUUID(),
      aggregateId,
      purpose: "EMAIL_VERIFICATION",
      tokenHash: hashToken(token),
      createdAt: now,
      expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MS),
      failedAttemptCount: 0,
      maxAttempts: MAX_ATTEMPTS,
      status: "active",
      correlationId,
    });
    return token;
  }

  private async consumeChallenge(
    tx: Tx,
    aggregateId: string,
    token: string,
  ): Promise<void> {
    const now = new Date();
    const hash = hashToken(token);
    const rows = await tx
      .select()
      .from(schema.verificationChallenges)
      .where(
        and(
          eq(schema.verificationChallenges.aggregateId, aggregateId),
          eq(schema.verificationChallenges.status, "active"),
        ),
      );
    const challenge = rows.find((r) => r.tokenHash === hash);
    if (!challenge) {
      const any = rows[0];
      if (any) {
        const nextCount = any.failedAttemptCount + 1;
        await tx
          .update(schema.verificationChallenges)
          .set({
            failedAttemptCount: nextCount,
            status: nextCount >= any.maxAttempts ? "exhausted" : any.status,
          })
          .where(eq(schema.verificationChallenges.id, any.id));
      }
      const err = new Error("VALIDATION_ERROR: invalid token");
      err.name = "VALIDATION_ERROR";
      throw err;
    }
    if (challenge.expiresAt.getTime() < now.getTime()) {
      await tx
        .update(schema.verificationChallenges)
        .set({ status: "expired" })
        .where(eq(schema.verificationChallenges.id, challenge.id));
      const err = new Error("CHALLENGE_EXPIRED");
      err.name = "CHALLENGE_EXPIRED";
      throw err;
    }
    await tx
      .update(schema.verificationChallenges)
      .set({ status: "consumed", consumedAt: now })
      .where(eq(schema.verificationChallenges.id, challenge.id));
  }

  private async writeAuditOutboxReceipt(
    tx: Tx,
    input: {
      prior: Activation | null;
      next: Activation;
      command: ActivationCommand;
      correlationId: string;
      fingerprint: string;
      eventType: string;
    },
  ): Promise<void> {
    const now = new Date();
    await tx.insert(schema.auditEvents).values({
      id: randomUUID(),
      actorRef: input.command.actorRef,
      action: input.command.type,
      subject: input.next.id,
      reason: input.command.reason,
      authority: input.command.authority,
      priorStateRef: input.prior?.state ?? null,
      resultingStateRef: input.next.state,
      recordedAt: now,
      correlationId: input.correlationId,
    });
    await tx.insert(schema.outboxEvents).values({
      eventId: randomUUID(),
      eventType: input.eventType,
      payload: {
        aggregateId: input.next.id,
        state: input.next.state,
        correlationId: input.correlationId,
      },
      recordedAt: now,
      status: "pending",
      retryCount: 0,
      idempotencyKey: `${input.next.id}:${input.command.idempotencyKey}:outbox`,
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

export async function claimPendingOutbox(
  db: Db,
  limit = 10,
): Promise<
  Array<{
    eventId: string;
    eventType: string;
    payload: Record<string, unknown>;
  }>
> {
  const rows = await db
    .select()
    .from(schema.outboxEvents)
    .where(eq(schema.outboxEvents.status, "pending"))
    .limit(limit);
  const claimed = [];
  for (const row of rows) {
    await db
      .update(schema.outboxEvents)
      .set({ status: "processing", retryCount: row.retryCount + 1 })
      .where(eq(schema.outboxEvents.eventId, row.eventId));
    claimed.push({
      eventId: row.eventId,
      eventType: row.eventType,
      payload: row.payload as Record<string, unknown>,
    });
  }
  return claimed;
}

export async function completeOutbox(
  db: Db,
  eventId: string,
  ok: boolean,
): Promise<void> {
  await db
    .update(schema.outboxEvents)
    .set({ status: ok ? "completed" : "failed" })
    .where(eq(schema.outboxEvents.eventId, eventId));
}
