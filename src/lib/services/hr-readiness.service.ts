import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  HR_RECOMMENDED_WORKFLOWS,
  HR_WORKFLOW_MATCH_KEYWORDS,
  type HrRecommendedWorkflow,
  type HrWorkflowReadinessStatus,
} from "@/lib/constants/hr-module-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { listHrEmployees } from "@/lib/services/hr.service";
import {
  listTenantDepartments,
  listTenantProfiles,
  listTenantRoles,
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

export type HrMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type HrWorkforceReadinessLevel = "needs_structure" | "building" | "operational";

export type HrWorkforceReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  employeeCount: number;
  activeEmployeeCount: number;
  employeesWithoutDepartment: number;
  profileCount: number;
  profilesWithoutDepartment: number;
  profilesWithoutRoles: number;
  roleCount: number;
  unassignedRoleCount: number;
  departmentCount: number;
  employeesLinkedToProfiles: number;
  employeesWithoutProfileMatch: number;
  sareaProfileCount: number;
  openTaskCount: number;
  hrRelatedOpenTasks: number;
  matchedWorkflows: HrMatchedWorkflow[];
  workflowReadiness: HrRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: HrWorkforceReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

function matchesHrKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return HR_WORKFLOW_MATCH_KEYWORDS.some((kw) => lower.includes(kw));
}

function mergeWorkflowReadiness(
  workflows: { id: string; name: string; _count: { tasks: number } }[],
  tasks: { workflowId: string | null; status: string; title: string }[]
): {
  matched: HrMatchedWorkflow[];
  readiness: HrRecommendedWorkflow[];
} {
  const matchedById = new Map<string, HrMatchedWorkflow>();

  for (const w of workflows) {
    if (matchesHrKeyword(w.name)) {
      matchedById.set(w.id, {
        id: w.id,
        name: w.name,
        taskCount: w._count.tasks,
        openTaskCount: 0,
      });
    }
  }

  for (const t of tasks) {
    if (matchesHrKeyword(t.title)) {
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

  const readiness = HR_RECOMMENDED_WORKFLOWS.map((rec) => {
    const found = matched.find((m) => matchesHrKeyword(rec.label) || matchesHrKeyword(rec.id));
    let status: HrWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveReadiness(input: {
  profileCount: number;
  roleCount: number;
  departmentCount: number;
  profilesWithoutRoles: number;
  unassignedRoleCount: number;
  employeesWithoutProfileMatch: number;
}): Pick<HrWorkforceReadinessSnapshot, "readinessLevel" | "readinessLabel" | "readinessDetail"> {
  if (input.profileCount === 0 && input.roleCount === 0) {
    return {
      readinessLevel: "needs_structure",
      readinessLabel: "Needs structure",
      readinessDetail:
        "Define roles and invite users before workforce coordination is meaningful.",
    };
  }
  if (
    input.profilesWithoutRoles > 0 ||
    input.unassignedRoleCount > 0 ||
    input.employeesWithoutProfileMatch > 0
  ) {
    return {
      readinessLevel: "building",
      readinessLabel: "Building readiness",
      readinessDetail:
        "Structure exists — close role assignments, department mapping, and HR/profile alignment.",
    };
  }
  return {
    readinessLevel: "operational",
    readinessLabel: "Operational readiness",
    readinessDetail:
      "Core workforce mappings are in place. Continue access reviews and workflow evidence as advisory practice.",
  };
}

function buildRecommendedActions(
  snapshot: Omit<
    HrWorkforceReadinessSnapshot,
    "recommendedActions" | "readinessLevel" | "readinessLabel" | "readinessDetail"
  >
): string[] {
  const actions: string[] = [];
  if (snapshot.profileCount === 0) {
    actions.push("Invite workspace users and assign RBAC roles.");
  }
  if (snapshot.profilesWithoutRoles > 0) {
    actions.push(
      `Assign roles to ${snapshot.profilesWithoutRoles} profile(s) without RBAC coverage.`
    );
  }
  if (snapshot.unassignedRoleCount > 0) {
    actions.push(`Map users to ${snapshot.unassignedRoleCount} unassigned role(s).`);
  }
  if (snapshot.employeesWithoutDepartment > 0) {
    actions.push(
      `Link ${snapshot.employeesWithoutDepartment} HR employee record(s) to departments.`
    );
  }
  if (snapshot.employeesWithoutProfileMatch > 0) {
    actions.push(
      "Align HR employee emails with workspace profiles for onboarding/offboarding traceability."
    );
  }
  if (snapshot.matchedWorkflows.length === 0) {
    actions.push("Add HR-related workflows (onboarding, access review) via discovery or ops seeding.");
  }
  if (!snapshot.cybercrowInitialized) {
    actions.push("Initialize CyberCrow for advisory identity and access evidence.");
  }
  if (snapshot.sareaProfileCount === 0) {
    actions.push("Configure SAREA experience profiles for role-based HR surfaces.");
  }
  if (actions.length === 0) {
    actions.push("Review open HR-related tasks and schedule an access review (advisory).");
  }
  return actions.slice(0, 6);
}

export async function getHrWorkforceReadinessSnapshot(
  tenantId: string,
  industry?: string | null
): Promise<HrWorkforceReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });

  const [employees, profiles, roles, departments, workflows, tasks, summary, ops] =
    await Promise.all([
      listHrEmployees(tenantId),
      listTenantProfiles(tenantId),
      listTenantRoles(tenantId),
      listTenantDepartments(tenantId),
      listTenantWorkflows(tenantId),
      listTenantTasks(tenantId),
      getTenantWorkspaceSummary(tenantId),
      getCemOperationsSnapshot(tenantId),
    ]);

  const profileEmails = new Set(profiles.map((p) => p.email.toLowerCase()));
  const activeEmployeeCount = employees.filter((e) => e.employmentStatus === "active").length;
  const employeesWithoutDepartment = employees.filter((e) => !e.departmentId).length;
  const profilesWithoutDepartment = profiles.filter((p) => !p.departmentId).length;
  const profilesWithoutRoles = profiles.filter((p) => p.userRoles.length === 0).length;
  const employeesLinkedToProfiles = employees.filter((e) =>
    profileEmails.has(e.email.toLowerCase())
  ).length;
  const employeesWithoutProfileMatch = employees.length - employeesLinkedToProfiles;
  const unassignedRoleCount = Math.max(0, roles.length - ops.rolesWithAssignments);

  const { matched, readiness } = mergeWorkflowReadiness(workflows, tasks);
  const hrRelatedOpenTasks = matched.reduce((n, w) => n + w.openTaskCount, 0);

  const partial: Omit<
    HrWorkforceReadinessSnapshot,
    "recommendedActions" | "readinessLevel" | "readinessLabel" | "readinessDetail"
  > = {
    sectorKey,
    employeeCount: employees.length,
    activeEmployeeCount,
    employeesWithoutDepartment,
    profileCount: profiles.length,
    profilesWithoutDepartment,
    profilesWithoutRoles,
    roleCount: roles.length,
    unassignedRoleCount,
    departmentCount: departments.length,
    employeesLinkedToProfiles,
    employeesWithoutProfileMatch,
    sareaProfileCount: summary.sareaProfileCount,
    openTaskCount: summary.openTaskCount,
    hrRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: summary.cybercrowInitialized,
  };

  const { readinessLevel, readinessLabel, readinessDetail } = deriveReadiness(partial);

  return {
    ...partial,
    readinessLevel,
    readinessLabel,
    readinessDetail,
    recommendedActions: buildRecommendedActions(partial),
  };
}
