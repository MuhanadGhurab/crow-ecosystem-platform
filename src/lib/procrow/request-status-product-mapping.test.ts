/**
 * CROW.REQUEST.2 — product status mapping (no DB enum migration).
 */

import assert from "node:assert/strict";

import {
  mapPersistedStatusToIntakeQueueGroup,
  mapPersistedStatusToProductStatus,
  productStatusLabelForPersisted,
  REQUEST_INTAKE_QUEUE_GROUP_LABELS,
} from "@/lib/procrow/request-status-product-mapping";
import { requestStatusToOperatorQueueHint } from "@/lib/procrow/procrow-request-status-queue-hint";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("request-status-product-mapping:test");

test("PENDING_REVIEW maps to NEEDS_REVIEW product status", () => {
  assert.equal(mapPersistedStatusToProductStatus("PENDING_REVIEW"), "NEEDS_REVIEW");
  assert.equal(productStatusLabelForPersisted("PENDING_REVIEW"), "Needs review");
});

test("UNDER_DISCOVERY maps to CONVERTED_TO_DISCOVERY", () => {
  assert.equal(mapPersistedStatusToProductStatus("UNDER_DISCOVERY"), "CONVERTED_TO_DISCOVERY");
});

test("REJECTED maps to DECLINED", () => {
  assert.equal(mapPersistedStatusToProductStatus("REJECTED"), "DECLINED");
});

test("intake queue groups cover submitted and discovery", () => {
  assert.equal(mapPersistedStatusToIntakeQueueGroup("PENDING_REVIEW"), "submitted_needs_review");
  assert.equal(mapPersistedStatusToIntakeQueueGroup("UNDER_DISCOVERY"), "ready_for_discovery");
  assert.ok(REQUEST_INTAKE_QUEUE_GROUP_LABELS.submitted_needs_review.includes("Submitted"));
});

test("operator queue hint includes product language for PENDING_REVIEW", () => {
  const hint = requestStatusToOperatorQueueHint("PENDING_REVIEW");
  assert.ok(hint.includes("PENDING_REVIEW"));
  assert.ok(hint.toLowerCase().includes("needs review") || hint.includes("Submitted"));
});

console.log("request-status-product-mapping:test PASS");
