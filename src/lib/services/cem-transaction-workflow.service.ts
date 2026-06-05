import "server-only";

import type { Prisma } from "@prisma/client";
import { routes } from "@/lib/routes";
import {
  CEM_TRANSACTION_WORKFLOW_DISCLAIMERS,
  type CemPurchaseToStockRequest,
  type CemTransactionEvidenceHook,
  type CemTransactionModuleImpact,
  type CemTransactionNextAction,
  type CemTransactionReportRef,
  type CemTransactionSareaRoleView,
  type CemTransactionStage,
  type CemTransactionStatus,
  type CemTransactionStep,
  type CemTransactionStepStatus,
  type CemTransactionTaskRef,
  type CemTransactionWorkflowSnapshot,
  type CemTransactionWorkflowSummary,
} from "@/lib/cem/cem-transaction-workflow-contract";
import {
  mergeWorkflowLineage,
  parseWorkflowLineage,
  type CemWorkflowLineageRecord,
} from "@/lib/cem/cem-workflow-lineage";
import { prisma } from "@/lib/db";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import {
  getPurchaseRequestById,
  listPurchaseRequests,
} from "@/lib/services/procurement.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export const PURCHASE_TO_STOCK_WORKFLOW_NAME = "Purchase-to-stock";
export const PURCHASE_TO_STOCK_REPORT_PREFIX = "Purchase-to-stock · ";
export const PURCHASE_TO_STOCK_CONFIG_KEY = "cem_transaction_workflow_v1";

export type PurchaseToStockWorkflowMeta = {
  workflowKey: "purchase_to_stock";
  requestId: string;
  itemName: string;
  quantity: number;
  department: string;
  businessReason: string;
  requestedByRole?: string;
};

const STAGE_ORDER: CemTransactionStage[] = [
  "department_request",
  "procurement_review",
  "finance_approval",
  "warehouse_receiving",
  "inventory_visibility",
  "report_output",
];

const STAGE_DEFS: Omit<CemTransactionStep, "status">[] = [
  {
    stage: "department_request",
    label: "Department request",
    ownerRole: "requester",
    moduleKey: "procurement",
    route: "procurement",
    description: "Department raises a purchase need with item, quantity, and business reason.",
    evidenceHook: "purchase_request_evidence",
    reportImpact: "Opens purchase-to-stock pipeline in reports.",
    sareaView: "Requester sees own request and task status.",
  },
  {
    stage: "procurement_review",
    label: "Procurement review",
    ownerRole: "procurement_owner",
    moduleKey: "procurement",
    route: "procurement",
    description: "Procurement validates need, vendor context, and readiness for finance.",
    evidenceHook: "procurement_review_evidence",
    reportImpact: "Pending procurement queue visible in operational reports.",
    sareaView: "Procurement owner sees review queue and dependencies.",
  },
  {
    stage: "finance_approval",
    label: "Finance approval readiness",
    ownerRole: "finance_approver",
    moduleKey: "finance",
    route: "finance",
    description: "Finance reviews budget readiness — not payment execution or ledger posting.",
    evidenceHook: "finance_approval_evidence",
    reportImpact: "Approval posture rolls into finance readiness reports.",
    sareaView: "Finance approver sees approval step only.",
  },
  {
    stage: "warehouse_receiving",
    label: "Warehouse receiving",
    ownerRole: "warehouse_receiver",
    moduleKey: "warehouse",
    route: "warehouse",
    description: "Warehouse records receiving step — advisory visibility, not stock mutation.",
    evidenceHook: "warehouse_receiving_evidence",
    reportImpact: "Receiving status summarized for operations reports.",
    sareaView: "Warehouse receiver sees receiving task.",
  },
  {
    stage: "inventory_visibility",
    label: "Inventory visibility",
    ownerRole: "operations_manager",
    moduleKey: "inventory",
    route: "inventory",
    description: "Inventory visibility updated for operators — not legal stock certification.",
    evidenceHook: "inventory_visibility_evidence",
    reportImpact: "Inventory visibility line in purchase-to-stock report output.",
    sareaView: "Operations manager sees stock visibility posture.",
  },
  {
    stage: "report_output",
    label: "Report output",
    ownerRole: "operations_manager",
    moduleKey: "bi",
    route: "reports",
    description: "Reports summarize stage, blockers, and workflow evidence readiness.",
    evidenceHook: "report_output_evidence",
    reportImpact: "Purchase-to-stock summary available on reports module.",
    sareaView: "Executive persona sees report output and blockers.",
  },
];

function stageIndex(stage: CemTransactionStage): number {
  return STAGE_ORDER.indexOf(stage);
}

function stepStatusForStage(
  stage: CemTransactionStage,
  current: CemTransactionStage,
  workflowStatus: CemTransactionStatus
): CemTransactionStepStatus {
  if (workflowStatus === "cancelled" || workflowStatus === "blocked") {
    if (stage === current) return "blocked";
    return stageIndex(stage) < stageIndex(current) ? "completed" : "pending";
  }
  const ci = stageIndex(current);
  const si = stageIndex(stage);
  if (si < ci) return "completed";
  if (si === ci) return "active";
  return "pending";
}

export function deriveTransactionStateFromPurchaseRequest(row: {
  status: string;
  linkedFinanceRef: string | null;
  linkedInventoryRef: string | null;
}): { status: CemTransactionStatus; currentStage: CemTransactionStage } {
  const prStatus = row.status;
  if (prStatus === "cancelled") {
    return { status: "cancelled", currentStage: "department_request" };
  }
  if (prStatus === "draft") {
    return { status: "draft", currentStage: "department_request" };
  }
  if (prStatus === "submitted") {
    return { status: "procurement_review", currentStage: "procurement_review" };
  }
  if (prStatus === "approved") {
    if (!row.linkedFinanceRef) {
      return { status: "finance_approval", currentStage: "finance_approval" };
    }
    return { status: "warehouse_receiving", currentStage: "warehouse_receiving" };
  }
  if (prStatus === "ordered") {
    return { status: "warehouse_receiving", currentStage: "warehouse_receiving" };
  }
  if (prStatus === "received") {
    if (!row.linkedInventoryRef) {
      return { status: "inventory_visible", currentStage: "inventory_visibility" };
    }
    return { status: "completed", currentStage: "report_output" };
  }
  return { status: "blocked", currentStage: "procurement_review" };
}

function parseWorkflowMeta(config: unknown): PurchaseToStockWorkflowMeta | null {
  if (!config || typeof config !== "object") return null;
  const c = config as Record<string, unknown>;
  if (c.workflowKey !== "purchase_to_stock" || typeof c.requestId !== "string") return null;
  return {
    workflowKey: "purchase_to_stock",
    requestId: c.requestId,
    itemName: String(c.itemName ?? ""),
    quantity: Number(c.quantity ?? 1),
    department: String(c.department ?? "General"),
    businessReason: String(c.businessReason ?? ""),
    requestedByRole: c.requestedByRole ? String(c.requestedByRole) : undefined,
  };
}

function mapPurchaseRequestToWorkflowRequest(
  slug: string,
  row: {
    id: string;
    title: string;
    status: string;
    vendorName: string | null;
    amountSar: number | null;
    linkedFinanceRef: string | null;
    linkedInventoryRef: string | null;
    referenceCode: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
  meta: PurchaseToStockWorkflowMeta | null,
  source: "tenant_backed" | "mock"
): CemPurchaseToStockRequest {
  const { status, currentStage } = deriveTransactionStateFromPurchaseRequest(row);
  return {
    id: row.id,
    tenantSlug: slug,
    title: row.title,
    itemName: meta?.itemName || row.title,
    quantity: meta?.quantity ?? row.amountSar ?? 1,
    department: meta?.department || row.vendorName || "General",
    requestedByRole: (meta?.requestedByRole as CemPurchaseToStockRequest["requestedByRole"]) ?? "requester",
    businessReason: meta?.businessReason || "Captured on workflow report metadata when available.",
    status,
    currentStage,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    source,
    referenceCode: row.referenceCode,
    linkedFinanceRef: row.linkedFinanceRef,
    linkedInventoryRef: row.linkedInventoryRef,
  };
}

function advisoryPurchaseRequest(slug: string, tenantName: string): CemPurchaseToStockRequest {
  const now = new Date().toISOString();
  return {
    id: "advisory-purchase-to-stock",
    tenantSlug: slug,
    title: `Advisory purchase-to-stock — ${tenantName}`,
    itemName: "Sample consumables",
    quantity: 12,
    department: "Operations",
    requestedByRole: "requester",
    businessReason: "Staging demo illustrating cross-module purchase-to-stock coordination.",
    status: "procurement_review",
    currentStage: "procurement_review",
    createdAt: now,
    updatedAt: now,
    source: "advisory",
  };
}

function buildSteps(
  currentStage: CemTransactionStage,
  status: CemTransactionStatus,
  slug: string
): CemTransactionStep[] {
  const r = routes.tenant(slug);
  const routeMap: Record<string, string> = {
    procurement: r.procurement,
    finance: r.finance,
    warehouse: r.warehouse,
    inventory: r.inventory,
    bi: r.reports,
    reports: r.reports,
  };
  return STAGE_DEFS.map((def) => ({
    ...def,
    route: routeMap[def.route] ?? r.workflows,
    status: stepStatusForStage(def.stage, currentStage, status),
  }));
}

function buildModuleImpacts(slug: string): CemTransactionModuleImpact[] {
  const r = routes.tenant(slug);
  return [
    {
      moduleKey: "procurement",
      label: "Procurement",
      impact: "Hosts purchase request intake and procurement review.",
      route: r.procurement,
    },
    {
      moduleKey: "finance",
      label: "Finance",
      impact: "Finance approval readiness — not payment or ledger posting.",
      route: r.finance,
    },
    {
      moduleKey: "warehouse",
      label: "Warehouse",
      impact: "Receiving step and warehouse task coordination.",
      route: r.warehouse,
    },
    {
      moduleKey: "inventory",
      label: "Inventory",
      impact: "Inventory visibility after receiving — advisory only.",
      route: r.inventory,
    },
    {
      moduleKey: "bi",
      label: "Reports",
      impact: "Purchase-to-stock summary and stage roll-up.",
      route: r.reports,
    },
  ];
}

function buildCyberCrowEvidence(slug: string, requestId: string): CemTransactionEvidenceHook[] {
  const r = routes.tenant(slug);
  return [
    {
      key: "purchase_request",
      label: "Purchase request evidence",
      description: "Workflow evidence hook for department request and procurement context.",
      route: `${r.workflows}/purchase-to-stock?requestId=${requestId}`,
      readiness: "ready",
    },
    {
      key: "finance_approval",
      label: "Finance approval evidence",
      description: "Approval posture and finance readiness — not accounting posting.",
      route: r.cybercrow.evidence,
      readiness: "partial",
    },
    {
      key: "warehouse_receiving",
      label: "Warehouse receiving evidence",
      description: "Receiving step audit trail readiness.",
      route: r.cybercrow.auditLogs,
      readiness: "partial",
    },
    {
      key: "inventory_visibility",
      label: "Inventory visibility evidence",
      description: "Inventory visibility hook — not certified stock mutation.",
      route: r.cybercrow.evidence,
      readiness: "advisory",
    },
  ];
}

function buildSareaViews(): CemTransactionSareaRoleView[] {
  return [
    {
      role: "requester",
      label: "Requester",
      focus: "Own purchase request and open task.",
      widgets: ["request_status", "task_board"],
    },
    {
      role: "procurement_owner",
      label: "Procurement owner",
      focus: "Procurement review queue and finance dependency.",
      widgets: ["procurement_queue", "workflow_timeline"],
    },
    {
      role: "finance_approver",
      label: "Finance approver",
      focus: "Finance approval readiness step only.",
      widgets: ["approval_queue", "budget_readiness"],
    },
    {
      role: "warehouse_receiver",
      label: "Warehouse receiver",
      focus: "Receiving task and warehouse handoff.",
      widgets: ["receiving_task", "warehouse_board"],
    },
    {
      role: "operations_manager",
      label: "Operations manager",
      focus: "End-to-end workflow, blockers, and report output.",
      widgets: ["workflow_timeline", "blockers", "report_summary"],
    },
    {
      role: "procrow_observer",
      label: "ProCrow observer",
      focus: "Transaction prototype readiness and persistence warnings.",
      widgets: ["go_no_go", "persistence_status"],
    },
  ];
}

function buildNextActions(
  request: CemPurchaseToStockRequest,
  modules: string[],
  actionsEnabled: boolean
): CemTransactionNextAction[] {
  const hasProcurement = modules.includes("procurement");
  const hasFinance = modules.includes("finance");
  const hasWarehouse = modules.includes("warehouse");
  const hasInventory = modules.includes("inventory");

  const actions: CemTransactionNextAction[] = [];

  if (request.status === "draft") {
    actions.push({
      id: "submit",
      label: "Submit request",
      description: "Move from department draft to procurement review.",
      actionKey: "submit_request",
      allowed: actionsEnabled && hasProcurement,
      blockedReason: !hasProcurement ? "Procurement module not enabled." : undefined,
    });
  }
  if (request.status === "procurement_review") {
    actions.push({
      id: "finance",
      label: "Send to finance approval",
      description: "Procurement review complete — route to finance approval readiness.",
      actionKey: "send_finance_approval",
      allowed: actionsEnabled && hasFinance,
      blockedReason: !hasFinance ? "Finance module not enabled." : undefined,
    });
  }
  if (request.status === "finance_approval") {
    actions.push({
      id: "approve_finance",
      label: "Approve finance step",
      description: "Record finance approval readiness — not payment execution.",
      actionKey: "approve_finance",
      allowed: actionsEnabled && hasFinance,
    });
  }
  if (request.status === "warehouse_receiving") {
    actions.push({
      id: "receive",
      label: "Mark warehouse received",
      description: "Record receiving step — does not mutate production stock.",
      actionKey: "mark_warehouse_received",
      allowed: actionsEnabled && hasWarehouse,
      blockedReason: !hasWarehouse ? "Warehouse module not enabled." : undefined,
    });
  }
  if (request.status === "inventory_visible") {
    actions.push({
      id: "inventory",
      label: "Confirm inventory visibility",
      description: "Advisory inventory visibility confirmation for reports.",
      actionKey: "confirm_inventory_visibility",
      allowed: actionsEnabled && hasInventory,
      blockedReason: !hasInventory ? "Inventory module not enabled." : undefined,
    });
  }

  return actions;
}

async function loadWorkflowMetaForRequest(tenantId: string, requestId: string) {
  const reports = await prisma.report.findMany({
    where: { tenantId },
    select: { configJson: true },
  });
  for (const report of reports) {
    const meta = parseWorkflowMeta(report.configJson);
    if (meta?.requestId === requestId) return meta;
  }
  return null;
}

async function loadRelatedTasks(
  tenantId: string,
  workflowId: string | null,
  requestTitle: string
): Promise<CemTransactionTaskRef[]> {
  const tasks = await prisma.task.findMany({
    where: {
      tenantId,
      OR: [
        workflowId ? { workflowId } : undefined,
        { title: { contains: requestTitle.slice(0, 40) } },
        { title: { contains: "Purchase-to-stock" } },
      ].filter(Boolean) as Prisma.TaskWhereInput[],
    },
    include: { workflow: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    workflowName: t.workflow?.name ?? null,
  }));
}

async function loadRelatedReports(
  tenantId: string,
  requestId: string
): Promise<CemTransactionReportRef[]> {
  const reports = await prisma.report.findMany({
    where: {
      tenantId,
      OR: [
        { name: { startsWith: PURCHASE_TO_STOCK_REPORT_PREFIX } },
        { name: { contains: "purchase-to-stock" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return reports
    .filter((rep) => {
      const meta = parseWorkflowMeta(rep.configJson);
      return !meta || meta.requestId === requestId;
    })
    .map((rep) => ({
      id: rep.id,
      name: rep.name,
      summary: "Purchase-to-stock workflow report output — advisory staging summary.",
    }));
}

export async function ensurePurchaseToStockWorkflow(tenantId: string) {
  let workflow = await prisma.workflow.findFirst({
    where: { tenantId, name: PURCHASE_TO_STOCK_WORKFLOW_NAME },
    include: { steps: true },
  });
  if (!workflow) {
    workflow = await prisma.workflow.create({
      data: { tenantId, name: PURCHASE_TO_STOCK_WORKFLOW_NAME, status: "active" },
      include: { steps: true },
    });
  }
  if (workflow.steps.length === 0) {
    await prisma.workflowStep.createMany({
      data: STAGE_DEFS.map((s, i) => ({
        workflowId: workflow!.id,
        name: s.label,
        orderIndex: i,
      })),
    });
  }
  return workflow;
}

export async function buildPurchaseToStockWorkflowSnapshotForTenantSlug(
  slug: string,
  requestId?: string
): Promise<CemTransactionWorkflowSnapshot | null> {
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return null;

  const tenantModules = tenant.modules ?? [];
  const moduleKeys = tenantModules.filter((m) => m.enabled !== false).map((m) => m.moduleKey);
  const r = routes.tenant(slug);

  const purchaseRows = await listPurchaseRequests(tenant.id);
  const persistenceMode = purchaseRows.length > 0 ? "tenant_backed" : "advisory_only";
  const actionsEnabled = persistenceMode === "tenant_backed";

  let selectedRow = requestId
    ? await getPurchaseRequestById(tenant.id, requestId)
    : purchaseRows[0] ?? null;

  const warnings: string[] = [];
  const blockers: string[] = [];

  if (!hasErpModule(tenantModules, "procurement")) {
    warnings.push("Procurement module not enabled — workflow remains advisory.");
  }

  let request: CemPurchaseToStockRequest;
  let workflowId: string | null = null;

  if (selectedRow) {
    const meta = await loadWorkflowMetaForRequest(tenant.id, selectedRow.id);
    request = mapPurchaseRequestToWorkflowRequest(slug, selectedRow, meta, "tenant_backed");
    const wf = await prisma.workflow.findFirst({
      where: { tenantId: tenant.id, name: PURCHASE_TO_STOCK_WORKFLOW_NAME },
    });
    workflowId = wf?.id ?? null;
  } else {
    request = advisoryPurchaseRequest(slug, tenant.organization.displayName);
    warnings.push("No tenant purchase requests — showing advisory purchase-to-stock prototype.");
    blockers.push("Create a purchase request to exercise tenant-backed workflow actions.");
  }

  const steps = buildSteps(request.currentStage, request.status, slug);
  const relatedTasks = selectedRow
    ? await loadRelatedTasks(tenant.id, workflowId, selectedRow.title)
    : [];
  const relatedReports = selectedRow
    ? await loadRelatedReports(tenant.id, selectedRow.id)
    : [
        {
          id: "advisory-report",
          name: "Purchase-to-stock · advisory",
          summary: "Advisory report output when no tenant-backed request exists.",
        },
      ];

  const nextActions = buildNextActions(request, moduleKeys, actionsEnabled);

  return {
    tenantSlug: slug,
    tenantName: tenant.organization.displayName,
    workflowKey: "purchase_to_stock",
    status: request.status,
    request,
    steps,
    relatedTasks,
    relatedReports,
    moduleImpacts: buildModuleImpacts(slug),
    cyberCrowEvidence: buildCyberCrowEvidence(slug, request.id),
    sareaExperienceImpact: buildSareaViews(),
    blockers,
    warnings,
    nextActions,
    disclaimers: CEM_TRANSACTION_WORKFLOW_DISCLAIMERS,
    persistenceMode,
    actionsEnabled,
  };
}

export async function buildCemTransactionWorkflowSummaryForTenantId(
  tenantId: string
): Promise<CemTransactionWorkflowSummary> {
  const rows = await listPurchaseRequests(tenantId);
  const active = rows[0];
  const state = active ? deriveTransactionStateFromPurchaseRequest(active) : null;
  const hasCompletedDemoFlow = rows.some((r) => r.status === "received");

  return {
    workflowKey: "purchase_to_stock",
    status: state?.status ?? "draft",
    requestCount: rows.length,
    activeRequestTitle: active?.title,
    persistenceMode: rows.length > 0 ? "tenant_backed" : "advisory_only",
    hasCompletedDemoFlow,
    warnings:
      rows.length === 0
        ? ["No tenant purchase requests — transaction workflow is advisory-only."]
        : [],
  };
}

export function buildPurchaseToStockReportConfig(
  meta: PurchaseToStockWorkflowMeta,
  lineage?: Partial<CemWorkflowLineageRecord>
): Prisma.InputJsonValue {
  return {
    [PURCHASE_TO_STOCK_CONFIG_KEY]: true,
    ...meta,
    ...lineage,
  } as Prisma.InputJsonValue;
}

/** M3.4 PATH A — persist lineage on report config without schema migration. */
export async function updatePurchaseToStockLineage(
  tenantId: string,
  requestId: string,
  patch: Partial<CemWorkflowLineageRecord>
): Promise<void> {
  const reports = await prisma.report.findMany({
    where: {
      tenantId,
      OR: [
        { name: { startsWith: PURCHASE_TO_STOCK_REPORT_PREFIX } },
        { name: { contains: "purchase-to-stock" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  for (const rep of reports) {
    const lineage = parseWorkflowLineage(rep.configJson);
    const meta = parseWorkflowMeta(rep.configJson);
    if (lineage?.requestId === requestId || meta?.requestId === requestId) {
      await prisma.report.update({
        where: { id: rep.id },
        data: {
          configJson: mergeWorkflowLineage(rep.configJson, {
            workflowKey: "purchase_to_stock",
            requestId,
            ...patch,
          }),
        },
      });
      return;
    }
  }
}

export function purchaseToStockWorkflowRoute(slug: string, requestId?: string) {
  const base = `${routes.tenant(slug).workflows}/purchase-to-stock`;
  return requestId ? `${base}?requestId=${encodeURIComponent(requestId)}` : base;
}
