import assert from "node:assert/strict";
import { test } from "node:test";
import {
  loadConfig,
  runtimeGuardMatrix,
  FORBIDDEN_DATABASE_FINGERPRINTS,
} from "../src/index.ts";

function withEnv(
  env: Record<string, string | undefined>,
  fn: () => void,
): void {
  const keys = new Set([
    ...Object.keys(env),
    "GHURAVIA_RUNTIME_MODE",
    "GHURAVIA_DATABASE_URL",
    "GHURAVIA_APP_VERSION",
    "GHURAVIA_SYNTHETIC_SESSION_SECRET",
    "GHURAVIA_DATA_CLASSIFICATION",
    "GHURAVIA_PREVIEW_PROJECT_REF",
    "ALLOW_SHARED_DEMO_BACKEND",
    "VERCEL_ENV",
    "CI",
  ]);
  const prev: Record<string, string | undefined> = {};
  for (const k of keys) {
    prev[k] = process.env[k];
    delete process.env[k];
  }
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    fn();
  } finally {
    for (const k of keys) {
      if (prev[k] === undefined) delete process.env[k];
      else process.env[k] = prev[k];
    }
  }
}

test("runtime guard matrix is deterministic", () => {
  for (const row of runtimeGuardMatrix()) {
    withEnv(row.env, () => {
      if (row.expect === "ALLOW") {
        assert.doesNotThrow(() => loadConfig(process.env));
      } else {
        assert.throws(() => loadConfig(process.env));
      }
    });
  }
});

test("forbidden Production fingerprints remain listed", () => {
  assert.ok(
    FORBIDDEN_DATABASE_FINGERPRINTS.some((f) =>
      f.includes("wbwnsndcxrgyqwppurms"),
    ),
  );
});
