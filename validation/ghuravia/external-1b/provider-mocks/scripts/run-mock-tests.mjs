/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import assert from "node:assert/strict";
import test from "node:test";
import * as mocks from "../src/mocks.mjs";

test("all mocks preserve validation invariants", () => {
  assert.equal(mocks.identity("SYNTHETIC:user").authenticated, false);
  assert.equal(mocks.email("SYNTHETIC:user@example.com").delivered, false);
  assert.equal(mocks.mobile("SYNTHETIC:+15550001").delivered, false);
  assert.equal(mocks.payments("SYNTHETIC:token").status, "not-captured");
  assert.equal(mocks.objectStorage("SYNTHETIC:key").isolated, true);
  assert.equal(mocks.malwareScan().failClosed, true);
  assert.equal(mocks.secretScan().redacted, true);
  assert.equal(mocks.kms("SYNTHETIC:key").cloudKeyMaterial, false);
  assert.equal(mocks.realtime().status, "blocked");
  assert.equal(mocks.search("SYNTHETIC:q").scaleValidated, false);
  assert.equal(mocks.notifications("SYNTHETIC:n").delivered, false);
  assert.equal(mocks.observability("SYNTHETIC:e").productionExport, false);
  assert.equal(mocks.enterpriseSso("SYNTHETIC:s").enterpriseConfigured, false);
  assert.equal(mocks.governmentFederation("SYNTHETIC:s").governmentConnected, false);
  assert.throws(() => mocks.identity("real-user"));
});
