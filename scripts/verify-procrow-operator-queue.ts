/**
 * J3 — ProCrow request-to-tenant operator queue guards.
 *
 *   npm run procrow-queue:verify
 *
 * Also invoked from `npm run procrow:verify` after J1/J2 checks.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN = [
  "service_role",
  "automatic tenant provisioning",
  "activate production",
  "live payments",
  "certified compliant",
  "autonomous detection",
  "siem replacement",
  "fully onboarded customer",
  "production active",
  "auto-provision",
  "auto provision",
] as const;

const REQUIRED = [
  "src/lib/procrow/procrow-operator-queue-contract.ts",
  "src/lib/services/procrow-operator-queue.service.ts",
  "src/components/procrow/procrow-operator-queue-panel.tsx",
  "src/components/procrow/procrow-operator-queue-browser.tsx",
  "src/app/admin/queue/page.tsx",
  "docs/internal/J3_PROCROW_REQUEST_TO_TENANT_OPERATOR_QUEUE.md",
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

function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listFilesRecursive(full));
    else if (st.isFile()) out.push(full);
  }
  return out;
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

  console.log("\n=== J3 ProCrow operator queue ===\n");

  for (const rel of REQUIRED) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"procrow-queue:verify"'),
    "package.json defines procrow-queue:verify",
    "Add npm script procrow-queue:verify"
  );
  check(
    pkg.includes("verify-procrow-operator-queue"),
    "procrow-queue:verify points at operator queue script",
    "Wire procrow-queue:verify script path"
  );

  const routes = fileText("src/lib/routes.ts");
  check(routes.includes('queue: "/admin/queue"'), "routes.admin.queue defined", "Missing routes.admin.queue");

  const layout = fileText("src/app/admin/layout.tsx");
  check(layout.includes("routes.admin.queue"), "Admin nav includes operator queue", "Add Queue to admin nav");

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(
    overview.includes("ProCrowControlTowerDashboard"),
    "/admin/overview still renders control tower dashboard",
    "Admin overview missing dashboard"
  );

  const dash = fileText("src/components/procrow/procrow-control-tower-dashboard.tsx");
  check(
    dash.includes("operatorQueueSnapshot"),
    "Dashboard uses operatorQueueSnapshot",
    "Dashboard must use operatorQueueSnapshot (not operatorQueue)"
  );
  check(
    dash.includes("ProCrowOperatorQueuePanel"),
    "Dashboard embeds ProCrowOperatorQueuePanel",
    "Missing ProCrowOperatorQueuePanel on dashboard"
  );
  check(
    dash.includes("routes.admin.queue"),
    "Dashboard links to full operator queue",
    "Missing link to /admin/queue"
  );

  const towerService = fileText("src/lib/services/procrow-control-tower.service.ts");
  check(
    towerService.includes("deriveProCrowOperatorQueueSnapshot"),
    "Control tower derives J3 queue snapshot",
    "Control tower must call deriveProCrowOperatorQueueSnapshot"
  );
  check(
    !towerService.includes("buildOperatorQueue"),
    "Legacy buildOperatorQueue removed from control tower",
    "Remove buildOperatorQueue from procrow-control-tower.service.ts"
  );
  check(
    towerService.includes("operatorQueueSnapshot"),
    "Control tower snapshot exposes operatorQueueSnapshot",
    "Missing operatorQueueSnapshot on control tower return"
  );

  const queueService = fileText("src/lib/services/procrow-operator-queue.service.ts");
  check(
    queueService.includes("deriveProCrowOperatorQueueSnapshot"),
    "Queue service exports deriveProCrowOperatorQueueSnapshot",
    "Missing deriveProCrowOperatorQueueSnapshot"
  );
  check(
    queueService.includes("getProCrowOperatorQueueSnapshot"),
    "Queue service exports getProCrowOperatorQueueSnapshot",
    "Missing getProCrowOperatorQueueSnapshot"
  );
  check(
    !queueService.includes(".update(") && !queueService.includes(".create(") && !queueService.includes(".delete("),
    "Queue service avoids Prisma writes",
    "Queue service must remain read-only (no create/update/delete)"
  );
  check(
    queueService.includes("openRequestChangesCount") || queueService.includes("request_changes"),
    "Queue derives from client request-changes signals",
    "Wire request-changes into queue derivation"
  );
  check(
    queueService.includes("openReviewNotesCount") || queueService.includes("review_note"),
    "Queue derives from client review notes",
    "Wire review notes into queue derivation"
  );

  const contract = fileText("src/lib/procrow/procrow-operator-queue-contract.ts");
  check(contract.includes("ProCrowQueueStage"), "Queue contract defines stages", "Missing ProCrowQueueStage");
  check(
    contract.includes("ProCrowOperatorQueueSnapshot"),
    "Queue contract defines snapshot type",
    "Missing ProCrowOperatorQueueSnapshot"
  );

  const queuePage = fileText("src/app/admin/queue/page.tsx");
  check(
    queuePage.includes("getProCrowOperatorQueueSnapshot"),
    "/admin/queue loads queue snapshot",
    "Queue page must call getProCrowOperatorQueueSnapshot"
  );
  check(
    queuePage.includes("ProCrowOperatorQueueBrowser"),
    "/admin/queue renders stage browser",
    "Missing ProCrowOperatorQueueBrowser"
  );

  const hint = fileText("src/lib/procrow/procrow-request-status-queue-hint.ts");
  check(
    hint.includes("requestStatusToOperatorQueueHint"),
    "Request status queue hints exported",
    "Missing requestStatusToOperatorQueueHint"
  );

  const requestsList = fileText("src/app/admin/requests/page.tsx");
  check(
    requestsList.includes("requestStatusToOperatorQueueHint") || requestsList.includes("routes.admin.queue"),
    "Request list aligned with operator queue (hint or queue link)",
    "Add queue hint or link on /admin/requests"
  );

  let scan = "";
  for (const rel of [
    "src/lib/procrow/procrow-operator-queue-contract.ts",
    "src/lib/services/procrow-operator-queue.service.ts",
    "src/components/procrow/procrow-operator-queue-panel.tsx",
    "src/app/admin/queue/page.tsx",
  ]) {
    scan += fileText(rel).toLowerCase() + "\n";
  }
  for (const phrase of FORBIDDEN) {
    check(
      !scan.includes(phrase.toLowerCase()),
      `No forbidden phrase in J3 surfaces: "${phrase}"`,
      `Forbidden phrase in J3 code: "${phrase}"`
    );
  }

  const procrowDir = join(ROOT, "src/components/procrow");
  const queueComponents = listFilesRecursive(procrowDir).filter((f) => f.includes("queue"));
  check(
    queueComponents.length >= 4,
    `Queue UI components present (${queueComponents.length} queue-related files)`,
    "Expected queue UI component set under src/components/procrow"
  );

  console.log(passed ? "\nJ3 procrow-queue:verify PASSED\n" : "\nJ3 procrow-queue:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
