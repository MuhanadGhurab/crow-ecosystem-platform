import type { Prisma, TenantInventoryItem } from "@prisma/client";
import { prisma } from "@/lib/db";

export type InventoryItemListRow = TenantInventoryItem;

export type InventorySummary = {
  totalSkus: number;
  lowStock: number;
  locations: number;
  qtyOnHand: number;
};

export async function listInventoryItems(
  tenantId: string
): Promise<InventoryItemListRow[]> {
  return prisma.tenantInventoryItem.findMany({
    where: { tenantId },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getInventorySummary(tenantId: string): Promise<InventorySummary> {
  const rows = await prisma.tenantInventoryItem.findMany({
    where: { tenantId },
    select: { qtyOnHand: true, reorderLevel: true, location: true, status: true },
  });

  const locations = new Set<string>();
  let lowStock = 0;
  let qtyOnHand = 0;

  for (const row of rows) {
    qtyOnHand += row.qtyOnHand;
    if (row.location) locations.add(row.location);
    const atOrBelowReorder =
      row.reorderLevel > 0 && row.qtyOnHand <= row.reorderLevel;
    if (atOrBelowReorder || row.status === "low_stock") {
      lowStock += 1;
    }
  }

  return {
    totalSkus: rows.length,
    lowStock,
    locations: locations.size,
    qtyOnHand,
  };
}
