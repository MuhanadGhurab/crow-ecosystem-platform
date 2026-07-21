import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadConfig } from "@ghuravia/config";
import { ActivationCommandService, createDb, hashToken } from "../src/index.ts";
import { eq } from "drizzle-orm";
import * as schema from "../src/schema.ts";

const url = process.env.GHURAVIA_DATABASE_URL;
const run = url ? test : test.skip;

run(
  "activation transaction: claim, challenge, confirm, terms, risk, activate",
  async () => {
    process.env.GHURAVIA_RUNTIME_MODE ??= "automated_test";
    process.env.GHURAVIA_APP_VERSION ??= "0.2.0-test";
    process.env.GHURAVIA_SYNTHETIC_SESSION_SECRET ??=
      "test-secret-at-least-16-chars";
    loadConfig();
    const { db, sql } = createDb(process.env.GHURAVIA_DATABASE_URL!);
    const svc = new ActivationCommandService(db);
    const id = randomUUID();
    const contactRef = `synthetic:${id.slice(0, 8)}`;
    try {
      await svc.claimSyntheticAccount({
        aggregateId: id,
        contactRef,
        actorRef: contactRef,
        idempotencyKey: `claim:${id}`,
      });
      const req = await svc.execute({
        aggregateId: id,
        expectedVersion: 0,
        command: {
          type: "REQUEST_EMAIL_VERIFICATION",
          idempotencyKey: "req-1",
          actorRef: contactRef,
        },
      });
      assert.ok(req.issuedToken);
      const token = req.issuedToken!;
      const challenges = await db
        .select()
        .from(schema.verificationChallenges)
        .where(eq(schema.verificationChallenges.aggregateId, id));
      assert.equal(challenges[0]?.tokenHash, hashToken(token));
      assert.notEqual(challenges[0]?.tokenHash, token);

      await svc.execute({
        aggregateId: id,
        expectedVersion: 1,
        command: {
          type: "CONFIRM_EMAIL_VERIFICATION",
          idempotencyKey: "conf-1",
          actorRef: contactRef,
          token,
        },
      });
      await svc.execute({
        aggregateId: id,
        expectedVersion: 2,
        command: {
          type: "ACCEPT_TERMS",
          idempotencyKey: "terms-1",
          actorRef: contactRef,
          termsVersion: "local-test-terms-v0",
        },
      });
      await svc.execute({
        aggregateId: id,
        expectedVersion: 3,
        command: {
          type: "ACCEPT_ACCOUNT_RISK",
          idempotencyKey: "risk-1",
          actorRef: contactRef,
          riskDisclosureVersion: "local-test-risk-v0",
        },
      });
      const done = await svc.execute({
        aggregateId: id,
        expectedVersion: 4,
        command: {
          type: "ACTIVATE",
          idempotencyKey: "act-1",
          actorRef: contactRef,
        },
      });
      assert.equal(done.state, "ACTIVATED");

      const replay = await svc.execute({
        aggregateId: id,
        expectedVersion: 4,
        command: {
          type: "ACTIVATE",
          idempotencyKey: "act-1",
          actorRef: contactRef,
        },
      });
      assert.equal(replay.idempotencyResult, "replayed");

      await assert.rejects(
        () =>
          svc.execute({
            aggregateId: id,
            expectedVersion: 4,
            command: {
              type: "ACTIVATE",
              idempotencyKey: "act-1",
              actorRef: contactRef,
              reason: "different",
            },
          }),
        /IDEMPOTENCY_CONFLICT/,
      );

      const audits = await db
        .select()
        .from(schema.auditEvents)
        .where(eq(schema.auditEvents.subject, id));
      assert.ok(audits.length >= 5);
      const outbox = await db.select().from(schema.outboxEvents);
      assert.ok(outbox.length >= 5);
    } finally {
      await sql.end({ timeout: 5 });
    }
  },
);
