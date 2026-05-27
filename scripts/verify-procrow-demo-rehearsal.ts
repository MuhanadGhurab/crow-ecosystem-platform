/**
 * J8 — ProCrow demo rehearsal guards.
 *
 *   npm run procrow-demo:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_DOCS = [
  "docs/internal/J8_PROCROW_DEMO_REHEARSAL.md",
  "docs/internal/J8_PROCROW_DEMO_ROUTE_AUDIT.md",
  "docs/internal/J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md",
  "docs/internal/J8_PROCROW_SCREENSHOT_CHECKLIST.md",
  "docs/internal/PROCROW_DEMO_RUNBOOK.md",
] as const;

const ROUTE_MARKERS = [
  "/admin/overview",
  "/admin/queue",
  "/admin/requests",
  "/admin/go-no-go",
  "/admin/operator-console",
  "cybercrow/dashboard",
  "cybercrow/evidence",
  "/sarea/overview",
  "/sarea/role-mapping",
] as const;

const SAFETY_MARKERS = [
  "manual",
  "no paid infra",
  "f23",
  "staging",
  "auto-provision",
  "forbidden",
] as const;

const FORBIDDEN_IN_J8_DOCS = [
  "production ready",
  "production-ready",
  "certified compliant",
  "compliance certified",
  "automatic deployment",
  "auto-deploy",
  "activate live payments",
  "autonomous validation",
  "launch approved",
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

  console.log("\n=== J8 ProCrow demo rehearsal ===\n");

  for (const rel of REQUIRED_DOCS) {
    check(existsSync(join(ROOT, rel)), `Required doc: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"procrow-demo:verify"'), "package.json defines procrow-demo:verify", "Add npm script");
  check(
    pkg.includes("verify-procrow-demo-rehearsal") && pkg.includes("procrow:verify"),
    "procrow:verify chain includes procrow-demo:verify",
    "Append procrow-demo:verify to procrow:verify"
  );

  const hint = fileText("src/components/procrow/procrow-demo-rehearsal-hint.tsx");
  const routesFile = fileText("src/lib/routes.ts");
  check(hint.includes("data-procrow"), "Demo rehearsal hint component exists", "Add procrow-demo-rehearsal-hint");
  check(
    hint.includes("routes.admin.queue") &&
      hint.includes("routes.admin.goNoGo") &&
      hint.includes("routes.admin.operatorConsole"),
    "Demo hint links core admin routes",
    "Demo hint missing route links"
  );
  check(
    routesFile.includes('queue: "/admin/queue"') &&
      routesFile.includes('goNoGo: "/admin/go-no-go"') &&
      routesFile.includes('operatorConsole: "/admin/operator-console"'),
    "routes.ts defines queue, go-no-go, operator console",
    "Missing admin routes in routes.ts"
  );

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(overview.includes("ProCrowDemoRehearsalHint"), "Overview embeds demo rehearsal hint", "Import demo hint on overview");

  let j8Corpus = "";
  for (const rel of REQUIRED_DOCS) {
    j8Corpus += fileText(rel).toLowerCase() + "\n";
  }

  for (const route of ROUTE_MARKERS) {
    check(j8Corpus.includes(route.toLowerCase()), `J8 docs mention route: ${route}`, `Missing route in J8 docs: ${route}`);
  }

  let safetyHits = 0;
  for (const marker of SAFETY_MARKERS) {
    if (j8Corpus.includes(marker)) safetyHits += 1;
  }
  check(safetyHits >= 4, `J8 docs include safety wording (${safetyHits}/${SAFETY_MARKERS.length})`, "Add manual/F23/staging safety copy");

  check(
    j8Corpus.includes("forbidden") || j8Corpus.includes("do not claim"),
    "J8 docs include forbidden-claims guidance",
    "Add forbidden claims section"
  );

  check(
    j8Corpus.includes("pause") || j8Corpus.includes("k1") || j8Corpus.includes("j9"),
    "J8 docs include next-phase recommendation",
    "Add pause/K1/J9 recommendation"
  );

  for (const phrase of FORBIDDEN_IN_J8_DOCS) {
    check(
      !j8Corpus.includes(phrase.toLowerCase()),
      `J8 docs avoid forbidden phrase: "${phrase}"`,
      `Forbidden phrase in J8 docs: "${phrase}"`
    );
  }

  const operatorIndex = fileText("docs/internal/PROCROW_OPERATOR_INDEX.md");
  check(operatorIndex.includes("J8"), "PROCROW_OPERATOR_INDEX mentions J8", "Add J8 to operator index");
  check(
    operatorIndex.includes("J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK"),
    "Operator index links J8 playbook",
    "Link J8 playbook in operator index"
  );

  const demoIndex = fileText("docs/internal/OPERATOR_DEMO_INDEX.md");
  check(demoIndex.includes("J8"), "OPERATOR_DEMO_INDEX mentions J8", "Add J8 to demo index");

  const milestones = fileText("docs/internal/MILESTONES.md");
  check(milestones.includes("J8"), "MILESTONES.md includes J8 section", "Add J8 to MILESTONES");

  const projectStatus = fileText("docs/internal/PROJECT_STATUS.md");
  check(projectStatus.includes("J8"), "PROJECT_STATUS.md mentions J8", "Update PROJECT_STATUS for J8");

  console.log(passed ? "\nJ8 procrow-demo:verify PASSED\n" : "\nJ8 procrow-demo:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
