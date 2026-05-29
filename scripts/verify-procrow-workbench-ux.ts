/**
 * L2 — ProCrow workbench UX redesign guards.
 *
 *   npm run procrow-workbench:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_PHRASES = [
  "pay now",
  "start subscription",
  "free month",
  "live checkout",
  "activate live payments",
  "automatic tenant provisioning",
  "auto-provision",
  "production go-live approved",
  "certified compliant",
  "autonomous validation",
] as const;

const REQUIRED_FILES = [
  "docs/internal/L2_PROCROW_WORKBENCH_UX_REDESIGN.md",
  "src/lib/constants/procrow-workbench-ia.ts",
  "src/components/procrow/procrow-workbench-page-header.tsx",
  "src/components/procrow/procrow-workbench-section.tsx",
  "src/components/procrow/procrow-request-lifecycle-panel.tsx",
  "src/components/procrow/procrow-request-list-card.tsx",
  "scripts/verify-procrow-workbench-ux.ts",
] as const;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== L2 ProCrow workbench UX ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"procrow-workbench:verify"'), "package.json defines procrow-workbench:verify", "Add script");
  check(
    pkg.includes("verify-procrow-workbench-ux.ts"),
    "procrow:verify chain includes workbench verifier",
    "Append workbench verifier to procrow:verify"
  );

  const queue = fileText("src/app/admin/queue/page.tsx");
  check(queue.includes("ProCrowWorkbenchPageHeader"), "Queue uses workbench page header", "Redesign /admin/queue");
  check(queue.includes("ProCrowOperatorQueueBrowser"), "Queue retains stage browser", "Keep queue browser");

  const requests = fileText("src/app/admin/requests/page.tsx");
  check(requests.includes("ProCrowRequestListCard"), "Requests list uses workbench list card", "Redesign requests list");
  check(
    requests.includes("next") || requests.includes("Stage:") || requests.includes("stage"),
    "Requests list has stage language",
    "Add stage/next-action copy on requests list"
  );

  const detail = fileText("src/app/admin/requests/[requestId]/page.tsx");
  check(detail.includes("ProCrowRequestLifecyclePanel"), "Request detail has lifecycle panel", "Add lifecycle panel");
  check(
    detail.includes("OperatorNextActionPanel"),
    "Request detail has next action",
    "Keep operator next action on detail"
  );
  check(
    detail.includes("ProCrowCommercialLifecycleCompact") || detail.includes("commercial-lifecycle"),
    "Request detail surfaces commercial lifecycle",
    "Add commercial lifecycle on detail"
  );
  check(
    detail.includes("ProCrowTenantRuntimeFraming") || detail.includes("Tenant runtime"),
    "Request detail clarifies ProCrow/CEM",
    "Add tenant runtime framing"
  );
  check(
    detail.includes("ProCrowWorkbenchSection"),
    "Request detail uses workbench sections",
    "Use workbench sections on detail"
  );

  const tenant = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  check(
    tenant.includes("ProCrowTenantWorkbenchHeader"),
    "Tenant detail uses workbench header",
    "Redesign tenant detail header"
  );
  check(
    tenant.includes("CEM runtime") || tenant.includes("ProCrow prepares"),
    "Tenant detail has ProCrow/CEM relationship copy",
    "Add ProCrow/CEM wording on tenant page"
  );

  const l2Doc = fileText("docs/internal/L2_PROCROW_WORKBENCH_UX_REDESIGN.md");
  check(l2Doc.includes("L2"), "L2 doc present", "L2 doc");
  check(l2Doc.includes("Passed") || l2Doc.includes("PASSED"), "L2 doc status", "L2 status");

  check(fileText("docs/internal/MILESTONES.md").includes("L2"), "MILESTONES.md includes L2", "Update milestones");
  check(fileText("docs/internal/PROJECT_STATUS.md").includes("L2"), "PROJECT_STATUS.md includes L2", "Update status");

  for (const phrase of FORBIDDEN_PHRASES) {
    const surfaces = [
      "src/components/procrow/procrow-commercial-lifecycle-compact.tsx",
      "src/components/procrow/procrow-tenant-workbench-header.tsx",
      "src/app/admin/queue/page.tsx",
    ];
    for (const rel of surfaces) {
      if (fileText(rel).toLowerCase().includes(phrase)) {
        check(false, "", `Forbidden phrase in ${rel}: "${phrase}"`);
      }
    }
  }
  ok("No forbidden phrases in L2 workbench surfaces");

  if (passed) {
    console.log("\nL2 procrow-workbench:verify PASSED\n");
    process.exit(0);
  }
  console.log("\nL2 procrow-workbench:verify FAILED\n");
  process.exit(1);
}

main();
