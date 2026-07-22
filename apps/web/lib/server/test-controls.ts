import { eq } from "drizzle-orm";
import * as schema from "@ghuravia/data";
import type { MockOutcome } from "@ghuravia/provider-mocks";
import { assertLocalRuntime } from "../session";
import { getDb } from "./db";

/** In-process email provider outcome for local/test automation only. */
let emailProviderMode: MockOutcome = "success";

export function getEmailProviderMode(): MockOutcome {
  return emailProviderMode;
}

export function setEmailProviderMode(mode: MockOutcome): void {
  assertLocalRuntime();
  emailProviderMode = mode;
}

export function resetEmailProviderMode(): void {
  emailProviderMode = "success";
}

export async function expireActiveChallenges(
  aggregateId: string,
): Promise<number> {
  assertLocalRuntime();
  const { db } = getDb();
  const rows = await db
    .select()
    .from(schema.verificationChallenges)
    .where(eq(schema.verificationChallenges.aggregateId, aggregateId));
  let n = 0;
  const past = new Date(Date.now() - 60_000);
  for (const row of rows) {
    if (row.status === "active") {
      await db
        .update(schema.verificationChallenges)
        .set({ status: "expired", expiresAt: past })
        .where(eq(schema.verificationChallenges.id, row.id));
      n += 1;
    }
  }
  return n;
}

export async function bumpAggregateVersion(
  aggregateId: string,
): Promise<number> {
  assertLocalRuntime();
  const { db } = getDb();
  const rows = await db
    .select()
    .from(schema.activationAggregates)
    .where(eq(schema.activationAggregates.id, aggregateId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    const err = new Error("NOT_FOUND");
    err.name = "NOT_FOUND";
    throw err;
  }
  const next = row.version + 1;
  await db
    .update(schema.activationAggregates)
    .set({ version: next, updatedAt: new Date() })
    .where(eq(schema.activationAggregates.id, aggregateId));
  return next;
}
