/**
 * J2 — ProCrow control tower dashboard depth guards.
 *
 *   npm run procrow-dashboard:verify
 *
 * Also invoked from `npm run procrow:verify` after J1 checks.
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
] as const;

const REQUIRED = [
  "src/lib/procrow/procrow-control-tower-contract.ts",
  "src/lib/services/procrow-control-tower.service.ts",
  "src/components/procrow/procrow-control-tower-dashboard.tsx",
  "docs/internal/J2_PROCROW_CONTROL_TOWER_DASHBOARD_DEPTH.md",
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

  console.log("\n=== J2 ProCrow control tower dashboard ===\n");

  for (const rel of REQUIRED) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(
    overview.includes("getProCrowControlTowerSnapshot"),
    "/admin/overview loads control tower snapshot",
    "Admin overview missing getProCrowControlTowerSnapshot"
  );
  check(
    overview.includes("ProCrowControlTowerDashboard"),
    "/admin/overview renders ProCrowControlTowerDashboard",
    "Admin overview missing ProCrowControlTowerDashboard"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"procrow-dashboard:verify"'),
    "package.json defines procrow-dashboard:verify",
    "Add npm script procrow-dashboard:verify"
  );

  const dash = fileText("src/components/procrow/procrow-control-tower-dashboard.tsx");
  check(dash.includes("Operator queue"), "Dashboard includes operator queue section", "Missing operator queue UI");
  check(dash.includes("F23"), "Dashboard references F23 production gate", "Missing F23 gate wording");
  check(dash.includes("Deployment /"), "Deployment / go-no-go section present", "Missing deployment section");

  const service = fileText("src/lib/services/procrow-control-tower.service.ts");
  check(service.includes("buildOperatorQueue"), "Service builds operator queue", "Missing buildOperatorQueue");
  check(!service.includes("service_role"), "Control tower service avoids service_role string", "Remove service_role from service");

  let scan = "";
  for (const rel of [
    "src/lib/procrow/procrow-control-tower-contract.ts",
    "src/lib/services/procrow-control-tower.service.ts",
    "src/components/procrow/procrow-control-tower-dashboard.tsx",
  ]) {
    scan += fileText(rel).toLowerCase() + "\n";
  }
  for (const phrase of FORBIDDEN) {
    check(
      !scan.includes(phrase.toLowerCase()),
      `No forbidden phrase in J2 surfaces: "${phrase}"`,
      `Forbidden phrase in J2 code: "${phrase}"`
    );
  }

  const procrowDir = join(ROOT, "src/components/procrow");
  const n = listFilesRecursive(procrowDir).length;
  check(n >= 6, `ProCrow components directory has files (${n})`, "Expected expanded ProCrow component set");

  console.log(passed ? "\nJ2 procrow-dashboard:verify PASSED\n" : "\nJ2 procrow-dashboard:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
