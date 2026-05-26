import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  INVENTORY_RECOMMENDED_WORKFLOWS,
  INVENTORY_WORKFLOW_MATCH_KEYWORDS,
  WAREHOUSE_RECOMMENDED_WORKFLOWS,
  WAREHOUSE_WORKFLOW_MATCH_KEYWORDS,
  type SupplyRecommendedWorkflow,
  type SupplyWorkflowReadinessStatus,
} from "@/lib/constants/inventory-warehouse-module-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import {
  getInventorySummary,
  listInventoryItems,
} from "@/lib/services/inventory.service";
import { listPurchaseRequests } from "@/lib/services/procurement.service";
import {
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";
import {
  getWarehouseSummary,
  listWarehouseLocations,
} from "@/lib/services/warehouse.service";

export type SupplyMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type SupplyReadinessLevel = "needs_structure" | "building" | "operational";

export type InventoryOperationsReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  inventoryEnabled: boolean;
  procurementEnabled: boolean;
  warehouseEnabled: boolean;
  logisticsEnabled: boolean;
  financeEnabled: boolean;
  reportsEnabled: boolean;
  totalSkus: number;
  lowStockCount: number;
  locationCount: number;
  qtyOnHand: number;
  distinctCategories: number;
  procurementPrCount: number;
  prsWithInventoryRef: number;
  prsWithoutInventoryRef: number;
  openTaskCount: number;
  inventoryRelatedOpenTasks: number;
  matchedWorkflows: SupplyMatchedWorkflow[];
  workflowReadiness: SupplyRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: SupplyReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

export type WarehouseOperationsReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  warehouseEnabled: boolean;
  procurementEnabled: boolean;
  inventoryEnabled: boolean;
  logisticsEnabled: boolean;
  reportsEnabled: boolean;
  totalLocations: number;
  siteCount: number;
  inboundLanes: number;
  outboundLanes: number;
  coldStorageLanes: number;
  procurementPrCount: number;
  approvedPrCount: number;
  openTaskCount: number;
  warehouseRelatedOpenTasks: number;
  matchedWorkflows: SupplyMatchedWorkflow[];
  workflowReadiness: SupplyRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: SupplyReadinessLevel;
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
  recommended: readonly SupplyRecommendedWorkflow[]
): {
  matched: SupplyMatchedWorkflow[];
  readiness: SupplyRecommendedWorkflow[];
} {
  const matchedById = new Map<string, SupplyMatchedWorkflow>();

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
    let status: SupplyWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveInventoryReadiness(input: {
  totalSkus: number;
  lowStockCount: number;
  procurementEnabled: boolean;
  prsWithoutInventoryRef: number;
  warehouseEnabled: boolean;
  logisticsEnabled: boolean;
  matchedWorkflowCount: number;
  inventoryRelatedOpenTasks: number;
}): {
  level: SupplyReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];
  if (input.totalSkus === 0) {
    actions.push(
      "Add inventory items when stock/material tracking matters — quantities are coordination signals, not live accuracy guarantees."
    );
  }
  if (input.lowStockCount > 0) {
    actions.push(
      `${input.lowStockCount} SKU(s) at or below reorder — review replenishment and procurement handoff.`
    );
  }
  if (input.procurementEnabled && input.prsWithoutInventoryRef > 0) {
    actions.push(
      `${input.prsWithoutInventoryRef} PR(s) lack inventory SKU reference — link on Procurement hub.`
    );
  }
  if (!input.warehouseEnabled) {
    actions.push("Enable Warehouse for receiving and movement coordination when hubs exist.");
  }
  if (!input.logisticsEnabled) {
    actions.push("Enable Logistics for dispatch / delivery handoff when outbound stock matters.");
  }
  if (input.matchedWorkflowCount === 0) {
    actions.push("Define inventory workflows (receiving, adjustment review) in Workflows.");
  }
  if (input.inventoryRelatedOpenTasks === 0 && input.totalSkus > 0) {
    actions.push("Assign inventory-related tasks for adjustments and count readiness.");
  }

  if (
    input.totalSkus >= 3 &&
    input.matchedWorkflowCount >= 1 &&
    (input.warehouseEnabled || input.logisticsEnabled)
  ) {
    return {
      level: "operational",
      label: "Operational inventory coordination",
      detail:
        "SKU records, handoffs, and workflow signals support stock/material readiness — operator-managed, not automated stock sync.",
      actions,
    };
  }
  if (input.totalSkus >= 1) {
    return {
      level: "building",
      label: "Building inventory readiness",
      detail:
        "Some SKU activity exists — strengthen procurement links, adjustments, and count workflows.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs inventory structure",
    detail:
      "Inventory readiness mode — use items for coordination; do not treat quantities as certified stock accuracy or WMS automation.",
    actions,
  };
}

function deriveWarehouseReadiness(input: {
  totalLocations: number;
  inboundLanes: number;
  outboundLanes: number;
  procurementEnabled: boolean;
  inventoryEnabled: boolean;
  logisticsEnabled: boolean;
  matchedWorkflowCount: number;
  warehouseRelatedOpenTasks: number;
}): {
  level: SupplyReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];
  if (input.totalLocations === 0) {
    actions.push(
      "Add warehouse locations (sites, zones, lanes) when hub operations matter — not a live WMS."
    );
  }
  if (!input.procurementEnabled) {
    actions.push("Enable Procurement for inbound receiving handoff from purchase requests.");
  }
  if (!input.inventoryEnabled) {
    actions.push("Enable Inventory for SKU / movement context alongside warehouse lanes.");
  }
  if (!input.logisticsEnabled && input.outboundLanes > 0) {
    actions.push("Enable Logistics for dispatch handoff from outbound lanes.");
  }
  if (input.matchedWorkflowCount === 0) {
    actions.push("Define warehouse workflows (receiving, putaway, dispatch prep) in Workflows.");
  }
  if (input.warehouseRelatedOpenTasks === 0 && input.totalLocations > 0) {
    actions.push("Assign warehouse-related tasks for receiving and movement checklists.");
  }

  if (
    input.totalLocations >= 2 &&
    input.matchedWorkflowCount >= 1 &&
    input.logisticsEnabled
  ) {
    return {
      level: "operational",
      label: "Operational warehouse coordination",
      detail:
        "Locations, movement kinds, and handoffs support hub readiness — operator-managed, not warehouse automation.",
      actions,
    };
  }
  if (input.totalLocations >= 1) {
    return {
      level: "building",
      label: "Building warehouse readiness",
      detail:
        "Some location structure exists — strengthen receiving, picking, and logistics handoff workflows.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs warehouse structure",
    detail:
      "Warehouse readiness mode — use locations for coordination; not barcode scanning, RFID, or real-time stock guarantees.",
    actions,
  };
}

export async function getInventoryOperationsReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined
): Promise<InventoryOperationsReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const inventoryEnabled = enabledModuleKeys.includes("inventory");
  const procurementEnabled = enabledModuleKeys.includes("procurement");
  const warehouseEnabled = enabledModuleKeys.includes("warehouse");
  const logisticsEnabled = enabledModuleKeys.includes("logistics");
  const financeEnabled = enabledModuleKeys.includes("finance");
  const reportsEnabled = enabledModuleKeys.includes("reports");

  const [items, summary, workflows, tasks, workspace, purchaseRequests] = await Promise.all([
    inventoryEnabled ? listInventoryItems(tenantId) : Promise.resolve([]),
    inventoryEnabled ? getInventorySummary(tenantId) : Promise.resolve({
      totalSkus: 0,
      lowStock: 0,
      locations: 0,
      qtyOnHand: 0,
    }),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
    procurementEnabled ? listPurchaseRequests(tenantId) : Promise.resolve([]),
  ]);

  const distinctCategories = new Set(
    items.map((i) => i.category?.trim()).filter(Boolean)
  ).size;

  const prsWithInventoryRef = purchaseRequests.filter((r) =>
    Boolean(r.linkedInventoryRef?.trim())
  ).length;
  const prsWithoutInventoryRef = procurementEnabled
    ? purchaseRequests.length - prsWithInventoryRef
    : 0;

  const inventoryRelatedOpenTasks = tasks.filter(
    (t) =>
      isOpenTaskStatus(t.status) &&
      matchesKeywords(t.title, INVENTORY_WORKFLOW_MATCH_KEYWORDS)
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    INVENTORY_WORKFLOW_MATCH_KEYWORDS,
    INVENTORY_RECOMMENDED_WORKFLOWS
  );

  const derived = deriveInventoryReadiness({
    totalSkus: summary.totalSkus,
    lowStockCount: summary.lowStock,
    procurementEnabled,
    prsWithoutInventoryRef,
    warehouseEnabled,
    logisticsEnabled,
    matchedWorkflowCount: matched.length,
    inventoryRelatedOpenTasks,
  });

  return {
    sectorKey,
    inventoryEnabled,
    procurementEnabled,
    warehouseEnabled,
    logisticsEnabled,
    financeEnabled,
    reportsEnabled,
    totalSkus: summary.totalSkus,
    lowStockCount: summary.lowStock,
    locationCount: summary.locations,
    qtyOnHand: summary.qtyOnHand,
    distinctCategories,
    procurementPrCount: purchaseRequests.length,
    prsWithInventoryRef,
    prsWithoutInventoryRef,
    openTaskCount: workspace.openTaskCount,
    inventoryRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}

export async function getWarehouseOperationsReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined
): Promise<WarehouseOperationsReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const warehouseEnabled = enabledModuleKeys.includes("warehouse");
  const procurementEnabled = enabledModuleKeys.includes("procurement");
  const inventoryEnabled = enabledModuleKeys.includes("inventory");
  const logisticsEnabled = enabledModuleKeys.includes("logistics");
  const reportsEnabled = enabledModuleKeys.includes("reports");

  const [locations, summary, workflows, tasks, workspace, purchaseRequests] = await Promise.all([
    warehouseEnabled ? listWarehouseLocations(tenantId) : Promise.resolve([]),
    warehouseEnabled
      ? getWarehouseSummary(tenantId)
      : Promise.resolve({
          totalLocations: 0,
          sites: 0,
          inbound: 0,
          outbound: 0,
          coldStorage: 0,
        }),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
    procurementEnabled ? listPurchaseRequests(tenantId) : Promise.resolve([]),
  ]);

  const approvedPrCount = purchaseRequests.filter(
    (r) => r.status === "approved" || r.status === "ordered" || r.status === "received"
  ).length;

  const warehouseRelatedOpenTasks = tasks.filter(
    (t) =>
      isOpenTaskStatus(t.status) &&
      matchesKeywords(t.title, WAREHOUSE_WORKFLOW_MATCH_KEYWORDS)
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    WAREHOUSE_WORKFLOW_MATCH_KEYWORDS,
    WAREHOUSE_RECOMMENDED_WORKFLOWS
  );

  const derived = deriveWarehouseReadiness({
    totalLocations: summary.totalLocations,
    inboundLanes: summary.inbound,
    outboundLanes: summary.outbound,
    procurementEnabled,
    inventoryEnabled,
    logisticsEnabled,
    matchedWorkflowCount: matched.length,
    warehouseRelatedOpenTasks,
  });

  return {
    sectorKey,
    warehouseEnabled,
    procurementEnabled,
    inventoryEnabled,
    logisticsEnabled,
    reportsEnabled,
    totalLocations: summary.totalLocations,
    siteCount: summary.sites,
    inboundLanes: summary.inbound,
    outboundLanes: summary.outbound,
    coldStorageLanes: summary.coldStorage,
    procurementPrCount: purchaseRequests.length,
    approvedPrCount,
    openTaskCount: workspace.openTaskCount,
    warehouseRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}
