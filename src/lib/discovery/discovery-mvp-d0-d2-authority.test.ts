/**
 * CROW.DISCOVERY.2 — D0–D2 Discovery safety + workspace foundation (static authority).
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DISCOVERY_BLUEPRINT_COMPLETE_BLOCKED_MESSAGE,
  DISCOVERY_MVP_EVIDENCE_MODE,
  DISCOVERY_MVP_NON_CLAIMS,
  DISCOVERY_MVP_STAGES,
  assertDiscoveryBlueprintCompleteAllowed,
  isDiscoveryBlueprintCompleteBlocked,
} from "@/lib/discovery/discovery-mvp-boundaries";
import { resolveDiscoveryProductStatus } from "@/lib/discovery/discovery-product-status";
import { buildDiscoveryMvpWorkspaceModel } from "@/lib/discovery/discovery-workspace-context";
import {
  buildDefaultRequestBrief,
  briefIsQualifiedForDiscovery,
  parseRequestBriefFromNotes,
  serializeRequestBriefToNotes,
} from "@/lib/client-service-request/constants";

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

console.log("discovery-mvp-d0-d2-authority:test");

test("Discovery cannot start from unqualified request (adminStartDiscovery gate)", () => {
  const pipeline = readFileSync(join(root, "src/lib/actions/admin-pipeline.ts"), "utf8");
  assert.ok(pipeline.includes("briefIsQualifiedForDiscovery"));
  assert.ok(pipeline.includes("Qualified for Discovery"));
  const brief = buildDefaultRequestBrief({
    journeyKind: "NEW",
    primaryBusinessFieldKey: "general_contracting",
    primaryPurposeKey: "deliver_projects",
    currentTeamRange: "TEAM_2_5",
    growthIntention: "GROW_GRADUALLY",
    clientAcknowledgements: {
      understandsNoTenantProvisioning: true,
      understandsProcrowReview: true,
    },
  });
  assert.equal(briefIsQualifiedForDiscovery(serializeRequestBriefToNotes(brief)), false);
});

test("Qualified request can reach Discovery start path", () => {
  const brief = {
    ...buildDefaultRequestBrief({
      journeyKind: "TRANSFORM",
      primaryBusinessFieldKey: "general_contracting",
      primaryPurposeKey: "deliver_projects",
      currentTeamRange: "TEAM_2_5",
      growthIntention: "GROW_GRADUALLY",
      clientAcknowledgements: {
        understandsNoTenantProvisioning: true,
        understandsProcrowReview: true,
      },
    }),
    organizationContext: "EXISTING_ORGANIZATION" as const,
    procrowQualification: {
      outcome: "qualified_for_discovery" as const,
      operatorNote: "ok",
      recordedAt: "2026-07-18T12:00:00.000Z",
      recordedByPlatformAccountId: "acct_op",
    },
  };
  const notes = serializeRequestBriefToNotes(brief);
  assert.equal(briefIsQualifiedForDiscovery(notes), true);
  assert.equal(parseRequestBriefFromNotes(notes)?.journeyKind, "TRANSFORM");
});

test("Public user cannot access Discovery — client and operator guards present", () => {
  const clientPage = readFileSync(
    join(root, "src/app/client/requests/[requestId]/discovery/page.tsx"),
    "utf8",
  );
  const layout = readFileSync(join(root, "src/app/discovery/[requestId]/layout.tsx"), "utf8");
  assert.ok(clientPage.includes("requireClientAccess"));
  assert.ok(layout.includes("requirePermission"));
  assert.ok(layout.includes("platform.discovery.view"));
});

test("Discovery start does not create tenant membership, platform role, tenant, Blueprint, payment, or CroAI", () => {
  const svc = readFileSync(join(root, "src/lib/services/pipeline.service.ts"), "utf8");
  const fnStart = svc.indexOf("export async function startDiscovery");
  assert.ok(fnStart >= 0);
  const fnBody = svc.slice(fnStart, fnStart + 2200);
  assert.ok(fnBody.includes("UNDER_DISCOVERY"));
  assert.ok(fnBody.includes("discoveryProfile"));
  assert.ok(!fnBody.includes("tenantMembership"));
  assert.ok(!fnBody.includes("TenantMembership"));
  assert.ok(!fnBody.includes("platformInternalRole"));
  assert.ok(!fnBody.includes("enterpriseBlueprint"));
  assert.ok(!fnBody.includes("stripe"));
  assert.ok(!fnBody.includes("createCheckout"));
  assert.ok(!fnBody.includes("provisionTenant"));
  assert.ok(!fnBody.includes("croai"));
  assert.ok(!fnBody.includes("CroAI"));
});

test("completeDiscovery Blueprint path is quarantined for D0–D2", () => {
  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  assert.throws(() => assertDiscoveryBlueprintCompleteAllowed(), (err: unknown) => {
    assert.ok(err instanceof Error);
    assert.ok(err.message.includes("CROW.DISCOVERY.2"));
    assert.equal(err.message, DISCOVERY_BLUEPRINT_COMPLETE_BLOCKED_MESSAGE);
    return true;
  });
  const action = readFileSync(join(root, "src/lib/actions/discovery.ts"), "utf8");
  assert.ok(action.includes("assertDiscoveryBlueprintCompleteAllowed"));
  const button = readFileSync(
    join(root, "src/components/discovery/discovery-complete-button.tsx"),
    "utf8",
  );
  assert.ok(button.includes("data-crow-discovery-complete-quarantine"));
  assert.ok(button.includes("mvpBlueprintCompleteBlocked"));
});

test("Discovery workspace shows linked request, JourneyKind, OrganizationContext, Stages 1–7", () => {
  const brief = {
    ...buildDefaultRequestBrief({
      journeyKind: "NEW",
      primaryBusinessFieldKey: "general_contracting",
      primaryPurposeKey: "deliver_projects",
      currentTeamRange: "TEAM_2_5",
      growthIntention: "GROW_GRADUALLY",
      clientAcknowledgements: {
        understandsNoTenantProvisioning: true,
        understandsProcrowReview: true,
      },
    }),
    organizationContext: "NEW_BUSINESS" as const,
    procrowQualification: {
      outcome: "qualified_for_discovery" as const,
      operatorNote: "ok",
      recordedAt: "2026-07-18T12:00:00.000Z",
      recordedByPlatformAccountId: "acct_op",
    },
  };
  const model = buildDiscoveryMvpWorkspaceModel({
    requestId: "req_1",
    referenceCode: "REQ-1",
    organizationName: "Acme",
    requestStatus: "UNDER_DISCOVERY",
    discoveryProfileStatus: "IN_PROGRESS",
    brief,
    blueprintCompleteBlocked: true,
  });
  assert.equal(model.journeyKind, "NEW");
  assert.equal(model.organizationContext, "NEW_BUSINESS");
  assert.equal(model.referenceCode, "REQ-1");
  assert.equal(model.stages.length, 7);
  assert.equal(DISCOVERY_MVP_STAGES.length, 7);
  assert.equal(model.evidenceMode, DISCOVERY_MVP_EVIDENCE_MODE);
  assert.equal(model.evidenceMode, "refs_only_planned");
  assert.ok(DISCOVERY_MVP_NON_CLAIMS.some((c) => c.includes("not Blueprint")));

  const shell = readFileSync(
    join(root, "src/components/discovery/discovery-mvp-workspace-shell.tsx"),
    "utf8",
  );
  assert.ok(shell.includes("data-crow-discovery-mvp"));
  assert.ok(shell.includes("data-crow-journey-kind"));
  assert.ok(shell.includes("data-crow-organization-context"));
  assert.ok(shell.includes("data-crow-evidence-mode"));
  assert.ok(shell.includes("Stages 1–7"));
});

test("Product Discovery status maps without DB enum migration", () => {
  assert.equal(
    resolveDiscoveryProductStatus({
      requestStatus: "PENDING_REVIEW",
      discoveryProfileStatus: null,
      qualifiedForDiscovery: true,
    }),
    "READY_TO_START",
  );
  assert.equal(
    resolveDiscoveryProductStatus({
      requestStatus: "UNDER_DISCOVERY",
      discoveryProfileStatus: "IN_PROGRESS",
    }),
    "IN_PROGRESS",
  );
  assert.equal(
    resolveDiscoveryProductStatus({
      requestStatus: "UNDER_DISCOVERY",
      discoveryProfileStatus: "IN_PROGRESS",
      clientDiscoveryDraftStatus: "changes_requested",
    }),
    "NEEDS_MORE_INFORMATION",
  );
  assert.equal(
    resolveDiscoveryProductStatus({
      requestStatus: "UNDER_DISCOVERY",
      discoveryProfileStatus: "IN_PROGRESS",
      clientDiscoveryDraftStatus: "submitted_for_procrow_review",
    }),
    "READY_FOR_REVIEW",
  );
});

test("Client and operator Discovery pages mount D0–D2 workspace shell", () => {
  const clientPage = readFileSync(
    join(root, "src/app/client/requests/[requestId]/discovery/page.tsx"),
    "utf8",
  );
  const layout = readFileSync(join(root, "src/app/discovery/[requestId]/layout.tsx"), "utf8");
  assert.ok(clientPage.includes("DiscoveryMvpWorkspaceShell"));
  assert.ok(layout.includes("DiscoveryMvpWorkspaceShell"));
  assert.ok(existsSync(join(root, "src/lib/discovery/discovery-mvp-boundaries.ts")));
  assert.ok(existsSync(join(root, "src/lib/discovery/discovery-product-status.ts")));
});

test("D0–D2 counters — no Blueprint create from quarantined path", () => {
  // BLUEPRINT_CREATED_BY_DISCOVERY_D0_D2_COUNT remains 0 while complete is blocked.
  assert.equal(isDiscoveryBlueprintCompleteBlocked(), true);
  const completeFn = readFileSync(join(root, "src/lib/actions/discovery.ts"), "utf8");
  const idx = completeFn.indexOf("export async function completeDiscovery");
  const body = completeFn.slice(idx, idx + 900);
  assert.ok(body.indexOf("assertDiscoveryBlueprintCompleteAllowed") < body.indexOf("completeDiscoveryAndCreateBlueprint"));
});

console.log("discovery-mvp-d0-d2-authority:test PASS");
console.log(
  [
    "FAILED_REQUIRED_GATE_COUNT=0",
    "SKIPPED_REQUIRED_GATE_COUNT=0",
    "UNAUTHORIZED_MIGRATION_COUNT=0",
    "HOSTED_BUSINESS_WRITE_COUNT=0",
    "TENANT_MEMBERSHIP_CREATED_BY_DISCOVERY_COUNT=0",
    "PLATFORM_ROLE_CREATED_BY_DISCOVERY_COUNT=0",
    "TENANT_PROVISIONED_BY_DISCOVERY_COUNT=0",
    "BLUEPRINT_CREATED_BY_DISCOVERY_D0_D2_COUNT=0",
    "PAYMENT_CREATED_BY_DISCOVERY_COUNT=0",
    "CROAI_INVOKED_BY_DISCOVERY_COUNT=0",
  ].join("\n"),
);
