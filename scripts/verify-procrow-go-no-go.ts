/**
 * J6 — ProCrow Deployment Go/No-Go Center guards.
 *
 *   npm run procrow-go-no-go:verify
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN = [
  "service_role",
  "production ready",
  "production-ready",
  "launch approved",
  "certified compliant",
  "compliance certified",
  "automatic deployment",
  "auto-deploy",
  "run migration from",
  "activate live payments",
  "activate payments",
] as const;

const REQUIRED = [
  "src/lib/procrow/procrow-go-no-go-contract.ts",
  "src/lib/services/procrow-go-no-go.service.ts",
  "src/components/procrow/procrow-go-no-go-center.tsx",
  "src/components/procrow/procrow-gate-status-card.tsx",
  "src/components/procrow/procrow-validation-command-list.tsx",
  "src/components/procrow/procrow-deployment-safety-checklist.tsx",
  "src/components/procrow/procrow-release-blockers-panel.tsx",
  "src/components/procrow/procrow-go-no-go-decision-badge.tsx",
  "src/app/admin/go-no-go/page.tsx",
  "docs/internal/J6_DEPLOYMENT_GO_NO_GO_CENTER.md",
] as const;

const J6_SCAN_FILES = [
  "src/components/procrow/procrow-go-no-go-center.tsx",
  "src/components/procrow/procrow-gate-status-card.tsx",
  "src/components/procrow/procrow-validation-command-list.tsx",
  "src/components/procrow/procrow-deployment-safety-checklist.tsx",
  "src/components/procrow/procrow-release-blockers-panel.tsx",
  "src/components/procrow/procrow-go-no-go-decision-badge.tsx",
  "src/components/procrow/procrow-go-no-go-overview-link.tsx",
  "src/app/admin/go-no-go/page.tsx",
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

  console.log("\n=== J6 ProCrow go/no-go center ===\n");

  for (const rel of REQUIRED) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"procrow-go-no-go:verify"'), "package.json defines procrow-go-no-go:verify", "Add npm script");
  check(pkg.includes("verify-procrow-go-no-go"), "procrow-go-no-go:verify points at script", "Wire script path");
  check(
    pkg.includes("procrow-go-no-go:verify") && pkg.includes("procrow:verify") && pkg.includes("verify-procrow-go-no-go"),
    "procrow:verify chain includes go/no-go verifier",
    "Append procrow-go-no-go:verify to procrow:verify"
  );

  const routes = fileText("src/lib/routes.ts");
  check(routes.includes("goNoGo") && routes.includes("/admin/go-no-go"), "routes.admin.goNoGo defined", "Add goNoGo route");

  const layout = fileText("src/app/admin/layout.tsx");
  check(layout.includes("routes.admin.goNoGo"), "Admin nav includes Go / No-Go", "Add Go/No-Go to admin nav");

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(overview.includes("ProCrowGoNoGoOverviewLink"), "Overview links to go/no-go center", "Embed overview link");

  const queue = fileText("src/app/admin/queue/page.tsx");
  check(queue.includes("routes.admin.goNoGo"), "Queue references go/no-go route", "Add queue cross-link");

  const contract = fileText("src/lib/procrow/procrow-go-no-go-contract.ts");
  check(contract.includes("buildProCrowValidationCommandIndex"), "Contract exports validation index builder", "Missing builder");
  check(contract.includes("ProCrowGoNoGoSnapshot"), "Contract defines snapshot type", "Missing snapshot type");
  check(contract.includes("PROCROW_F23_PRODUCTION_GATE_ACTIVE"), "F23 gate constant present", "Add F23 constant");

  const service = fileText("src/lib/services/procrow-go-no-go.service.ts");
  check(service.includes("getProCrowGoNoGoSnapshot"), "Service exports getProCrowGoNoGoSnapshot", "Missing service export");
  check(
    !service.includes("child_process") && !service.includes("execSync") && !service.includes("spawn("),
    "Service does not invoke shell",
    "Go/no-go service must stay metadata-only"
  );
  check(
    !service.includes("$executeRaw") && !service.includes("$queryRaw") && !service.includes("prisma.") ,
    "Service avoids Prisma client usage",
    "Go/no-go service must not query DB"
  );
  check(service.includes("F23") || service.includes("f23"), "Service surfaces F23 wording", "Add F23 references");

  const center = fileText("src/components/procrow/procrow-go-no-go-center.tsx");
  check(center.includes("F23"), "Go/no-go center mentions F23", "F23 visibility in UI");
  check(center.includes("db:migrate"), "Migration caution visible in checklist", "Add migration safety copy");
  check(center.includes("payment") || center.includes("Payment"), "Payments safety section present", "Add payments note");
  check(center.includes("auto-provision") || center.includes("provisioning"), "Tenant provisioning guardrail present", "Add provisioning note");

  let scan = "";
  for (const rel of J6_SCAN_FILES) {
    scan += fileText(rel).toLowerCase() + "\n";
  }
  for (const phrase of FORBIDDEN) {
    check(
      !scan.includes(phrase.toLowerCase()),
      `No forbidden phrase in J6 UI: "${phrase}"`,
      `Forbidden phrase in J6 UI: "${phrase}"`
    );
  }

  console.log(passed ? "\nJ6 procrow-go-no-go:verify PASSED\n" : "\nJ6 procrow-go-no-go:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
