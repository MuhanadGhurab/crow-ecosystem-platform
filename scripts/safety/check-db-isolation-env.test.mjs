/**
 * Static safety tests for check-db-isolation-env.mjs (no DB connect, no secrets).
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const root = process.cwd();
const script = join(root, "scripts/safety/check-db-isolation-env.mjs");

console.log("db-isolation-env:test");

test("script exists and forbids printing DATABASE_URL patterns carelessly", () => {
  const src = readFileSync(script, "utf8");
  assert.ok(src.includes("Never prints"));
  assert.ok(src.includes("fingerprint"));
  assert.ok(!src.includes("console.log(productionDb)"));
  assert.ok(!src.includes("console.log(previewDb)"));
  assert.ok(src.includes("wbwnsndcxrgyqwppurms"));
});

test("vercel.json has no migrate deploy", () => {
  const v = readFileSync(join(root, "vercel.json"), "utf8");
  assert.ok(!/db:migrate:deploy/.test(v));
  assert.ok(!/migrate\s+deploy/.test(v));
});

test("fails closed when env missing", () => {
  const r = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, PRODUCTION_DATABASE_URL: "", PREVIEW_DATABASE_URL: "" },
  });
  assert.notEqual(r.status, 0);
  assert.ok(r.stdout.includes("PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0"));
  assert.ok(!r.stdout.includes("postgresql://"));
});

test("detects shared known Production ref on Preview", () => {
  const dir = mkdtempSync(join(tmpdir(), "gap004-"));
  try {
    const prod = join(dir, "prod.env");
    const prev = join(dir, "prev.env");
    // Synthetic pooler-style URLs (fake password) — must not appear in stdout.
    writeFileSync(
      prod,
      "DATABASE_URL=postgresql://postgres.wbwnsndcxrgyqwppurms:secret-prod@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true\n",
    );
    writeFileSync(
      prev,
      "DATABASE_URL=postgresql://postgres.wbwnsndcxrgyqwppurms:secret-prev@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true\n",
    );
    const r = spawnSync(
      process.execPath,
      [script, `--production-env-file=${prod}`, `--preview-env-file=${prev}`],
      { cwd: root, encoding: "utf8", env: { ...process.env } },
    );
    assert.notEqual(r.status, 0);
    assert.ok(r.stdout.includes("PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0"));
    assert.ok(r.stdout.includes("share Supabase project ref") || r.stdout.includes("wbwnsndcxrgyqwppurms"));
    assert.ok(!r.stdout.includes("secret-prod"));
    assert.ok(!r.stdout.includes("secret-prev"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("proves isolation when refs differ", () => {
  const dir = mkdtempSync(join(tmpdir(), "gap004-"));
  try {
    const prod = join(dir, "prod.env");
    const prev = join(dir, "prev.env");
    writeFileSync(
      prod,
      "DATABASE_URL=postgresql://postgres.wbwnsndcxrgyqwppurms:secret-prod@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true\nDIRECT_URL=postgresql://postgres.wbwnsndcxrgyqwppurms:secret-prod@aws-0-eu-central-1.pooler.supabase.com:5432/postgres\n",
    );
    writeFileSync(
      prev,
      "DATABASE_URL=postgresql://postgres.abcdefghijklmnopqrst:secret-prev@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true\nDIRECT_URL=postgresql://postgres.abcdefghijklmnopqrst:secret-prev@aws-0-eu-central-1.pooler.supabase.com:5432/postgres\n",
    );
    const r = spawnSync(
      process.execPath,
      [script, `--production-env-file=${prod}`, `--preview-env-file=${prev}`],
      { cwd: root, encoding: "utf8", env: { ...process.env } },
    );
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.ok(r.stdout.includes("PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=1"));
    assert.ok(!r.stdout.includes("secret-prod"));
    assert.ok(!r.stdout.includes("secret-prev"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

console.log("db-isolation-env:test PASS");
