import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertCatalogParity,
  errorMessage,
  lockCopy,
  t,
} from "../lib/localization/format.js";
import { MESSAGE_KEYS } from "../lib/localization/messages.js";
import { ar } from "../lib/localization/ar.js";
import { en } from "../lib/localization/en.js";

test("Arabic and English catalogues have identical keys", () => {
  assertCatalogParity();
  assert.equal(Object.keys(ar).length, MESSAGE_KEYS.length);
  assert.equal(Object.keys(en).length, MESSAGE_KEYS.length);
});

test("default locale Arabic resolves product name", () => {
  assert.match(t("ar", "productName"), /غورا/);
});

test("error categories map without raw server text", () => {
  assert.equal(errorMessage("ar", "INTERNAL_ERROR"), ar.errInternal);
  assert.equal(errorMessage("en", "CHALLENGE_EXPIRED"), en.errChallengeExpired);
  assert.equal(
    errorMessage("en", "CATALOGUE_VERSION_CONFLICT"),
    en.errCatalogueVersionConflict,
  );
  assert.equal(
    errorMessage("ar", "ORIGIN_SCHEMA_CONFLICT"),
    ar.errOriginSchemaConflict,
  );
});

test("onboarding entry keys are present for guided and quick-start", () => {
  assert.ok(en.onb001Guided.length > 0);
  assert.ok(ar.onb001Guided.length > 0);
  assert.ok(en.onb001QuickStart.length > 0);
  assert.ok(ar.onb003DeferredNote.length > 0);
  assert.doesNotMatch(en.onb001Guided, /deferred to the next Gate/i);
});

test("lock catalogue covers required codes", () => {
  for (const code of [
    "EMAIL_NOT_VERIFIED",
    "TERMS_NOT_ACCEPTED",
    "ACCOUNT_RISK_NOT_ACCEPTED",
    "RECOVERY_REQUIRED",
    "RISK_REVIEW_REQUIRED",
    "ACCOUNT_SUSPENDED",
    "ACCOUNT_CLOSED",
  ] as const) {
    const arCopy = lockCopy("ar", code);
    const enCopy = lockCopy("en", code);
    assert.ok(arCopy.title.length > 0);
    assert.ok(enCopy.body.length > 0);
  }
});
