/**
 * J4 — CyberCrow Evidence / GRC / Risk UX depth guards.
 *
 *   npm run cybercrow:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN = [
  "service_role",
  "siem replacement",
  "certified compliant",
  "certified compliance",
  "autonomous detection",
  "automatic remediation",
  "legal audit evidence",
  "production-grade soc",
  "regulatory approval",
  "guaranteed audit readiness",
  "auto-provision",
  "auto provision",
  "live payments",
] as const;

const REQUIRED = [
  "src/lib/constants/cybercrow-ux-depth.ts",
  "src/components/tenant/cybercrow/cybercrow-page-header.tsx",
  "src/components/tenant/cybercrow/cybercrow-scope-note.tsx",
  "src/components/tenant/cybercrow/cybercrow-operator-next-actions.tsx",
  "src/components/tenant/cybercrow/cybercrow-evidence-summary.tsx",
  "src/components/tenant/cybercrow/cybercrow-grc-summary.tsx",
  "src/components/tenant/cybercrow/cybercrow-risk-summary.tsx",
  "docs/internal/J4_CYBERCROW_EVIDENCE_GRC_UX_DEPTH.md",
] as const;

const PAGE_PATHS = [
  "src/app/[tenant]/cybercrow/dashboard/page.tsx",
  "src/app/[tenant]/cybercrow/evidence/page.tsx",
  "src/app/[tenant]/cybercrow/grc/page.tsx",
  "src/app/[tenant]/cybercrow/risk/page.tsx",
  "src/app/[tenant]/cybercrow/security-events/page.tsx",
  "src/app/[tenant]/cybercrow/audit-logs/page.tsx",
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

  console.log("\n=== J4 CyberCrow Evidence/GRC UX depth ===\n");

  for (const rel of REQUIRED) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"cybercrow:verify"'),
    "package.json defines cybercrow:verify",
    "Add npm script cybercrow:verify"
  );

  const constants = fileText("src/lib/constants/cybercrow-ux-depth.ts");
  check(constants.includes("CyberCrowUXArea"), "UX model defines CyberCrowUXArea", "Missing CyberCrowUXArea");
  check(
    constants.includes("CyberCrowEvidenceCategory"),
    "UX model defines evidence categories",
    "Missing CyberCrowEvidenceCategory"
  );
  check(
    constants.includes("ProCrow Trust & Security"),
    "UX model references ProCrow ownership",
    "Missing ProCrow ownership copy"
  );
  check(
    constants.includes("whatItIsNot"),
    "UX model defines what CyberCrow is not",
    "Missing scope negatives"
  );

  for (const page of PAGE_PATHS) {
    const text = fileText(page);
    check(
      text.includes("CybercrowPageHeader") || text.includes("cybercrow-page-header"),
      `${page} uses CybercrowPageHeader`,
      `${page} should use CybercrowPageHeader`
    );
  }

  const dash = fileText("src/app/[tenant]/cybercrow/dashboard/page.tsx");
  check(
    dash.includes("CybercrowTrustCockpitStrip"),
    "Dashboard includes trust cockpit strip",
    "Missing CybercrowTrustCockpitStrip on dashboard"
  );
  check(
    dash.includes("CybercrowEvidenceSummary"),
    "Dashboard includes evidence summary",
    "Missing CybercrowEvidenceSummary on dashboard"
  );

  const evidence = fileText("src/app/[tenant]/cybercrow/evidence/page.tsx");
  check(
    evidence.includes("CybercrowOperatorNextActions"),
    "Evidence page has operator next actions",
    "Missing operator next actions on evidence page"
  );

  const tower = fileText("src/components/procrow/procrow-control-tower-dashboard.tsx");
  check(
    tower.includes("cybercrow.grc") && tower.includes("cybercrow.auditLogs"),
    "ProCrow control tower links GRC and audit logs",
    "Expand ProCrow CyberCrow deep links"
  );

  const j4ComponentPaths = [
    "src/components/tenant/cybercrow/cybercrow-page-header.tsx",
    "src/components/tenant/cybercrow/cybercrow-scope-note.tsx",
    "src/components/tenant/cybercrow/cybercrow-readiness-card.tsx",
    "src/components/tenant/cybercrow/cybercrow-operator-next-actions.tsx",
    "src/components/tenant/cybercrow/cybercrow-evidence-summary.tsx",
    "src/components/tenant/cybercrow/cybercrow-grc-summary.tsx",
    "src/components/tenant/cybercrow/cybercrow-risk-summary.tsx",
    "src/components/tenant/cybercrow/cybercrow-trust-cockpit-strip.tsx",
  ];
  for (const rel of j4ComponentPaths) {
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
    for (const phrase of FORBIDDEN) {
      if (text.toLowerCase().includes(phrase)) {
        check(false, "", `Forbidden phrase "${phrase}" in ${page}`);
      }
    }
    check(
      text.includes("operator") || text.includes("Operator") || text.includes("recommended"),
      `${page} includes operator-oriented copy`,
      `${page} should include next-action or operator language`
    );
  }

  console.log("");
  if (passed) {
    console.log("J4 CyberCrow UX depth: PASSED\n");
    process.exit(0);
  } else {
    console.log("J4 CyberCrow UX depth: FAILED\n");
    process.exit(1);
  }
}

main();
