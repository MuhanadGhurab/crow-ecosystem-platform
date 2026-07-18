/**
 * CROW.DEVFLOW.4 — Alpha demo backend runtime gate + write-guard certification.
 * Pure unit tests — no DB connection, no Prisma import.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const KEYS = [
  "VERCEL_ENV",
  "CROW_RUNTIME_MODE",
  "CROW_DATA_CLASSIFICATION",
  "CROW_ALLOW_REAL_CUSTOMER_DATA",
  "ALLOW_SHARED_DEMO_BACKEND",
  "CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE",
  "CROW_PAYMENT_ENABLED",
  "CROW_ALLOW_PAYMENT_RUNTIME",
  "CROW_TENANT_GO_LIVE_ENABLED",
  "CROW_ALLOW_TENANT_PROVISIONING",
  "DATABASE_URL",
  "DIRECT_URL",
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

function clearEnv() {
  for (const k of KEYS) delete process.env[k];
}

/** Minimal flags for an enabled alpha demo backend (no blockers). */
function enableDemoBackendFlags() {
  clearEnv();
  process.env.CROW_RUNTIME_MODE = "alpha_development";
  process.env.CROW_DATA_CLASSIFICATION = "demo_only";
  process.env.ALLOW_SHARED_DEMO_BACKEND = "true";
}

async function loadMode() {
  return import("./alpha-demo-backend-mode");
}

async function loadGuard() {
  return import("./alpha-demo-write-guard");
}

function test(name: string, fn: () => void | Promise<void>) {
  return { name, fn };
}

const VALID_MARKERS = {
  isDemo: true as const,
  dataClassification: "demo_only" as const,
  runtimeMode: "alpha_development" as const,
  notProduction: true as const,
};

const cases = [
  test("1. disabled by default", async () => {
    clearEnv();
    const m = await loadMode();
    assert.equal(m.isAlphaDemoBackendModeEnabled(), false);
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("missing_allow_shared_demo_backend"));
  }),

  test("2. enabled only when all required flags are present", async () => {
    enableDemoBackendFlags();
    const m = await loadMode();
    assert.equal(m.isAlphaDemoBackendModeEnabled(), true);
    const status = m.getAlphaDemoBackendModeStatus();
    assert.equal(status.enabled, true);
    assert.equal(status.decision.allowed, true);
    assert.deepEqual(status.decision.reasons, []);
  }),

  test("3. missing ALLOW_SHARED_DEMO_BACKEND blocks", async () => {
    clearEnv();
    process.env.CROW_RUNTIME_MODE = "alpha_development";
    process.env.CROW_DATA_CLASSIFICATION = "demo_only";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("missing_allow_shared_demo_backend"));
  }),

  test("4. real customer data flag blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_ALLOW_REAL_CUSTOMER_DATA = "true";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("real_customer_data_flag"));
  }),

  test("5. commercial production mode blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_RUNTIME_MODE = "commercial_production";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("commercial_production_mode"));
    assert.ok(d.reasons.includes("runtime_mode_not_alpha_development"));
  }),

  test("6. production-sensitive classification blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_DATA_CLASSIFICATION = "production_sensitive_blocked";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("production_sensitive_classification"));
    assert.ok(d.reasons.includes("data_classification_not_demo_only"));
  }),

  test("7. payment enabled blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_PAYMENT_ENABLED = "true";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("payment_enabled"));
  }),

  test("8. Blueprint generation enabled blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE = "1";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("blueprint_generation_enabled"));
  }),

  test("9. tenant go-live enabled blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_TENANT_GO_LIVE_ENABLED = "true";
    const m = await loadMode();
    const d = m.evaluateAlphaDemoBackendMode();
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("tenant_go_live_enabled"));
  }),

  test("10. allowed demo action with full markers passes", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("demo_request_create", VALID_MARKERS);
    assert.equal(d.allowed, true);
    assert.deepEqual(d.reasons, []);
    assert.doesNotThrow(() =>
      g.assertAlphaDemoWriteAllowed("demo_discovery_draft_save", VALID_MARKERS),
    );
  }),

  test("11. non-allowlisted action blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("random_write", VALID_MARKERS);
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("action_not_allowlisted"));
  }),

  test("12. missing isDemo blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("demo_feedback_save", {
      ...VALID_MARKERS,
      isDemo: false,
    });
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("is_demo_not_true"));
  }),

  test("13. missing notProduction blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("demo_feedback_save", {
      isDemo: true,
      dataClassification: "demo_only",
      runtimeMode: "alpha_development",
      notProduction: false as unknown as true,
    });
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("not_production_not_true"));
  }),

  test("14. wrong dataClassification blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("demo_feedback_save", {
      ...VALID_MARKERS,
      dataClassification: "internal_test" as "demo_only",
    });
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("data_classification_not_demo_only"));
  }),

  test("15. wrong runtimeMode blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("demo_feedback_save", {
      ...VALID_MARKERS,
      runtimeMode: "demo_sandbox" as "alpha_development",
    });
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("runtime_mode_not_alpha_development"));
  }),

  test("16. Blueprint action attempt blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("blueprint_generate", VALID_MARKERS);
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("forbidden_action"));
    assert.ok(d.reasons.includes("blueprint_intent"));
  }),

  test("17. payment action attempt blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("payment_checkout", VALID_MARKERS);
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("forbidden_action"));
    assert.ok(d.reasons.includes("payment_intent"));
  }),

  test("18. tenant action attempt blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard("tenant_provision", VALID_MARKERS);
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("forbidden_action"));
    assert.ok(d.reasons.includes("tenant_intent"));
  }),

  test("19. CroAI production action attempt blocks", async () => {
    enableDemoBackendFlags();
    const g = await loadGuard();
    const d = g.evaluateAlphaDemoWriteGuard(
      "croai_production_action",
      VALID_MARKERS,
    );
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("forbidden_action"));
    assert.ok(d.reasons.includes("croai_intent"));
  }),

  test("20. no secrets printed", async () => {
    enableDemoBackendFlags();
    process.env.DATABASE_URL =
      "postgresql://user:supersecretpassword@db.example.com:5432/crow";
    process.env.DIRECT_URL =
      "postgresql://user:supersecretpassword@db.example.com:5432/crow";
    const m = await loadMode();
    const status = m.getAlphaDemoBackendModeStatus();
    const blob = JSON.stringify(status);
    assert.equal(m.alphaDemoBackendModeStatusLooksRedacted(status), true);
    assert.doesNotMatch(blob, /supersecretpassword/i);
    assert.doesNotMatch(blob, /postgresql:\/\//i);
    assert.doesNotMatch(blob, /DATABASE_URL/);
  }),

  test("21. no DB connection attempted", async () => {
    // Guard modules must not reference prisma / pg / neon clients.
    const modeSrc = readFileSync(
      join(process.cwd(), "src/lib/runtime/alpha-demo-backend-mode.ts"),
      "utf8",
    );
    const guardSrc = readFileSync(
      join(process.cwd(), "src/lib/runtime/alpha-demo-write-guard.ts"),
      "utf8",
    );
    for (const src of [modeSrc, guardSrc]) {
      assert.doesNotMatch(src, /from\s+["']@prisma/);
      assert.doesNotMatch(src, /from\s+["']prisma/);
      assert.doesNotMatch(src, /new\s+PrismaClient/);
      assert.doesNotMatch(src, /pg\.Pool|from\s+["']pg["']/);
      assert.doesNotMatch(src, /@neondatabase|neon\(/);
    }
    enableDemoBackendFlags();
    const g = await loadGuard();
    g.evaluateAlphaDemoWriteGuard("demo_request_create", VALID_MARKERS);
    // If we reached here without network/DB side effects, pass.
    assert.equal(true, true);
  }),

  test("22. no Prisma import required", async () => {
    const modeSrc = readFileSync(
      join(process.cwd(), "src/lib/runtime/alpha-demo-backend-mode.ts"),
      "utf8",
    );
    const guardSrc = readFileSync(
      join(process.cwd(), "src/lib/runtime/alpha-demo-write-guard.ts"),
      "utf8",
    );
    const testSrc = readFileSync(
      join(process.cwd(), "src/lib/runtime/alpha-demo-backend-guard.test.ts"),
      "utf8",
    );
    for (const src of [modeSrc, guardSrc, testSrc]) {
      assert.doesNotMatch(src, /from\s+["'][^"']*prisma[^"']*["']/i);
      assert.doesNotMatch(src, /require\s*\(\s*["'][^"']*prisma/i);
      assert.doesNotMatch(src, /import\s*\(\s*["'][^"']*prisma/i);
    }
    // Dynamic import of guards must succeed without Prisma client modules.
    enableDemoBackendFlags();
    const [m, g] = await Promise.all([loadMode(), loadGuard()]);
    assert.equal(typeof m.isAlphaDemoBackendModeEnabled, "function");
    assert.equal(typeof g.evaluateAlphaDemoWriteGuard, "function");
    assert.equal(g.ALPHA_DEMO_WRITE_ACTIONS.length, 6);
  }),
];

async function main() {
  snapshotEnv();
  let failed = 0;
  for (const c of cases) {
    try {
      clearEnv();
      await c.fn();
      console.log(`PASS  ${c.name}`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL  ${c.name}`);
      console.error(err);
    } finally {
      restoreEnv();
    }
  }
  restoreEnv();
  if (failed > 0) {
    console.error(`\n${failed} failed / ${cases.length} total`);
    process.exit(1);
  }
  console.log(`\nAll ${cases.length} alpha-demo-backend-guard tests passed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
