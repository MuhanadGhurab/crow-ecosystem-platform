/**
 * J1 — ProCrow portal UX unification guards.
 *
 *   npm run procrow:verify
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_CLAIM_PHRASES = [
  "production go-live approved",
  "activate production",
  "automatic tenant provisioning",
  "self-healing security",
  "autonomous detection",
  "certified compliant",
  "fully compliant",
  "guaranteed compliance",
  "siem replacement",
  "live payments enabled",
  "payment authorized",
  "ai-powered governance",
] as const;

const REQUIRED_FILES = [
  "src/lib/constants/procrow-portal.ts",
  "src/components/procrow/procrow-page-header.tsx",
  "src/components/procrow/procrow-control-tower-map.tsx",
  "src/components/procrow/procrow-safety-note.tsx",
  "src/components/procrow/procrow-capability-card.tsx",
  "src/components/procrow/procrow-capability-framing.tsx",
  "docs/internal/J1_PROCROW_PORTAL_UX_UNIFICATION.md",
  "docs/internal/PROCROW_OPERATOR_INDEX.md",
] as const;

const PROCROW_COPY_PATHS = [
  "src/app/admin/overview/page.tsx",
  "src/app/admin/layout.tsx",
  "src/app/admin/requests/page.tsx",
  "src/app/admin/requests/[requestId]/page.tsx",
  "src/app/admin/tenants/[tenantId]/page.tsx",
  "src/app/[tenant]/cybercrow/dashboard/page.tsx",
  "src/app/sarea/overview/page.tsx",
  "src/lib/constants/procrow-portal.ts",
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

  console.log("\n=== J1 ProCrow portal UX unification ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"procrow:verify"'),
    "package.json defines procrow:verify script",
    "Missing npm script procrow:verify"
  );

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(
    overview.includes("ProCrowControlTowerHeader"),
    "/admin/overview uses ProCrow Control Tower header",
    "Admin overview missing ProCrowControlTowerHeader"
  );
  check(
    overview.includes("ProCrowControlTowerMap"),
    "/admin/overview includes control tower map",
    "Admin overview missing ProCrowControlTowerMap"
  );

  const constants = fileText("src/lib/constants/procrow-portal.ts");
  check(
    constants.includes("PROCROW_INFORMATION_ARCHITECTURE"),
    "ProCrow information architecture documented in constants",
    "Missing PROCROW_INFORMATION_ARCHITECTURE"
  );
  check(
    constants.includes("PROCROW_UX_ROADMAP"),
    "ProCrow UX roadmap documented in constants",
    "Missing PROCROW_UX_ROADMAP"
  );

  const adminLayout = fileText("src/app/admin/layout.tsx");
  check(
    adminLayout.includes("requirePlatformConsole"),
    "Admin layout still requires platform console auth",
    "Admin layout may have weakened requirePlatformConsole"
  );
  check(
    adminLayout.includes('title="ProCrow"'),
    "Admin shell titles ProCrow",
    "Admin layout missing ProCrow title"
  );

  check(
    fileText("src/lib/auth/session.ts").includes("requirePlatformConsole"),
    "requirePlatformConsole guard still present",
    "Missing requirePlatformConsole in session auth"
  );

  let combinedCopy = "";
  for (const rel of PROCROW_COPY_PATHS) {
    if (rel === "src/lib/constants/procrow-portal.ts") continue;
    combinedCopy += fileText(rel) + "\n";
  }
  for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
    check(
      !combinedCopy.toLowerCase().includes(phrase.toLowerCase()),
      `No forbidden claim phrase in ProCrow copy: "${phrase}"`,
      `Forbidden claim phrase found in ProCrow surfaces: "${phrase}"`
    );
  }

  const procrowComponentsDir = join(ROOT, "src/components/procrow");
  const procrowFiles = listFilesRecursive(procrowComponentsDir);
  check(
    procrowFiles.length >= 6,
    `ProCrow shared components present (${procrowFiles.length} files)`,
    "Expected at least 6 ProCrow component files"
  );

  const operatorIndex = fileText("docs/internal/PROCROW_OPERATOR_INDEX.md");
  check(
    operatorIndex.includes("CLIENT_PORTAL_RUNBOOK") &&
      operatorIndex.includes("F23_PRODUCTION_LAUNCH_DEFERRED_GATE"),
    "ProCrow operator index links key runbooks",
    "PROCROW_OPERATOR_INDEX missing key doc references"
  );

  const j1Doc = fileText("docs/internal/J1_PROCROW_PORTAL_UX_UNIFICATION.md");
  check(
    j1Doc.includes("PASSED") || j1Doc.includes("Passed"),
    "J1 phase doc records completion status",
    "J1 doc should record pass/fail decision"
  );

  console.log(passed ? "\nJ1 procrow:verify PASSED\n" : "\nJ1 procrow:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
