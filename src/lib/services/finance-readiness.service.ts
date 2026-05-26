import { isStripeConfigured } from "@/lib/billing/env";
import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  FINANCE_RECOMMENDED_WORKFLOWS,
  FINANCE_WORKFLOW_MATCH_KEYWORDS,
  type FinanceRecommendedWorkflow,
  type FinanceWorkflowReadinessStatus,
} from "@/lib/constants/finance-module-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { getFinanceSummary, listFinanceEntries } from "@/lib/services/finance.service";
import {
  getProcurementSummary,
  listPurchaseRequests,
} from "@/lib/services/procurement.service";
import { getReportsKpiSummary } from "@/lib/services/reports.service";
import { getSalesSummary } from "@/lib/services/sales.service";
import { getTenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";
import {
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

export type FinanceMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type FinanceReadinessLevel = "needs_structure" | "building" | "operational";

export type FinanceOperationsReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  moduleKeys: string[];
  financeEnabled: boolean;
  salesEnabled: boolean;
  procurementEnabled: boolean;
  reportsEnabled: boolean;
  financeEntryCount: number;
  arOpenSar: number;
  apOpenSar: number;
  salesOpportunityCount: number;
  salesPipelineSar: number;
  salesWonSar: number;
  procurementRequestCount: number;
  procurementOpenCount: number;
  procurementAmountSar: number;
  procurementWithoutFinanceLink: number;
  openTaskCount: number;
  financeRelatedOpenTasks: number;
  activeWorkflowCount: number;
  matchedWorkflows: FinanceMatchedWorkflow[];
  workflowReadiness: FinanceRecommendedWorkflow[];
  planDisplayName: string | null;
  planKeyMismatch: boolean;
  billingCheckoutConfigured: boolean;
  cybercrowInitialized: boolean;
  reportsFinanceEntries: number;
  readinessLevel: FinanceReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

function moduleEnabled(keys: string[], key: string): boolean {
  return keys.includes(key);
}

function matchesFinanceKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return FINANCE_WORKFLOW_MATCH_KEYWORDS.some((kw) => lower.includes(kw));
}

function mergeWorkflowReadiness(
  workflows: { id: string; name: string; _count: { tasks: number } }[],
  tasks: { workflowId: string | null; status: string; title: string }[]
): {
  matched: FinanceMatchedWorkflow[];
  readiness: FinanceRecommendedWorkflow[];
} {
  const matchedById = new Map<string, FinanceMatchedWorkflow>();

  for (const w of workflows) {
    if (matchesFinanceKeyword(w.name)) {
      matchedById.set(w.id, {
        id: w.id,
        name: w.name,
        taskCount: w._count.tasks,
        openTaskCount: 0,
      });
    }
  }

  for (const t of tasks) {
    if (matchesFinanceKeyword(t.title)) {
      const wfId = t.workflowId ?? `task-${t.title.slice(0, 24)}`;
      const existing = matchedById.get(wfId);
      if (existing) {
        existing.taskCount += 1;
        if (isOpenTaskStatus(t.status)) existing.openTaskCount += 1;
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
      if (isOpenTaskStatus(t.status)) row.openTaskCount += 1;
    }
  }

  const matched = [...matchedById.values()].sort((a, b) => a.name.localeCompare(b.name));

  const readiness = FINANCE_RECOMMENDED_WORKFLOWS.map((rec) => {
    const found = matched.find((m) => matchesFinanceKeyword(rec.label) || matchesFinanceKeyword(rec.id));
    let status: FinanceWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveReadiness(input: {
  financeEntryCount: number;
  salesOpportunityCount: number;
  procurementRequestCount: number;
  matchedWorkflowCount: number;
}): Pick<
  FinanceOperationsReadinessSnapshot,
  "readinessLevel" | "readinessLabel" | "readinessDetail"
> {
  if (
    input.financeEntryCount === 0 &&
    input.salesOpportunityCount === 0 &&
    input.procurementRequestCount === 0 &&
    input.matchedWorkflowCount === 0
  ) {
    return {
      readinessLevel: "needs_structure",
      readinessLabel: "Needs structure",
      readinessDetail:
        "Enable sales/procurement modules and seed finance coordination data before operational finance readiness is meaningful.",
    };
  }
  if (input.financeEntryCount === 0 && (input.salesOpportunityCount > 0 || input.procurementRequestCount > 0)) {
    return {
      readinessLevel: "building",
      readinessLabel: "Building readiness",
      readinessDetail:
        "Commercial or spend signals exist — add finance ledger lines or explicit handoff references for coordination.",
    };
  }
  return {
    readinessLevel: "operational",
    readinessLabel: "Operational readiness",
    readinessDetail:
      "Finance coordination signals are present. Continue approval trails and monthly review as advisory practice.",
  };
}

function buildRecommendedActions(
  snapshot: Omit<
    FinanceOperationsReadinessSnapshot,
    "recommendedActions" | "readinessLevel" | "readinessLabel" | "readinessDetail"
  >
): string[] {
  const actions: string[] = [];
  if (!snapshot.salesEnabled && !snapshot.procurementEnabled) {
    actions.push("Enable sales and/or procurement modules for revenue and expense readiness signals.");
  }
  if (snapshot.salesEnabled && snapshot.financeEntryCount === 0) {
    actions.push("Add finance ledger lines or link sales references for revenue coordination.");
  }
  if (snapshot.procurementEnabled && snapshot.procurementWithoutFinanceLink > 0) {
    actions.push(
      `Link ${snapshot.procurementWithoutFinanceLink} purchase request(s) to finance references where applicable.`
    );
  }
  if (snapshot.matchedWorkflows.length === 0) {
    actions.push("Define finance-related workflows (billing review, purchase approval) via discovery or ops seed.");
  }
  if (!snapshot.cybercrowInitialized) {
    actions.push("Initialize CyberCrow for advisory financial evidence and approval trails.");
  }
  if (snapshot.planKeyMismatch) {
    actions.push("Review tenant plan vs subscription alignment on the plan settings page (advisory).");
  }
  if (!snapshot.reportsEnabled) {
    actions.push("Enable the reports module for finance KPI roll-ups.");
  }
  if (actions.length === 0) {
    actions.push("Run a monthly finance review using reports and open finance-related tasks (advisory).");
  }
  return actions.slice(0, 6);
}

export async function getFinanceOperationsReadinessSnapshot(
  tenantId: string,
  moduleKeys: string[],
  industry?: string | null
): Promise<FinanceOperationsReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const financeEnabled = moduleEnabled(moduleKeys, "finance");
  const salesEnabled = moduleEnabled(moduleKeys, "sales");
  const procurementEnabled = moduleEnabled(moduleKeys, "procurement");
  const reportsEnabled = moduleEnabled(moduleKeys, "reports");

  const [
    financeSummary,
    financeEntries,
    salesSummary,
    procurementSummary,
    purchaseRequests,
    workflows,
    tasks,
    workspace,
    planSnapshot,
    reportsKpis,
  ] = await Promise.all([
    financeEnabled ? getFinanceSummary(tenantId) : Promise.resolve(null),
    financeEnabled ? listFinanceEntries(tenantId) : Promise.resolve([]),
    salesEnabled ? getSalesSummary(tenantId) : Promise.resolve(null),
    procurementEnabled ? getProcurementSummary(tenantId) : Promise.resolve(null),
    procurementEnabled ? listPurchaseRequests(tenantId) : Promise.resolve([]),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
    getTenantCapabilitySnapshot(tenantId),
    reportsEnabled
      ? getReportsKpiSummary(tenantId, moduleKeys)
      : Promise.resolve({
          pipelineSar: 0,
          lowStockCount: 0,
          openArSar: 0,
          activeWorkflows: 0,
          openTasks: 0,
          warehouseLocations: 0,
          salesCount: 0,
          inventorySkus: 0,
          financeEntries: 0,
        }),
  ]);

  const procurementWithoutFinanceLink = purchaseRequests.filter(
    (pr) => !pr.linkedFinanceRef
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(workflows, tasks);
  const financeRelatedOpenTasks = matched.reduce((n, w) => n + w.openTaskCount, 0);

  const partial: Omit<
    FinanceOperationsReadinessSnapshot,
    "recommendedActions" | "readinessLevel" | "readinessLabel" | "readinessDetail"
  > = {
    sectorKey,
    moduleKeys,
    financeEnabled,
    salesEnabled,
    procurementEnabled,
    reportsEnabled,
    financeEntryCount: financeSummary?.total ?? financeEntries.length,
    arOpenSar: financeSummary?.arOpenSar ?? 0,
    apOpenSar: financeSummary?.apOpenSar ?? 0,
    salesOpportunityCount: salesSummary?.total ?? 0,
    salesPipelineSar: salesSummary?.pipelineSar ?? 0,
    salesWonSar: salesSummary?.wonSar ?? 0,
    procurementRequestCount: procurementSummary?.total ?? 0,
    procurementOpenCount: (procurementSummary?.draft ?? 0) + (procurementSummary?.submitted ?? 0),
    procurementAmountSar: procurementSummary?.totalAmountSar ?? 0,
    procurementWithoutFinanceLink,
    openTaskCount: workspace.openTaskCount,
    financeRelatedOpenTasks,
    activeWorkflowCount: workspace.workflowCount,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    planDisplayName: planSnapshot?.planDisplayName ?? null,
    planKeyMismatch: planSnapshot?.planKeyMismatch ?? false,
    billingCheckoutConfigured: isStripeConfigured(),
    cybercrowInitialized: workspace.cybercrowInitialized,
    reportsFinanceEntries: reportsKpis.financeEntries,
  };

  const { readinessLevel, readinessLabel, readinessDetail } = deriveReadiness({
    financeEntryCount: partial.financeEntryCount,
    salesOpportunityCount: partial.salesOpportunityCount,
    procurementRequestCount: partial.procurementRequestCount,
    matchedWorkflowCount: partial.matchedWorkflows.length,
  });

  return {
    ...partial,
    readinessLevel,
    readinessLabel,
    readinessDetail,
    recommendedActions: buildRecommendedActions(partial),
  };
}
