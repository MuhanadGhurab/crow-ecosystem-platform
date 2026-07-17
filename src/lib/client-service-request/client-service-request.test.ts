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
    journeyKind: "NEW",
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
  if (valid.ok) {
    assert.equal(valid.brief.journeyKind, "NEW");
  }
});

test("brief rejects missing journeyKind", () => {
  const missing = validateClientServiceRequestBrief({
    ...buildDefaultRequestBrief(),
    journeyKind: null,
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
  assert.equal(missing.ok, false);
});

test("brief round-trips journeyKind through notes field without migration", () => {
  const brief = buildDefaultRequestBrief({
    journeyKind: "TRANSFORM",
    primaryBusinessFieldKey: "software_saas",
    primaryPurposeKey: "sell_products",
    currentTeamRange: "TEAM_6_15",
    growthIntention: "GROW_QUICKLY",
    configurationMode: "RECOMMEND_EVERYTHING",
  });
  const notes = serializeRequestBriefToNotes(brief);
  const parsed = parseRequestBriefFromNotes(notes);
  assert.equal(parsed?.primaryBusinessFieldKey, "software_saas");
  assert.equal(parsed?.journeyKind, "TRANSFORM");
});

test("custom unresolved field allowed without catalog match", () => {
  const valid = validateClientServiceRequestBrief({
    ...buildDefaultRequestBrief(),
    journeyKind: "TRANSFORM",
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
    journeyKind: "NEW",
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
  assert.ok(BUSINESS_FIELD_CATALOG.length >= 110);
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

test("createModernServiceRequest does not provision tenant, blueprint, payment, or platform roles", () => {
  const svc = readFileSync(join(process.cwd(), "src/lib/services/client-service-request.service.ts"), "utf8");
  assert.ok(svc.includes('status: "PENDING_REVIEW"'));
  assert.ok(svc.includes("phoneVerifiedAt") || svc.includes("accountMissingClientProcessPhone"));
  assert.ok(!svc.includes("tenantMembership.create"));
  assert.ok(!svc.includes("TenantMembership"));
  assert.ok(!svc.includes("enterpriseBlueprint.create"));
  assert.ok(!svc.includes("platformInternalRole"));
  assert.ok(!svc.includes("stripe.checkout"));
  assert.ok(!svc.includes("createCheckout"));
  assert.ok(svc.includes("CLIENT_SERVICE_REQUEST_BRIEF_AUTHORITY") || svc.includes("serializeRequestBriefToNotes"));
});

test("brief authority contract remains non-provisioning", () => {
  const types = readFileSync(join(process.cwd(), "src/lib/client-service-request/types.ts"), "utf8");
  assert.ok(types.includes("provisionsTenant: false"));
  assert.ok(types.includes("grantsAuthority: false"));
  assert.ok(types.includes("createsBlueprint: false"));
  assert.ok(types.includes("journeyKind"));
});

test("wizard persists journeyKind from URL and submit payload", () => {
  const wizard = readFileSync(
    join(process.cwd(), "src/components/client-service-request/service-request-wizard.tsx"),
    "utf8",
  );
  assert.ok(wizard.includes("journeyKind"));
  assert.ok(wizard.includes("REQUEST_JOURNEY_KIND_LABELS"));
});

console.log("client-service-request:test PASS");
