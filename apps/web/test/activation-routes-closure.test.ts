import assert from "node:assert/strict";
import { test } from "node:test";
import { canAccessScreen } from "../lib/activation-routes.js";

const incomplete = {
  state: "EMAIL_VERIFICATION_PENDING",
  gates: {
    emailVerified: false,
    termsAccepted: false,
    accountRiskAcceptable: false,
  },
  recoveryAvailable: false,
};

test("ACT-012 denied without recoverable condition", () => {
  const r = canAccessScreen("ACT-012", incomplete);
  assert.equal(r.allowed, false);
  assert.equal(r.redirectTo, "ACT-003");
});

test("ACT-012 denied when only gate-lock recoveryAvailable is true", () => {
  const r = canAccessScreen("ACT-012", {
    ...incomplete,
    recoveryAvailable: true,
  });
  assert.equal(r.allowed, false);
  assert.equal(r.redirectTo, "ACT-003");
});

test("ACT-012 allowed for ACTIVATION_RECOVERY_REQUIRED", () => {
  const r = canAccessScreen("ACT-012", {
    ...incomplete,
    state: "ACTIVATION_RECOVERY_REQUIRED",
    recoveryAvailable: true,
  });
  assert.equal(r.allowed, true);
});

test("protected screens deny null resource", () => {
  for (const id of [
    "ACT-005",
    "ACT-013",
    "ACT-006",
    "ACT-007",
    "ONB-001",
  ] as const) {
    const r = canAccessScreen(id, null);
    assert.equal(r.allowed, false);
  }
});

test("entry screens allow null resource for bootstrap", () => {
  assert.equal(canAccessScreen("ACT-003", null).allowed, true);
  assert.equal(canAccessScreen("ACT-011", null).allowed, true);
});
