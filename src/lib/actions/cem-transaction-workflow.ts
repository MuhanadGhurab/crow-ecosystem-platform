"use server";

import { revalidatePath } from "next/cache";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import { routes } from "@/lib/routes";
import { prisma } from "@/lib/db";
import {
  buildPurchaseToStockReportConfig,
  ensurePurchaseToStockWorkflow,
  PURCHASE_TO_STOCK_REPORT_PREFIX,
  purchaseToStockWorkflowRoute,
  updatePurchaseToStockLineage,
} from "@/lib/services/cem-transaction-workflow.service";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import {
  createPurchaseRequest,
  getPurchaseRequestById,
  updatePurchaseRequest,
} from "@/lib/services/procurement.service";

export type CemTransactionActionState = { error?: string; success?: string } | undefined;

function revalidatePurchaseToStock(slug: string) {
  revalidatePath(purchaseToStockWorkflowRoute(slug));
  revalidatePath(routes.tenant(slug).workflows);
  revalidatePath(routes.tenant(slug).procurement);
  revalidatePath(routes.tenant(slug).finance);
  revalidatePath(routes.tenant(slug).warehouse);
  revalidatePath(routes.tenant(slug).inventory);
  revalidatePath(routes.tenant(slug).reports);
  revalidatePath(routes.tenant(slug).tasks);
}

function nextReferenceCode() {
  return `PTS-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

export async function createPurchaseToStockRequestAction(
  _prev: CemTransactionActionState,
  formData: FormData
): Promise<CemTransactionActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  let tenant;
  try {
    ({ tenant } = await requireActionTenantPolicy(slug, "cem.workflows.manage"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not allowed." };
  }

  if (!hasErpModule(tenant.modules ?? [], "procurement")) {
    return { error: "Procurement module not enabled." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const itemName = String(formData.get("itemName") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const department = String(formData.get("department") ?? "").trim();
  const businessReason = String(formData.get("businessReason") ?? "").trim();

  if (!title || !itemName || !department || !businessReason) {
    return { error: "Title, item, department, and business reason are required." };
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { error: "Quantity must be at least 1." };
  }

  const referenceCode = nextReferenceCode();

  try {
    const pr = await createPurchaseRequest(tenant.id, {
      title,
      status: "draft",
      vendorName: department,
      amountSar: Math.round(quantity),
      referenceCode,
    });

    const workflow = await ensurePurchaseToStockWorkflow(tenant.id);
    const workflowWithSteps = await prisma.workflow.findUniqueOrThrow({
      where: { id: workflow.id },
      include: { steps: { orderBy: { orderIndex: "asc" } } },
    });

    const task = await prisma.task.create({
      data: {
        tenantId: tenant.id,
        workflowId: workflow.id,
        title: `Purchase-to-stock: ${title}`,
        status: "open",
      },
    });

    const meta = {
      workflowKey: "purchase_to_stock" as const,
      requestId: pr.id,
      itemName,
      quantity: Math.round(quantity),
      department,
      businessReason,
      requestedByRole: "requester",
    };

    const report = await prisma.report.create({
      data: {
        tenantId: tenant.id,
        name: `${PURCHASE_TO_STOCK_REPORT_PREFIX}${referenceCode}`,
        configJson: buildPurchaseToStockReportConfig(meta, {
          workflowId: workflow.id,
          primaryTaskId: task.id,
          workflowStepIds: workflowWithSteps.steps.map((s) => s.id),
          lastActionKey: "create_request",
          lastAdvancedAt: new Date().toISOString(),
        }),
      },
    });

    await updatePurchaseToStockLineage(tenant.id, pr.id, {
      workflowId: workflow.id,
      primaryTaskId: task.id,
      reportId: report.id,
      workflowStepIds: workflowWithSteps.steps.map((s) => s.id),
      lastActionKey: "create_request",
      lastAdvancedAt: new Date().toISOString(),
    });

    await prisma.cybercrowAuditLog.create({
      data: {
        tenantId: tenant.id,
        action: "CEM_TRANSACTION_REQUEST_CREATED",
        entityType: "purchase_request",
        entityId: pr.id,
        metadata: { referenceCode, workflowKey: "purchase_to_stock" },
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create request." };
  }

  revalidatePurchaseToStock(slug);
  return { success: "Purchase-to-stock request created (draft)." };
}

export async function advancePurchaseToStockStageAction(
  _prev: CemTransactionActionState,
  formData: FormData
): Promise<CemTransactionActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const requestId = String(formData.get("requestId") ?? "");
  const actionKey = String(formData.get("actionKey") ?? "");

  let tenant;
  try {
    ({ tenant } = await requireActionTenantPolicy(slug, "cem.workflows.manage"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not allowed." };
  }

  const pr = await getPurchaseRequestById(tenant.id, requestId);
  if (!pr) return { error: "Purchase request not found." };

  try {
    const requiredModuleByActionKey = {
      submit_request: "procurement",
      send_finance_approval: "finance",
      approve_finance: "finance",
      mark_warehouse_received: "warehouse",
      confirm_inventory_visibility: "inventory",
    } as const;

    const requiredModule = (
      requiredModuleByActionKey as Record<string, (typeof requiredModuleByActionKey)[keyof typeof requiredModuleByActionKey]>
    )[actionKey];

    if (requiredModule && !hasErpModule(tenant.modules ?? [], requiredModule)) {
      return { error: `${requiredModule} module not enabled.` };
    }

    const workflow = await ensurePurchaseToStockWorkflow(tenant.id);
    const taskTitle = `Purchase-to-stock: ${pr.title}`;

    if (actionKey === "submit_request" && pr.status === "draft") {
      await updatePurchaseRequest(tenant.id, pr.id, { status: "submitted" });
      await prisma.task.updateMany({
        where: { tenantId: tenant.id, workflowId: workflow.id, title: taskTitle },
        data: { status: "in_progress" },
      });
    } else if (actionKey === "send_finance_approval" && pr.status === "submitted") {
      await updatePurchaseRequest(tenant.id, pr.id, { status: "approved" });
      await prisma.task.updateMany({
        where: { tenantId: tenant.id, workflowId: workflow.id, title: taskTitle },
        data: { status: "in_progress" },
      });
    } else if (actionKey === "approve_finance" && pr.status === "approved" && !pr.linkedFinanceRef) {
      const approval = await prisma.approval.create({
        data: {
          tenantId: tenant.id,
          entityType: "purchase_request",
          entityId: pr.id,
          status: "approved",
        },
      });
      await updatePurchaseRequest(tenant.id, pr.id, {
        linkedFinanceRef: approval.id,
      });
      await prisma.task.updateMany({
        where: { tenantId: tenant.id, workflowId: workflow.id, title: taskTitle },
        data: { status: "in_progress" },
      });
    } else if (actionKey === "mark_warehouse_received") {
      if (pr.status !== "approved" && pr.status !== "ordered") {
        return { error: "Finance approval must complete before warehouse receiving." };
      }
      if (!pr.linkedFinanceRef) {
        return { error: "Finance approval evidence required before receiving." };
      }
      await updatePurchaseRequest(tenant.id, pr.id, { status: "received" });
      await prisma.task.updateMany({
        where: { tenantId: tenant.id, workflowId: workflow.id, title: taskTitle },
        data: { status: "in_progress" },
      });
    } else if (actionKey === "confirm_inventory_visibility" && pr.status === "received") {
      await updatePurchaseRequest(tenant.id, pr.id, {
        linkedInventoryRef: `visibility-${pr.id}`,
      });
      await prisma.cybercrowAuditLog.create({
        data: {
          tenantId: tenant.id,
          action: "CEM_TRANSACTION_INVENTORY_VISIBILITY",
          entityType: "purchase_request",
          entityId: pr.id,
          metadata: { advisory: true, workflowKey: "purchase_to_stock" },
        },
      });
      await prisma.task.updateMany({
        where: { tenantId: tenant.id, workflowId: workflow.id, title: taskTitle },
        data: { status: "completed" },
      });
    } else {
      return { error: "Stage transition not allowed from current status." };
    }

    const lineagePatch: {
      lastActionKey: string;
      lastAdvancedAt: string;
      approvalId?: string;
      workflowId: string;
    } = {
      lastActionKey: actionKey,
      lastAdvancedAt: new Date().toISOString(),
      workflowId: workflow.id,
    };
    if (actionKey === "approve_finance") {
      const refreshed = await getPurchaseRequestById(tenant.id, pr.id);
      if (refreshed?.linkedFinanceRef) lineagePatch.approvalId = refreshed.linkedFinanceRef;
    }
    await updatePurchaseToStockLineage(tenant.id, pr.id, lineagePatch);

    await prisma.cybercrowAuditLog.create({
      data: {
        tenantId: tenant.id,
        action: "CEM_TRANSACTION_STAGE_ADVANCED",
        entityType: "purchase_request",
        entityId: pr.id,
        metadata: { actionKey, workflowKey: "purchase_to_stock" },
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to advance workflow." };
  }

  revalidatePurchaseToStock(slug);
  return { success: "Workflow stage updated." };
}

export async function markWarehouseReceivedAction(
  _prev: CemTransactionActionState,
  formData: FormData
): Promise<CemTransactionActionState> {
  formData.set("actionKey", "mark_warehouse_received");
  return advancePurchaseToStockStageAction(_prev, formData);
}
