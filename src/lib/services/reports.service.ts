import { prisma } from "@/lib/db";
import { getFinanceSummary } from "@/lib/services/finance.service";
import { getInventorySummary } from "@/lib/services/inventory.service";
import { getSalesSummary } from "@/lib/services/sales.service";
import { getWarehouseSummary } from "@/lib/services/warehouse.service";

export type ReportsKpiSummary = {
  pipelineSar: number;
  lowStockCount: number;
  openArSar: number;
  activeWorkflows: number;
  openTasks: number;
  warehouseLocations: number;
  salesCount: number;
  inventorySkus: number;
  financeEntries: number;
};

function hasModule(moduleKeys: string[], key: string): boolean {
  return moduleKeys.includes(key);
}

/**
 * Aggregate ERP KPIs for the reports hub from enabled module data.
 */
export async function getReportsKpiSummary(
  tenantId: string,
  moduleKeys: string[]
): Promise<ReportsKpiSummary> {
  const [
    sales,
    inventory,
    warehouse,
    finance,
    activeWorkflows,
    openTasks,
  ] = await Promise.all([
    hasModule(moduleKeys, "sales")
      ? getSalesSummary(tenantId)
      : Promise.resolve({
          total: 0,
          quotes: 0,
          orders: 0,
          pipelineSar: 0,
          wonSar: 0,
        }),
    hasModule(moduleKeys, "inventory")
      ? getInventorySummary(tenantId)
      : Promise.resolve({ totalSkus: 0, lowStock: 0, locations: 0, qtyOnHand: 0 }),
    hasModule(moduleKeys, "warehouse")
      ? getWarehouseSummary(tenantId)
      : Promise.resolve({
          totalLocations: 0,
          sites: 0,
          inbound: 0,
          outbound: 0,
          coldStorage: 0,
        }),
    hasModule(moduleKeys, "finance")
      ? getFinanceSummary(tenantId)
      : Promise.resolve({
          total: 0,
          arOpenSar: 0,
          arPostedSar: 0,
          apOpenSar: 0,
          paymentsClearedSar: 0,
        }),
    prisma.workflow.count({
      where: { tenantId, status: "active" },
    }),
    prisma.task.count({
      where: { tenantId, status: { in: ["open", "in_progress", "pending"] } },
    }),
  ]);

  return {
    pipelineSar: sales.pipelineSar,
    lowStockCount: inventory.lowStock,
    openArSar: finance.arOpenSar,
    activeWorkflows,
    openTasks,
    warehouseLocations: warehouse.totalLocations,
    salesCount: sales.total,
    inventorySkus: inventory.totalSkus,
    financeEntries: finance.total,
  };
}
