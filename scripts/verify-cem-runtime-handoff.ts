/**
 * M3 — CEM runtime handoff & Business Portal operational readiness verifier.
 *
 *   npm run cem-handoff:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/cem/cem-runtime-handoff-contract.ts",
  "src/lib/cem/cem-runtime-go-no-go.ts",
  "src/lib/services/cem-runtime-handoff.service.ts",
  "src/lib/constants/cem-operational-readiness.ts",
  "src/components/admin/admin-cem-runtime-handoff-panel.tsx",
  "src/components/procrow/procrow-cem-runtime-go-no-go-panel.tsx",
  "src/components/tenant/tenant-business-portal-handoff-note.tsx",
  "src/components/tenant/tenant-cem-operational-readiness-note.tsx",
  "docs/internal/M3_CEM_RUNTIME_HANDOFF_BUSINESS_PORTAL_OPERATIONAL_READINESS.md",
] as const;

const FORBIDDEN = [
  "production launch approved",
  "subscription active",
  "payment active",
  "legally approved",
  "certified compliant",
  "auto-provision",
  "platform_admin",
  "permission editor",
  "prisma.user.create",
  "graph.microsoft",
] as const;

const REQUIRED_PHRASES = [
  "CEM runs operations",
  "CyberCrow reviews trust",
  "SAREA shapes",
  "staging runtime",
  "F23-gated",
  "Client Portal",
  "Business Portal",
  "cem-handoff:verify",
  "does not approve production launch",
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

  console.log("\n=== M3 CEM runtime handoff & Business Portal readiness ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"cem-handoff:verify"')) {
    pass = fail("package.json missing cem-handoff:verify") && pass;
  } else {
    pass = ok("npm script cem-handoff:verify") && pass;
  }

  const surfaces = [
    "src/app/admin/tenants/[tenantId]/page.tsx",
    "src/app/admin/go-no-go/page.tsx",
    "src/app/[tenant]/dashboard/page.tsx",
    "src/app/[tenant]/modules/page.tsx",
    "src/app/[tenant]/tasks/page.tsx",
    "src/app/[tenant]/workflows/page.tsx",
    "src/app/[tenant]/reports/page.tsx",
  ];

  for (const rel of surfaces) {
    const t = fileText(rel);
    if (!t.includes("Cem") && !t.includes("cem") && !t.includes("BusinessPortal")) {
      pass = fail(`${rel} missing CEM handoff integration`) && pass;
    } else {
      pass = ok(`${rel} integrates CEM handoff`) && pass;
    }
  }

  const combined = [
    "src/lib/cem/cem-runtime-handoff-contract.ts",
    "src/lib/services/cem-runtime-handoff.service.ts",
    "src/lib/constants/cem-operational-readiness.ts",
    "src/components/tenant/tenant-business-portal-handoff-note.tsx",
    "src/components/admin/admin-cem-runtime-handoff-panel.tsx",
    "package.json",
  ]
    .map(fileText)
    .join("\n");

  for (const phrase of REQUIRED_PHRASES) {
    if (!combined.toLowerCase().includes(phrase.toLowerCase())) {
      pass = fail(`Missing required phrase: ${phrase}`) && pass;
    }
  }
  if (pass) pass = ok("Required safe-readiness phrases") && pass;

  const service = fileText("src/lib/services/cem-runtime-handoff.service.ts");
  if (!service.includes("buildCemRuntimeHandoffSnapshotForTenantId")) {
    pass = fail("Handoff service must build tenant snapshot") && pass;
  } else {
    pass = ok("Tenant handoff snapshot builder") && pass;
  }

  if (service.includes("graph.microsoft") || service.includes("prisma.user.create")) {
    pass = fail("Service must not call Graph or create users") && pass;
  } else {
    pass = ok("No Graph/user mutation in handoff service") && pass;
  }

  const forbiddenScan = [
    "src/lib/services/cem-runtime-handoff.service.ts",
    "src/components/admin/admin-cem-runtime-handoff-panel.tsx",
    "src/components/procrow/procrow-cem-runtime-go-no-go-panel.tsx",
    "src/components/tenant/tenant-business-portal-handoff-note.tsx",
  ]
    .map(fileText)
    .join("\n");

  for (const bad of FORBIDDEN) {
    if (forbiddenScan.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden phrase: ${bad}`) && pass;
    }
  }
  pass = ok("No forbidden production/payment/provisioning claims in M3 surfaces") && pass;

  const goNoGo = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGo.includes("cem-runtime-handoff-m3")) {
    pass = fail("Go/No-Go missing cem-runtime-handoff-m3 gate") && pass;
  } else {
    pass = ok("Go/No-Go CEM runtime handoff gate") && pass;
  }

  const contract = fileText("src/lib/cem/cem-runtime-handoff-contract.ts");
  if (!contract.includes("ready_for_staging_handoff") || !contract.includes("needs_cybercrow")) {
    pass = fail("Contract must define handoff statuses") && pass;
  } else {
    pass = ok("Handoff status enum") && pass;
  }

  console.log(
    pass
      ? "\nPASS: M3 CEM runtime handoff & Business Portal readiness\n"
      : "\nFAIL: M3 verification\n"
  );
  return pass;
}

process.exit(main() ? 0 : 1);
