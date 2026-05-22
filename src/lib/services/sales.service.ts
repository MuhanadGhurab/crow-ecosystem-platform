import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const salesListArgs = {
  include: { crmAccount: { select: { id: true, name: true } } },
  orderBy: [{ status: "asc" as const }, { updatedAt: "desc" as const }],
} satisfies Prisma.TenantSalesOpportunityFindManyArgs;

export type SalesOpportunityListItem = Prisma.TenantSalesOpportunityGetPayload<
  typeof salesListArgs
>;

export type SalesSummary = {
  total: number;
  quotes: number;
  orders: number;
  pipelineSar: number;
  wonSar: number;
};

export async function listSalesOpportunities(
  tenantId: string
): Promise<SalesOpportunityListItem[]> {
  return prisma.tenantSalesOpportunity.findMany({
    where: { tenantId },
    ...salesListArgs,
  });
}

export async function getSalesSummary(tenantId: string): Promise<SalesSummary> {
  const rows = await prisma.tenantSalesOpportunity.findMany({
    where: { tenantId },
    select: { kind: true, status: true, amountSar: true },
  });

  let pipelineSar = 0;
  let wonSar = 0;
  let quotes = 0;
  let orders = 0;

  for (const row of rows) {
    if (row.kind === "quote") quotes += 1;
    if (row.kind === "order") orders += 1;
    const amount = row.amountSar ?? 0;
    if (row.status === "won" || row.status === "fulfilled") {
      wonSar += amount;
    } else if (row.status !== "lost") {
      pipelineSar += amount;
    }
  }

  return {
    total: rows.length,
    quotes,
    orders,
    pipelineSar,
    wonSar,
  };
}
