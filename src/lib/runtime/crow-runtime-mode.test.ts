/**
 * CROW.DEVFLOW.2 — Alpha runtime mode + banner certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const KEYS = [
  "VERCEL_ENV",
  "CROW_RUNTIME_MODE",
  "CROW_DATA_CLASSIFICATION",
  "CROW_ALLOW_REAL_CUSTOMER_DATA",
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

function clearRuntimeEnv() {
  for (const k of KEYS) delete process.env[k];
}

async function loadRuntime() {
  return import("./crow-runtime-mode");
}

function test(name: string, fn: () => void | Promise<void>) {
  return { name, fn };
}

const cases = [
  test("1. default runtime mode is alpha development / demo-only", async () => {
    clearRuntimeEnv();
    const r = await loadRuntime();
    assert.equal(r.getCrowRuntimeMode(), "alpha_development");
    assert.equal(r.getCrowDataClassification(), "demo_only");
    assert.equal(r.isAlphaDevelopmentMode(), true);
    assert.equal(r.isDemoSandboxMode(), true);
  }),

  test("2. VERCEL_ENV=preview is alpha/demo unless explicitly overridden", async () => {
    clearRuntimeEnv();
    process.env.VERCEL_ENV = "preview";
    const r = await loadRuntime();
    assert.equal(r.getCrowRuntimeMode(), "alpha_development");
    assert.equal(r.getCrowDataClassification(), "demo_only");
    assert.equal(r.shouldShowCrowAlphaRuntimeBanner(), true);
    assert.equal(r.isCommercialProductionMode(), false);
  }),

  test("3. real customer data is not allowed in current mode", async () => {
    clearRuntimeEnv();
    process.env.VERCEL_ENV = "preview";
    const r = await loadRuntime();
    assert.equal(r.isRealCustomerDataAllowed(), false);
  }),

  test("4. commercial production mode does not become true accidentally", async () => {
    clearRuntimeEnv();
    process.env.VERCEL_ENV = "production";
    const r = await loadRuntime();
    assert.equal(r.isCommercialProductionMode(), false);
    assert.equal(r.getCrowRuntimeMode(), "alpha_development");
    assert.equal(r.isRealCustomerDataAllowed(), false);
  }),

  test("5. runtime safety notice includes demo/test warning", async () => {
    clearRuntimeEnv();
    const r = await loadRuntime();
    const notice = r.getRuntimeSafetyNotice();
    assert.match(notice, /demo\/test data only/i);
    assert.match(notice, /Not production/i);
    assert.match(notice, /Do not enter real customer/i);
    assert.equal(notice, r.CROW_ALPHA_RUNTIME_SAFETY_NOTICE);
  }),

  test("6. banner source renders alpha/demo warning", () => {
    const bannerPath = join(
      process.cwd(),
      "src/components/runtime/CrowAlphaRuntimeBanner.tsx",
    );
    const helperPath = join(process.cwd(), "src/lib/runtime/crow-runtime-mode.ts");
    const src = readFileSync(bannerPath, "utf8");
    const helper = readFileSync(helperPath, "utf8");
    assert.match(src, /CROW_ALPHA_RUNTIME_SAFETY_NOTICE/);
    assert.match(src, /data-crow-alpha-runtime-banner/);
    assert.match(src, /Local-first Review/);
    assert.match(src, /Demo\/Test Data Only/);
    assert.match(helper, /Crow Alpha Development Environment/);
    assert.match(helper, /demo\/test data only/i);
    assert.match(helper, /Not production/i);
  }),

  test("7. banner does not enable hosted writes", () => {
    const bannerPath = join(
      process.cwd(),
      "src/components/runtime/CrowAlphaRuntimeBanner.tsx",
    );
    const helperPath = join(process.cwd(), "src/lib/runtime/crow-runtime-mode.ts");
    const banner = readFileSync(bannerPath, "utf8");
    const helper = readFileSync(helperPath, "utf8");
    assert.doesNotMatch(banner, /assertHostedBusinessWriteAllowed/);
    assert.doesNotMatch(banner, /prisma/i);
    assert.doesNotMatch(helper, /assertHostedBusinessWriteAllowed/);
    assert.match(helper, /Does not authorize hosted writes/);
  }),

  test("8. banner does not change Blueprint flags", () => {
    const banner = readFileSync(
      join(process.cwd(), "src/components/runtime/CrowAlphaRuntimeBanner.tsx"),
      "utf8",
    );
    const helper = readFileSync(
      join(process.cwd(), "src/lib/runtime/crow-runtime-mode.ts"),
      "utf8",
    );
    assert.doesNotMatch(banner, /CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE/);
    assert.doesNotMatch(banner, /blueprintGenerationAllowed/);
    assert.doesNotMatch(banner, /readyForBlueprintDraft/);
    assert.doesNotMatch(helper, /CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE/);
    assert.doesNotMatch(helper, /blueprintGenerationAllowed/);
  }),

  test("9. PreviewDbDisabledNotice remains separate", () => {
    const notice = readFileSync(
      join(process.cwd(), "src/components/runtime/preview-db-disabled-notice.tsx"),
      "utf8",
    );
    const banner = readFileSync(
      join(process.cwd(), "src/components/runtime/CrowAlphaRuntimeBanner.tsx"),
      "utf8",
    );
    const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    assert.match(notice, /Preview database access is disabled/);
    assert.match(banner, /Does not replace PreviewDbDisabledNotice/);
    assert.match(layout, /CrowAlphaRuntimeBanner/);
    assert.doesNotMatch(banner, /from ["']@\/components\/runtime\/preview-db-disabled-notice["']/);
    assert.doesNotMatch(banner, /function PreviewDbDisabledNotice/);
  }),

  test("10. status is redacted; commercial requires explicit flags", async () => {
    clearRuntimeEnv();
    process.env.CROW_RUNTIME_MODE = "commercial_production";
    process.env.CROW_DATA_CLASSIFICATION = "real_customer";
    // Missing CROW_ALLOW_REAL_CUSTOMER_DATA → still false
    const r = await loadRuntime();
    assert.equal(r.isCommercialProductionMode(), true);
    assert.equal(r.isRealCustomerDataAllowed(), false);
    const status = r.getRuntimeModeStatus();
    assert.equal(r.crowRuntimeModeStatusLooksRedacted(status), true);
    assert.equal(status.realCustomerDataAllowed, false);
  }),
];

async function main() {
  snapshotEnv();
  let failed = 0;
  for (const c of cases) {
    try {
      clearRuntimeEnv();
      await c.fn();
      console.log(`PASS ${c.name}`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL ${c.name}`);
      console.error(err);
    } finally {
      restoreEnv();
    }
  }
  console.log(`FAILED_REQUIRED_GATE_COUNT=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
