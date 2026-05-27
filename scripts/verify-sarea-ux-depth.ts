/**
 * J5 — SAREA Studio UX depth guards.
 *
 *   npm run sarea:ux-verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN = [
  "service_role",
  "replaces rbac",
  "replace rbac",
  "rbac editor",
  "permission management console",
  "autonomous personalization",
  "ai-driven role",
  "ai role assignment",
  "drag-and-drop builder",
  "drag/drop builder",
  "production-ready tenant customization",
  "guaranteed ux compliance",
  "auto-provision",
  "auto provision",
  "live payments",
] as const;

const REQUIRED = [
  "src/lib/constants/sarea-ux-depth.ts",
  "src/components/sarea/sarea-page-header.tsx",
  "src/components/sarea/sarea-scope-note.tsx",
  "src/components/sarea/sarea-operator-next-actions.tsx",
  "src/components/sarea/sarea-profile-summary.tsx",
  "src/components/sarea/sarea-studio-strip.tsx",
  "src/components/sarea/sarea-experience-boundary-note.tsx",
  "docs/internal/J5_SAREA_STUDIO_UX_DEPTH.md",
] as const;

const PAGE_PATHS = [
  "src/app/sarea/overview/page.tsx",
  "src/app/sarea/profiles/page.tsx",
  "src/app/sarea/role-mapping/page.tsx",
  "src/app/sarea/preview/page.tsx",
  "src/app/sarea/navigation/page.tsx",
  "src/app/sarea/widgets/page.tsx",
] as const;

const J5_COMPONENT_PATHS = [
  "src/components/sarea/sarea-page-header.tsx",
  "src/components/sarea/sarea-scope-note.tsx",
  "src/components/sarea/sarea-readiness-card.tsx",
  "src/components/sarea/sarea-operator-next-actions.tsx",
  "src/components/sarea/sarea-profile-summary.tsx",
  "src/components/sarea/sarea-studio-strip.tsx",
  "src/components/sarea/sarea-experience-boundary-note.tsx",
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

  console.log("\n=== J5 SAREA Studio UX depth ===\n");

  for (const rel of REQUIRED) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"sarea:ux-verify"'), "package.json defines sarea:ux-verify", "Add npm script sarea:ux-verify");

  const constants = fileText("src/lib/constants/sarea-ux-depth.ts");
  check(constants.includes("SareaUXArea"), "UX model defines SareaUXArea", "Missing SareaUXArea");
  check(
    constants.includes("SareaProfileReadinessStatus"),
    "UX model defines profile readiness statuses",
    "Missing SareaProfileReadinessStatus"
  );
  check(
    constants.includes("ProCrow Experience Studio"),
    "UX model references ProCrow ownership",
    "Missing ProCrow ownership copy"
  );
  check(constants.includes("whatItIsNot"), "UX model defines what SAREA is not", "Missing scope negatives");
  check(
    constants.includes("RBAC controls access"),
    "UX model includes RBAC vs SAREA boundary copy",
    "Missing RBAC boundary wording"
  );
  check(
    constants.includes("tenant_backed"),
    "UX model includes tenant-backed wording",
    "Missing tenant-backed status"
  );

  const overview = fileText("src/app/sarea/overview/page.tsx");
  check(
    overview.includes("SareaPageHeader"),
    "Overview uses SareaPageHeader",
    "Overview should use SareaPageHeader"
  );
  check(
    overview.includes("SareaStudioStrip"),
    "Overview includes studio strip",
    "Overview should include SareaStudioStrip"
  );
  check(
    overview.includes("SareaOperatorNextActions"),
    "Overview includes operator next actions",
    "Overview should include operator next actions"
  );

  for (const page of PAGE_PATHS) {
    const text = fileText(page);
    check(
      text.includes('area="') || text.includes("SareaPageHeader"),
      `${page} uses J5 header pattern`,
      `${page} should set SareaStudioPage area or SareaPageHeader`
    );
    check(
      text.includes("RBAC") || text.includes("rbac"),
      `${page} references RBAC boundary`,
      `${page} should mention RBAC vs SAREA`
    );
    check(
      text.includes("tenant") || text.includes("Tenant") || text.includes("fallback"),
      `${page} mentions tenant-backed or fallback`,
      `${page} should clarify materialization source`
    );
    check(
      text.includes("operator") ||
        text.includes("Operator") ||
        text.includes("operatorActions") ||
        text.includes("SareaOperatorNextActions"),
      `${page} includes operator-oriented copy`,
      `${page} should include next-action language`
    );
  }

  const tower = fileText("src/components/procrow/procrow-control-tower-dashboard.tsx");
  check(
    tower.includes("routes.sarea.navigation") && tower.includes("routes.sarea.widgets"),
    "ProCrow control tower links navigation and widgets",
    "Expand ProCrow SAREA deep links"
  );

  for (const rel of J5_COMPONENT_PATHS) {
    if (!existsSync(join(ROOT, rel))) continue;
    const text = fileText(rel);
    for (const phrase of FORBIDDEN) {
      if (text.toLowerCase().includes(phrase)) {
        check(false, "", `Forbidden phrase "${phrase}" in ${rel}`);
      }
    }
  }

  for (const page of PAGE_PATHS) {
    const text = fileText(page);
    for (const phrase of ["replaces rbac", "rbac editor", "autonomous personalization", "ai-driven role"]) {
      if (text.toLowerCase().includes(phrase)) {
        check(false, "", `Forbidden phrase "${phrase}" in ${page}`);
      }
    }
  }

  console.log("");
  if (passed) {
    console.log("J5 SAREA UX depth: PASSED\n");
    process.exit(0);
  } else {
    console.log("J5 SAREA UX depth: FAILED\n");
    process.exit(1);
  }
}

main();
