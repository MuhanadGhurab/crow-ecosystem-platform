/**
 * M3.2 — CEM Module Depth Pass verifier.
 *
 *   npm run cem-module-depth:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/cem/cem-module-depth-contract.ts",
  "src/lib/cem/cem-module-depth-go-no-go.ts",
  "src/lib/services/cem-module-depth.service.ts",
  "src/components/tenant/cem-module-depth-header.tsx",
  "src/components/tenant/cem-module-records-panel.tsx",
  "src/components/tenant/cem-module-flow-panel.tsx",
  "src/components/tenant/cem-module-reporting-panel.tsx",
  "src/components/tenant/cem-module-trust-experience-panel.tsx",
  "src/components/tenant/cem-module-next-actions.tsx",
  "src/components/tenant/tenant-cem-module-depth-section.tsx",
  "src/components/admin/admin-cem-module-depth-panel.tsx",
  "src/components/procrow/procrow-cem-module-depth-go-no-go-panel.tsx",
  "docs/internal/M3_2_CEM_MODULE_DEPTH_PASS.md",
] as const;

const MODULE_PAGES: { path: string; depthKey: string }[] = [
  { path: "src/app/[tenant]/hr/page.tsx", depthKey: "hr" },
  { path: "src/app/[tenant]/finance/page.tsx", depthKey: "finance" },
  { path: "src/app/[tenant]/procurement/page.tsx", depthKey: "procurement" },
  { path: "src/app/[tenant]/inventory/page.tsx", depthKey: "inventory" },
  { path: "src/app/[tenant]/warehouse/page.tsx", depthKey: "warehouse" },
  { path: "src/app/[tenant]/logistics/page.tsx", depthKey: "logistics" },
  { path: "src/app/[tenant]/crm/page.tsx", depthKey: "crm" },
  { path: "src/app/[tenant]/sales/page.tsx", depthKey: "sales" },
  { path: "src/app/[tenant]/reports/page.tsx", depthKey: "reports" },
];

const SERVICE_MODULE_PHRASES: { depthKey: string; phrases: string[] }[] = [
  { depthKey: "hr", phrases: ['depthKey === "hr"', "Onboarding", 'case "hr"', "employee"] },
  {
    depthKey: "finance",
    phrases: ['depthKey === "finance"', "approval", "procurement", 'case "finance"', "invoice"],
  },
  {
    depthKey: "procurement",
    phrases: ['depthKey === "procurement"', "purchase_request", "warehouse", "inventory"],
  },
  {
    depthKey: "inventory",
    phrases: ['depthKey === "inventory"', "stock", "procurement", "sales"],
  },
  {
    depthKey: "warehouse",
    phrases: ['depthKey === "warehouse"', "Receiving", "Dispatch", "warehouse_receipt"],
  },
  {
    depthKey: "logistics",
    phrases: ['depthKey === "logistics"', "shipment", "dispatch", "warehouse"],
  },
  {
    depthKey: "crm",
    phrases: ['depthKey === "crm"', "customer", "sales", "follow-up"],
  },
  {
    depthKey: "sales",
    phrases: ['depthKey === "sales"', "opportunit", "inventory", "logistics", "finance"],
  },
  {
    depthKey: "reports",
    phrases: ['depthKey === "reports"', "CyberCrow", "SAREA", "workflow", "task"],
  },
];

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
  "activatePayment",
  "stripe.checkout",
] as const;

const REQUIRED_PHRASES = [
  "staging",
  "demo",
  "ProCrow Go/No-Go",
  "F23-gated",
  "not production",
  "tenant_backed",
  "advisory",
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

  console.log("\n=== M3.2 CEM Module Depth Pass ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"cem-module-depth:verify"')) {
    pass = fail("package.json missing cem-module-depth:verify") && pass;
  } else {
    pass = ok("npm script cem-module-depth:verify") && pass;
  }

  for (const { path, depthKey } of MODULE_PAGES) {
    const t = fileText(path);
    if (!t.includes("TenantCemModuleDepthSection")) {
      pass = fail(`${path} missing TenantCemModuleDepthSection`) && pass;
    } else if (!t.includes("buildCemModuleDepthSnapshotForTenantSlug")) {
      pass = fail(`${path} missing module depth service call`) && pass;
    } else if (!t.includes(`"${depthKey}"`)) {
      pass = fail(`${path} missing depth key "${depthKey}"`) && pass;
    } else {
      pass = ok(`${path} module depth section`) && pass;
    }
  }

  const serviceText = fileText("src/lib/services/cem-module-depth.service.ts");
  for (const { depthKey, phrases } of SERVICE_MODULE_PHRASES) {
    let moduleOk = true;
    for (const phrase of phrases) {
      if (!serviceText.toLowerCase().includes(phrase.toLowerCase())) {
        pass = fail(`Service missing ${depthKey} content: ${phrase}`) && pass;
        moduleOk = false;
      }
    }
    if (moduleOk) pass = ok(`Service depth content for ${depthKey}`) && pass;
  }

  const flowPanel = fileText("src/components/tenant/cem-module-flow-panel.tsx");
  if (!flowPanel.includes("crossModuleLinks")) {
    pass = fail("Flow panel must show cross-module links") && pass;
  } else {
    pass = ok("Cross-module flow visibility panel") && pass;
  }

  const tenantWorkbench = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  if (!tenantWorkbench.includes("AdminCemModuleDepthPanel")) {
    pass = fail("ProCrow tenant page missing module depth panel") && pass;
  } else {
    pass = ok("ProCrow tenant module depth panel") && pass;
  }

  const goNoGoPage = fileText("src/app/admin/go-no-go/page.tsx");
  if (!goNoGoPage.includes("ProCrowCemModuleDepthGoNoGoPanel")) {
    pass = fail("Go/No-Go page missing module depth panel") && pass;
  } else {
    pass = ok("Go/No-Go module depth dependency panel") && pass;
  }

  const goNoGoService = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGoService.includes("cem-module-depth-m32")) {
    pass = fail("Go/No-Go missing cem-module-depth-m32 gate") && pass;
  } else {
    pass = ok("Go/No-Go CEM module depth gate") && pass;
  }

  const service = serviceText;
  if (!service.includes("buildCemModuleDepthSnapshotForTenantId")) {
    pass = fail("Service must build module depth snapshot") && pass;
  } else {
    pass = ok("Module depth snapshot builder") && pass;
  }

  if (
    service.includes("prisma.") &&
    (service.includes(".create(") ||
      service.includes(".update(") ||
      service.includes(".delete("))
  ) {
    pass = fail("Service must not mutate database") && pass;
  } else {
    pass = ok("Read-only module depth service (no DB writes)") && pass;
  }

  const combined = [
    "src/lib/cem/cem-module-depth-contract.ts",
    "src/lib/services/cem-module-depth.service.ts",
    "src/components/tenant/tenant-cem-module-depth-section.tsx",
    "src/components/admin/admin-cem-module-depth-panel.tsx",
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

  const forbiddenScan = [
    "src/lib/services/cem-module-depth.service.ts",
    "src/components/admin/admin-cem-module-depth-panel.tsx",
    "src/components/procrow/procrow-cem-module-depth-go-no-go-panel.tsx",
    "src/components/tenant/cem-module-depth-header.tsx",
  ]
    .map(fileText)
    .join("\n");

  let forbiddenHit = false;
  for (const bad of FORBIDDEN) {
    if (forbiddenScan.toLowerCase().includes(bad.toLowerCase())) {
      forbiddenHit = true;
      pass = fail(`Forbidden phrase: ${bad}`) && pass;
    }
  }
  if (!forbiddenHit) pass = ok("No forbidden production/payment/provisioning claims in M3.2 surfaces") && pass;

  const contract = fileText("src/lib/cem/cem-module-depth-contract.ts");
  if (!contract.includes("CemModuleDepthSnapshot") || !contract.includes("operational_model_ready")) {
    pass = fail("Contract must define snapshot and status types") && pass;
  } else {
    pass = ok("Module depth contract types") && pass;
  }

  console.log(
    pass ? "\nPASS: M3.2 CEM Module Depth Pass\n" : "\nFAIL: M3.2 verification\n"
  );
  return pass;
}

process.exit(main() ? 0 : 1);
