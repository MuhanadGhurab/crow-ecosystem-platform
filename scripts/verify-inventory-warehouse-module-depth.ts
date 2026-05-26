/**
 * G6 — Inventory + Warehouse module depth (read-only).
 *
 *   npm run inventory-warehouse:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  INVENTORY_RECOMMENDED_WORKFLOWS,
  INVENTORY_SAREA_PERSONAS,
  INVENTORY_WAREHOUSE_FORBIDDEN_CLAIM_PHRASES,
  INVENTORY_WAREHOUSE_SECTOR_NOTES,
  WAREHOUSE_RECOMMENDED_WORKFLOWS,
  WAREHOUSE_SAREA_PERSONAS,
} from "../src/lib/constants/inventory-warehouse-module-depth";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_EXTRA = [
  "barcode scan ui",
  "real-time stock guarantees",
  "warehouse automation",
  "automated stock sync",
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

  console.log("\n=== G6 Inventory + Warehouse module depth ===\n");

  const inventory = ERP_MODULE_CATALOG.find((e) => e.erpKey === "inventory");
  const warehouse = ERP_MODULE_CATALOG.find((e) => e.erpKey === "warehouse");

  check(Boolean(inventory), "Inventory catalog entry exists", "missing inventory in erp-module-catalog");
  check(Boolean(warehouse), "Warehouse catalog entry exists", "missing warehouse in erp-module-catalog");
  if (!inventory || !warehouse) {
    process.exit(1);
  }

  for (const entry of [inventory, warehouse]) {
    check(entry.hasTenantRoute === true, `${entry.label} has tenant route`, `${entry.label} route flag`);
    check(
      entry.dependencies.includes("procurement") &&
        entry.dependencies.includes("tasks") &&
        entry.dependencies.includes("reports"),
      `${entry.label} dependencies include procurement/tasks/reports`,
      `${entry.label} dependencies incomplete`
    );
    check(
      entry.dependencies.includes("cybercrow") && entry.dependencies.includes("workflows"),
      `${entry.label} dependencies include cybercrow and workflows`,
      `${entry.label} missing cybercrow/workflows dep`
    );
    check(
      (entry.cyberCrowRisks?.length ?? 0) >= 3 && (entry.sareaExperienceHints?.length ?? 0) >= 2,
      `${entry.label} catalog has CyberCrow and SAREA hints`,
      `${entry.label} catalog missing posture hints`
    );
    check(
      Object.keys(entry.sectorRelevance).length >= 4,
      `${entry.label} sector relevance covers modeled sectors`,
      `${entry.label} sector relevance thin`
    );
    check(
      (entry.futureOnlyCapabilities?.length ?? 0) >= 5,
      `${entry.label} future-only capabilities documented`,
      `${entry.label} missing future-only guardrails`
    );
  }

  check(
    inventory.dependencies.includes("warehouse") && inventory.dependencies.includes("logistics"),
    "Inventory dependencies include warehouse and logistics",
    "Inventory missing warehouse/logistics dep"
  );
  check(
    warehouse.dependencies.includes("inventory") && warehouse.dependencies.includes("logistics"),
    "Warehouse dependencies include inventory and logistics",
    "Warehouse missing inventory/logistics dep"
  );

  check(
    INVENTORY_RECOMMENDED_WORKFLOWS.length >= 8,
    `Inventory recommended workflows (${INVENTORY_RECOMMENDED_WORKFLOWS.length})`,
    "Inventory workflow readiness list too short"
  );
  check(
    WAREHOUSE_RECOMMENDED_WORKFLOWS.length >= 7,
    `Warehouse recommended workflows (${WAREHOUSE_RECOMMENDED_WORKFLOWS.length})`,
    "Warehouse workflow readiness list too short"
  );
  check(
    INVENTORY_SAREA_PERSONAS.length >= 6 && WAREHOUSE_SAREA_PERSONAS.length >= 6,
    "SAREA inventory and warehouse personas defined",
    "SAREA personas missing"
  );
  check(
    INVENTORY_WAREHOUSE_SECTOR_NOTES.length === 5,
    "sector notes for 5 sectors",
    "sector notes count"
  );

  const inventoryPage = fileText("src/app/[tenant]/inventory/page.tsx");
  const warehousePage = fileText("src/app/[tenant]/warehouse/page.tsx");
  check(
    inventoryPage.includes("InventoryOperationsReadinessPanel") &&
      inventoryPage.includes("getInventoryOperationsReadinessSnapshot"),
    "Inventory page uses readiness service and panel",
    "Inventory page missing G6 depth"
  );
  check(
    warehousePage.includes("WarehouseOperationsReadinessPanel") &&
      warehousePage.includes("getWarehouseOperationsReadinessSnapshot"),
    "Warehouse page uses readiness service and panel",
    "Warehouse page missing G6 depth"
  );
  check(
    !inventoryPage.includes("showMeemHub ? (") ||
      inventoryPage.includes("InventoryOperationsReadinessPanel"),
    "Inventory readiness not gated solely inside MEEM branch",
    "Inventory readiness may be MEEM-only"
  );
  check(
    !warehousePage.includes("showMeemHub ? (") ||
      warehousePage.includes("WarehouseOperationsReadinessPanel"),
    "Warehouse readiness not gated solely inside MEEM branch",
    "Warehouse readiness may be MEEM-only"
  );

  check(
    fileText("src/lib/services/inventory-warehouse-readiness.service.ts").includes(
      "getInventoryOperationsReadinessSnapshot"
    ) &&
      fileText("src/lib/services/inventory-warehouse-readiness.service.ts").includes(
        "getWarehouseOperationsReadinessSnapshot"
      ),
    "inventory-warehouse-readiness.service exported",
    "missing inventory-warehouse-readiness.service"
  );

  const userFacing = [
    "src/app/[tenant]/inventory/page.tsx",
    "src/app/[tenant]/warehouse/page.tsx",
    "src/components/tenant/inventory/inventory-operations-readiness-panel.tsx",
    "src/components/tenant/warehouse/warehouse-operations-readiness-panel.tsx",
    "src/components/tenant/supply-chain/supply-chain-operations-linkage-banner.tsx",
  ]
    .map(fileText)
    .join("\n")
    .toLowerCase();
  const forbidden = [...INVENTORY_WAREHOUSE_FORBIDDEN_CLAIM_PHRASES, ...FORBIDDEN_EXTRA];
  for (const phrase of forbidden) {
    if (!userFacing.includes(phrase)) {
      ok(`user-facing copy avoids: ${phrase}`);
      continue;
    }
    const negated =
      userFacing.includes(`not ${phrase}`) ||
      userFacing.includes(`no ${phrase}`) ||
      userFacing.includes(`without ${phrase}`) ||
      userFacing.includes(`not a ${phrase}`) ||
      userFacing.includes(`not live ${phrase}`) ||
      userFacing.includes(`not barcode`) ||
      (phrase === "full wms" && userFacing.includes("not a full wms")) ||
      (phrase === "barcode scanner" && userFacing.includes("not barcode-scanner")) ||
      (phrase === "real-time stock accuracy" &&
        userFacing.includes("without real-time stock accuracy")) ||
      (phrase === "real-time stock guarantees" && userFacing.includes("not real-time stock"));
    check(
      negated,
      `phrase "${phrase}" only appears negated in user-facing Inventory/Warehouse UI`,
      `forbidden Inventory/Warehouse claim in user-facing copy: "${phrase}"`
    );
  }

  check(
    fileText("src/components/tenant/supply-chain/supply-chain-operations-linkage-banner.tsx").includes(
      "SupplyChainOperationsLinkageBanner"
    ),
    "Supply chain linkage banner component",
    "missing supply-chain-operations-linkage-banner"
  );

  check(
    fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"inventory"') &&
      fileText("src/components/tenant/tenant-runtime-cross-links.tsx").includes('"warehouse"'),
    "tenant runtime cross-links include inventory and warehouse",
    "cross-links missing inventory/warehouse"
  );

  console.log(
    passed ? "\nG6 inventory-warehouse:verify PASSED\n" : "\nG6 inventory-warehouse:verify FAILED\n"
  );
  process.exit(passed ? 0 : 1);
}

main();
