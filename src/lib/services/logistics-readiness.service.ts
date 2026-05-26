import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  LOGISTICS_RECOMMENDED_WORKFLOWS,
  LOGISTICS_WORKFLOW_MATCH_KEYWORDS,
  type LogisticsRecommendedWorkflow,
  type LogisticsWorkflowReadinessStatus,
} from "@/lib/constants/logistics-module-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { listCrmAccounts, listCrmContacts } from "@/lib/services/crm.service";
import { getFinanceSummary } from "@/lib/services/finance.service";
import { getInventorySummary } from "@/lib/services/inventory.service";
import { listPurchaseRequests } from "@/lib/services/procurement.service";
import {
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";
import { getWarehouseSummary } from "@/lib/services/warehouse.service";

export type LogisticsMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type LogisticsReadinessLevel = "needs_structure" | "building" | "operational";

export type LogisticsOperationsReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  logisticsEnabled: boolean;
  warehouseEnabled: boolean;
  inventoryEnabled: boolean;
  procurementEnabled: boolean;
  crmEnabled: boolean;
  financeEnabled: boolean;
  reportsEnabled: boolean;
  totalSkus: number;
  lowStockCount: number;
  warehouseLocations: number;
  outboundLanes: number;
  inboundLanes: number;
  procurementPrCount: number;
  approvedPrCount: number;
  crmAccountCount: number;
  crmContactCount: number;
  accountsWithoutContacts: number;
  openArSar: number;
  openTaskCount: number;
  logisticsRelatedOpenTasks: number;
  matchedWorkflows: LogisticsMatchedWorkflow[];
  workflowReadiness: LogisticsRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: LogisticsReadinessLevel;
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
  recommended: readonly LogisticsRecommendedWorkflow[]
): {
  matched: LogisticsMatchedWorkflow[];
  readiness: LogisticsRecommendedWorkflow[];
} {
  const matchedById = new Map<string, LogisticsMatchedWorkflow>();

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
    let status: LogisticsWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveLogisticsReadiness(input: {
  warehouseEnabled: boolean;
  inventoryEnabled: boolean;
  procurementEnabled: boolean;
  crmEnabled: boolean;
  outboundLanes: number;
  totalSkus: number;
  procurementPrCount: number;
  crmAccountCount: number;
  matchedWorkflowCount: number;
  logisticsRelatedOpenTasks: number;
}): {
  level: LogisticsReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];

  if (!input.warehouseEnabled) {
    actions.push("Enable Warehouse for outbound lanes and warehouse-to-logistics handoff.");
  } else if (input.outboundLanes === 0) {
    actions.push("Add outbound warehouse lanes when dispatch prep matters — operator-managed.");
  }
  if (!input.inventoryEnabled) {
    actions.push("Enable Inventory for SKU / movement context alongside dispatch.");
  } else if (input.totalSkus === 0) {
    actions.push("Add inventory SKUs when material readiness should inform dispatch.");
  }
  if (!input.procurementEnabled) {
    actions.push("Enable Procurement for supplier / purchase handoff into logistics planning.");
  }
  if (input.crmEnabled && input.crmAccountCount === 0) {
    actions.push("Add CRM accounts for customer delivery and escalation context.");
  }
  if (!input.crmEnabled) {
    actions.push("Enable CRM when customer issue linkage and account context are required.");
  }
  if (input.matchedWorkflowCount === 0) {
    actions.push(
      "Define logistics workflows (dispatch, exception, handoff) in Workflows — advisory templates."
    );
  }
  if (input.logisticsRelatedOpenTasks === 0 && input.outboundLanes > 0) {
    actions.push("Assign logistics-related tasks for dispatch and exception checklists.");
  }

  if (
    input.outboundLanes >= 1 &&
    input.totalSkus >= 1 &&
    input.matchedWorkflowCount >= 1 &&
    input.warehouseEnabled &&
    input.inventoryEnabled
  ) {
    return {
      level: "operational",
      label: "Operational logistics coordination",
      detail:
        "Warehouse outbound, stock context, and workflow signals support dispatch and delivery readiness — operator-managed, not live tracking or carrier automation.",
      actions,
    };
  }
  if (input.outboundLanes >= 1 || input.totalSkus >= 1 || input.procurementPrCount >= 1) {
    return {
      level: "building",
      label: "Building logistics readiness",
      detail:
        "Some supply-chain signals exist — strengthen dispatch workflows, CRM linkage, and exception review.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs logistics structure",
    detail:
      "Logistics readiness mode — coordinate dispatch and delivery lifecycle with warehouse, inventory, and procurement; not a TMS, GPS tracker, or carrier API.",
    actions,
  };
}

export async function getLogisticsOperationsReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined
): Promise<LogisticsOperationsReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const logisticsEnabled = enabledModuleKeys.includes("logistics");
  const warehouseEnabled = enabledModuleKeys.includes("warehouse");
  const inventoryEnabled = enabledModuleKeys.includes("inventory");
  const procurementEnabled = enabledModuleKeys.includes("procurement");
  const crmEnabled = enabledModuleKeys.includes("crm");
  const financeEnabled = enabledModuleKeys.includes("finance");
  const reportsEnabled = enabledModuleKeys.includes("reports");

  const [
    inventorySummary,
    warehouseSummary,
    purchaseRequests,
    accounts,
    contacts,
    financeSummary,
    workflows,
    tasks,
    workspace,
  ] = await Promise.all([
    inventoryEnabled
      ? getInventorySummary(tenantId)
      : Promise.resolve({ totalSkus: 0, lowStock: 0, locations: 0, qtyOnHand: 0 }),
    warehouseEnabled
      ? getWarehouseSummary(tenantId)
      : Promise.resolve({
          totalLocations: 0,
          sites: 0,
          inbound: 0,
          outbound: 0,
          coldStorage: 0,
        }),
    procurementEnabled ? listPurchaseRequests(tenantId) : Promise.resolve([]),
    crmEnabled ? listCrmAccounts(tenantId) : Promise.resolve([]),
    crmEnabled ? listCrmContacts(tenantId) : Promise.resolve([]),
    financeEnabled ? getFinanceSummary(tenantId) : Promise.resolve({ arOpenSar: 0 }),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
  ]);

  const accountIdsWithContacts = new Set(
    contacts.map((c) => c.accountId).filter(Boolean) as string[]
  );
  const accountsWithoutContacts = accounts.filter(
    (a) => !accountIdsWithContacts.has(a.id)
  ).length;

  const approvedPrCount = purchaseRequests.filter(
    (r) => r.status === "approved" || r.status === "ordered" || r.status === "received"
  ).length;

  const logisticsRelatedOpenTasks = tasks.filter(
    (t) =>
      isOpenTaskStatus(t.status) &&
      matchesKeywords(t.title, LOGISTICS_WORKFLOW_MATCH_KEYWORDS)
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    LOGISTICS_WORKFLOW_MATCH_KEYWORDS,
    LOGISTICS_RECOMMENDED_WORKFLOWS
  );

  const derived = deriveLogisticsReadiness({
    warehouseEnabled,
    inventoryEnabled,
    procurementEnabled,
    crmEnabled,
    outboundLanes: warehouseSummary.outbound,
    totalSkus: inventorySummary.totalSkus,
    procurementPrCount: purchaseRequests.length,
    crmAccountCount: accounts.length,
    matchedWorkflowCount: matched.length,
    logisticsRelatedOpenTasks,
  });

  return {
    sectorKey,
    logisticsEnabled,
    warehouseEnabled,
    inventoryEnabled,
    procurementEnabled,
    crmEnabled,
    financeEnabled,
    reportsEnabled,
    totalSkus: inventorySummary.totalSkus,
    lowStockCount: inventorySummary.lowStock,
    warehouseLocations: warehouseSummary.totalLocations,
    outboundLanes: warehouseSummary.outbound,
    inboundLanes: warehouseSummary.inbound,
    procurementPrCount: purchaseRequests.length,
    approvedPrCount,
    crmAccountCount: accounts.length,
    crmContactCount: contacts.length,
    accountsWithoutContacts,
    openArSar: financeSummary.arOpenSar ?? 0,
    openTaskCount: workspace.openTaskCount,
    logisticsRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}
