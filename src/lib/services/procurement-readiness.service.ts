import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  PROCUREMENT_RECOMMENDED_WORKFLOWS,
  PROCUREMENT_WORKFLOW_MATCH_KEYWORDS,
  type ProcurementRecommendedWorkflow,
  type ProcurementWorkflowReadinessStatus,
} from "@/lib/constants/procurement-module-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import {
  getProcurementSummary,
  listPurchaseRequests,
} from "@/lib/services/procurement.service";
import {
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

export type ProcurementMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type ProcurementReadinessLevel = "needs_structure" | "building" | "operational";

export type ProcurementOperationsReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  procurementEnabled: boolean;
  financeEnabled: boolean;
  inventoryEnabled: boolean;
  warehouseEnabled: boolean;
  reportsEnabled: boolean;
  requestCount: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
  urgentCount: number;
  totalAmountSar: number;
  requestsWithoutFinanceLink: number;
  requestsWithoutInventoryLink: number;
  uniqueVendorCount: number;
  openTaskCount: number;
  procurementRelatedOpenTasks: number;
  matchedWorkflows: ProcurementMatchedWorkflow[];
  workflowReadiness: ProcurementRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: ProcurementReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

function matchesKeywords(text: string, keywords: readonly string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function mergeWorkflowReadiness(
  workflows: { id: string; name: string; _count: { tasks: number } }[],
  tasks: { workflowId: string | null; status: string; title: string }[],
  keywords: readonly string[],
  recommended: readonly ProcurementRecommendedWorkflow[]
): {
  matched: ProcurementMatchedWorkflow[];
  readiness: ProcurementRecommendedWorkflow[];
} {
  const matchedById = new Map<string, ProcurementMatchedWorkflow>();

  for (const w of workflows) {
    if (matchesKeywords(w.name, keywords)) {
      matchedById.set(w.id, {
        id: w.id,
        name: w.name,
        taskCount: w._count.tasks,
        openTaskCount: 0,
      });
    }
  }

  for (const t of tasks) {
    if (matchesKeywords(t.title, keywords)) {
      const wfId = t.workflowId ?? `task-${t.title.slice(0, 24)}`;
      const existing = matchedById.get(wfId);
      if (existing) {
        existing.taskCount += 1;
        if (isOpenTaskStatus(t.status)) {
          existing.openTaskCount += 1;
        }
      } else if (t.workflowId) {
        matchedById.set(t.workflowId, {
          id: t.workflowId,
          name: t.title,
          taskCount: 1,
          openTaskCount: isOpenTaskStatus(t.status) ? 1 : 0,
        });
      }
    } else if (t.workflowId && matchedById.has(t.workflowId)) {
      const row = matchedById.get(t.workflowId)!;
      row.taskCount += 1;
      if (isOpenTaskStatus(t.status)) {
        row.openTaskCount += 1;
      }
    }
  }

  const matched = [...matchedById.values()].sort((a, b) => a.name.localeCompare(b.name));

  const readiness = recommended.map((rec) => {
    const found = matched.find(
      (m) => matchesKeywords(rec.label, keywords) || matchesKeywords(rec.id, keywords)
    );
    let status: ProcurementWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveProcurementReadiness(input: {
  requestCount: number;
  submittedCount: number;
  approvedCount: number;
  requestsWithoutFinanceLink: number;
  requestsWithoutInventoryLink: number;
  financeEnabled: boolean;
  inventoryEnabled: boolean;
  matchedWorkflowCount: number;
  procurementRelatedOpenTasks: number;
}): {
  level: ProcurementReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];
  if (input.requestCount === 0) {
    actions.push(
      "Add purchase requests when spend intake exists — amounts are coordination signals, not paid invoices."
    );
  }
  if (input.financeEnabled && input.requestsWithoutFinanceLink > 0) {
    actions.push(
      `${input.requestsWithoutFinanceLink} PR(s) lack finance reference — coordinate on Finance hub.`
    );
  }
  if (input.inventoryEnabled && input.requestsWithoutInventoryLink > 0) {
    actions.push(
      `${input.requestsWithoutInventoryLink} PR(s) lack inventory SKU reference — link for replenishment traceability.`
    );
  }
  if (!input.financeEnabled) {
    actions.push("Enable Finance module for procurement-to-finance handoff readiness.");
  }
  if (!input.inventoryEnabled) {
    actions.push("Enable Inventory or Warehouse for receiving handoff readiness when stock matters.");
  }
  if (input.matchedWorkflowCount === 0) {
    actions.push("Define procurement workflows (purchase approval, supplier review) in Workflows.");
  }
  if (input.procurementRelatedOpenTasks === 0 && input.requestCount > 0) {
    actions.push("Assign procurement-related tasks for approvals and handoffs.");
  }

  if (
    input.requestCount >= 3 &&
    input.matchedWorkflowCount >= 1 &&
    input.financeEnabled &&
    input.requestsWithoutFinanceLink === 0
  ) {
    return {
      level: "operational",
      label: "Operational procurement coordination",
      detail:
        "Purchase requests, finance linkage, and workflow signals support spend readiness — operator-managed, not live supplier payments.",
      actions,
    };
  }
  if (input.requestCount >= 1 || input.submittedCount + input.approvedCount >= 1) {
    return {
      level: "building",
      label: "Building procurement readiness",
      detail:
        "Some PR activity exists — strengthen supplier refs, finance/inventory links, and approval workflows.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs procurement structure",
    detail:
      "Procurement readiness mode — use purchase requests for coordination; do not treat PR SAR as paid spend or automated PO issuance.",
    actions,
  };
}

export async function getProcurementOperationsReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined
): Promise<ProcurementOperationsReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const procurementEnabled = enabledModuleKeys.includes("procurement");
  const financeEnabled = enabledModuleKeys.includes("finance");
  const inventoryEnabled = enabledModuleKeys.includes("inventory");
  const warehouseEnabled = enabledModuleKeys.includes("warehouse");
  const reportsEnabled = enabledModuleKeys.includes("reports");

  const [requests, summary, workflows, tasks, workspace] = await Promise.all([
    procurementEnabled ? listPurchaseRequests(tenantId) : Promise.resolve([]),
    procurementEnabled ? getProcurementSummary(tenantId) : Promise.resolve({
      total: 0,
      draft: 0,
      submitted: 0,
      approved: 0,
      urgent: 0,
      totalAmountSar: 0,
    }),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
  ]);

  const requestsWithoutFinanceLink = financeEnabled
    ? requests.filter((r) => !r.linkedFinanceRef).length
    : 0;
  const requestsWithoutInventoryLink = inventoryEnabled
    ? requests.filter((r) => !r.linkedInventoryRef).length
    : 0;
  const uniqueVendorCount = new Set(
    requests.map((r) => r.vendorName?.trim()).filter(Boolean)
  ).size;

  const procurementRelatedOpenTasks = tasks.filter(
    (t) =>
      isOpenTaskStatus(t.status) &&
      matchesKeywords(t.title, PROCUREMENT_WORKFLOW_MATCH_KEYWORDS)
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    PROCUREMENT_WORKFLOW_MATCH_KEYWORDS,
    PROCUREMENT_RECOMMENDED_WORKFLOWS
  );

  const derived = deriveProcurementReadiness({
    requestCount: summary.total,
    submittedCount: summary.submitted,
    approvedCount: summary.approved,
    requestsWithoutFinanceLink,
    requestsWithoutInventoryLink,
    financeEnabled,
    inventoryEnabled: inventoryEnabled || warehouseEnabled,
    matchedWorkflowCount: matched.length,
    procurementRelatedOpenTasks,
  });

  return {
    sectorKey,
    procurementEnabled,
    financeEnabled,
    inventoryEnabled,
    warehouseEnabled,
    reportsEnabled,
    requestCount: summary.total,
    draftCount: summary.draft,
    submittedCount: summary.submitted,
    approvedCount: summary.approved,
    urgentCount: summary.urgent,
    totalAmountSar: summary.totalAmountSar,
    requestsWithoutFinanceLink,
    requestsWithoutInventoryLink,
    uniqueVendorCount,
    openTaskCount: workspace.openTaskCount,
    procurementRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}
