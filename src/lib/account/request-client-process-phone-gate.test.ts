/**
 * CROW.REQUEST.2 — client-process phone gate (constitution) vs deferred enrollment phone policy.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  accountMissingClientProcessPhone,
  isClientProcessPhoneVerificationRequired,
  isPhoneVerificationFlowEnabled,
  isPhoneVerificationRequired,
} from "@/lib/account/phone-verification-policy";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const prevEnrollment = process.env.CROW_PHONE_VERIFICATION_REQUIRED;
const prevClient = process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED;

function restoreEnv() {
  if (prevEnrollment === undefined) {
    delete process.env.CROW_PHONE_VERIFICATION_REQUIRED;
  } else {
    process.env.CROW_PHONE_VERIFICATION_REQUIRED = prevEnrollment;
  }
  if (prevClient === undefined) {
    delete process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED;
  } else {
    process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED = prevClient;
  }
}

console.log("request-client-process-phone-gate:test");

try {
  test("enrollment phone policy remains deferred by default", () => {
    delete process.env.CROW_PHONE_VERIFICATION_REQUIRED;
    assert.equal(isPhoneVerificationRequired(), false);
  });

  test("client-process phone required by default (constitution)", () => {
    delete process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED;
    assert.equal(isClientProcessPhoneVerificationRequired(), true);
  });

  test("client-process phone can be waived only with explicit false", () => {
    process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED = "false";
    assert.equal(isClientProcessPhoneVerificationRequired(), false);
    delete process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED;
    assert.equal(isClientProcessPhoneVerificationRequired(), true);
  });

  test("accountMissingClientProcessPhone detects unverified phone", () => {
    delete process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED;
    assert.equal(accountMissingClientProcessPhone({ phoneVerifiedAt: null }), true);
    assert.equal(accountMissingClientProcessPhone({ phoneVerifiedAt: new Date() }), false);
    assert.equal(accountMissingClientProcessPhone(null), true);
  });

  test("requireClientAccess enforces client-process phone gate", () => {
    const session = readFileSync(join(process.cwd(), "src/lib/auth/session.ts"), "utf8");
    assert.ok(session.includes("enforceClientProcessPhoneGate"));
    assert.ok(session.includes("requireClientAccess"));
    assert.ok(session.includes("verifyPhone"));
  });

  test("phone verification flow enabled when client-process requires phone", () => {
    delete process.env.CROW_PHONE_VERIFICATION_REQUIRED;
    delete process.env.CROW_CLIENT_PROCESS_PHONE_REQUIRED;
    assert.equal(isPhoneVerificationFlowEnabled(), true);
  });

  test("verify-phone page allows client-process path", () => {
    const page = readFileSync(join(process.cwd(), "src/app/onboarding/verify-phone/page.tsx"), "utf8");
    assert.ok(page.includes("isPhoneVerificationFlowEnabled"));
    assert.ok(page.includes("client-process"));
  });

  test("submit path blocks unverified phone without faking OTP", () => {
    const svc = readFileSync(
      join(process.cwd(), "src/lib/services/client-service-request.service.ts"),
      "utf8",
    );
    assert.ok(svc.includes("accountMissingClientProcessPhone"));
    assert.ok(svc.includes("Verify your mobile phone"));
    assert.ok(!svc.includes("phoneVerifiedAt: new Date()"));
    assert.ok(!svc.includes("fakePhone"));
  });
} finally {
  restoreEnv();
}

console.log("request-client-process-phone-gate:test PASS");
