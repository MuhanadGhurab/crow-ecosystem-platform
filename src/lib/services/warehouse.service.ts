import type { TenantWarehouseLocation } from "@prisma/client";
import { prisma } from "@/lib/db";

export type WarehouseLocationListRow = TenantWarehouseLocation;

export type WarehouseSummary = {
  totalLocations: number;
  sites: number;
  inbound: number;
  outbound: number;
  coldStorage: number;
};

export async function listWarehouseLocations(
  tenantId: string
): Promise<WarehouseLocationListRow[]> {
  return prisma.tenantWarehouseLocation.findMany({
    where: { tenantId },
    orderBy: [{ site: "asc" }, { movementKind: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getWarehouseSummary(tenantId: string): Promise<WarehouseSummary> {
  const rows = await prisma.tenantWarehouseLocation.findMany({
    where: { tenantId },
    select: { site: true, movementKind: true },
  });

  const sites = new Set<string>();
  let inbound = 0;
  let outbound = 0;
  let coldStorage = 0;

  for (const row of rows) {
    sites.add(row.site);
    if (row.movementKind === "inbound") inbound += 1;
    if (row.movementKind === "outbound") outbound += 1;
    if (row.movementKind === "cold_storage") coldStorage += 1;
  }

  return {
    totalLocations: rows.length,
    sites: sites.size,
    inbound,
    outbound,
    coldStorage,
  };
}
