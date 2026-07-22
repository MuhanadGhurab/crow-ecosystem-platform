import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadConfig } from "@ghuravia/config";
import {
  ActivationCommandService,
  OnboardingCommandService,
  createDb,
} from "../src/index.ts";
import { eq } from "drizzle-orm";
import * as schema from "../src/schema.ts";

const url = process.env.GHURAVIA_DATABASE_URL;
const run = url ? test : test.skip;

const PERSONALIZATION_CATALOGUE_VERSION = "0.1.0";
const ORIGIN_CATALOGUE_VERSION = "0.1.0";

async function activateAccount(
  svc: ActivationCommandService,
  id: string,
  contactRef: string,
): Promise<void> {
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
  await svc.execute({
    aggregateId: id,
    expectedVersion: 1,
    command: {
      type: "CONFIRM_EMAIL_VERIFICATION",
      idempotencyKey: "conf-1",
      actorRef: contactRef,
      token: req.issuedToken,
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
  await svc.execute({
    aggregateId: id,
    expectedVersion: 4,
    command: {
      type: "ACTIVATE",
      idempotencyKey: "act-1",
      actorRef: contactRef,
    },
  });
}

run(
  "onboarding: quick-start, origin review-later, idempotent replay, isolation",
  async () => {
    process.env.GHURAVIA_RUNTIME_MODE ??= "automated_test";
    process.env.GHURAVIA_APP_VERSION ??= "0.2.0-test";
    process.env.GHURAVIA_SYNTHETIC_SESSION_SECRET ??=
      "test-secret-at-least-16-chars";
    loadConfig();
    const { db, sql } = createDb(process.env.GHURAVIA_DATABASE_URL!);
    const activationSvc = new ActivationCommandService(db);
    const onboardingSvc = new OnboardingCommandService(db);
    const id = randomUUID();
    const otherId = randomUUID();
    const contactRef = `synthetic:${id.slice(0, 8)}`;
    const otherContact = `synthetic:${otherId.slice(0, 8)}`;
    try {
      await activateAccount(activationSvc, id, contactRef);
      await activateAccount(activationSvc, otherId, otherContact);

      const begun = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: 0,
        command: {
          type: "BEGIN_QUICK_START",
          idempotencyKey: "qs-1",
          actorRef: contactRef,
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
        },
      });
      assert.equal(begun.state, "PERSONALIZATION_MINIMUM_COMPLETE");
      assert.equal(begun.idempotencyResult, "applied");
      assert.deepEqual(begun.resource.progressionImpact, {
        xp: 0,
        mastery: 0,
        rank: 0,
        prestige: 0,
        trust: 0,
      });

      const replay = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: 0,
        command: {
          type: "BEGIN_QUICK_START",
          idempotencyKey: "qs-1",
          actorRef: contactRef,
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
        },
      });
      assert.equal(replay.idempotencyResult, "replayed");
      assert.equal(replay.aggregateVersion, begun.aggregateVersion);

      await assert.rejects(
        () =>
          onboardingSvc.execute({
            aggregateId: id,
            expectedVersion: 0,
            command: {
              type: "BEGIN_QUICK_START",
              idempotencyKey: "qs-1",
              actorRef: contactRef,
              personalizationCatalogueVersion:
                PERSONALIZATION_CATALOGUE_VERSION,
              privacyPreviewAcknowledged: true,
            },
          }),
        /IDEMPOTENCY_CONFLICT/,
      );

      const later = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: begun.aggregateVersion,
        command: {
          type: "MARK_ORIGIN_REVIEW_LATER",
          idempotencyKey: "orl-1",
          actorRef: contactRef,
          originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
        },
      });
      assert.equal(later.state, "ORIGIN_REVIEW_LATER");

      const audits = await db
        .select()
        .from(schema.auditEvents)
        .where(eq(schema.auditEvents.subject, id));
      const originAudits = audits.filter(
        (a) => a.action === "MARK_ORIGIN_REVIEW_LATER",
      );
      assert.ok(originAudits.length >= 1);
      for (const a of originAudits) {
        // Origin response values must not appear in audit bodies
        assert.equal(a.reason?.includes("region."), false);
        assert.equal(a.reason?.includes("goal."), false);
        assert.equal(a.reason?.includes("exp."), false);
      }

      const outbox = await db
        .select()
        .from(schema.outboxEvents)
        .where(
          eq(
            schema.outboxEvents.eventType,
            "Onboarding.MARK_ORIGIN_REVIEW_LATER",
          ),
        );
      assert.ok(outbox.length >= 1);
      for (const row of outbox) {
        const payload = row.payload as Record<string, unknown>;
        assert.equal("originRegionOption" in payload, false);
        assert.equal("originGoalsOptions" in payload, false);
        assert.equal(payload.originStatus, "REVIEW_LATER");
      }

      // Cross-user isolation: other aggregate unaffected
      const other = await onboardingSvc.get(otherId);
      assert.equal(other, null);
      const self = await onboardingSvc.get(id);
      assert.ok(self);
      assert.equal(self.state, "ORIGIN_REVIEW_LATER");
      assert.notEqual(self.aggregateId, otherId);

      const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'onboarding_aggregates'
      `;
      assert.equal(tables.length, 1);
    } finally {
      await sql.end({ timeout: 5 });
    }
  },
);

run("onboarding: rejects begin when not ACTIVATED", async () => {
  process.env.GHURAVIA_RUNTIME_MODE ??= "automated_test";
  process.env.GHURAVIA_APP_VERSION ??= "0.2.0-test";
  process.env.GHURAVIA_SYNTHETIC_SESSION_SECRET ??=
    "test-secret-at-least-16-chars";
  loadConfig();
  const { db, sql } = createDb(process.env.GHURAVIA_DATABASE_URL!);
  const activationSvc = new ActivationCommandService(db);
  const onboardingSvc = new OnboardingCommandService(db);
  const id = randomUUID();
  const contactRef = `synthetic:${id.slice(0, 8)}`;
  try {
    await activationSvc.claimSyntheticAccount({
      aggregateId: id,
      contactRef,
      actorRef: contactRef,
      idempotencyKey: `claim:${id}`,
    });
    await assert.rejects(
      () =>
        onboardingSvc.execute({
          aggregateId: id,
          expectedVersion: 0,
          command: {
            type: "BEGIN_GUIDED_PERSONALIZATION",
            idempotencyKey: "g1",
            actorRef: contactRef,
            personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
          },
        }),
      /FORBIDDEN|ACTIVATED/,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
});

const NEST_READINESS_CATALOGUE_VERSION = "0.1.0";

run(
  "onboarding: nest readiness answers submit immutability and cross-account",
  async () => {
    process.env.GHURAVIA_RUNTIME_MODE ??= "automated_test";
    process.env.GHURAVIA_APP_VERSION ??= "0.2.0-test";
    process.env.GHURAVIA_SYNTHETIC_SESSION_SECRET ??=
      "test-secret-at-least-16-chars";
    loadConfig();
    const { db, sql } = createDb(process.env.GHURAVIA_DATABASE_URL!);
    const activationSvc = new ActivationCommandService(db);
    const onboardingSvc = new OnboardingCommandService(db);
    const id = randomUUID();
    const otherId = randomUUID();
    const contactRef = `synthetic:${id.slice(0, 8)}`;
    const otherContact = `synthetic:${otherId.slice(0, 8)}`;
    const { NEST_READINESS_ITEMS } = await import("@ghuravia/domain");
    try {
      await activateAccount(activationSvc, id, contactRef);
      await activateAccount(activationSvc, otherId, otherContact);

      let version = 0;
      let outcome = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: version,
        command: {
          type: "BEGIN_QUICK_START",
          idempotencyKey: "nest-qs",
          actorRef: contactRef,
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
        },
      });
      version = outcome.aggregateVersion;

      outcome = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: version,
        command: {
          type: "COMPLETE_ORIGIN",
          idempotencyKey: "nest-origin",
          actorRef: contactRef,
          originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
          originRegionOption: "region.gulf",
          originExperienceOption: "exp.exploring",
          originGoalsOptions: ["goal.foundations"],
        },
      });
      version = outcome.aggregateVersion;

      outcome = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: version,
        command: {
          type: "START_NEST_ASSESSMENT",
          idempotencyKey: "nest-start",
          actorRef: contactRef,
          nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
        },
      });
      version = outcome.aggregateVersion;
      const attemptId = outcome.resource.nestReadiness.attemptId;
      assert.ok(attemptId);
      assert.equal(outcome.resource.nestReadiness.score, null);
      assert.equal(outcome.resource.nestReadiness.band, null);

      const attempts = await db
        .select()
        .from(schema.nestReadinessAttempts)
        .where(eq(schema.nestReadinessAttempts.id, attemptId));
      assert.equal(attempts.length, 1);
      assert.equal(attempts[0]!.onboardingId, id);

      for (const item of NEST_READINESS_ITEMS) {
        outcome = await onboardingSvc.execute({
          aggregateId: id,
          expectedVersion: version,
          command: {
            type: "SAVE_NEST_ANSWER",
            idempotencyKey: `ans-${item.id}`,
            actorRef: contactRef,
            nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
            nestItemId: item.id,
            nestOptionId: item.correctOptionId,
          },
        });
        version = outcome.aggregateVersion;
      }
      assert.equal(outcome.resource.nestReadiness.answerCount, 10);
      assert.equal(outcome.resource.nestReadiness.canSubmit, true);
      assert.equal(outcome.resource.nestReadiness.score, null);

      outcome = await onboardingSvc.execute({
        aggregateId: id,
        expectedVersion: version,
        command: {
          type: "SUBMIT_NEST_ASSESSMENT",
          idempotencyKey: "nest-submit",
          actorRef: contactRef,
          nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
        },
      });
      version = outcome.aggregateVersion;
      assert.equal(outcome.resource.state, "NEST_RESULT_READY");
      assert.equal(outcome.resource.nestReadiness.attemptStatus, "SUBMITTED");
      assert.equal(outcome.resource.nestReadiness.score, 100);
      assert.equal(outcome.resource.nestReadiness.band, "READY_TO_FLY");

      await assert.rejects(
        () =>
          onboardingSvc.execute({
            aggregateId: id,
            expectedVersion: version,
            command: {
              type: "SAVE_NEST_ANSWER",
              idempotencyKey: "after-submit",
              actorRef: contactRef,
              nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
              nestItemId: NEST_READINESS_ITEMS[0]!.id,
              nestOptionId: NEST_READINESS_ITEMS[0]!.correctOptionId,
            },
          }),
        /FORBIDDEN|INVALID_TRANSITION/,
      );

      await onboardingSvc.execute({
        aggregateId: otherId,
        expectedVersion: 0,
        command: {
          type: "BEGIN_QUICK_START",
          idempotencyKey: "other-qs",
          actorRef: otherContact,
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
        },
      });
      const otherResource = await onboardingSvc.get(otherId);
      assert.ok(otherResource);
      assert.notEqual(otherResource!.nestReadiness.attemptId, attemptId);
      const owned = await db
        .select()
        .from(schema.nestReadinessAttempts)
        .where(eq(schema.nestReadinessAttempts.id, attemptId!));
      assert.equal(owned[0]!.onboardingId, id);
      assert.notEqual(owned[0]!.onboardingId, otherId);
    } finally {
      await sql.end({ timeout: 5 });
    }
  },
);
