import "server-only";

import {
  CEM_MODULE_DEPTH_DISCLAIMERS,
  type CemModuleDepthCrossLink,
  type CemModuleDepthKey,
  type CemModuleDepthSnapshot,
  type CemModuleDepthStatus,
  type CemModuleDepthSummaryItem,
  type CemModuleDepthTaskRef,
  type CemModuleDepthWorkflowRef,
  type CemModuleOperationalRecord,
} from "@/lib/cem/cem-module-depth-contract";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { listHrEmployees } from "@/lib/services/hr.service";
import { getHrWorkforceReadinessSnapshot } from "@/lib/services/hr-readiness.service";
import { listFinanceEntries } from "@/lib/services/finance.service";
import { getFinanceOperationsReadinessSnapshot } from "@/lib/services/finance-readiness.service";
import { listPurchaseRequests } from "@/lib/services/procurement.service";
import { getProcurementOperationsReadinessSnapshot } from "@/lib/services/procurement-readiness.service";
import { listInventoryItems } from "@/lib/services/inventory.service";
import {
  getInventoryOperationsReadinessSnapshot,
  getWarehouseOperationsReadinessSnapshot,
} from "@/lib/services/inventory-warehouse-readiness.service";
import { listWarehouseLocations } from "@/lib/services/warehouse.service";
import { getLogisticsOperationsReadinessSnapshot } from "@/lib/services/logistics-readiness.service";
import { listCrmAccounts } from "@/lib/services/crm.service";
import {
  getCrmCommercialReadinessSnapshot,
  getSalesCommercialReadinessSnapshot,
} from "@/lib/services/crm-sales-readiness.service";
import { listSalesOpportunities } from "@/lib/services/sales.service";
import { getReportsBiReadinessSnapshot } from "@/lib/services/reports-bi-readiness.service";
import { getReportsKpiSummary } from "@/lib/services/reports.service";
import {
  buildCemOperatingModelSnapshotForTenantId,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { getTenantById } from "@/lib/services/tenant.service";
import { buildCyberCrowTenantTrustSnapshotForTenantId } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceMappingSnapshotForTenantId } from "@/lib/services/sarea-experience-mapping.service";

const MODULE_PURPOSE: Record<CemModuleDepthKey, string> = {
  hr: "Workforce records, onboarding context, department/role linkage, and access-review readiness — not payroll or legal HRMS.",
  finance:
    "Advisory finance entries, approval checkpoints, and spend visibility linked to procurement and sales — not live payments or accounting engine.",
  procurement:
    "Purchase requests, supplier coordination, and approval handoffs to finance and warehouse — not automated PO issuance or vendor payments.",
  inventory:
    "SKU catalog and stock visibility with receiving/issue links to procurement and sales — not live stock mutation guarantees.",
  warehouse:
    "Receiving, storage lanes, and dispatch readiness tied to inventory and logistics — not a full WMS or barcode platform.",
  logistics:
    "Shipment/dispatch coordination, delivery tasks, and customer dependency — not live TMS, GPS, or carrier integrations.",
  crm: "Customer accounts, relationship context, and follow-up tasks linked to sales — not full case management or marketing automation.",
  sales:
    "Pipeline opportunities and order readiness with inventory, logistics, and finance dependencies — not payment or subscription activation.",
  reports:
    "Executive roll-up and module-fed visibility across tasks, workflows, exceptions, CyberCrow trust, and SAREA experience — advisory BI only.",
};

const MODULE_LABEL: Record<CemModuleDepthKey, string> = {
  hr: "Human Resources",
  finance: "Finance",
  procurement: "Procurement",
  inventory: "Inventory",
  warehouse: "Warehouse",
  logistics: "Logistics",
  crm: "CRM",
  sales: "Sales",
  reports: "Reports",
};

const DEPTH_KEYS: readonly CemModuleDepthKey[] = [
  "hr",
  "finance",
  "procurement",
  "inventory",
  "warehouse",
  "logistics",
  "crm",
  "sales",
  "reports",
];

function cemKeyFromDepthKey(key: CemModuleDepthKey): string {
  if (key === "reports") return "bi";
  return key;
}

function moduleEnabled(
  modules: { moduleKey: string; enabled?: boolean }[],
  depthKey: CemModuleDepthKey
): boolean {
  const cemKey = cemKeyFromDepthKey(depthKey);
  return hasErpModule(modules, cemKey);
}

function deriveStatus(input: {
  enabled: boolean;
  tenantRecordCount: number;
  flowCount: number;
  readinessLevel?: string;
}): CemModuleDepthStatus {
  if (!input.enabled) return "not_available";
  if (input.tenantRecordCount === 0 && input.flowCount === 0) return "needs_data";
  if (input.readinessLevel === "operational" && input.tenantRecordCount > 0) {
    return "operational_model_ready";
  }
  if (input.tenantRecordCount > 0) return "demo_ready";
  if (input.flowCount > 0) return "demo_ready";
  return "thin";
}

function mapWorkflows(
  matched: { id: string; name: string; taskCount?: number }[],
  recommended: { id: string; label: string; status: string }[]
): CemModuleDepthWorkflowRef[] {
  const fromTenant = matched.slice(0, 6).map((w) => ({
    id: w.id,
    label: w.name,
    status: `${w.taskCount ?? 0} tasks`,
    source: "tenant_backed" as const,
  }));
  const advisory = recommended
    .filter((r) => r.status === "recommended")
    .slice(0, 4)
    .map((r) => ({
      id: r.id,
      label: r.label,
      status: r.status,
      source: "advisory" as const,
    }));
  return [...fromTenant, ...advisory].slice(0, 8);
}

function crossLinksFromFlows(
  flows: ReturnType<typeof selectModuleOperatingContext>["relatedFlows"],
  moduleKey: CemModuleDepthKey
): CemModuleDepthCrossLink[] {
  return flows.map((f) => ({
    flowKey: f.key,
    flowLabel: f.label,
    readiness: f.readiness,
    roleInFlow: f.modulesInvolved.includes(cemKeyFromDepthKey(moduleKey))
      ? "participant"
      : "supporting",
  }));
}

async function buildRecords(
  tenantId: string,
  depthKey: CemModuleDepthKey,
  enabled: boolean
): Promise<CemModuleOperationalRecord[]> {
  if (!enabled) return [];

  switch (depthKey) {
    case "hr": {
      const employees = await listHrEmployees(tenantId);
      return employees.slice(0, 8).map((e) => ({
        id: e.id,
        label: e.fullName,
        type: "employee" as const,
        status: e.employmentStatus,
        department: e.department?.name,
        source: "tenant_backed" as const,
      }));
    }
    case "finance": {
      const entries = await listFinanceEntries(tenantId);
      return entries.slice(0, 8).map((e) => ({
        id: e.id,
        label: e.title ?? e.referenceCode ?? e.id,
        type: "invoice" as const,
        status: e.status,
        source: "tenant_backed" as const,
      }));
    }
    case "procurement": {
      const prs = await listPurchaseRequests(tenantId);
      return prs.slice(0, 8).map((p) => ({
        id: p.id,
        label: p.title ?? p.referenceCode ?? p.id,
        type: "purchase_request" as const,
        status: p.status,
        source: "tenant_backed" as const,
      }));
    }
    case "inventory": {
      const items = await listInventoryItems(tenantId);
      return items.slice(0, 8).map((i) => ({
        id: i.id,
        label: i.name ?? i.sku,
        type: "inventory_item" as const,
        status: i.status,
        source: "tenant_backed" as const,
      }));
    }
    case "warehouse": {
      const locations = await listWarehouseLocations(tenantId);
      return locations.slice(0, 8).map((l) => ({
        id: l.id,
        label: l.name,
        type: "warehouse_receipt" as const,
        status: l.movementKind,
        source: "tenant_backed" as const,
      }));
    }
    case "logistics": {
      return [
        {
          id: "dispatch-queue",
          label: "Dispatch queue (advisory)",
          type: "shipment",
          status: "staging",
          relatedWorkflow: "Shipment dispatch approval",
          source: "advisory",
        },
        {
          id: "delivery-tasks",
          label: "Delivery / field tasks",
          type: "task",
          status: "operator-managed",
          source: "inferred",
        },
      ];
    }
    case "crm": {
      const accounts = await listCrmAccounts(tenantId);
      return accounts.slice(0, 8).map((a) => ({
        id: a.id,
        label: a.name,
        type: "customer" as const,
        status: a.status ?? "active",
        source: "tenant_backed" as const,
      }));
    }
    case "sales": {
      const opps = await listSalesOpportunities(tenantId);
      return opps.slice(0, 8).map((o) => ({
        id: o.id,
        label: o.title ?? o.customerName ?? o.id,
        type: "sales_opportunity" as const,
        status: o.status,
        source: "tenant_backed" as const,
      }));
    }
    case "reports": {
      return [
        {
          id: "kpi-roll-up",
          label: "Executive KPI roll-up",
          type: "report",
          status: "advisory",
          source: "inferred",
        },
        {
          id: "task-aging",
          label: "Open task aging",
          type: "report",
          status: "tenant-backed when tasks exist",
          source: "inferred",
        },
      ];
    }
    default:
      return [];
  }
}

export async function buildCemModuleDepthSnapshotForTenantId(
  tenantId: string,
  depthKey: CemModuleDepthKey
): Promise<CemModuleDepthSnapshot | null> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return null;

  const slug = tenant.slug;
  const modules = tenant.modules ?? [];
  const enabled = moduleEnabled(modules, depthKey);
  const cemKey = cemKeyFromDepthKey(depthKey);
  const industry = tenant.organization.industry;
  const moduleKeys = modules.filter((m) => m.enabled !== false).map((m) => m.moduleKey);

  const [operatingModel, cybercrowTrust, sareaMapping, records] = await Promise.all([
    buildCemOperatingModelSnapshotForTenantId(tenantId),
    buildCyberCrowTenantTrustSnapshotForTenantId(tenantId).catch(() => null),
    buildSareaExperienceMappingSnapshotForTenantId(tenantId).catch(() => null),
    buildRecords(tenantId, depthKey, enabled),
  ]);

  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, cemKey)
    : { relatedFlows: [], moduleAssignment: undefined };

  let workflows: CemModuleDepthWorkflowRef[] = [];
  let tasks: CemModuleDepthTaskRef[] = [];
  let departments: string[] = [];
  let roles: string[] = [];
  let reports: string[] = [];
  let nextActions: string[] = [];
  let warnings: string[] = [];
  let blockers: string[] = [];
  let demoLimitations: string[] = [];
  let readinessLevel: string | undefined;

  if (depthKey === "hr") {
    const snap = await getHrWorkforceReadinessSnapshot(tenantId, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    tasks = snap.hrRelatedOpenTasks > 0
      ? [{ id: "hr-open", label: `${snap.hrRelatedOpenTasks} HR-related open tasks`, status: "open", source: "tenant_backed" }]
      : [];
    departments = snap.departmentCount > 0 ? [`${snap.departmentCount} departments`] : [];
    roles = snap.roleCount > 0 ? [`${snap.roleCount} roles`] : [];
    reports = ["Headcount roll-up", "Onboarding completion rate"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["No payroll engine", "No legal HR compliance claims"];
    if (snap.employeeCount === 0) warnings.push("No HR employee records — workforce depth is advisory.");
  } else if (depthKey === "finance") {
    const snap = await getFinanceOperationsReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    reports = ["Spend by department", "AR advisory summary"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["No payment activation", "No accounting/tax engine"];
    if (snap.financeEntryCount === 0) {
      warnings.push("No finance entries — approval story is template-only.");
    }
  } else if (depthKey === "procurement") {
    const snap = await getProcurementOperationsReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    reports = ["Spend by department", "PR status summary"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["No live PO issuance", "No supplier payment processing"];
  } else if (depthKey === "inventory") {
    const snap = await getInventoryOperationsReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    reports = ["Stock receipt summary", "Low-stock advisory"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["No guaranteed stock accuracy", "No automated stock mutation in M3.2"];
  } else if (depthKey === "warehouse") {
    const snap = await getWarehouseOperationsReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    reports = ["Receiving summary", "Dispatch readiness"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["Not a full WMS", "Movements are readiness signals only"];
  } else if (depthKey === "logistics") {
    const snap = await getLogisticsOperationsReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    tasks =
      snap.logisticsRelatedOpenTasks > 0
        ? [
            {
              id: "logistics-open",
              label: `${snap.logisticsRelatedOpenTasks} logistics-related open tasks`,
              status: "open",
              source: "tenant_backed",
            },
          ]
        : [];
    reports = ["Fulfillment SLA advisory", "Shipment status trail"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["No live carrier/TMS integration", "No GPS tracking"];
  } else if (depthKey === "crm") {
    const snap = await getCrmCommercialReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    reports = ["Account coverage", "Customer issue escalation summary"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
  } else if (depthKey === "sales") {
    const snap = await getSalesCommercialReadinessSnapshot(tenantId, moduleKeys, industry);
    workflows = mapWorkflows(snap.matchedWorkflows, snap.workflowReadiness);
    reports = ["Pipeline SAR roll-up", "Quote-to-cash advisory"];
    nextActions = snap.recommendedActions.slice(0, 4);
    readinessLevel = snap.readinessLevel;
    demoLimitations = ["No payment or subscription activation"];
  } else if (depthKey === "reports") {
    const [biSnap, kpis] = await Promise.all([
      getReportsBiReadinessSnapshot(tenantId, moduleKeys, industry),
      getReportsKpiSummary(tenantId, moduleKeys),
    ]);
    workflows = mapWorkflows([], biSnap.reportWorkflowReadiness);
    reports = [
      ...(operatingModel?.reportOutputs ?? []),
      "Module exception summary",
      "CyberCrow trust/evidence roll-up",
      "SAREA role-experience coverage",
    ].slice(0, 8);
    nextActions = biSnap.recommendedActions.slice(0, 4);
    readinessLevel = biSnap.readinessLevel;
    if (kpis.activeWorkflows === 0) warnings.push("Limited workflow throughput data for reports.");
  }

  if (!enabled) {
    blockers.push(`Module ${MODULE_LABEL[depthKey]} is not enabled for this tenant.`);
  }

  const crossModuleLinks = crossLinksFromFlows(moduleCtx.relatedFlows, depthKey);

  const cyberCrowHooks = [
    ...(moduleCtx.relatedFlows.flatMap((f) => f.cyberCrowEvidence).slice(0, 3)),
    cybercrowTrust
      ? `Trust readiness: ${cybercrowTrust.trustStatus.replace(/_/g, " ")}`
      : "CyberCrow trust snapshot unavailable",
    depthKey === "hr" ? "Access review checkpoint for onboarding/offboarding" : "",
    depthKey === "finance" || depthKey === "procurement"
      ? "Financial control evidence posture — not certified audit"
      : "",
  ].filter(Boolean);

  const sareaHooks = [
    ...(moduleCtx.relatedFlows.flatMap((f) => f.sareaExperienceImpact).slice(0, 3)),
    sareaMapping
      ? `Experience mapping: ${sareaMapping.status.replace(/_/g, " ")}`
      : "SAREA mapping not evaluated",
    "Role/persona views adapt from operating model — RBAC unchanged",
  ];

  const status = deriveStatus({
    enabled,
    tenantRecordCount: records.filter((r) => r.source === "tenant_backed").length,
    flowCount: crossModuleLinks.length,
    readinessLevel,
  });

  if (status === "needs_review" || (warnings.length > 2 && status === "demo_ready")) {
    // keep status as derived; add needs_review hint via warnings only
  }

  return {
    tenantSlug: slug,
    tenantName: tenant.organization.displayName,
    moduleKey: depthKey,
    cemModuleKey: cemKey,
    moduleLabel: MODULE_LABEL[depthKey],
    status,
    purpose: MODULE_PURPOSE[depthKey],
    records,
    workflows,
    tasks,
    departments,
    roles,
    reports,
    cyberCrowHooks,
    sareaHooks,
    crossModuleLinks,
    nextActions,
    blockers,
    warnings: warnings.slice(0, 6),
    demoLimitations,
    disclaimers: CEM_MODULE_DEPTH_DISCLAIMERS,
  };
}

export async function buildCemModuleDepthSnapshotForTenantSlug(
  slug: string,
  depthKey: CemModuleDepthKey
): Promise<CemModuleDepthSnapshot | null> {
  const { getTenantBySlug } = await import("@/lib/services/tenant.service");
  const t = await getTenantBySlug(slug);
  if (!t) return null;
  return buildCemModuleDepthSnapshotForTenantId(t.id, depthKey);
}

export async function buildCemModuleDepthSummaryForTenantId(
  tenantId: string
): Promise<CemModuleDepthSummaryItem[]> {
  const snapshots = await Promise.all(
    DEPTH_KEYS.map((key) => buildCemModuleDepthSnapshotForTenantId(tenantId, key))
  );
  return DEPTH_KEYS.map((key, i) => {
    const snap = snapshots[i];
    return {
      moduleKey: key,
      moduleLabel: MODULE_LABEL[key],
      status: snap?.status ?? "not_available",
      recordCount: snap?.records.filter((r) => r.source === "tenant_backed").length ?? 0,
      flowCount: snap?.crossModuleLinks.length ?? 0,
    };
  });
}
