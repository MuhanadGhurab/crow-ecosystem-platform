import test from "node:test";
import assert from "node:assert/strict";
import {
  applyActivationCommand,
  commercialEventCannotProgress,
  evidenceOutcome,
  publicProfile,
} from "@ghuravia/domain";
import { loadConfig } from "@ghuravia/config";
import { emailDeliveryMock } from "@ghuravia/provider-mocks";
const base = {
  id: "a",
  state: "ACCOUNT_CLAIMED" as const,
  version: 0,
  commandKeys: [],
};
test("activation is server-authoritative and ordered", () => {
  assert.throws(
    () =>
      applyActivationCommand(
        base,
        { type: "ACTIVATE", idempotencyKey: "x", actorRef: "server" },
        0,
      ),
    /INVALID_TRANSITION/,
  );
  const pending = applyActivationCommand(
    base,
    {
      type: "REQUEST_EMAIL_VERIFICATION",
      idempotencyKey: "x",
      actorRef: "server",
    },
    0,
  );
  assert.equal(pending.aggregate.state, "EMAIL_VERIFICATION_PENDING");
});
test("commercial events never create progression", () =>
  assert.deepEqual(commercialEventCannotProgress({ kind: "payment" }), {
    xp: 0,
    mastery: 0,
    trust: 0,
    prestige: 0,
  }));
test("evidence fails closed and trust is private", () => {
  assert.equal(evidenceOutcome(false, true), "quarantine");
  assert.deepEqual(publicProfile({ displayName: "Raven" }), {
    displayName: "Raven",
  });
});
test("email delivery is not verification or mutation", () =>
  assert.equal(emailDeliveryMock("success").provider, "email-delivery"));
test("config rejects external databases", () =>
  assert.throws(
    () =>
      loadConfig({
        GHURAVIA_RUNTIME_MODE: "automated_test",
        GHURAVIA_DATABASE_URL: "postgresql://db.example/ghuravia_test_a",
        GHURAVIA_APP_VERSION: "0",
      }),
    /LOCAL_RUNTIME_ONLY/,
  ));
