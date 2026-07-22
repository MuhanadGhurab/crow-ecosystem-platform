import assert from "node:assert/strict";
import { test } from "node:test";
import { assertLocalRuntime } from "../lib/session.js";

test("assertLocalRuntime rejects deployment markers", () => {
  const prev = process.env.GHURAVIA_DEPLOYMENT_MARKERS;
  process.env.GHURAVIA_DEPLOYMENT_MARKERS = "1";
  try {
    assert.throws(() => assertLocalRuntime(), /LOCAL_RUNTIME_ONLY/);
  } finally {
    if (prev === undefined) delete process.env.GHURAVIA_DEPLOYMENT_MARKERS;
    else process.env.GHURAVIA_DEPLOYMENT_MARKERS = prev;
  }
});
