import {
  EXECUTIVE_ROLLUP_CATEGORIES,
  REPORTS_BI_RECOMMENDED_WORKFLOWS,
  type ExecutiveRollupCategoryId,
  type ExecutiveRollupStatus,
  type ReportsBiRecommendedWorkflow,
} from "@/lib/constants/reports-bi-readiness-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import {
  getCrmCommercialReadinessSnapshot,
  getSalesCommercialReadinessSnapshot,
} from "@/lib/services/crm-sales-readiness.service";
import { getFinanceOperationsReadinessSnapshot } from "@/lib/services/finance-readiness.service";
import { getHrWorkforceReadinessSnapshot } from "@/lib/services/hr-readiness.service";
import {
  getInventoryOperationsReadinessSnapshot,
  getWarehouseOperationsReadinessSnapshot,
} from "@/lib/services/inventory-warehouse-readiness.service";
import { getLogisticsOperationsReadinessSnapshot } from "@/lib/services/logistics-readiness.service";
import { getProcurementOperationsReadinessSnapshot } from "@/lib/services/procurement-readiness.service";
import { getReportsKpiSummary, type ReportsKpiSummary } from "@/lib/services/reports.service";
import { getTenantSareaHealthDetail } from "@/lib/services/sarea-studio.service";
import { getTaskApprovalEngineReadinessSnapshot } from "@/lib/services/task-approval-readiness.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";

type ModuleReadinessLevel = "needs_structure" | "building" | "operational";

export type ExecutiveRollupItem = {
  id: ExecutiveRollupCategoryId;
  title: string;
  status: ExecutiveRollupStatus;
  explanation: string;
  routeKey: string;
  nextAction: string;
  moduleKeys: string[];
};

export type ReportsBiReadinessLevel = "needs_structure" | "building" | "operational";

export type ReportsBiReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  enabledModuleKeys: string[];
  kpis: ReportsKpiSummary;
  executiveRollup: ExecutiveRollupItem[];
  reportWorkflowReadiness: ReportsBiRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  cybercrowSummary: string;
  sareaAdvisory: string;
  sareaBackedPersonas: number;
  sareaTotalPersonas: number;
  sareaNextActions: string[];
  cemOpsReadinessLabel: string;
  cemOpsReadinessDetail: string;
  readinessLevel: ReportsBiReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

function hasModule(keys: string[], key: string): boolean {
  return keys.includes(key);
}

function hasAnyModule(keys: string[], targets: readonly string[]): boolean {
  return targets.some((t) => keys.includes(t));
}

function levelToRollupStatus(
  level: ModuleReadinessLevel | undefined,
  enabled: boolean
): ExecutiveRollupStatus {
  if (!enabled) return "not_enabled";
  if (!level) return "limited_data";
  if (level === "operational") return "healthy";
  if (level === "building") return "needs_review";
  return "limited_data";
}

function worseLevel(a: ModuleReadinessLevel, b: ModuleReadinessLevel): ModuleReadinessLevel {
  const rank: Record<ModuleReadinessLevel, number> = {
    needs_structure: 0,
    building: 1,
    operational: 2,
  };
  return rank[a] <= rank[b] ? a : b;
}

function combineLevels(
  levels: (ModuleReadinessLevel | undefined)[],
  enabled: boolean
): ExecutiveRollupStatus {
  if (!enabled) return "not_enabled";
  const defined = levels.filter(Boolean) as ModuleReadinessLevel[];
  if (defined.length === 0) return "limited_data";
  let combined = defined[0]!;
  for (let i = 1; i < defined.length; i++) {
    combined = worseLevel(combined, defined[i]!);
  }
  return levelToRollupStatus(combined, true);
}

function sareaAdvisoryToRollup(advisory: string, total: number): ExecutiveRollupStatus {
  if (total === 0) return "limited_data";
  if (advisory === "healthy") return "healthy";
  if (advisory === "fallback_only") return "limited_data";
  return "needs_review";
}

function cybercrowRollupStatus(initialized: boolean, cemLabel: string): ExecutiveRollupStatus {
  if (!initialized) return "limited_data";
  if (cemLabel.toLowerCase().includes("operational")) return "healthy";
  if (cemLabel.toLowerCase().includes("building")) return "needs_review";
  return "limited_data";
}

function buildCybercrowSummary(initialized: boolean): string {
  if (!initialized) {
    return "CyberCrow not initialized — evidence and GRC reporting context is limited to advisory placeholders.";
  }
  return "CyberCrow initialized — evidence packs, GRC readiness, and operator-reviewed risk signals available from the security hub.";
}

function buildRecommendedActions(input: {
  rollup: ExecutiveRollupItem[];
  kpis: ReportsKpiSummary;
  cybercrowInitialized: boolean;
  sareaAdvisory: string;
}): string[] {
  const actions: string[] = [];
  const needsReview = input.rollup.filter((r) => r.status === "needs_review");
  const limited = input.rollup.filter((r) => r.status === "limited_data");

  if (needsReview.length > 0) {
    actions.push(
      `Review executive roll-up domains flagged for attention: ${needsReview.map((r) => r.title).join(", ")}.`
    );
  }
  if (limited.length > 0 && !input.cybercrowInitialized) {
    actions.push("Initialize CyberCrow to unlock security and evidence reporting context in roll-ups.");
  }
  if (input.kpis.openTasks > 0) {
    actions.push(`Clear or assign ${input.kpis.openTasks} open tasks before monthly executive review.`);
  }
  if (input.sareaAdvisory === "missing_mapping" || input.sareaAdvisory === "fallback_only") {
    actions.push("Align SAREA role mapping and persona materialization before executive experience review.");
  }
  if (actions.length === 0) {
    actions.push("Run a monthly executive readiness review using module hubs and this roll-up — advisory only.");
  }
  return actions.slice(0, 6);
}

function deriveOverallReadiness(rollup: ExecutiveRollupItem[]): {
  readinessLevel: ReportsBiReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
} {
  const enabled = rollup.filter((r) => r.status !== "not_enabled");
  const healthy = enabled.filter((r) => r.status === "healthy").length;
  const needsReview = enabled.filter((r) => r.status === "needs_review").length;
  const limited = enabled.filter((r) => r.status === "limited_data").length;

  if (enabled.length === 0) {
    return {
      readinessLevel: "needs_structure",
      readinessLabel: "No roll-up domains enabled",
      readinessDetail: "Enable ERP modules and seed tenant data to unlock cross-module reporting readiness.",
    };
  }
  if (healthy >= Math.max(3, Math.ceil(enabled.length * 0.6)) && needsReview === 0) {
    return {
      readinessLevel: "operational",
      readinessLabel: "Executive visibility operational",
      readinessDetail: `${healthy}/${enabled.length} roll-up domains show healthy advisory readiness.`,
    };
  }
  if (needsReview > 0 || limited > healthy) {
    return {
      readinessLevel: "building",
      readinessLabel: "Executive visibility building",
      readinessDetail: `${needsReview} domain(s) need review · ${limited} with limited data — operator-guided roll-up only.`,
    };
  }
  return {
    readinessLevel: "needs_structure",
    readinessLabel: "Reporting structure needed",
    readinessDetail: "Expand module depth and seed data before relying on executive roll-ups.",
  };
}

/**
 * Cross-module reporting readiness snapshot for the Reports / BI hub.
 */
export async function getReportsBiReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry?: string | null
): Promise<ReportsBiReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });

  const [
    kpis,
    cemOps,
    workspace,
    sarea,
    hrSnap,
    financeSnap,
    crmSnap,
    salesSnap,
    procurementSnap,
    inventorySnap,
    warehouseSnap,
    logisticsSnap,
    tasksSnap,
  ] = await Promise.all([
    getReportsKpiSummary(tenantId, enabledModuleKeys),
    getCemOperationsSnapshot(tenantId),
    safeWorkspaceSummary(tenantId),
    getTenantSareaHealthDetail(tenantId),
    hasModule(enabledModuleKeys, "hr")
      ? getHrWorkforceReadinessSnapshot(tenantId, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "finance")
      ? getFinanceOperationsReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "crm")
      ? getCrmCommercialReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "sales")
      ? getSalesCommercialReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "procurement")
      ? getProcurementOperationsReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "inventory")
      ? getInventoryOperationsReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "warehouse")
      ? getWarehouseOperationsReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasModule(enabledModuleKeys, "logistics")
      ? getLogisticsOperationsReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
    hasAnyModule(enabledModuleKeys, ["tasks", "workflows"])
      ? getTaskApprovalEngineReadinessSnapshot(tenantId, enabledModuleKeys, industry)
      : Promise.resolve(null),
  ]);

  const levelByCategory: Partial<Record<ExecutiveRollupCategoryId, ExecutiveRollupStatus>> = {
    people_hr: levelToRollupStatus(hrSnap?.readinessLevel, hasModule(enabledModuleKeys, "hr")),
    commercial: combineLevels(
      [crmSnap?.readinessLevel, salesSnap?.readinessLevel],
      hasAnyModule(enabledModuleKeys, ["crm", "sales"])
    ),
    finance: levelToRollupStatus(
      financeSnap?.readinessLevel,
      hasModule(enabledModuleKeys, "finance")
    ),
    procurement: levelToRollupStatus(
      procurementSnap?.readinessLevel,
      hasModule(enabledModuleKeys, "procurement")
    ),
    supply_chain: combineLevels(
      [inventorySnap?.readinessLevel, warehouseSnap?.readinessLevel],
      hasAnyModule(enabledModuleKeys, ["inventory", "warehouse"])
    ),
    logistics: levelToRollupStatus(
      logisticsSnap?.readinessLevel,
      hasModule(enabledModuleKeys, "logistics")
    ),
    tasks_approvals: levelToRollupStatus(
      tasksSnap?.readinessLevel,
      hasAnyModule(enabledModuleKeys, ["tasks", "workflows"])
    ),
    cybercrow: cybercrowRollupStatus(workspace.cybercrowInitialized, cemOps.readinessLabel),
    sarea: sareaAdvisoryToRollup(sarea.advisory, sarea.totalPersonas),
  };

  const detailByCategory: Partial<Record<ExecutiveRollupCategoryId, string>> = {
    people_hr: hrSnap?.readinessDetail ?? "Enable HR module for workforce roll-up.",
    commercial:
      crmSnap?.readinessDetail ??
      salesSnap?.readinessDetail ??
      "Enable CRM or Sales for commercial roll-up.",
    finance: financeSnap?.readinessDetail ?? "Enable Finance for commercial ledger signals.",
    procurement: procurementSnap?.readinessDetail ?? "Enable Procurement for supply spend roll-up.",
    supply_chain:
      inventorySnap?.readinessDetail ??
      warehouseSnap?.readinessDetail ??
      "Enable Inventory or Warehouse for supply chain roll-up.",
    logistics: logisticsSnap?.readinessDetail ?? "Enable Logistics for dispatch roll-up.",
    tasks_approvals: tasksSnap?.readinessDetail ?? "Enable Tasks or Workflows for coordination roll-up.",
    cybercrow: buildCybercrowSummary(workspace.cybercrowInitialized),
    sarea:
      sarea.totalPersonas > 0
        ? `${sarea.backedPersonas}/${sarea.totalPersonas} tenant-backed personas · advisory ${sarea.advisory}`
        : "SAREA personas not materialized for this tenant.",
  };

  const nextActionByCategory: Partial<Record<ExecutiveRollupCategoryId, string>> = {
    people_hr: hrSnap?.recommendedActions[0] ?? "Open HR hub to review workforce readiness.",
    commercial:
      crmSnap?.recommendedActions[0] ??
      salesSnap?.recommendedActions[0] ??
      "Open CRM or Sales hub for pipeline context.",
    finance: financeSnap?.recommendedActions[0] ?? "Open Finance hub for AR/AP signals.",
    procurement: procurementSnap?.recommendedActions[0] ?? "Open Procurement hub for supplier context.",
    supply_chain:
      inventorySnap?.recommendedActions[0] ??
      warehouseSnap?.recommendedActions[0] ??
      "Open Inventory or Warehouse hub.",
    logistics: logisticsSnap?.recommendedActions[0] ?? "Open Logistics hub for dispatch context.",
    tasks_approvals: tasksSnap?.recommendedActions[0] ?? "Open Tasks hub for open work queue.",
    cybercrow: workspace.cybercrowInitialized
      ? "Review evidence packs and GRC readiness in CyberCrow."
      : "Initialize CyberCrow from the security hub.",
    sarea: sarea.nextActions[0] ?? "Review SAREA profiles and role mapping.",
  };

  const executiveRollup: ExecutiveRollupItem[] = EXECUTIVE_ROLLUP_CATEGORIES.map((cat) => ({
    id: cat.id,
    title: cat.title,
    status: levelByCategory[cat.id] ?? "not_enabled",
    explanation: detailByCategory[cat.id] ?? "Not in scope for this tenant.",
    routeKey: cat.routeKey,
    nextAction: nextActionByCategory[cat.id] ?? "Enable related modules.",
    moduleKeys: [...cat.moduleKeys],
  }));

  const reportWorkflowReadiness = REPORTS_BI_RECOMMENDED_WORKFLOWS.map((w) => ({ ...w }));

  const { readinessLevel, readinessLabel, readinessDetail } = deriveOverallReadiness(executiveRollup);

  return {
    sectorKey,
    enabledModuleKeys,
    kpis,
    executiveRollup,
    reportWorkflowReadiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    cybercrowSummary: buildCybercrowSummary(workspace.cybercrowInitialized),
    sareaAdvisory: sarea.advisory,
    sareaBackedPersonas: sarea.backedPersonas,
    sareaTotalPersonas: sarea.totalPersonas,
    sareaNextActions: sarea.nextActions,
    cemOpsReadinessLabel: cemOps.readinessLabel,
    cemOpsReadinessDetail: cemOps.readinessDetail,
    readinessLevel,
    readinessLabel,
    readinessDetail,
    recommendedActions: buildRecommendedActions({
      rollup: executiveRollup,
      kpis,
      cybercrowInitialized: workspace.cybercrowInitialized,
      sareaAdvisory: sarea.advisory,
    }),
  };
}
