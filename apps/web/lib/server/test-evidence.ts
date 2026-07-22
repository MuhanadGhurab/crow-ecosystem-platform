import "server-only";

import { and, eq, sql } from "drizzle-orm";
import * as schema from "@ghuravia/data";
import { readMockMailbox } from "@ghuravia/provider-mocks";
import { assertLocalRuntime } from "../session";
import { getDb } from "./db";

export type IdempotencyEvidence = {
  testingOnly: true;
  aggregateId: string;
  aggregateVersion: number;
  state: string;
  /** Onboarding aggregate version when a row exists (0D Closure-01). */
  onboardingAggregateVersion: number | null;
  onboardingState: string | null;
  personalizationCatalogueVersion: string | null;
  personalizationStatus: string | null;
  originStatus: string | null;
  auditCount: number;
  outboxCount: number;
  receiptCount: number;
  mockDeliveryCount: number;
  receipts: Array<{
    commandType: string;
    responseStatus: string;
    resultRef: string | null;
    /** Opaque correlation id only — never tokens/hashes */
    correlationId: string;
  }>;
};

/**
 * Narrow local/test evidence for Closure idempotency browser scenarios.
 * Exposes counts and opaque identifiers only.
 * Activation version remains the primary aggregateVersion; onboarding fields
 * are populated when an onboarding_aggregates row exists for the account.
 */
export async function getIdempotencyEvidence(input: {
  aggregateId: string;
  contactRef: string;
  idempotencyKey?: string;
}): Promise<IdempotencyEvidence> {
  assertLocalRuntime();
  const { db } = getDb();
  const rows = await db
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

  const onboardingRows = await db
    .select()
    .from(schema.onboardingAggregates)
    .where(eq(schema.onboardingAggregates.id, input.aggregateId))
    .limit(1);
  const onboarding = onboardingRows[0];

  const auditRows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(schema.auditEvents)
    .where(eq(schema.auditEvents.subject, input.aggregateId));

  const outboxRows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(schema.outboxEvents)
    .where(
      sql`${schema.outboxEvents.payload}->>'aggregateId' = ${input.aggregateId}`,
    );

  const receiptQuery = input.idempotencyKey
    ? await db
        .select()
        .from(schema.commandReceipts)
        .where(
          and(
            eq(schema.commandReceipts.aggregateId, input.aggregateId),
            eq(schema.commandReceipts.idempotencyKey, input.idempotencyKey),
          ),
        )
    : await db
        .select()
        .from(schema.commandReceipts)
        .where(eq(schema.commandReceipts.aggregateId, input.aggregateId));

  return {
    testingOnly: true,
    aggregateId: input.aggregateId,
    aggregateVersion: row.version,
    state: row.state,
    onboardingAggregateVersion: onboarding?.version ?? null,
    onboardingState: onboarding?.state ?? null,
    personalizationCatalogueVersion:
      onboarding?.personalizationCatalogueVersion ?? null,
    personalizationStatus: onboarding?.personalizationStatus ?? null,
    originStatus: onboarding?.originStatus ?? null,
    auditCount: auditRows[0]?.c ?? 0,
    outboxCount: outboxRows[0]?.c ?? 0,
    receiptCount: receiptQuery.length,
    mockDeliveryCount: readMockMailbox(input.contactRef).length,
    receipts: receiptQuery.map((r) => ({
      commandType: r.commandType,
      responseStatus: r.responseStatus,
      resultRef: r.resultRef,
      correlationId: r.correlationId,
    })),
  };
}
