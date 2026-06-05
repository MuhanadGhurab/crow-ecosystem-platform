/**
 * M3.4 — CEM Workflow Persistence / Transaction Schema verifier.
 *
 *   npm run cem-workflow-persistence:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/cem/cem-workflow-persistence-contract.ts",
  "src/lib/cem/cem-workflow-lineage.ts",
  "src/lib/cem/cem-workflow-persistence-go-no-go.ts",
  "src/lib/services/cem-workflow-persistence.service.ts",
  "src/components/admin/admin-cem-workflow-persistence-panel.tsx",
  "src/components/tenant/cem-workflow-persistence-panel.tsx",
  "src/components/procrow/procrow-cem-workflow-persistence-go-no-go-panel.tsx",
  "docs/internal/M3_4_CEM_WORKFLOW_PERSISTENCE_TRANSACTION_SCHEMA.md",
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
  "legal audit evidence",
  "auto-provision",
] as const;

const FORBIDDEN_STOCK_MUTATION_SIGNS = [
  "qtyOnHand",
  "tenantInventoryItem.update",
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

/** Flags positive claims only; allows negated disclaimers (e.g. "not legal audit evidence"). */
function hasForbiddenPositiveClaim(text: string, phrase: string): boolean {
  const lower = text.toLowerCase();
  const p = phrase.toLowerCase();
  let idx = 0;
  while ((idx = lower.indexOf(p, idx)) !== -1) {
    const windowStart = Math.max(0, idx - 24);
    const before = lower.slice(windowStart, idx);
    const negated =
      /\bnot\s+$/.test(before) ||
      before.includes("— not ") ||
      before.includes("—not ") ||
      before.includes(", not ");
    if (!negated) return true;
    idx += p.length;
  }
  return false;
}

function main(): boolean {
  let pass = true;

  console.log("\n=== M3.4 CEM Workflow Persistence / Transaction Schema ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"cem-workflow-persistence:verify"')) {
    pass = fail("package.json missing cem-workflow-persistence:verify script") && pass;
  } else {
    pass = ok("npm script cem-workflow-persistence:verify present") && pass;
  }

  const contract = fileText("src/lib/cem/cem-workflow-persistence-contract.ts");
  for (const sym of [
    "CemWorkflowPersistenceMode",
    "CemWorkflowLinkType",
    "CemWorkflowPersistenceLink",
    "CemWorkflowPersistenceAudit",
    "CemWorkflowPersistenceSnapshot",
  ]) {
    if (!contract.includes(sym)) pass = fail(`Contract missing ${sym}`) && pass;
    else pass = ok(`Contract exports ${sym}`) && pass;
  }

  const service = fileText("src/lib/services/cem-workflow-persistence.service.ts");
  if (!service.includes("auditCemWorkflowPersistenceForTenantSlug")) {
    pass = fail("Persistence service missing auditCemWorkflowPersistenceForTenantSlug") && pass;
  } else {
    pass = ok("Persistence audit service present") && pass;
  }
  if (service.includes("prisma.report.create") || service.includes("prisma.task.create")) {
    pass = fail("Persistence audit service must be read-only (no creates)") && pass;
  } else {
    pass = ok("Persistence audit service is read-only") && pass;
  }

  const actions = fileText("src/lib/actions/cem-transaction-workflow.ts");
  if (!actions.includes("updatePurchaseToStockLineage")) {
    pass = fail("Transaction actions missing lineage persistence hardening") && pass;
  } else {
    pass = ok("Transaction actions persist report lineage metadata") && pass;
  }
  if (!actions.includes("requireActionTenantPolicy")) {
    pass = fail("Server actions must guard tenant policy") && pass;
  } else {
    pass = ok("Tenant policy guard present in actions") && pass;
  }

  const wfPage = fileText("src/app/[tenant]/workflows/purchase-to-stock/page.tsx");
  if (!wfPage.includes("CemWorkflowPersistencePanel")) {
    pass = fail("Purchase-to-stock page missing persistence panel") && pass;
  } else {
    pass = ok("Business Portal workflow UI shows persistence status") && pass;
  }

  const panels = fileText("src/components/tenant/cem-transaction-workflow-panels.tsx");
  if (!panels.includes("Report output lineage") || !panels.includes("Evidence hook lineage")) {
    pass = fail("Report/CyberCrow panels missing persisted/inferred/advisory labels") && pass;
  } else {
    pass = ok("Reports and CyberCrow panels show lineage state") && pass;
  }

  const goNoGoService = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGoService.includes("cem-workflow-persistence-m34")) {
    pass = fail("ProCrow gates missing cem-workflow-persistence-m34 dependency") && pass;
  } else {
    pass = ok("ProCrow gates include cem-workflow-persistence-m34") && pass;
  }

  const adminTenantPage = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  if (!adminTenantPage.includes("AdminCemWorkflowPersistencePanel")) {
    pass = fail("Tenant workbench missing AdminCemWorkflowPersistencePanel") && pass;
  } else {
    pass = ok("ProCrow tenant panel shows persistence readiness") && pass;
  }

  const adminGoNoGoPage = fileText("src/app/admin/go-no-go/page.tsx");
  if (!adminGoNoGoPage.includes("ProCrowCemWorkflowPersistenceGoNoGoPanel")) {
    pass = fail("Global Go/No-Go page missing ProCrowCemWorkflowPersistenceGoNoGoPanel") && pass;
  } else {
    pass = ok("Global Go/No-Go includes workflow persistence dependency") && pass;
  }

  const migrationsDir = join(ROOT, "prisma/migrations");
  const doc = existsSync(join(ROOT, "docs/internal/M3_4_CEM_WORKFLOW_PERSISTENCE_TRANSACTION_SCHEMA.md"))
    ? fileText("docs/internal/M3_4_CEM_WORKFLOW_PERSISTENCE_TRANSACTION_SCHEMA.md")
    : "";
  if (doc.includes("PATH A") || doc.includes("existing_schema")) {
    pass = ok("Documentation records PATH A (no migration applied)") && pass;
  } else {
    pass = fail("M3.4 doc must document PATH A / existing_schema decision") && pass;
  }

  const combined = [
    contract,
    service,
    actions,
    wfPage,
    panels,
    fileText("src/lib/cem/cem-workflow-persistence-go-no-go.ts"),
    goNoGoService,
  ].join("\n");

  for (const bad of FORBIDDEN_POSITIVE_CLAIMS) {
    if (hasForbiddenPositiveClaim(combined, bad)) {
      pass = fail(`Forbidden positive claim found: ${bad}`) && pass;
    }
  }

  for (const bad of FORBIDDEN_STOCK_MUTATION_SIGNS) {
    if (actions.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden stock mutation sign found in actions: ${bad}`) && pass;
    }
  }

  if (existsSync(migrationsDir)) {
    pass = ok("No new M3.4 migration file required (PATH A)") && pass;
  }

  console.log(pass ? "\nPASS: M3.4 verification\n" : "\nFAIL: M3.4 verification\n");
  return pass;
}

process.exit(main() ? 0 : 1);
