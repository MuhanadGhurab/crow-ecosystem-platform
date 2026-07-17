/**
 * CROW.PROCROW.1 — qualification outcome + Discovery handoff authority safety (static).
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  isQualifiedForDiscovery,
  PROCROW_QUALIFICATION_OUTCOMES,
} from "@/lib/procrow/procrow-qualification";
import {
  buildDefaultRequestBrief,
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

console.log("procrow-qualification-authority:test");

test("qualification outcomes cover product vocabulary without DB enums", () => {
  assert.ok(PROCROW_QUALIFICATION_OUTCOMES.includes("needs_more_information"));
  assert.ok(PROCROW_QUALIFICATION_OUTCOMES.includes("qualified_for_discovery"));
  assert.ok(PROCROW_QUALIFICATION_OUTCOMES.includes("declined"));
});

test("brief round-trips procrowQualification in notes JSON", () => {
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
    procrowQualification: {
      outcome: "qualified_for_discovery" as const,
      operatorNote: "Ready for discovery interview",
      recordedAt: "2026-07-18T12:00:00.000Z",
      recordedByPlatformAccountId: "acct_op",
    },
  };
  const notes = serializeRequestBriefToNotes(brief);
  const parsed = parseRequestBriefFromNotes(notes);
  assert.equal(parsed?.procrowQualification?.outcome, "qualified_for_discovery");
  assert.ok(isQualifiedForDiscovery(parsed?.procrowQualification));
  assert.equal(isQualifiedForDiscovery(null), false);
});

test("applyProcrowQualification does not create tenant, membership, role, blueprint, or payment", () => {
  const svc = readFileSync(
    join(process.cwd(), "src/lib/services/client-service-request.service.ts"),
    "utf8",
  );
  const fnStart = svc.indexOf("export async function applyProcrowQualification");
  assert.ok(fnStart >= 0);
  const fnBody = svc.slice(fnStart, fnStart + 1800);
  assert.ok(fnBody.includes("procrowQualification"));
  assert.ok(fnBody.includes("serializeRequestBriefToNotes"));
  assert.ok(!fnBody.includes("tenantMembership"));
  assert.ok(!fnBody.includes("TenantMembership"));
  assert.ok(!fnBody.includes("platformInternalRole"));
  assert.ok(!fnBody.includes("enterpriseBlueprint.create"));
  assert.ok(!fnBody.includes("stripe"));
  assert.ok(!fnBody.includes("createCheckout"));
  assert.ok(!fnBody.includes("tenant.create"));
});

test("rejectImplementationRequest preserves modern brief JSON when declining with reason", () => {
  const impl = readFileSync(
    join(process.cwd(), "src/lib/services/implementation-request.service.ts"),
    "utf8",
  );
  assert.ok(impl.includes("parseRequestBriefFromNotes"));
  assert.ok(impl.includes("serializeRequestBriefToNotes"));
  assert.ok(impl.includes('outcome: "declined"'));
  assert.ok(!impl.includes("notes: trimmed"));
});

test("adminStartDiscovery requires qualified_for_discovery", () => {
  const pipeline = readFileSync(join(process.cwd(), "src/lib/actions/admin-pipeline.ts"), "utf8");
  assert.ok(pipeline.includes("briefIsQualifiedForDiscovery"));
  assert.ok(pipeline.includes("Qualified for Discovery"));
});

test("RequestAdminActions disables Start Discovery until qualified", () => {
  const ui = readFileSync(
    join(process.cwd(), "src/components/admin/request-admin-actions.tsx"),
    "utf8",
  );
  assert.ok(ui.includes("qualifiedForDiscovery"));
  assert.ok(ui.includes("disabled={pending || !qualifiedForDiscovery}"));
});

test("qualification panel and admin route protection exist", () => {
  assert.ok(
    existsSync(join(process.cwd(), "src/components/admin/admin-procrow-qualification-panel.tsx")),
  );
  const layout = readFileSync(join(process.cwd(), "src/app/admin/layout.tsx"), "utf8");
  assert.ok(layout.includes("requirePlatformConsole"));
  const action = readFileSync(join(process.cwd(), "src/lib/actions/admin-request-brief.ts"), "utf8");
  assert.ok(action.includes("requireActionRequestReview"));
  assert.ok(action.includes("recordProcrowQualificationAction"));
});

test("qualification action does not provision tenant or blueprint", () => {
  const action = readFileSync(join(process.cwd(), "src/lib/actions/admin-request-brief.ts"), "utf8");
  assert.ok(!action.includes("tenantMembership"));
  assert.ok(!action.includes("enterpriseBlueprint.create"));
  assert.ok(!action.includes("createCheckout"));
  assert.ok(action.includes("rejectImplementationRequest"));
});

console.log("procrow-qualification-authority:test PASS");
