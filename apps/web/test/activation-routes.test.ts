import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canAccessScreen,
  isAllowedReturnTo,
  resolveAuthorizedScreen,
} from "../lib/activation-routes.js";

const base = {
  state: "EMAIL_VERIFIED",
  gates: {
    emailVerified: true,
    termsAccepted: false,
    accountRiskAcceptable: false,
  },
  recoveryAvailable: false,
};

test("terms locked before email verification", () => {
  const r = canAccessScreen("ACT-005", {
    ...base,
    gates: {
      emailVerified: false,
      termsAccepted: false,
      accountRiskAcceptable: false,
    },
  });
  assert.equal(r.allowed, false);
  assert.equal(r.redirectTo, "ACT-003");
});

test("onboarding entry requires activation", () => {
  const r = canAccessScreen("ONB-001", base);
  assert.equal(r.allowed, false);
});

test("activated account may enter ACT-007 and ONB-001", () => {
  const activated = {
    state: "ACTIVATED",
    gates: {
      emailVerified: true,
      termsAccepted: true,
      accountRiskAcceptable: true,
    },
    recoveryAvailable: false,
  };
  assert.equal(canAccessScreen("ACT-007", activated).allowed, true);
  assert.equal(canAccessScreen("ONB-001", activated).allowed, true);
  assert.equal(resolveAuthorizedScreen(activated), "ACT-006");
});

test("open redirects are rejected", () => {
  assert.equal(isAllowedReturnTo("https://evil.example"), false);
  assert.equal(isAllowedReturnTo("/activation/complete"), true);
  assert.equal(isAllowedReturnTo("/onboarding/entry"), true);
});
