/**
 * M3.1 — CEM Core Operating Model Integration verifier.
 *
 *   npm run cem-operating-model:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/cem/cem-operating-model-contract.ts",
  "src/lib/cem/cem-operating-model-go-no-go.ts",
  "src/lib/services/cem-operating-model.service.ts",
  "src/lib/constants/cem-core-operating-flows.ts",
  "src/components/admin/admin-cem-operating-model-panel.tsx",
  "src/components/procrow/procrow-cem-operating-model-go-no-go-panel.tsx",
  "src/components/tenant/tenant-cem-operating-model-panel.tsx",
  "src/components/tenant/tenant-module-operating-context.tsx",
  "src/components/tenant/tenant-operating-model-cross-link.tsx",
  "docs/internal/M3_1_CEM_CORE_OPERATING_MODEL_INTEGRATION.md",
] as const;

const MODULE_PAGES = [
  "src/app/[tenant]/hr/page.tsx",
  "src/app/[tenant]/finance/page.tsx",
  "src/app/[tenant]/procurement/page.tsx",
  "src/app/[tenant]/logistics/page.tsx",
  "src/app/[tenant]/inventory/page.tsx",
  "src/app/[tenant]/warehouse/page.tsx",
  "src/app/[tenant]/crm/page.tsx",
  "src/app/[tenant]/sales/page.tsx",
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
  "grants access",
  "certifies compliance",
] as const;

const REQUIRED_PHRASES = [
  "operational model readiness",
  "staging",
  "F23-gated",
  "ProCrow Go/No-Go",
  "CEM runs",
  "CyberCrow",
  "SAREA",
  "cem-operating-model:verify",
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

  console.log("\n=== M3.1 CEM Core Operating Model Integration ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"cem-operating-model:verify"')) {
    pass = fail("package.json missing cem-operating-model:verify") && pass;
  } else {
    pass = ok("npm script cem-operating-model:verify") && pass;
  }

  const dashboard = fileText("src/app/[tenant]/dashboard/page.tsx");
  if (!dashboard.includes("TenantCemOperatingModelPanel")) {
    pass = fail("Dashboard missing TenantCemOperatingModelPanel") && pass;
  } else {
    pass = ok("Dashboard operating model section") && pass;
  }

  for (const rel of MODULE_PAGES) {
    const t = fileText(rel);
    if (!t.includes("TenantModuleOperatingContext")) {
      pass = fail(`${rel} missing TenantModuleOperatingContext`) && pass;
    } else {
      pass = ok(`${rel} module operating context`) && pass;
    }
  }

  for (const rel of [
    "src/app/[tenant]/tasks/page.tsx",
    "src/app/[tenant]/workflows/page.tsx",
    "src/app/[tenant]/reports/page.tsx",
  ]) {
    const t = fileText(rel);
    if (!t.includes("TenantOperatingModelCrossLink")) {
      pass = fail(`${rel} missing cross-link panel`) && pass;
    } else {
      pass = ok(`${rel} cross-module connection copy`) && pass;
    }
  }

  const tenantWorkbench = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  if (!tenantWorkbench.includes("AdminCemOperatingModelPanel")) {
    pass = fail("ProCrow tenant page missing CEM operating model panel") && pass;
  } else {
    pass = ok("ProCrow tenant CEM operating model panel") && pass;
  }

  const goNoGoPage = fileText("src/app/admin/go-no-go/page.tsx");
  if (!goNoGoPage.includes("ProCrowCemOperatingModelGoNoGoPanel")) {
    pass = fail("Go/No-Go page missing operating model panel") && pass;
  } else {
    pass = ok("Go/No-Go operating model dependency panel") && pass;
  }

  const goNoGoService = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGoService.includes("cem-operating-model-m31")) {
    pass = fail("Go/No-Go missing cem-operating-model-m31 gate") && pass;
  } else {
    pass = ok("Go/No-Go CEM operating model gate") && pass;
  }

  const flows = fileText("src/lib/constants/cem-core-operating-flows.ts");
  const flowKeys = [
    "employee_onboarding",
    "purchase_to_stock",
    "sales_to_delivery",
    "task_workflow_execution",
    "incident_exception",
  ];
  for (const key of flowKeys) {
    if (!flows.includes(key)) pass = fail(`Missing core flow: ${key}`) && pass;
  }
  if (pass) pass = ok("Five core operating flows defined") && pass;

  const combined = [
    "src/lib/cem/cem-operating-model-contract.ts",
    "src/lib/services/cem-operating-model.service.ts",
    "src/lib/constants/cem-core-operating-flows.ts",
    "src/components/tenant/tenant-cem-operating-model-panel.tsx",
    "src/components/admin/admin-cem-operating-model-panel.tsx",
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

  const service = fileText("src/lib/services/cem-operating-model.service.ts");
  if (!service.includes("buildCemOperatingModelSnapshotForTenantId")) {
    pass = fail("Service must build tenant operating model snapshot") && pass;
  } else {
    pass = ok("Tenant operating model snapshot builder") && pass;
  }

  if (service.includes("graph.microsoft") || service.includes("prisma.user.create")) {
    pass = fail("Service must not call Graph or create users") && pass;
  } else {
    pass = ok("No Graph/user mutation in operating model service") && pass;
  }

  const forbiddenScan = [
    "src/lib/services/cem-operating-model.service.ts",
    "src/components/admin/admin-cem-operating-model-panel.tsx",
    "src/components/procrow/procrow-cem-operating-model-go-no-go-panel.tsx",
    "src/components/tenant/tenant-cem-operating-model-panel.tsx",
  ]
    .map(fileText)
    .join("\n");

  for (const bad of FORBIDDEN) {
    if (forbiddenScan.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden phrase: ${bad}`) && pass;
    }
  }
  pass = ok("No forbidden production/payment/provisioning claims in M3.1 surfaces") && pass;

  const contract = fileText("src/lib/cem/cem-operating-model-contract.ts");
  if (!contract.includes("operational_spine_ready") || !contract.includes("CemOperatingEntity")) {
    pass = fail("Contract must define status enum and entity types") && pass;
  } else {
    pass = ok("Operating model contract types") && pass;
  }

  console.log(
    pass
      ? "\nPASS: M3.1 CEM Core Operating Model Integration\n"
      : "\nFAIL: M3.1 verification\n"
  );
  return pass;
}

process.exit(main() ? 0 : 1);
