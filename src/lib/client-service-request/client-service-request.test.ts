import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  buildDefaultRequestBrief,
  parseRequestBriefFromNotes,
  serializeRequestBriefToNotes,
  validateClientServiceRequestBrief,
  buildPreliminaryRequestRecommendation,
  prefillDesignDraftFromRequestBrief,
} from "@/lib/client-service-request";
import { emptyClientEnterpriseDesignDraft } from "@/lib/client-enterprise-design/persistence/constants";
import { searchBusinessFields } from "@/lib/business-field-catalog/search";
import { BUSINESS_FIELD_CATALOG } from "@/lib/business-field-catalog/fields";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("client-service-request:test");

test("Request Brief validates essential intake", () => {
  const invalid = validateClientServiceRequestBrief(buildDefaultRequestBrief());
  assert.equal(invalid.ok, false);

  const valid = validateClientServiceRequestBrief({
    ...buildDefaultRequestBrief(),
    primaryBusinessFieldKey: "general_contracting",
    primaryPurposeKey: "deliver_projects",
    currentTeamRange: "TEAM_2_5",
    growthIntention: "GROW_GRADUALLY",
    configurationMode: "RECOMMEND_EVERYTHING",
    clientAcknowledgements: {
      understandsNoTenantProvisioning: true,
      understandsProcrowReview: true,
    },
  });
  assert.ok(valid.ok);
});

test("brief round-trips through notes field without migration", () => {
  const brief = buildDefaultRequestBrief({
    primaryBusinessFieldKey: "software_saas",
    primaryPurposeKey: "sell_products",
    currentTeamRange: "TEAM_6_15",
    growthIntention: "GROW_QUICKLY",
    configurationMode: "RECOMMEND_EVERYTHING",
  });
  const notes = serializeRequestBriefToNotes(brief);
  const parsed = parseRequestBriefFromNotes(notes);
  assert.equal(parsed?.primaryBusinessFieldKey, "software_saas");
});

test("custom unresolved field allowed without catalog match", () => {
  const valid = validateClientServiceRequestBrief({
    ...buildDefaultRequestBrief(),
    customFieldDescription: "We operate remote mining camps with catering and fleet",
    fieldResolutionStatus: "CUSTOM_UNRESOLVED",
    primaryPurposeKey: "operate_assets",
    currentTeamRange: "TEAM_16_50",
    growthIntention: "GROW_GRADUALLY",
    configurationMode: "RECOMMEND_EVERYTHING",
    requiresProcrowFieldReview: true,
    clientAcknowledgements: {
      understandsNoTenantProvisioning: true,
      understandsProcrowReview: true,
    },
  });
  assert.ok(valid.ok);
});

test("preliminary recommendation generated without ERP module selection", () => {
  const rec = buildPreliminaryRequestRecommendation({
    idempotencyKey: "test",
    primaryBusinessFieldKey: "restaurant_food_service",
    secondaryBusinessFieldKeys: [],
    customFieldDescription: null,
    fieldResolutionStatus: "CATALOG_MATCH",
    customFieldSuggestedMatches: [],
    requiresProcrowFieldReview: false,
    primaryPurposeKey: "sell_products",
    secondaryPurposeKeys: [],
    customPurposeDescription: null,
    currentTeamRange: "TEAM_2_5",
    growthIntention: "STAY_SAME",
    organizationContext: null,
    configurationMode: "RECOMMEND_EVERYTHING",
    plainLanguageGoal: null,
    letProcrowDecideTechnical: true,
    clientAcknowledgements: {
      understandsNoTenantProvisioning: false,
      understandsProcrowReview: false,
    },
  });
  assert.ok(rec.essentialCapabilities.length > 0);
  assert.ok(rec.summary.includes("ProCrow"));
});

test("Discovery prefill preserves request brief without repeating empty draft", () => {
  const brief = buildDefaultRequestBrief({
    primaryBusinessFieldKey: "freight_logistics",
    primaryPurposeKey: "manage_logistics",
    currentTeamRange: "TEAM_6_15",
    growthIntention: "GROW_GRADUALLY",
    configurationMode: "GUIDE_ME",
  });
  const empty = emptyClientEnterpriseDesignDraft("req-1");
  const prefilled = prefillDesignDraftFromRequestBrief("req-1", brief, empty);
  assert.equal(prefilled.primaryBusinessFieldKey, "freight_logistics");
  assert.equal(prefilled.configurationMode, "GUIDE_ME");
  assert.equal(prefilled.organizationalPreferences.prefilledFromRequestBrief, true);
});

test("all catalog fields searchable", () => {
  assert.equal(BUSINESS_FIELD_CATALOG.length, 99);
  const r = searchBusinessFields("construction");
  assert.ok(r.length > 0);
});

test("canonical request route exists", () => {
  assert.ok(existsSync(join(process.cwd(), "src/app/client/requests/new/page.tsx")));
});

test("public request entry redirects to canonical flow", () => {
  const page = readFileSync(join(process.cwd(), "src/app/(public)/request/page.tsx"), "utf8");
  assert.ok(page.includes("routes.client.requestNew"));
  assert.ok(!page.includes("ImplementationRequestForm"));
});

test("confirmation route exists", () => {
  assert.ok(existsSync(join(process.cwd(), "src/app/client/requests/[requestId]/confirmation/page.tsx")));
});

test("legacy intake write paths disabled", () => {
  const api = readFileSync(join(process.cwd(), "src/app/api/implementation-requests/route.ts"), "utf8");
  assert.ok(api.includes("LEGACY_IMPLEMENTATION_REQUEST_INTAKE_DISABLED"));
  const action = readFileSync(join(process.cwd(), "src/lib/actions/implementation-request.ts"), "utf8");
  assert.ok(action.includes("assertLegacyImplementationRequestIntakeDisabled"));
});

console.log("client-service-request:test PASS");
