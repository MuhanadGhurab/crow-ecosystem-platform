import assert from "node:assert/strict";
import { test } from "node:test";
import { assertLocalRuntime } from "../lib/session.js";

const basePreview = {
  GHURAVIA_RUNTIME_MODE: "controlled_preview",
  GHURAVIA_DATA_CLASSIFICATION: "demo_only",
  GHURAVIA_PREVIEW_PROJECT_REF: "xmuawtodfuavwebxrqpt",
  GHURAVIA_DATABASE_URL:
    "postgresql://ghuravia_preview.xmuawtodfuavwebxrqpt:secret@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require",
  GHURAVIA_APP_VERSION: "0.3.0-preview",
  GHURAVIA_SYNTHETIC_SESSION_SECRET: "ci-synthetic-session-secret-32b",
  ALLOW_SHARED_DEMO_BACKEND: "false",
};

function withEnv(
  env: Record<string, string | undefined>,
  fn: () => void,
): void {
  const keys = Object.keys({ ...basePreview, ...env, VERCEL_ENV: "x" });
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

test("assertLocalRuntime allows verified Preview and denies Production", () => {
  withEnv({ ...basePreview, VERCEL_ENV: "preview" }, () => {
    assert.doesNotThrow(() => assertLocalRuntime());
  });
  withEnv({ ...basePreview, VERCEL_ENV: "production" }, () => {
    assert.throws(() => assertLocalRuntime());
  });
  withEnv({ ...basePreview, VERCEL_ENV: undefined }, () => {
    assert.throws(() => assertLocalRuntime());
  });
});
