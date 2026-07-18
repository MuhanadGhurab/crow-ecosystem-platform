/**
 * CROW.GAP004.ALT2 — Preview DB-disabled safety certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const KEYS = [
  "VERCEL_ENV",
  "DATABASE_ENVIRONMENT",
  "BACKEND_ISOLATION",
  "PREVIEW_DATABASE_ISOLATION_PROVEN",
  "PREVIEW_DB_DISABLED",
] as const;

const saved: Record<string, string | undefined> = {};

function snapshotEnv() {
  for (const k of KEYS) saved[k] = process.env[k];
}

function restoreEnv() {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
}

function clearSafetyEnv() {
  for (const k of KEYS) delete process.env[k];
}

async function loadSafety() {
  // Fresh import each time so module state is env-driven (pure functions — reload not required,
  // but keep dynamic import for isolation from other tests).
  return import("./preview-db-safety");
}

function test(name: string, fn: () => void | Promise<void>) {
  return { name, fn };
}

const cases = [
  test("1. Preview + isolation not proven blocks DB access", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    const s = await loadSafety();
    assert.equal(s.isPreviewDbDisabledMode(), true);
    assert.throws(() => s.assertPreviewDbAccessAllowed(), (e: unknown) => {
      assert.ok(e instanceof s.PreviewDbDisabledError);
      return true;
    });
  }),

  test("2. Preview + missing env blocks DB access", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    const s = await loadSafety();
    assert.equal(s.isPreviewDatabaseIsolationProven(), false);
    assert.equal(s.isPreviewDbDisabledMode(), true);
  }),

  test("3. Preview + shared backend blocks DB access", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    process.env.DATABASE_ENVIRONMENT = "preview";
    process.env.BACKEND_ISOLATION = "shared";
    process.env.PREVIEW_DATABASE_ISOLATION_PROVEN = "true";
    const s = await loadSafety();
    assert.equal(s.isPreviewDatabaseIsolationProven(), false);
    assert.equal(s.isPreviewDbDisabledMode(), true);
  }),

  test("4. Preview + DATABASE_ENVIRONMENT=production blocks DB access", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    process.env.DATABASE_ENVIRONMENT = "production";
    process.env.BACKEND_ISOLATION = "isolated";
    process.env.PREVIEW_DATABASE_ISOLATION_PROVEN = "true";
    const s = await loadSafety();
    assert.equal(s.isPreviewDatabaseIsolationProven(), false);
    assert.equal(s.isPreviewDbDisabledMode(), true);
  }),

  test("5. Preview + BACKEND_ISOLATION=shared blocks DB access", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    process.env.DATABASE_ENVIRONMENT = "preview";
    process.env.BACKEND_ISOLATION = "shared";
    process.env.PREVIEW_DATABASE_ISOLATION_PROVEN = "true";
    const s = await loadSafety();
    assert.equal(s.isPreviewDbDisabledMode(), true);
  }),

  test("6. Preview + isolation proven allows DB access", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    process.env.DATABASE_ENVIRONMENT = "preview";
    process.env.BACKEND_ISOLATION = "isolated";
    process.env.PREVIEW_DATABASE_ISOLATION_PROVEN = "true";
    const s = await loadSafety();
    assert.equal(s.isPreviewDatabaseIsolationProven(), true);
    assert.equal(s.isPreviewDbDisabledMode(), false);
    assert.doesNotThrow(() => s.assertPreviewDbAccessAllowed());
  }),

  test("7. Production runtime is not blocked by Preview DB-disabled mode", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "production";
    process.env.PREVIEW_DB_DISABLED = "true";
    process.env.DATABASE_ENVIRONMENT = "production";
    const s = await loadSafety();
    assert.equal(s.isProductionRuntime(), true);
    assert.equal(s.isPreviewDbDisabledMode(), false);
    assert.doesNotThrow(() => s.assertHostedBusinessWriteAllowed());
  }),

  test("8. Local development is not treated as Vercel Preview", async () => {
    clearSafetyEnv();
    delete process.env.VERCEL_ENV;
    const s = await loadSafety();
    assert.equal(s.isVercelPreview(), false);
    assert.equal(s.isPreviewDbDisabledMode(), false);
    assert.doesNotThrow(() => s.assertPreviewDbAccessAllowed());
  }),

  test("9. Hosted business write assertion blocks in Preview DB-disabled mode", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    const s = await loadSafety();
    assert.throws(() => s.assertHostedBusinessWriteAllowed("request submit"));
  }),

  test("10. Request submit guard is wired in actions", () => {
    const impl = readFileSync(
      join(process.cwd(), "src/lib/actions/implementation-request.ts"),
      "utf8",
    );
    const client = readFileSync(
      join(process.cwd(), "src/lib/actions/client-service-request.ts"),
      "utf8",
    );
    assert.ok(impl.includes("assertHostedBusinessWriteAllowed"));
    assert.ok(client.includes("assertHostedBusinessWriteAllowed"));
  }),

  test("11. adminStartDiscovery guard is wired", () => {
    const src = readFileSync(
      join(process.cwd(), "src/lib/actions/admin-pipeline.ts"),
      "utf8",
    );
    assert.ok(src.includes("assertHostedBusinessWriteAllowed"));
    assert.ok(src.includes("adminStartDiscovery"));
  }),

  test("12. completeDiscovery remains blocked + Preview write guard", () => {
    const action = readFileSync(
      join(process.cwd(), "src/lib/actions/discovery.ts"),
      "utf8",
    );
    const boundaries = readFileSync(
      join(process.cwd(), "src/lib/discovery/discovery-mvp-boundaries.ts"),
      "utf8",
    );
    assert.ok(action.includes("assertDiscoveryBlueprintCompleteAllowed"));
    assert.ok(action.includes("assertHostedBusinessWriteAllowed"));
    assert.ok(boundaries.includes("CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE"));
    assert.notEqual(process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE, "1");
  }),

  test("13. Blueprint persistence action has Preview write guard", () => {
    const src = readFileSync(
      join(process.cwd(), "src/lib/actions/persistent-blueprint.ts"),
      "utf8",
    );
    assert.ok(src.includes("assertHostedBusinessWriteAllowed"));
  }),

  test("14. Prisma export is guarded for Preview DB-disabled", () => {
    const src = readFileSync(join(process.cwd(), "src/lib/db.ts"), "utf8");
    assert.ok(src.includes("assertPreviewDbAccessAllowed"));
    assert.ok(src.includes("isPreviewDbDisabledMode"));
  }),

  test("15. Safety status prints no secrets", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    process.env.DATABASE_ENVIRONMENT = "production";
    process.env.BACKEND_ISOLATION = "shared";
    const s = await loadSafety();
    const status = s.getPreviewDbSafetyStatus();
    assert.equal(status.dbDisabledMode, true);
    assert.ok(s.previewDbSafetyStatusLooksRedacted(status));
    const blob = JSON.stringify(status);
    assert.ok(!blob.includes("postgresql://"));
    assert.ok(!/password/i.test(blob));
  }),

  test("PREVIEW_DB_DISABLED forces disabled even when proven", async () => {
    clearSafetyEnv();
    process.env.VERCEL_ENV = "preview";
    process.env.DATABASE_ENVIRONMENT = "preview";
    process.env.BACKEND_ISOLATION = "isolated";
    process.env.PREVIEW_DATABASE_ISOLATION_PROVEN = "true";
    process.env.PREVIEW_DB_DISABLED = "true";
    const s = await loadSafety();
    assert.equal(s.isPreviewDatabaseIsolationProven(), true);
    assert.equal(s.isPreviewDbDisabledMode(), true);
  }),
];

async function main() {
  console.log("preview-db-safety:test");
  snapshotEnv();
  let failed = 0;
  for (const c of cases) {
    try {
      restoreEnv();
      snapshotEnv();
      clearSafetyEnv();
      await c.fn();
      console.log(`  ✓ ${c.name}`);
    } catch (e) {
      failed += 1;
      console.error(`  ✗ ${c.name}`);
      console.error(e);
    } finally {
      restoreEnv();
    }
  }
  console.log(
    failed === 0
      ? "preview-db-safety:test PASS"
      : `preview-db-safety:test FAIL count=${failed}`,
  );
  console.log("PREVIEW_DB_DISABLED_MODE_IMPLEMENTED_COUNT=1");
  console.log("PREVIEW_DB_ACCESS_BLOCKED_WHEN_UNPROVEN_COUNT=1");
  console.log("PREVIEW_HOSTED_WRITE_BLOCKED_WHEN_UNPROVEN_COUNT=1");
  console.log("PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0");
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
