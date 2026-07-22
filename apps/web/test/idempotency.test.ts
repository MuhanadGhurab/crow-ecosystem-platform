import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveIdempotencyKey } from "../lib/idempotency.js";

test("retries reuse the same idempotency key for one logical op", () => {
  const first = resolveIdempotencyKey(null, "accept-terms", "fp-1");
  const second = resolveIdempotencyKey(first.slot, "accept-terms", "fp-1");
  assert.equal(first.key, second.key);
});

test("new logical operation gets a new key", () => {
  const first = resolveIdempotencyKey(null, "accept-terms", "fp-1");
  const next = resolveIdempotencyKey(first.slot, "accept-terms", "fp-2");
  assert.notEqual(first.key, next.key);
});
