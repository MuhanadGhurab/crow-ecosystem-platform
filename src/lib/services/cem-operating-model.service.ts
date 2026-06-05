import "server-only";

import {
  CEM_CORE_OPERATING_FLOWS,
} from "@/lib/constants/cem-core-operating-flows";
import {
  CEM_OPERATING_MODEL_DISCLAIMERS,
  CEM_OPERATING_MODEL_RELATIONSHIP_COPY,
  type CemModuleRoleAssignment,
  type CemOperatingFlow,
  type CemOperatingFlowReadiness,
  type CemOperatingModelSnapshot,
  type CemOperatingModelStatus,
  type CemOperationalLink,
} from "@/lib/cem/cem-operating-model-contract";
import { moduleLabel } from "@/lib/catalog-labels";
import { ERP_MODULE_KEYS, hasErpModule } from "@/lib/constants/erp-module-registry";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { buildCyberCrowTenantTrustSnapshotForTenantId } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceMappingSnapshotForTenantId } from "@/lib/services/sarea-experience-mapping.service";
import { getTenantById } from "@/lib/services/tenant.service";

const MODULE_ROLE_MAP: Record<
  string,
  CemModuleRoleAssignment["roles"]
> = {
  hr: ["system_of_record", "workflow_source", "task_source", "reporting_source"],
  finance: ["system_of_record", "approval_source", "reporting_source"],
  procurement: ["workflow_source", "task_source", "approval_source"],
  logistics: ["system_of_record", "workflow_source", "reporting_source"],
  inventory: ["system_of_record", "reporting_source", "supporting_module"],
  warehouse: ["system_of_record", "task_source", "reporting_source"],
  crm: ["system_of_record", "workflow_source", "reporting_source"],
  sales: ["system_of_record", "workflow_source", "reporting_source"],
  bi: ["reporting_source"],
  approvals: ["task_source", "approval_source"],
};

function classifyModuleReadiness(
  enabled: boolean,
  dataBacked: boolean
): CemModuleRoleAssignment["readiness"] {
  if (!enabled) return "not_enabled";
  if (dataBacked) return "tenant_backed";
  return "thin";
}

function flowReadiness(
  flowModules: string[],
  enabledKeys: Set<string>,
  ops: {
    taskCount: number;
    workflowCount: number;
    profileCount: number;
    departmentCount: number;
  }
): CemOperatingFlowReadiness {
  const moduleHits = flowModules.filter((m) => {
    if (m === "users" || m === "roles" || m === "workflows" || m === "tasks" || m === "reports") {
      return true;
    }
    return enabledKeys.has(m) || enabledKeys.has(m === "reports" ? "bi" : m);
  }).length;
  const ratio = moduleHits / Math.max(flowModules.length, 1);

  if (ratio >= 0.8 && ops.taskCount > 0 && ops.workflowCount > 0) return "mapped";
  if (ratio >= 0.5 && (ops.taskCount > 0 || ops.workflowCount > 0)) return "partial";
  if (ops.profileCount > 0 || ops.departmentCount > 0) return "advisory";
  return "missing_data";
}

function deriveStatus(input: {
  spineScore: number;
  linkStrong: number;
  linkMissing: number;
  moduleCount: number;
}): CemOperatingModelStatus {
  if (input.moduleCount === 0) return "not_started";
  if (input.spineScore < 2) return "needs_data";
  if (input.linkMissing > input.linkStrong && input.spineScore < 4) return "needs_review";
  if (input.spineScore >= 5 && input.linkStrong >= 3) return "operational_spine_ready";
  if (input.spineScore >= 3) return "partially_connected";
  return "model_detected";
}

function buildLinks(
  slug: string,
  ops: Awaited<ReturnType<typeof getCemOperationsSnapshot>>,
  enabledModuleKeys: string[]
): CemOperationalLink[] {
  const links: CemOperationalLink[] = [];
  const r = routes.tenant(slug);

  for (const wf of ops.workflows.slice(0, 8)) {
    const strength =
      wf.taskCount > 0 ? "strong" : wf.stepCount > 0 ? "partial" : "inferred";
    links.push({
      fromType: "workflow",
      fromId: wf.id,
      fromLabel: wf.name,
      toType: "task",
      toId: wf.id,
      toLabel: `${wf.taskCount} tasks`,
      relationship: "generates_tasks",
      strength,
    });
  }

  if (ops.taskCount > 0) {
    links.push({
      fromType: "task",
      fromId: "tasks",
      fromLabel: `${ops.taskCount} tasks`,
      toType: "report",
      toId: "reports",
      toLabel: "Reports / BI",
      relationship: "feeds_reporting",
      strength: ops.openTaskCount > 0 ? "partial" : "inferred",
    });
  }

  if (ops.departmentCount > 0 && ops.roleCount > 0) {
    links.push({
      fromType: "department",
      fromId: "departments",
      fromLabel: `${ops.departmentCount} departments`,
      toType: "role",
      toId: "roles",
      toLabel: `${ops.roleCount} roles`,
      relationship: "org_structure",
      strength: ops.departmentsWithProfiles > 0 ? "strong" : "partial",
    });
  }

  if (ops.profileCount > 0) {
    links.push({
      fromType: "user",
      fromId: "users",
      fromLabel: `${ops.profileCount} users`,
      toType: "task",
      toId: "task_assignments",
      toLabel: "Task ownership",
      relationship: "owns_tasks",
      strength: ops.unassignedTaskCount === 0 && ops.taskCount > 0 ? "strong" : "partial",
    });
  }

  for (const key of enabledModuleKeys.slice(0, 6)) {
    links.push({
      fromType: "module",
      fromId: key,
      fromLabel: moduleLabel(key),
      toType: "workflow",
      toId: "workflows",
      toLabel: r.workflows,
      relationship: "contributes_operational_data",
      strength: ops.workflowCount > 0 ? "inferred" : "missing",
    });
  }

  if (ops.tasksWithoutWorkflow > 0 && ops.taskCount > 0) {
    links.push({
      fromType: "task",
      fromId: "orphan_tasks",
      fromLabel: `${ops.tasksWithoutWorkflow} without workflow`,
      toType: "workflow",
      toId: "missing",
      toLabel: "Workflow source",
      relationship: "missing_workflow_link",
      strength: "missing",
    });
  }

  return links;
}

function buildModuleRoles(
  tenantModules: { moduleKey: string; enabled?: boolean }[],
  ops: Awaited<ReturnType<typeof getCemOperationsSnapshot>>
): CemModuleRoleAssignment[] {
  const enabledSet = new Set(
    tenantModules.filter((m) => m.enabled !== false).map((m) => m.moduleKey)
  );

  const erpKeys = ERP_MODULE_KEYS.map((k) => {
    const def = k === "reports" ? "bi" : k === "tasks" ? "approvals" : k;
    return { erpKey: k, cemKey: def };
  });

  return erpKeys.map(({ erpKey, cemKey }) => {
    const enabled = enabledSet.has(cemKey) || (erpKey === "tasks" && ops.taskCount > 0);
    let dataBacked = false;
    if (erpKey === "hr") dataBacked = ops.profileCount > 0;
    if (["finance", "sales", "inventory", "warehouse", "logistics", "procurement", "crm"].includes(erpKey)) {
      dataBacked = enabled && hasErpModule(tenantModules, cemKey);
    }
    if (erpKey === "tasks") dataBacked = ops.taskCount > 0;
    if (erpKey === "reports") dataBacked = enabled && ops.taskCount + ops.workflowCount > 0;

    return {
      moduleKey: cemKey,
      moduleLabel: moduleLabel(cemKey),
      roles: MODULE_ROLE_MAP[cemKey] ?? ["supporting_module"],
      enabled,
      dataBacked,
      readiness: classifyModuleReadiness(enabled, dataBacked),
    };
  });
}

export async function buildCemOperatingModelSnapshotForTenantId(
  tenantId: string
): Promise<CemOperatingModelSnapshot | null> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return null;

  const slug = tenant.slug;
  const enabledModules = tenant.modules.filter((m) => m.enabled !== false);
  const enabledKeys = new Set(enabledModules.map((m) => m.moduleKey));

  const [cemOps, cybercrowTrust, sareaMapping] = await Promise.all([
    getCemOperationsSnapshot(tenantId),
    buildCyberCrowTenantTrustSnapshotForTenantId(tenantId).catch(() => null),
    buildSareaExperienceMappingSnapshotForTenantId(tenantId).catch(() => null),
  ]);

  const taskSample = await prisma.task.findMany({
    where: { tenantId },
    take: 5,
    select: { title: true, workflow: { select: { name: true } } },
  });

  const flows: CemOperatingFlow[] = CEM_CORE_OPERATING_FLOWS.map((flow) => ({
    ...flow,
    readiness: flowReadiness(flow.modulesInvolved, enabledKeys, {
      taskCount: cemOps.taskCount,
      workflowCount: cemOps.workflowCount,
      profileCount: cemOps.profileCount,
      departmentCount: cemOps.departmentCount,
    }),
    taskExamples:
      flow.key === "task_workflow_execution" && taskSample.length > 0
        ? taskSample.map((t) => t.title).slice(0, 3)
        : flow.taskExamples,
    workflowKeys:
      flow.key === "task_workflow_execution" && cemOps.workflows.length > 0
        ? cemOps.workflows.slice(0, 3).map((w) => w.name)
        : flow.workflowKeys,
  }));

  const links = buildLinks(
    slug,
    cemOps,
    enabledModules.map((m) => m.moduleKey)
  );

  const moduleRoles = buildModuleRoles(tenant.modules, cemOps);

  const spineScore = [
    cemOps.departmentCount > 0,
    cemOps.roleCount > 0,
    cemOps.profileCount > 0,
    enabledModules.length > 0,
    cemOps.workflowCount > 0,
    cemOps.taskCount > 0,
  ].filter(Boolean).length;

  const linkStrong = links.filter((l) => l.strength === "strong").length;
  const linkMissing = links.filter((l) => l.strength === "missing").length;

  const status = deriveStatus({
    spineScore,
    linkStrong,
    linkMissing,
    moduleCount: enabledModules.length,
  });

  const blockers: string[] = [];
  const warnings: string[] = [];
  const recommendedActions: string[] = [];

  if (enabledModules.length === 0) {
    blockers.push("No enabled modules — operating model cannot connect.");
  }
  if (cemOps.departmentCount === 0) {
    warnings.push("No departments — department ownership links are thin.");
    recommendedActions.push("Add departments and assign profiles.");
  }
  if (cemOps.roleCount === 0) {
    warnings.push("No roles — role-based task ownership is incomplete.");
    recommendedActions.push("Define roles and assign users.");
  }
  if (cemOps.workflowCount === 0) {
    warnings.push("No workflows — task/workflow spine is advisory only.");
    recommendedActions.push("Create workflow templates linked to modules.");
  }
  if (cemOps.tasksWithoutWorkflow > 0) {
    warnings.push(`${cemOps.tasksWithoutWorkflow} tasks lack workflow source.`);
  }
  if (!cemOps.cybercrowInitialized) {
    warnings.push("CyberCrow not initialized — trust/evidence hooks are limited.");
    recommendedActions.push("Initialize CyberCrow for audit context on operational actions.");
  }
  if (
    sareaMapping &&
    sareaMapping.status !== "mapping_ready" &&
    sareaMapping.status !== "ready_for_go_no_go"
  ) {
    warnings.push("SAREA experience mapping incomplete — role views may use fallbacks.");
  }

  const reportOutputs = [
    "Open task aging",
    "Workflow throughput",
    ...(enabledKeys.has("bi") || enabledKeys.has("reports")
      ? ["Executive KPI roll-up"]
      : ["Enable BI/reports module for KPI roll-up"]),
    ...(enabledKeys.has("sales") ? ["Pipeline summary"] : []),
    ...(enabledKeys.has("finance") ? ["Spend / AR advisory"] : []),
  ];

  const cyberCrowObservability = [
    cemOps.cybercrowInitialized
      ? "Audit log context available for workflow actions"
      : "CyberCrow staging not initialized — evidence hooks advisory",
    cybercrowTrust
      ? `Trust readiness: ${cybercrowTrust.trustStatus.replace(/_/g, " ")}`
      : "Tenant trust snapshot unavailable",
    "Access review ties users/roles/departments to trust posture",
    "Does not certify compliance or replace SIEM",
  ];

  const sareaExperienceHooks = [
    "Each role receives relevant module/task/report views via SAREA mapping",
    sareaMapping
      ? `Experience mapping: ${sareaMapping.status.replace(/_/g, " ")}`
      : "SAREA mapping not evaluated",
    "Dashboard/nav/widgets adapt from operating model — RBAC unchanged",
    "SAREA does not grant access or permissions",
  ];

  return {
    tenantSlug: slug,
    tenantName: tenant.organization.displayName,
    status,
    entities: {
      tenant: 1,
      department: cemOps.departmentCount,
      role: cemOps.roleCount,
      user: cemOps.profileCount,
      module: enabledModules.length,
      workflow: cemOps.workflowCount,
      task: cemOps.taskCount,
      report: enabledKeys.has("bi") ? 1 : 0,
      event: cemOps.cybercrowInitialized ? 1 : 0,
    },
    links,
    flows,
    moduleRoles,
    blockers,
    warnings: warnings.slice(0, 8),
    recommendedActions: recommendedActions.slice(0, 6),
    reportOutputs,
    cyberCrowObservability,
    sareaExperienceHooks,
    businessPortalRoute: routes.tenant(slug).dashboard,
    goNoGoDependency:
      "CEM operating model confirms cross-module spine in staging — ProCrow Go/No-Go still required; production remains F23-gated.",
    disclaimers: CEM_OPERATING_MODEL_DISCLAIMERS,
  };
}

export function selectModuleOperatingContext(
  snapshot: CemOperatingModelSnapshot,
  cemModuleKey: string
): {
  relatedFlows: CemOperatingFlow[];
  moduleAssignment: CemModuleRoleAssignment | undefined;
} {
  const flowAliases = new Set([cemModuleKey]);
  if (cemModuleKey === "bi") flowAliases.add("reports");
  if (cemModuleKey === "approvals") flowAliases.add("tasks");

  const relatedFlows = snapshot.flows.filter((f) =>
    f.modulesInvolved.some((m) => flowAliases.has(m))
  );
  const moduleAssignment = snapshot.moduleRoles.find((m) => m.moduleKey === cemModuleKey);
  return { relatedFlows, moduleAssignment };
}

export async function buildCemOperatingModelSnapshotForTenantSlug(
  slug: string
): Promise<CemOperatingModelSnapshot | null> {
  const { getTenantBySlug } = await import("@/lib/services/tenant.service");
  const t = await getTenantBySlug(slug);
  if (!t) return null;
  return buildCemOperatingModelSnapshotForTenantId(t.id);
}
