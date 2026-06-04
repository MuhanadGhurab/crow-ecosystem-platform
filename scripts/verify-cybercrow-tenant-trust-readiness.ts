/**
 * M1 — CyberCrow tenant trust readiness verifier.
 *
 *   npm run cybercrow-trust:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/cybercrow/cybercrow-tenant-trust-contract.ts",
  "src/lib/services/cybercrow-tenant-trust.service.ts",
  "src/lib/constants/cybercrow-identity-readiness.ts",
  "src/lib/constants/cybercrow-grc-readiness.ts",
  "src/components/admin/admin-cybercrow-trust-readiness-panel.tsx",
  "src/components/tenant/cybercrow/cybercrow-tenant-trust-summary.tsx",
  "src/components/procrow/procrow-cybercrow-trust-go-no-go-panel.tsx",
  "docs/internal/M1_CYBERCROW_IDENTITY_GRC_TENANT_READINESS.md",
] as const;

const FORBIDDEN = [
  "Certified compliant",
  "Official audit passed",
  "Regulator-approved",
  "Legal evidence",
  "SIEM replacement",
  "autonomous remediation",
  "autonomous detection",
  "Entra ID integration active",
  "Entra ID live sync",
  "Microsoft-certified integration",
  "auto-provision",
  "production launch approved",
  "live checkout",
  "platform_admin",
] as const;

const REQUIRED_PHRASES = [
  "Entra ID readiness mapping",
  "Compliance readiness posture",
  "CyberCrow validates trust and access boundaries",
  "CEM runs",
  "cybercrow-trust:verify",
  "Advisory trust readiness only",
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

function main(): boolean {
  let pass = true;

  console.log("\n=== M1 CyberCrow tenant trust readiness ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"cybercrow-trust:verify"')) {
    pass = fail("package.json missing cybercrow-trust:verify") && pass;
  } else {
    pass = ok("npm script cybercrow-trust:verify") && pass;
  }

  const surfaces = [
    "src/app/admin/tenants/[tenantId]/page.tsx",
    "src/app/admin/requests/[requestId]/page.tsx",
    "src/app/admin/go-no-go/page.tsx",
    "src/app/[tenant]/cybercrow/dashboard/page.tsx",
    "src/app/[tenant]/cybercrow/evidence/page.tsx",
    "src/app/[tenant]/cybercrow/grc/page.tsx",
    "src/app/[tenant]/cybercrow/risk/page.tsx",
  ];

  for (const rel of surfaces) {
    const t = fileText(rel);
    if (!t.includes("Cybercrow") && !t.includes("cybercrow") && !t.includes("CyberCrow")) {
      pass = fail(`${rel} missing CyberCrow trust integration`) && pass;
    } else {
      pass = ok(`${rel} integrates trust readiness`) && pass;
    }
  }

  const phraseSources = [
    "src/lib/cybercrow/cybercrow-tenant-trust-contract.ts",
    "src/lib/services/cybercrow-tenant-trust.service.ts",
    "src/lib/constants/cybercrow-identity-readiness.ts",
    "src/lib/constants/cybercrow-grc-readiness.ts",
    "src/components/tenant/cybercrow/cybercrow-tenant-trust-summary.tsx",
    "src/components/admin/admin-cybercrow-trust-readiness-panel.tsx",
    "package.json",
  ].map(fileText);

  const combinedPhrases = phraseSources.join("\n");

  for (const phrase of REQUIRED_PHRASES) {
    if (!combinedPhrases.includes(phrase)) {
      pass = fail(`Missing required phrase: ${phrase}`) && pass;
    }
  }
  pass = ok("Required safe-readiness phrases") && pass;

  const service = fileText("src/lib/services/cybercrow-tenant-trust.service.ts");
  if (service.includes("graph.microsoft") || service.includes("Microsoft Graph")) {
    pass = fail("Service must not call Microsoft Graph") && pass;
  } else {
    pass = ok("No Microsoft Graph in trust service") && pass;
  }

  if (!service.includes("buildCyberCrowTenantTrustSnapshotForTenantId")) {
    pass = fail("Tenant trust snapshot builder required") && pass;
  } else {
    pass = ok("Tenant trust snapshot builder") && pass;
  }

  const forbiddenScan = [
    "src/lib/services/cybercrow-tenant-trust.service.ts",
    "src/components/admin/admin-cybercrow-trust-readiness-panel.tsx",
    "src/components/procrow/procrow-cybercrow-trust-go-no-go-panel.tsx",
  ]
    .map(fileText)
    .join("\n");

  for (const bad of FORBIDDEN) {
    if (forbiddenScan.includes(bad)) {
      pass = fail(`Forbidden claim or phrase: ${bad}`) && pass;
    }
  }
  pass = ok("No forbidden compliance/SIEM/Entra-live claims in M1 surfaces") && pass;

  const goNoGo = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGo.includes("cybercrow-tenant-trust-m1")) {
    pass = fail("Go/No-Go service missing cybercrow-tenant-trust-m1 gate") && pass;
  } else {
    pass = ok("Go/No-Go CyberCrow tenant trust gate") && pass;
  }

  console.log(pass ? "\nPASS: M1 CyberCrow tenant trust readiness\n" : "\nFAIL: M1 verification\n");
  return pass;
}

process.exit(main() ? 0 : 1);
