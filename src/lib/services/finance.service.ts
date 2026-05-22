import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type FinanceEntryListItem = Prisma.TenantFinanceEntryGetPayload<Record<string, never>>;

export type FinanceSummary = {
  total: number;
  arOpenSar: number;
  arPostedSar: number;
  apOpenSar: number;
  paymentsClearedSar: number;
};

export async function listFinanceEntries(tenantId: string): Promise<FinanceEntryListItem[]> {
  return prisma.tenantFinanceEntry.findMany({
    where: { tenantId },
    orderBy: [{ direction: "asc" }, { status: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getFinanceSummary(tenantId: string): Promise<FinanceSummary> {
  const rows = await prisma.tenantFinanceEntry.findMany({
    where: { tenantId },
    select: { entryType: true, direction: true, status: true, amountSar: true },
  });

  let arOpenSar = 0;
  let arPostedSar = 0;
  let apOpenSar = 0;
  let paymentsClearedSar = 0;

  for (const row of rows) {
    const amount = row.amountSar ?? 0;
    if (row.entryType === "payment" && row.status === "cleared") {
      paymentsClearedSar += amount;
      continue;
    }
    if (row.direction === "ar") {
      if (row.status === "open") arOpenSar += amount;
      else if (row.status === "posted") arPostedSar += amount;
    } else if (row.direction === "ap" && row.status === "open") {
      apOpenSar += amount;
    }
  }

  return {
    total: rows.length,
    arOpenSar,
    arPostedSar,
    apOpenSar,
    paymentsClearedSar,
  };
}
