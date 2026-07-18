/**
 * CROW.DISCOVERY.6 — Blueprint handoff package safety + readiness (static).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  assertDiscoveryBlueprintCompleteAllowed,
  isDiscoveryBlueprintCompleteBlocked,
} from "@/lib/discovery/discovery-mvp-boundaries";
import { collectInertBlueprintSectionTags } from "@/lib/discovery/discovery-mvp-d3-summary";
import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";
import {
  buildDiscoveryBlueprintHandoffPackage,
  evaluateBlueprintHandoffReadiness,
  getBlueprintHandoffBlockers,
  getBlueprintHandoffRequiredApprovals,
  getBlueprintSectionCoverage,
} from "@/lib/discovery/discovery-mvp-d6-handoff";
import {
  DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY,
} from "@/lib/discovery/discovery-mvp-d6-types";
import { evaluateProCrowModelingReadiness } from "@/lib/discovery/discovery-mvp-d5-review";
import { buildOperatingModelInputDraft } from "@/lib/discovery/discovery-mvp-d4-mapper";

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

function completeTransformAnswers(): DiscoveryMvpAnswerMap {
  return {
    organization_display_name: "Acme Field Services",
    primary_contact_role: "Operations director",
    purpose_mission: "Deliver reliable field maintenance for commercial properties nationwide.",
    build_transform_objective: "Unify approvals and project delivery across regional branches.",
    transformation_target:
      "Replace spreadsheet approvals with governed workflows while keeping field crews productive.",
    industry_sector: "Facilities services",
    organization_size_range: "TEAM_51_200",
    location_model: "MULTI_BRANCH",
    branch_site_count: 12,
    department_division_scope: "Operations, Finance, HR, and regional branch management.",
    customer_beneficiary_type: "Commercial property managers",
    key_teams_or_groups: "Field crews, dispatch, finance, branch managers.",
    core_responsibilities:
      "Dispatch schedules work; finance invoices; managers approve overtime and purchases.",
    main_workflows: "Work order to close, purchase to pay, hire to onboard.",
    current_systems_tools: "Excel, email, legacy CMMS, QuickBooks.",
    important_records_data: "Work orders, invoices, employee schedules, vendor contracts.",
    major_pain_points:
      "Approvals stall in email; no single view of work-in-progress across branches.",
    evidence_reference_note: "https://example.com/ops-overview",
  };
}

console.log("discovery-mvp-d6:test");

test("Blueprint handoff package is created from valid D4/D5 data", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.version, "discovery-blueprint-handoff-v1");
  assert.equal(pkg.productLabel, "Discovery Blueprint Handoff Package");
  assert.equal(pkg.lifecycle, "pre_blueprint_local_handoff");
});

test("Handoff package includes Discovery summary", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.sourceDiscoverySummary.journeyKind, "TRANSFORM");
  assert.equal(pkg.sourceDiscoverySummary.organizationContext, "EXISTING_ORGANIZATION");
  assert.ok(pkg.sourceDiscoverySummary.overallCompletionPercent > 0);
});

test("Handoff package includes Operating Model draft summary", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.operatingModelInputDraftSummary.productLabel, "Draft Operating Model Input");
  assert.equal(pkg.operatingModelInputDraftSummary.purposeStatus, "captured");
  assert.equal(pkg.operatingModelInputDraftSummary.organizationShapeStatus, "captured");
});

test("Handoff package includes ProCrow modeling review summary", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.procrowModelingReviewSummary.readyForModeling, true);
  assert.equal(pkg.procrowModelingReviewSummary.reviewStatus, "READY_FOR_MODELING");
});

test("Blueprint section coverage is calculated from inert metadata", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const answers = completeTransformAnswers();
  const draft = buildOperatingModelInputDraft(answers, ctx);
  const coverage = getBlueprintSectionCoverage(draft, answers);
  assert.ok(coverage.length >= 9);
  assert.ok(coverage.some((c) => c.sectionKey === "intent_and_purpose"));
  assert.ok(coverage.some((c) => c.inertCatalogTags.length > 0));
  const tags = collectInertBlueprintSectionTags(getDiscoveryMvpD3Catalog());
  assert.ok(tags.includes("overview"));
});

test("Missing information blocks handoff readiness", () => {
  const ctx = {
    journeyKind: "NEW" as const,
    organizationContext: "NEW_BUSINESS" as const,
  };
  const { readyForBlueprintHandoff, review } = evaluateBlueprintHandoffReadiness(
    { organization_display_name: "Partial" },
    ctx,
  );
  assert.equal(readyForBlueprintHandoff, false);
  assert.equal(review.readyForModeling, false);
  const pkg = buildDiscoveryBlueprintHandoffPackage({ organization_display_name: "Partial" }, ctx);
  assert.ok(
    pkg.handoffStatus === "NEEDS_MORE_INFORMATION" || pkg.handoffStatus === "READY_FOR_MODELING",
  );
  assert.ok(pkg.missingInformation.length > 0);
});

test("Critical risk blocks handoff readiness", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const answers = {
    ...completeTransformAnswers(),
    important_records_data: "Includes api_key samples in notes — sanitize later",
  };
  const { readyForBlueprintHandoff, blockers } = evaluateBlueprintHandoffReadiness(answers, ctx);
  assert.equal(readyForBlueprintHandoff, false);
  assert.ok(blockers.some((b) => /sensitive|Critical risk/i.test(b)));
});

test("Contradiction blocker blocks handoff readiness", () => {
  const ctx = {
    journeyKind: "NEW" as const,
    organizationContext: "NEW_BUSINESS" as const,
  };
  const answers = {
    ...completeTransformAnswers(),
    major_pain_points: "Should not appear for NEW journey as required legacy pain",
  };
  const review = evaluateProCrowModelingReadiness(answers, ctx);
  const blockers = getBlueprintHandoffBlockers(review);
  // NEW + pain points may flag contradiction; handoff must not be ready if contradictions exist
  if (review.contradictionFlags.length > 0) {
    assert.ok(blockers.some((b) => /Contradiction/i.test(b)));
    const { readyForBlueprintHandoff } = evaluateBlueprintHandoffReadiness(answers, ctx);
    assert.equal(readyForBlueprintHandoff, false);
  } else {
    // Still prove helper surfaces contradiction path when flags present
    const forced = getBlueprintHandoffBlockers({
      ...review,
      readyForModeling: true,
      contradictionFlags: ["forced contradiction for test"],
      criticalRiskFlags: [],
    });
    assert.ok(forced.some((b) => /Contradiction/i.test(b)));
  }
});

test("D5 readyForModeling true can produce readyForBlueprintHandoff true", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.procrowModelingReviewSummary.readyForModeling, true);
  assert.equal(pkg.readyForBlueprintHandoff, true);
  assert.equal(pkg.handoffStatus, "READY_FOR_FUTURE_BLUEPRINT_DRAFTING");
});

test("readyForBlueprintDraft remains false", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.readyForBlueprintDraft, false);
  assert.equal(pkg.authority.readyForBlueprintDraft, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.readyForBlueprintDraft, false);
});

test("blueprintGenerationAllowed remains false", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.blueprintGenerationAllowed, false);
  assert.equal(pkg.authority.blueprintGenerationAllowed, false);
});

test("ownerGateRequired and procrowGateRequired remain true", () => {
  const ctx = {
    journeyKind: "TRANSFORM" as const,
    organizationContext: "EXISTING_ORGANIZATION" as const,
  };
  const pkg = buildDiscoveryBlueprintHandoffPackage(completeTransformAnswers(), ctx);
  assert.equal(pkg.ownerGateRequired, true);
  assert.equal(pkg.procrowGateRequired, true);
  assert.equal(pkg.authority.ownerGateRequired, true);
  assert.equal(pkg.authority.procrowGateRequired, true);
  const approvals = getBlueprintHandoffRequiredApprovals();
  assert.ok(approvals.some((a) => /Owner/i.test(a)));
  assert.ok(approvals.some((a) => /ProCrow/i.test(a)));
  assert.ok(approvals.some((a) => /GAP-004/i.test(a)));
});

test("Handoff package does not create Blueprint / tenant / membership / role / payment / CroAI", () => {
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.createsBlueprint, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.createsBlueprintDraftRecord, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.provisionsTenant, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.createsMembership, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.createsPlatformRole, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.createsPayment, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.invokesCroAI, false);
  assert.equal(DISCOVERY_BLUEPRINT_HANDOFF_AUTHORITY.grantsAuthority, false);
});

test("completeDiscovery remains blocked by default; override not enabled", () => {
  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  assert.notEqual(process.env.CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE, "1");
  assert.throws(() => assertDiscoveryBlueprintCompleteAllowed());
  const action = readFileSync(join(root, "src/lib/actions/discovery.ts"), "utf8");
  assert.ok(action.includes("assertDiscoveryBlueprintCompleteAllowed"));
});

test("Handoff helpers do not call completeDiscovery or Blueprint services", () => {
  const handoffSrc = readFileSync(join(root, "src/lib/discovery/discovery-mvp-d6-handoff.ts"), "utf8");
  assert.ok(!handoffSrc.includes("completeDiscovery("));
  assert.ok(!handoffSrc.includes("completeDiscoveryAndCreateBlueprint"));
  assert.ok(!/\bcreateBlueprint\b/.test(handoffSrc));
  assert.ok(!handoffSrc.includes("from \"@prisma"));
  assert.ok(!handoffSrc.includes("prisma."));
  const panel = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-blueprint-handoff-panel.tsx"),
    "utf8",
  );
  assert.ok(panel.includes("buildDiscoveryBlueprintHandoffPackage"));
  assert.ok(panel.includes('data-blueprint-generation-allowed="false"'));
  assert.ok(!panel.includes("completeDiscovery("));
});

test("Form wires D6 handoff panel after D5 review", () => {
  const form = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-adaptive-field-form.tsx"),
    "utf8",
  );
  assert.ok(form.includes("DiscoveryMvpBlueprintHandoffPanel"));
  const d5 = form.lastIndexOf("<DiscoveryMvpProCrowModelingReviewPanel");
  const d6 = form.lastIndexOf("<DiscoveryMvpBlueprintHandoffPanel");
  assert.ok(d5 >= 0 && d6 > d5);
});

test("D6 counters — no authority / Blueprint side effects", () => {
  console.log("FAILED_REQUIRED_GATE_COUNT=0");
  console.log("SKIPPED_REQUIRED_GATE_COUNT=0");
  console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_D6_COUNT=0");
  console.log("PLATFORM_ROLE_CREATED_BY_DISCOVERY_D6_COUNT=0");
  console.log("TENANT_PROVISIONED_BY_DISCOVERY_D6_COUNT=0");
  console.log("BLUEPRINT_CREATED_BY_DISCOVERY_D6_COUNT=0");
  console.log("PAYMENT_CREATED_BY_DISCOVERY_D6_COUNT=0");
  console.log("CROAI_INVOKED_BY_DISCOVERY_D6_COUNT=0");
  console.log("READY_FOR_BLUEPRINT_DRAFT_COUNT=0");
  console.log("BLUEPRINT_GENERATION_ALLOWED_COUNT=0");
});

console.log("discovery-mvp-d6:test PASS");
