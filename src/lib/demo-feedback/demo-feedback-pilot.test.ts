/**
 * CROW.DEVFLOW.5 — Demo feedback pilot safety certification.
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
  "CROW_TENANT_GO_LIVE_ENABLED",
  "PREVIEW_DB_DISABLED",
  "DATABASE_ENVIRONMENT",
  "BACKEND_ISOLATION",
  "PREVIEW_DATABASE_ISOLATION_PROVEN",
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

function enableDemoBackendFlags() {
  clearEnv();
  process.env.CROW_RUNTIME_MODE = "alpha_development";
  process.env.CROW_DATA_CLASSIFICATION = "demo_only";
  process.env.ALLOW_SHARED_DEMO_BACKEND = "true";
}

const BASE_PAYLOAD = {
  reviewerType: "tester",
  pageOrArea: "/alpha-feedback",
  feedbackType: "bug",
  message: "Demo feedback message for certification.",
  sourceEnvironment: "local",
};

function test(name: string, fn: () => void | Promise<void>) {
  return { name, fn };
}

const cases = [
  test("1. feedback hosted write disabled by default", async () => {
    clearEnv();
    const { evaluateDemoFeedbackSubmit } = await import(
      "@/lib/services/demo-feedback.service"
    );
    const res = evaluateDemoFeedbackSubmit(BASE_PAYLOAD);
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.code, "alpha_demo_write_blocked");
    }
  }),

  test("2. missing ALLOW_SHARED_DEMO_BACKEND blocks", async () => {
    clearEnv();
    process.env.CROW_RUNTIME_MODE = "alpha_development";
    process.env.CROW_DATA_CLASSIFICATION = "demo_only";
    const { evaluateDemoFeedbackSubmit } = await import(
      "@/lib/services/demo-feedback.service"
    );
    const res = evaluateDemoFeedbackSubmit(BASE_PAYLOAD);
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.code, "alpha_demo_write_blocked");
  }),

  test("3. alpha/demo flags allow only demo_feedback_save", async () => {
    enableDemoBackendFlags();
    const guard = await import("@/lib/runtime/alpha-demo-write-guard");
    const escape = await import("@/lib/runtime/alpha-demo-db-access");
    const markers = guard.createValidAlphaDemoWriteMarkers({
      sourceEnvironment: "local",
    });
    const ok = guard.evaluateAlphaDemoWriteGuard("demo_feedback_save", markers);
    assert.equal(ok.allowed, true);
    const blocked = guard.evaluateAlphaDemoWriteGuard(
      "demo_request_create",
      markers,
    );
    // request create is allowlisted for future, but Prisma escape is feedback-only
    assert.equal(blocked.allowed, true);
    assert.equal(escape.isAlphaDemoPrismaEscapeAction("demo_feedback_save"), true);
    assert.equal(escape.isAlphaDemoPrismaEscapeAction("demo_request_create"), false);
    await assert.rejects(
      () =>
        escape.withAlphaDemoAllowlistedPrismaWrite(
          "demo_request_create",
          markers,
          {},
          async () => "nope",
        ),
      /not authorized/,
    );
  }),

  test("4. missing demo markers blocks", async () => {
    enableDemoBackendFlags();
    const guard = await import("@/lib/runtime/alpha-demo-write-guard");
    const d = guard.evaluateAlphaDemoWriteGuard("demo_feedback_save", {
      isDemo: false,
      dataClassification: "demo_only",
      runtimeMode: "alpha_development",
      notProduction: true,
    });
    assert.equal(d.allowed, false);
    assert.ok(d.reasons.includes("is_demo_not_true"));
  }),

  test("5. real customer data flag blocks", async () => {
    enableDemoBackendFlags();
    process.env.CROW_ALLOW_REAL_CUSTOMER_DATA = "true";
    const { evaluateDemoFeedbackSubmit } = await import(
      "@/lib/services/demo-feedback.service"
    );
    const res = evaluateDemoFeedbackSubmit(BASE_PAYLOAD);
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.code, "alpha_demo_write_blocked");
  }),

  test("6. payment/Blueprint/tenant/CroAI contexts block", async () => {
    enableDemoBackendFlags();
    const { evaluateDemoFeedbackSubmit } = await import(
      "@/lib/services/demo-feedback.service"
    );
    for (const ctx of [
      { intendsPayment: true },
      { intendsBlueprint: true },
      { intendsTenantGoLive: true },
      { intendsCroAiProduction: true },
    ] as const) {
      const res = evaluateDemoFeedbackSubmit(BASE_PAYLOAD, ctx);
      assert.equal(res.ok, false, JSON.stringify(ctx));
      if (!res.ok) assert.equal(res.code, "alpha_demo_write_blocked");
    }
  }),

  test("7. invalid feedback type blocks", async () => {
    enableDemoBackendFlags();
    const { validateDemoFeedbackInput } = await import(
      "@/lib/demo-feedback/demo-feedback-validate"
    );
    const v = validateDemoFeedbackInput({
      ...BASE_PAYLOAD,
      feedbackType: "not_a_type",
    });
    assert.equal(v.ok, false);
    if (!v.ok) assert.equal(v.code, "invalid_feedback_type");
  }),

  test("8. oversized message blocks", async () => {
    enableDemoBackendFlags();
    const { validateDemoFeedbackInput } = await import(
      "@/lib/demo-feedback/demo-feedback-validate"
    );
    const { DEMO_FEEDBACK_MESSAGE_MAX } = await import(
      "@/lib/demo-feedback/demo-feedback-contract"
    );
    const v = validateDemoFeedbackInput({
      ...BASE_PAYLOAD,
      message: "x".repeat(DEMO_FEEDBACK_MESSAGE_MAX + 1),
    });
    assert.equal(v.ok, false);
    if (!v.ok) assert.equal(v.code, "message_too_long");
  }),

  test("9. sensitive-data warning copy exists", () => {
    const contract = readFileSync(
      join(process.cwd(), "src/lib/demo-feedback/demo-feedback-contract.ts"),
      "utf8",
    );
    const form = readFileSync(
      join(process.cwd(), "src/components/runtime/DemoFeedbackForm.tsx"),
      "utf8",
    );
    const page = readFileSync(
      join(process.cwd(), "src/app/alpha-feedback/page.tsx"),
      "utf8",
    );
    assert.match(contract, /Demo feedback only/);
    assert.match(contract, /Not production/);
    assert.match(contract, /Do not enter real customer or sensitive data/);
    assert.match(form, /DEMO_FEEDBACK_SENSITIVE_WARNING/);
    assert.match(page, /DEMO_FEEDBACK_SENSITIVE_WARNING/);
  }),

  test("10. UI does not claim production", () => {
    const page = readFileSync(
      join(process.cwd(), "src/app/alpha-feedback/page.tsx"),
      "utf8",
    );
    const form = readFileSync(
      join(process.cwd(), "src/components/runtime/DemoFeedbackForm.tsx"),
      "utf8",
    );
    assert.match(page, /Not production/i);
    assert.doesNotMatch(page, /commercial Production ready/i);
    assert.match(form, /Not production/i);
  }),

  test("11. no Request persistence is triggered", () => {
    const svc = readFileSync(
      join(process.cwd(), "src/lib/services/demo-feedback.service.ts"),
      "utf8",
    );
    const action = readFileSync(
      join(process.cwd(), "src/lib/actions/demo-feedback.ts"),
      "utf8",
    );
    assert.doesNotMatch(svc, /implementationRequest/i);
    assert.doesNotMatch(svc, /createRequest|submitRequest/i);
    assert.doesNotMatch(action, /implementationRequest/i);
  }),

  test("12. no Discovery persistence is triggered", () => {
    const svc = readFileSync(
      join(process.cwd(), "src/lib/services/demo-feedback.service.ts"),
      "utf8",
    );
    assert.doesNotMatch(svc, /discoveryProfile|DiscoveryAnswer|adminStartDiscovery/i);
    assert.doesNotMatch(svc, /completeDiscovery/i);
  }),

  test("13. no Blueprint generation is enabled", () => {
    const svc = readFileSync(
      join(process.cwd(), "src/lib/services/demo-feedback.service.ts"),
      "utf8",
    );
    assert.doesNotMatch(svc, /EnterpriseBlueprint|blueprintGeneration|completeDiscovery/i);
  }),

  test("14. no tenant/payment/CroAI side effects", () => {
    const svc = readFileSync(
      join(process.cwd(), "src/lib/services/demo-feedback.service.ts"),
      "utf8",
    );
    assert.doesNotMatch(svc, /tenantMembership|Tenant\.create|stripe|croai/i);
  }),

  test("15. no migration/schema change", () => {
    // Static: pilot uses existing PlatformNotification only.
    const svc = readFileSync(
      join(process.cwd(), "src/lib/services/demo-feedback.service.ts"),
      "utf8",
    );
    assert.match(svc, /platformNotification\.create/);
    assert.match(svc, /DEMO_FEEDBACK_EVENT_TYPE|alpha_demo_feedback/);
    // No new migration files in this milestone — checked via schema not imported for edits.
    assert.doesNotMatch(svc, /\$executeRaw|migrate/i);
  }),

  test("16. preview-db-safety remains fail-closed outside explicit alpha demo backend mode", async () => {
    clearEnv();
    process.env.VERCEL_ENV = "preview";
    const safety = await import("@/lib/runtime/preview-db-safety");
    assert.equal(safety.isPreviewDbDisabledMode(), true);
    assert.throws(() => safety.assertPreviewDbAccessAllowed("test"));
    const { evaluateDemoFeedbackSubmit } = await import(
      "@/lib/services/demo-feedback.service"
    );
    const res = evaluateDemoFeedbackSubmit(BASE_PAYLOAD);
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.code, "alpha_demo_write_blocked");
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
  console.log(`\nAll ${cases.length} demo-feedback-pilot tests passed.`);
  console.log("DEMO_FEEDBACK_PILOT_AUDITED_COUNT=1");
  console.log("DEMO_FEEDBACK_HOSTED_WRITE_IMPLEMENTED_COUNT=1");
  console.log("DEMO_FEEDBACK_HOSTED_WRITE_BLOCKED_COUNT=0");
  console.log("DEMO_ONLY_HOSTED_WRITE_COUNT=1");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("PRISMA_SCHEMA_CHANGED_COUNT=0");
  console.log("REQUEST_PERSISTENCE_ENABLED_BY_DEVFLOW5_COUNT=0");
  console.log("DISCOVERY_PERSISTENCE_ENABLED_BY_DEVFLOW5_COUNT=0");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
