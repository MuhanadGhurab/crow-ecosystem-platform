/**
 * CROW.REQUEST.2 / CROW.PROCROW.1 — product status mapping (no DB enum migration).
 */

import assert from "node:assert/strict";

import {
  mapPersistedStatusToIntakeQueueGroup,
  mapPersistedStatusToProductStatus,
  productStatusLabelForPersisted,
  REQUEST_INTAKE_QUEUE_GROUP_LABELS,
  resolveEffectiveProductStatus,
} from "@/lib/procrow/request-status-product-mapping";
import { requestStatusToOperatorQueueHint } from "@/lib/procrow/procrow-request-status-queue-hint";
import type { ProcrowQualification } from "@/lib/procrow/procrow-qualification";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const sampleQualification = (
  outcome: ProcrowQualification["outcome"],
): ProcrowQualification => ({
  outcome,
  operatorNote: null,
  recordedAt: "2026-07-18T00:00:00.000Z",
  recordedByPlatformAccountId: "acct_test",
});

console.log("request-status-product-mapping:test");

test("PENDING_REVIEW maps to NEEDS_QUALIFICATION_REVIEW product status", () => {
  assert.equal(mapPersistedStatusToProductStatus("PENDING_REVIEW"), "NEEDS_QUALIFICATION_REVIEW");
  assert.equal(productStatusLabelForPersisted("PENDING_REVIEW"), "Needs qualification review");
});

test("qualification overlay refines PENDING_REVIEW product status", () => {
  assert.equal(
    resolveEffectiveProductStatus("PENDING_REVIEW", sampleQualification("needs_more_information")),
    "NEEDS_MORE_INFORMATION",
  );
  assert.equal(
    resolveEffectiveProductStatus("PENDING_REVIEW", sampleQualification("qualified_for_discovery")),
    "QUALIFIED_FOR_DISCOVERY",
  );
  assert.equal(
    resolveEffectiveProductStatus("PENDING_REVIEW", sampleQualification("declined")),
    "DECLINED",
  );
});

test("UNDER_DISCOVERY maps to CONVERTED_TO_DISCOVERY", () => {
  assert.equal(mapPersistedStatusToProductStatus("UNDER_DISCOVERY"), "CONVERTED_TO_DISCOVERY");
});

test("REJECTED maps to DECLINED", () => {
  assert.equal(mapPersistedStatusToProductStatus("REJECTED"), "DECLINED");
});

test("intake queue groups cover submitted, more-info, qualified, discovery", () => {
  assert.equal(mapPersistedStatusToIntakeQueueGroup("PENDING_REVIEW"), "submitted_needs_review");
  assert.equal(
    mapPersistedStatusToIntakeQueueGroup(
      "PENDING_REVIEW",
      sampleQualification("needs_more_information"),
    ),
    "needs_more_information",
  );
  assert.equal(
    mapPersistedStatusToIntakeQueueGroup(
      "PENDING_REVIEW",
      sampleQualification("qualified_for_discovery"),
    ),
    "qualified_for_discovery",
  );
  assert.equal(mapPersistedStatusToIntakeQueueGroup("UNDER_DISCOVERY"), "ready_for_discovery");
  assert.ok(REQUEST_INTAKE_QUEUE_GROUP_LABELS.submitted_needs_review.includes("Submitted"));
});

test("operator queue hint includes product language for PENDING_REVIEW", () => {
  const hint = requestStatusToOperatorQueueHint("PENDING_REVIEW");
  assert.ok(hint.includes("PENDING_REVIEW"));
  assert.ok(
    hint.toLowerCase().includes("qualification") || hint.includes("Submitted"),
    `unexpected hint: ${hint}`,
  );
});

console.log("request-status-product-mapping:test PASS");
