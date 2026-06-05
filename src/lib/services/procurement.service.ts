import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type PurchaseRequestListItem = Prisma.TenantPurchaseRequestGetPayload<
  Record<string, never>
>;

export type ProcurementSummary = {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  urgent: number;
  totalAmountSar: number;
};

export async function listPurchaseRequests(
  tenantId: string
): Promise<PurchaseRequestListItem[]> {
  return prisma.tenantPurchaseRequest.findMany({
    where: { tenantId },
    orderBy: [{ priority: "desc" }, { status: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getPurchaseRequestById(tenantId: string, id: string) {
  return prisma.tenantPurchaseRequest.findFirst({
    where: { tenantId, id },
  });
}

export async function createPurchaseRequest(
  tenantId: string,
  data: {
    title: string;
    status?: string;
    priority?: string;
    vendorName?: string | null;
    amountSar?: number | null;
    referenceCode?: string | null;
    linkedFinanceRef?: string | null;
    linkedInventoryRef?: string | null;
  }
) {
  return prisma.tenantPurchaseRequest.create({
    data: {
      tenantId,
      title: data.title,
      status: data.status ?? "draft",
      priority: data.priority ?? "normal",
      vendorName: data.vendorName ?? null,
      amountSar: data.amountSar ?? null,
      referenceCode: data.referenceCode ?? null,
      linkedFinanceRef: data.linkedFinanceRef ?? null,
      linkedInventoryRef: data.linkedInventoryRef ?? null,
    },
  });
}

export async function updatePurchaseRequest(
  tenantId: string,
  id: string,
  data: Prisma.TenantPurchaseRequestUpdateInput
) {
  const existing = await getPurchaseRequestById(tenantId, id);
  if (!existing) {
    throw new Error("Purchase request not found.");
  }
  return prisma.tenantPurchaseRequest.update({
    where: { id },
    data,
  });
}

export async function getProcurementSummary(tenantId: string): Promise<ProcurementSummary> {
  const rows = await prisma.tenantPurchaseRequest.findMany({
    where: { tenantId },
    select: { status: true, priority: true, amountSar: true },
  });

  let draft = 0;
  let submitted = 0;
  let approved = 0;
  let urgent = 0;
  let totalAmountSar = 0;

  for (const row of rows) {
    if (row.status === "draft") draft += 1;
    else if (row.status === "submitted") submitted += 1;
    else if (row.status === "approved" || row.status === "ordered") approved += 1;
    if (row.priority === "urgent") urgent += 1;
    totalAmountSar += row.amountSar ?? 0;
  }

  return {
    total: rows.length,
    draft,
    submitted,
    approved,
    urgent,
    totalAmountSar,
  };
}
