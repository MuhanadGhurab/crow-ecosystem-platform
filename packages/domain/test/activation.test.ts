import test from "node:test";
import assert from "node:assert/strict";
import {
  applyActivationCommand,
  canAcceptRisk,
  canAcceptTerms,
  isActivationComplete,
  MOBILE_VERIFICATION_IN_ACTIVATION_FORMULA,
  commercialEventCannotProgress,
  type Activation,
} from "../src/index.ts";

const base = (): Activation => ({
  id: "a1",
  state: "ACCOUNT_CLAIMED",
  version: 0,
  emailVerified: false,
  termsAccepted: false,
  accountRiskAcceptable: false,
});

test("ordered happy path reaches ACTIVATED only with full formula", () => {
  let a = base();
  a = applyActivationCommand(
    a,
    {
      type: "REQUEST_EMAIL_VERIFICATION",
      idempotencyKey: "1",
      actorRef: "u",
    },
    0,
  ).aggregate;
  a = applyActivationCommand(
    a,
    {
      type: "CONFIRM_EMAIL_VERIFICATION",
      idempotencyKey: "2",
      actorRef: "u",
    },
    1,
  ).aggregate;
  assert.equal(a.emailVerified, true);
  assert.throws(
    () =>
      applyActivationCommand(
        a,
        {
          type: "ACCEPT_ACCOUNT_RISK",
          idempotencyKey: "x",
          actorRef: "u",
        },
        2,
      ),
    /INVALID_TRANSITION/,
  );
  a = applyActivationCommand(
    a,
    {
      type: "ACCEPT_TERMS",
      idempotencyKey: "3",
      actorRef: "u",
      termsVersion: "t",
    },
    2,
  ).aggregate;
  assert.ok(canAcceptRisk(a));
  a = applyActivationCommand(
    a,
    {
      type: "ACCEPT_ACCOUNT_RISK",
      idempotencyKey: "4",
      actorRef: "u",
      riskDisclosureVersion: "r",
    },
    3,
  ).aggregate;
  assert.ok(isActivationComplete(a));
  a = applyActivationCommand(
    a,
    { type: "ACTIVATE", idempotencyKey: "5", actorRef: "u" },
    4,
  ).aggregate;
  assert.equal(a.state, "ACTIVATED");
});

test("stale version conflicts", () => {
  assert.throws(
    () =>
      applyActivationCommand(
        base(),
        {
          type: "REQUEST_EMAIL_VERIFICATION",
          idempotencyKey: "1",
          actorRef: "u",
        },
        9,
      ),
    /CONFLICT/,
  );
});

test("recovery cannot activate", () => {
  let a = base();
  a = applyActivationCommand(
    a,
    {
      type: "REQUEST_EMAIL_VERIFICATION",
      idempotencyKey: "1",
      actorRef: "u",
    },
    0,
  ).aggregate;
  a = applyActivationCommand(
    a,
    {
      type: "BEGIN_ACTIVATION_RECOVERY",
      idempotencyKey: "2",
      actorRef: "u",
    },
    1,
  ).aggregate;
  assert.throws(
    () =>
      applyActivationCommand(
        a,
        { type: "ACTIVATE", idempotencyKey: "3", actorRef: "u" },
        2,
      ),
    /INVALID_TRANSITION/,
  );
});

test("mobile is excluded from activation formula", () => {
  assert.equal(MOBILE_VERIFICATION_IN_ACTIVATION_FORMULA, false);
});

test("payment cannot activate or progress", () => {
  assert.deepEqual(commercialEventCannotProgress({ kind: "payment" }), {
    xp: 0,
    mastery: 0,
    trust: 0,
    prestige: 0,
  });
  assert.equal(canAcceptTerms(base()), false);
});
