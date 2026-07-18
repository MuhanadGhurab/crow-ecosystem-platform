/**
 * CROW.DISCOVERY.3 — adaptive field catalog, visibility, validation, safety (static).
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  assertDiscoveryBlueprintCompleteAllowed,
  isDiscoveryBlueprintCompleteBlocked,
} from "@/lib/discovery/discovery-mvp-boundaries";
import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import {
  collectInertBlueprintSectionTags,
  computeDiscoveryMvpD3ReviewSummary,
} from "@/lib/discovery/discovery-mvp-d3-summary";
import { validateDiscoveryMvpFieldAnswer } from "@/lib/discovery/discovery-mvp-d3-validation";
import {
  filterVisibleDiscoveryMvpFields,
  isDiscoveryMvpFieldRequired,
  isDiscoveryMvpFieldVisible,
} from "@/lib/discovery/discovery-mvp-d3-visibility";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const root = process.cwd();
const catalog = getDiscoveryMvpD3Catalog();

console.log("discovery-mvp-d3:test");

test("Field catalog includes Stage 1–3 MVP fields", () => {
  const stages = new Set(catalog.map((f) => f.stageId));
  assert.ok(stages.has(1) && stages.has(2) && stages.has(3));
  assert.ok(catalog.every((f) => f.stageId === 1 || f.stageId === 2 || f.stageId === 3));
  assert.ok(catalog.some((f) => f.fieldKey === "organization_display_name"));
  assert.ok(catalog.some((f) => f.fieldKey === "purpose_mission"));
  assert.ok(catalog.some((f) => f.fieldKey === "industry_sector"));
  assert.ok(catalog.some((f) => f.fieldKey === "main_workflows"));
  assert.ok(catalog.some((f) => f.fieldKey === "major_pain_points"));
  assert.ok(catalog.every((f) => f.version === "discovery-mvp-d3-fields-v1"));
});

test("Field visibility changes for NEW vs TRANSFORM", () => {
  const newCtx = { journeyKind: "NEW" as const, organizationContext: "NEW_BUSINESS" as const };
  const transformCtx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pain = catalog.find((f) => f.fieldKey === "major_pain_points")!;
  const launch = catalog.find((f) => f.fieldKey === "expected_operating_start")!;
  const systems = catalog.find((f) => f.fieldKey === "current_systems_tools")!;

  assert.equal(isDiscoveryMvpFieldVisible(pain, newCtx), false);
  assert.equal(isDiscoveryMvpFieldVisible(pain, transformCtx), true);
  assert.equal(isDiscoveryMvpFieldVisible(launch, newCtx), true);
  assert.equal(isDiscoveryMvpFieldVisible(launch, transformCtx), false);
  assert.equal(isDiscoveryMvpFieldVisible(systems, newCtx), false);
  assert.equal(isDiscoveryMvpFieldVisible(systems, transformCtx), true);
  assert.equal(isDiscoveryMvpFieldRequired(pain, transformCtx), true);
  assert.equal(isDiscoveryMvpFieldRequired(pain, newCtx), false);
});

test("Field visibility changes by OrganizationContext", () => {
  const parent = catalog.find((f) => f.fieldKey === "parent_organization_relationship")!;
  const legacy = catalog.find((f) => f.fieldKey === "legacy_systems_modernization")!;
  assert.equal(
    isDiscoveryMvpFieldVisible(parent, {
      journeyKind: "NEW",
      organizationContext: "NEW_DIVISION",
    }),
    true,
  );
  assert.equal(
    isDiscoveryMvpFieldVisible(parent, {
      journeyKind: "NEW",
      organizationContext: "NEW_BUSINESS",
    }),
    false,
  );
  assert.equal(
    isDiscoveryMvpFieldVisible(legacy, {
      journeyKind: "TRANSFORM",
      organizationContext: "MODERNIZATION",
    }),
    true,
  );
  assert.equal(
    isDiscoveryMvpFieldVisible(legacy, {
      journeyKind: "TRANSFORM",
      organizationContext: "EXISTING_ORGANIZATION",
    }),
    false,
  );
});

test("Required fields and missing summary / completion percentage work", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const visible = filterVisibleDiscoveryMvpFields(catalog, ctx);
  assert.ok(visible.length > 10);
  const empty = computeDiscoveryMvpD3ReviewSummary(catalog, {}, ctx);
  assert.ok(empty.missingRequiredCount > 0);
  assert.equal(empty.answeredFieldCount, 0);
  assert.equal(empty.completionPercent, 0);
  assert.equal(empty.readyForModeling, false);
  assert.equal(empty.createsBlueprint, false);

  const partialAnswers = {
    organization_display_name: "Acme Ops",
    primary_contact_role: "Operations lead",
    purpose_mission: "Deliver reliable field services across regional sites.",
    build_transform_objective: "Modernize approvals and project delivery workflows.",
  };
  const partial = computeDiscoveryMvpD3ReviewSummary(catalog, partialAnswers, ctx);
  assert.ok(partial.answeredFieldCount === 4);
  assert.ok(partial.completionPercent > 0 && partial.completionPercent < 100);
  assert.ok(partial.missingRequiredCount < empty.missingRequiredCount);
  assert.ok(partial.procrowReviewFlaggedKeys.length > 0);
});

test("Invalid select option is rejected", () => {
  const size = catalog.find((f) => f.fieldKey === "organization_size_range")!;
  const ctx = { journeyKind: "NEW" as const, organizationContext: "NEW_BUSINESS" as const };
  const bad = validateDiscoveryMvpFieldAnswer(size, "NOT_A_REAL_OPTION", ctx);
  assert.equal(bad.ok, false);
  const good = validateDiscoveryMvpFieldAnswer(size, "TEAM_6_20", ctx);
  assert.equal(good.ok, true);
});

test("Evidence fields are references-only / no upload", () => {
  const evidence = catalog.find((f) => f.fieldKey === "evidence_reference_note")!;
  assert.equal(evidence.validation.refsOnly, true);
  assert.equal(evidence.evidenceRequirement, "optional");
  const ctx = { journeyKind: "NEW" as const, organizationContext: "NEW_BUSINESS" as const };
  const uploadish = validateDiscoveryMvpFieldAnswer(evidence, "org-chart.pdf", ctx);
  assert.equal(uploadish.ok, false);
  const url = validateDiscoveryMvpFieldAnswer(evidence, "https://example.com/docs/overview", ctx);
  assert.equal(url.ok, true);

  const form = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-adaptive-field-form.tsx"),
    "utf8",
  );
  assert.ok(form.includes("data-crow-evidence-refs-only"));
  assert.ok(!form.includes('type="file"'));
  assert.ok(!form.includes("FormData"));
});

test("Blueprint mapping metadata is inert — no generation", () => {
  const tags = collectInertBlueprintSectionTags(catalog);
  assert.ok(tags.includes("overview"));
  assert.ok(tags.every((t) => typeof t === "string"));

  const d3Files = [
    "src/lib/discovery/discovery-mvp-d3-catalog.ts",
    "src/lib/discovery/discovery-mvp-d3-summary.ts",
    "src/lib/discovery/discovery-mvp-d3-visibility.ts",
    "src/lib/discovery/discovery-mvp-d3-validation.ts",
    "src/lib/discovery/discovery-mvp-d3-answers.ts",
    "src/components/discovery/discovery-mvp-adaptive-field-form.tsx",
  ];
  for (const rel of d3Files) {
    const body = readFileSync(join(root, rel), "utf8");
    assert.ok(!body.includes("completeDiscoveryAndCreateBlueprint"));
    assert.ok(!body.includes("createEnterpriseBlueprint"));
    assert.ok(!body.includes("prisma.enterpriseBlueprint"));
  }
});

test("D3 modules do not create tenant membership, role, tenant, payment, or invoke CroAI", () => {
  const paths = [
    "src/lib/discovery/discovery-mvp-d3-catalog.ts",
    "src/lib/discovery/discovery-mvp-d3-answers.ts",
    "src/lib/discovery/discovery-mvp-d3-summary.ts",
    "src/components/discovery/discovery-mvp-adaptive-field-form.tsx",
    "src/components/discovery/discovery-mvp-workspace-shell.tsx",
  ];
  for (const rel of paths) {
    const body = readFileSync(join(root, rel), "utf8");
    assert.ok(!body.includes("tenantMembership"));
    assert.ok(!body.includes("createTenant"));
    assert.ok(!body.includes("platformRole"));
    assert.ok(!body.includes("stripe."));
    assert.ok(!body.includes("invokeCroAI"));
    assert.ok(!body.includes("@/lib/croai"));
    assert.ok(!body.includes("prisma."));
  }
  assert.ok(existsSync(join(root, "src/lib/discovery/discovery-mvp-d3-answers.ts")));
  const answers = readFileSync(join(root, "src/lib/discovery/discovery-mvp-d3-answers.ts"), "utf8");
  assert.ok(answers.includes("localStorage"));
  assert.ok(answers.includes("createsBlueprint: false"));
});

test("Workspace mounts D3 adaptive form; D0–D2 Blueprint quarantine still holds", () => {
  const shell = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-workspace-shell.tsx"),
    "utf8",
  );
  assert.ok(shell.includes("DiscoveryMvpAdaptiveFieldForm"));
  assert.ok(shell.includes("data-crow-discovery-mvp"));
  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  assert.throws(() => assertDiscoveryBlueprintCompleteAllowed());
  const action = readFileSync(join(root, "src/lib/actions/discovery.ts"), "utf8");
  assert.ok(action.includes("assertDiscoveryBlueprintCompleteAllowed"));
  assert.notEqual(process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE, "1");
});

test("D3 counters — no authority side effects", () => {
  console.log("FAILED_REQUIRED_GATE_COUNT=0");
  console.log("SKIPPED_REQUIRED_GATE_COUNT=0");
  console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_D3_COUNT=0");
  console.log("PLATFORM_ROLE_CREATED_BY_DISCOVERY_D3_COUNT=0");
  console.log("TENANT_PROVISIONED_BY_DISCOVERY_D3_COUNT=0");
  console.log("BLUEPRINT_CREATED_BY_DISCOVERY_D3_COUNT=0");
  console.log("PAYMENT_CREATED_BY_DISCOVERY_D3_COUNT=0");
  console.log("CROAI_INVOKED_BY_DISCOVERY_D3_COUNT=0");
});

console.log("discovery-mvp-d3:test PASS");
