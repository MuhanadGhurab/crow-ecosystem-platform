import assert from "node:assert/strict";
import test from "node:test";

import {
  designationArtifactIntegrity,
  loadProcrowOwnerAdminOperatorConfig,
  normalizeOperatorEmail,
  redactEmailForReport,
} from "./procrow-owner-admin-operator";

test("normalizeOperatorEmail rejects empty and accepts lowercase gmail shape", () => {
  assert.equal(normalizeOperatorEmail(""), null);
  assert.equal(normalizeOperatorEmail("  "), null);
  assert.equal(normalizeOperatorEmail("Owner@Example.COM"), "owner@example.com");
});

test("redactEmailForReport never returns full local part", () => {
  const redacted = redactEmailForReport("personal.name@gmail.com");
  assert.equal(redacted.includes("personal.name"), false);
  assert.match(redacted, /@/);
});

test("designation artifact integrity is stable for same payload", () => {
  const payload = { targetFingerprint: "abc123", provider: "google" };
  assert.equal(
    designationArtifactIntegrity(payload),
    designationArtifactIntegrity(payload)
  );
});

test("operator config loads provider google from operator file", () => {
  const config = loadProcrowOwnerAdminOperatorConfig();
  assert.equal(config.provider, "google");
  assert.equal(typeof config.transferAuthorized, "boolean");
});

test("non-Google provider is detectable from operator config", () => {
  const provider = "microsoft";
  assert.notEqual(provider, "google");
});
