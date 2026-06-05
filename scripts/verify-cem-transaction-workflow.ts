/**
 * M3.3 — CEM Transaction Workflow Prototype verifier.
 *
 *   npm run cem-transaction:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/cem/cem-transaction-workflow-contract.ts",
  "src/lib/cem/cem-transaction-workflow-go-no-go.ts",
  "src/lib/services/cem-transaction-workflow.service.ts",
  "src/lib/actions/cem-transaction-workflow.ts",
  "src/app/[tenant]/workflows/purchase-to-stock/page.tsx",
  "src/components/tenant/cem-transaction-workflow-actions.tsx",
  "src/components/tenant/cem-transaction-workflow-panels.tsx",
  "src/components/tenant/tenant-cem-purchase-to-stock-link.tsx",
  "src/components/admin/admin-cem-transaction-workflow-panel.tsx",
  "src/components/procrow/procrow-cem-transaction-workflow-go-no-go-panel.tsx",
  "docs/internal/M3_3_CEM_TRANSACTION_WORKFLOW_PROTOTYPE.md",
] as const;

const MODULE_PAGES = [
  "src/app/[tenant]/procurement/page.tsx",
  "src/app/[tenant]/finance/page.tsx",
  "src/app/[tenant]/warehouse/page.tsx",
  "src/app/[tenant]/inventory/page.tsx",
  "src/app/[tenant]/reports/page.tsx",
  "src/app/[tenant]/tasks/page.tsx",
  "src/app/[tenant]/workflows/page.tsx",
] as const;

const FORBIDDEN_POSITIVE_CLAIMS = [
  "production purchase order issued",
  "payment completed",
  "inventory legally updated",
  "accounting posted",
  "supplier paid",
  "production ready",
  "activatePayment",
  "stripe.checkout",
  "prisma.user.create",
  "platform_admin",
  "permission editor",
  "RBAC bypass",
  "auth weakening",
  "subscription active",
  "payment active",
  "certified compliant",
  "certifies compliance",
  "auto-provision",
] as const;

const FORBIDDEN_STOCK_MUTATION_SIGNS = [
  "qtyOnHand",
  "tenantInventoryItem",
  "stock mutation",
  "stock movement mutation",
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

  console.log("\n=== M3.3 CEM Transaction Workflow Prototype ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"cem-transaction:verify"')) {
    pass = fail("package.json missing cem-transaction:verify script") && pass;
  } else {
    pass = ok("npm script cem-transaction:verify present") && pass;
  }

  for (const rel of MODULE_PAGES) {
    const t = fileText(rel);
    if (!t.includes("TenantCemPurchaseToStockLink")) {
      pass = fail(`${rel} missing TenantCemPurchaseToStockLink deep link`) && pass;
    } else {
      pass = ok(`${rel} includes purchase-to-stock deep link`) && pass;
    }
  }

  const wfPage = fileText("src/app/[tenant]/workflows/purchase-to-stock/page.tsx");
  if (!wfPage.includes("purchase-to-stock")) pass = fail("Workflow route missing") && pass;
  if (!wfPage.includes("Report output")) pass = fail("Workflow UI missing report output") && pass;
  if (!wfPage.includes("CemTransactionEvidencePanel")) {
    pass = fail("Workflow UI missing CyberCrow evidence panel") && pass;
  } else {
    pass = ok("CyberCrow evidence panel present") && pass;
  }
  if (!wfPage.includes("CemTransactionSareaPanel")) {
    pass = fail("Workflow UI missing SAREA role experience panel") && pass;
  } else {
    pass = ok("SAREA role experience panel present") && pass;
  }

  const actions = fileText("src/lib/actions/cem-transaction-workflow.ts");
  if (!actions.includes("requireActionTenantPolicy")) {
    pass = fail("Server actions must guard tenant policy") && pass;
  } else {
    pass = ok("Tenant policy guard present in actions") && pass;
  }

  const goNoGoService = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGoService.includes("cem-transaction-workflow-m33")) {
    pass = fail("ProCrow gates missing cem-transaction-workflow-m33 dependency") && pass;
  } else {
    pass = ok("ProCrow gates include cem-transaction-workflow-m33") && pass;
  }

  const adminTenantPage = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  if (!adminTenantPage.includes("AdminCemTransactionWorkflowPanel")) {
    pass = fail("Tenant workbench missing AdminCemTransactionWorkflowPanel") && pass;
  } else {
    pass = ok("Admin tenant workbench includes transaction workflow panel") && pass;
  }

  const adminGoNoGoPage = fileText("src/app/admin/go-no-go/page.tsx");
  if (!adminGoNoGoPage.includes("ProCrowCemTransactionWorkflowGoNoGoPanel")) {
    pass = fail("Global Go/No-Go page missing ProCrowCemTransactionWorkflowGoNoGoPanel") && pass;
  } else {
    pass = ok("Global Go/No-Go includes transaction workflow dependency") && pass;
  }

  const combined = [
    wfPage,
    actions,
    fileText("src/lib/services/cem-transaction-workflow.service.ts"),
    fileText("src/lib/cem/cem-transaction-workflow-go-no-go.ts"),
    fileText("src/components/tenant/cem-transaction-workflow-panels.tsx"),
    goNoGoService,
  ].join("\n");

  for (const bad of FORBIDDEN_POSITIVE_CLAIMS) {
    if (combined.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden positive claim found: ${bad}`) && pass;
    }
  }

  for (const bad of FORBIDDEN_STOCK_MUTATION_SIGNS) {
    if (actions.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden stock mutation sign found in actions: ${bad}`) && pass;
    }
  }

  console.log(pass ? "\nPASS: M3.3 verification\n" : "\nFAIL: M3.3 verification\n");
  return pass;
}

process.exit(main() ? 0 : 1);

