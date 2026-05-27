/**
 * J7 — ProCrow Operator Docs & Validation Console guards.
 *
 *   npm run procrow-operator:verify
 */

import { existsSync, readFileSync } from "node:fs";
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
  "autonomous validation",
] as const;

const REQUIRED = [
  "src/lib/procrow/procrow-operator-console-contract.ts",
  "src/lib/services/procrow-operator-console.service.ts",
  "src/components/procrow/procrow-operator-console.tsx",
  "src/components/procrow/procrow-docs-index-panel.tsx",
  "src/components/procrow/procrow-validation-command-panel.tsx",
  "src/components/procrow/procrow-command-risk-badge.tsx",
  "src/components/procrow/procrow-operator-safety-warnings.tsx",
  "src/components/procrow/procrow-recommended-next-actions.tsx",
  "src/components/procrow/procrow-operator-console-overview-link.tsx",
  "src/app/admin/operator-console/page.tsx",
  "docs/internal/J7_OPERATOR_DOCS_VALIDATION_CONSOLE.md",
] as const;

const J7_SCAN_FILES = [
  "src/components/procrow/procrow-operator-console.tsx",
  "src/components/procrow/procrow-docs-index-panel.tsx",
  "src/components/procrow/procrow-validation-command-panel.tsx",
  "src/components/procrow/procrow-command-risk-badge.tsx",
  "src/components/procrow/procrow-operator-safety-warnings.tsx",
  "src/components/procrow/procrow-operator-console-overview-link.tsx",
  "src/app/admin/operator-console/page.tsx",
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

  console.log("\n=== J7 ProCrow operator console ===\n");

  for (const rel of REQUIRED) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"procrow-operator:verify"'), "package.json defines procrow-operator:verify", "Add npm script");
  check(pkg.includes("verify-procrow-operator-console"), "procrow-operator:verify points at script", "Wire script path");
  check(
    pkg.includes("verify-procrow-operator-console") &&
      pkg.includes("procrow:verify") &&
      pkg.includes("procrow-operator:verify"),
    "procrow:verify chain includes operator console verifier",
    "Append procrow-operator:verify to procrow:verify"
  );

  const routes = fileText("src/lib/routes.ts");
  check(
    routes.includes("operatorConsole") && routes.includes("/admin/operator-console"),
    "routes.admin.operatorConsole defined",
    "Add operatorConsole route"
  );

  const layout = fileText("src/app/admin/layout.tsx");
  check(layout.includes("routes.admin.operatorConsole"), "Admin nav includes operator console", "Add nav item");

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(overview.includes("ProCrowOperatorConsoleOverviewLink"), "Overview links to operator console", "Embed overview link");

  const queue = fileText("src/app/admin/queue/page.tsx");
  check(queue.includes("routes.admin.operatorConsole"), "Queue references operator console route", "Add queue cross-link");

  const goNoGo = fileText("src/components/procrow/procrow-go-no-go-center.tsx");
  check(goNoGo.includes("routes.admin.operatorConsole"), "Go/no-go links to operator console", "Add go/no-go cross-link");

  const contract = fileText("src/lib/procrow/procrow-operator-console-contract.ts");
  check(contract.includes("buildProCrowOperatorValidationCommands"), "Contract exports command builder", "Missing builder");
  check(contract.includes("PROCROW_OPERATOR_DOC_INDEX"), "Contract exports doc index", "Missing doc index");
  check(contract.includes("buildProCrowValidationCommandIndex"), "Contract reuses J6 validation index", "Import J6 index");
  check(contract.includes("J1") || contract.includes("j1"), "Doc index includes J-track phases", "Add phase history docs");

  const service = fileText("src/lib/services/procrow-operator-console.service.ts");
  check(service.includes("getProCrowOperatorConsoleSnapshot"), "Service exports snapshot getter", "Missing service export");
  check(
    !service.includes("child_process") && !service.includes("execSync") && !service.includes("spawn("),
    "Service does not invoke shell",
    "Operator console service must stay metadata-only"
  );
  check(
    !service.includes("$executeRaw") && !service.includes("$queryRaw") && !service.includes("prisma."),
    "Service avoids Prisma client usage",
    "Operator console service must not query DB"
  );

  const consoleUi = fileText("src/components/procrow/procrow-operator-console.tsx");
  check(
    consoleUi.includes("manual") || consoleUi.includes("Manual"),
    "Console UI states manual execution",
    "Add manual-execution copy"
  );
  check(
    !consoleUi.includes("child_process") && !consoleUi.includes("execSync"),
    "Console UI does not invoke shell",
    "UI must not run commands"
  );

  const operatorIndex = fileText("docs/internal/PROCROW_OPERATOR_INDEX.md");
  for (const phase of ["J1", "J2", "J3", "J4", "J5", "J6", "J7"]) {
    check(operatorIndex.includes(phase), `PROCROW_OPERATOR_INDEX mentions ${phase}`, `Add ${phase} to operator index`);
  }
  check(
    operatorIndex.includes("/admin/operator-console"),
    "Operator index lists operator console route",
    "Add operator console route to index"
  );

  let scan = "";
  for (const rel of J7_SCAN_FILES) {
    scan += fileText(rel).toLowerCase() + "\n";
  }
  for (const phrase of FORBIDDEN) {
    check(
      !scan.includes(phrase.toLowerCase()),
      `No forbidden phrase in J7 UI: "${phrase}"`,
      `Forbidden phrase in J7 UI: "${phrase}"`
    );
  }

  console.log(passed ? "\nJ7 procrow-operator:verify PASSED\n" : "\nJ7 procrow-operator:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
