import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { emptyClientEnterpriseDesignDraft } from "./persistence/constants";
import { stepsForConfigurationMode } from "./intake/quick-intake-steps";
import { validateClientEnterpriseDesignDraft, hasStructuralContradictions } from "./validation/validate-draft";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("client-quick-intake:test");

test("normal path asks only essential questions", () => {
  const steps = stepsForConfigurationMode("RECOMMEND_EVERYTHING");
  assert.deepEqual(steps, ["field", "purpose", "team", "mode", "recommendations", "review"]);
  assert.ok(!steps.includes("capabilities"));
  assert.ok(!steps.includes("priority"));
});

test("guided questions remain optional via mode", () => {
  const steps = stepsForConfigurationMode("GUIDE_ME");
  assert.ok(steps.includes("capabilities"));
  assert.ok(!steps.includes("customize"));
});

test("expert questions hidden by default in recommend mode", () => {
  const normal = stepsForConfigurationMode("RECOMMEND_EVERYTHING");
  assert.ok(!normal.includes("customize"));
  const expert = stepsForConfigurationMode("EXPERT_CONFIGURATION");
  assert.ok(expert.includes("customize"));
});

test("request may be submitted without module expertise", () => {
  const draft = {
    ...emptyClientEnterpriseDesignDraft("req-1"),
    status: "SUBMITTED" as const,
    primaryBusinessFieldKey: "general_contracting",
    primaryPurposeKey: "deliver_projects",
    configurationMode: "RECOMMEND_EVERYTHING" as const,
    letProcrowDecideTechnical: true,
    selectedCapabilities: [],
  };
  const validated = validateClientEnterpriseDesignDraft(draft);
  assert.ok(validated.ok);
  assert.equal(hasStructuralContradictions(draft).length, 0);
});

test("ProCrow recommendation mode works", () => {
  const draft = emptyClientEnterpriseDesignDraft("req-1");
  assert.equal(draft.configurationMode, "RECOMMEND_EVERYTHING");
  assert.equal(draft.letProcrowDecideTechnical, false);
});

test("custom field submission allowed without catalog match", () => {
  const draft = {
    ...emptyClientEnterpriseDesignDraft("req-1"),
    status: "SUBMITTED" as const,
    customFieldDescription: "We operate remote mining camps with fleet and catering",
    fieldResolutionStatus: "CUSTOM_UNRESOLVED" as const,
    primaryPurposeKey: "operate_assets",
    requiresProcrowFieldReview: true,
  };
  const validated = validateClientEnterpriseDesignDraft(draft);
  assert.ok(validated.ok);
});

test("loading boundaries exist for key routes", () => {
  const root = join(process.cwd(), "src", "app");
  const paths = [
    "login/loading.tsx",
    "client/loading.tsx",
    "client/requests/loading.tsx",
    "client/requests/[requestId]/loading.tsx",
    "client/requests/[requestId]/discovery/design/loading.tsx",
  ];
  for (const p of paths) {
    assert.ok(existsSync(join(root, p)), `missing ${p}`);
  }
});

test("login navigation component exists", () => {
  const nav = readFileSync(join(process.cwd(), "src", "components", "auth", "auth-back-navigation.tsx"), "utf8");
  assert.ok(nav.includes("Back to Home"));
  const loginPage = readFileSync(join(process.cwd(), "src", "app", "login", "page.tsx"), "utf8");
  assert.ok(loginPage.includes("AuthBackNavigation"));
});

console.log("client-quick-intake:test PASS");
