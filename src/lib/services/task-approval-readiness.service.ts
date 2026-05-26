import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  MODULE_TASK_APPROVAL_MAP,
  TASK_APPROVAL_ENGINE_WORKFLOW_KEYWORDS,
  TASK_APPROVAL_RECOMMENDED_WORKFLOWS,
  type ModuleTaskApprovalMap,
  type TaskApprovalRecommendedWorkflow,
  type TaskApprovalWorkflowReadinessStatus,
} from "@/lib/constants/task-approval-engine-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import {
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";

export type TaskApprovalMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type TaskApprovalReadinessLevel = "needs_structure" | "building" | "operational";

export type TaskApprovalEngineReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  enabledModuleKeys: string[];
  moduleApprovalMap: ModuleTaskApprovalMap[];
  matchedWorkflows: TaskApprovalMatchedWorkflow[];
  workflowReadiness: TaskApprovalRecommendedWorkflow[];
  taskCount: number;
  openTaskCount: number;
  completedTaskCount: number;
  unassignedTaskCount: number;
  tasksWithoutWorkflow: number;
  workflowCount: number;
  workflowsWithTasks: number;
  workflowsWithoutTasks: number;
  activeWorkflowCount: number;
  tasksByStatus: Record<string, number>;
  cybercrowInitialized: boolean;
  readinessLevel: TaskApprovalReadinessLevel;
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
  recommended: readonly TaskApprovalRecommendedWorkflow[]
): {
  matched: TaskApprovalMatchedWorkflow[];
  readiness: TaskApprovalRecommendedWorkflow[];
} {
  const matchedById = new Map<string, TaskApprovalMatchedWorkflow>();

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
    let status: TaskApprovalWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveTaskApprovalReadiness(input: {
  taskCount: number;
  workflowCount: number;
  workflowsWithTasks: number;
  workflowsWithoutTasks: number;
  unassignedTaskCount: number;
  tasksWithoutWorkflow: number;
  openTaskCount: number;
  matchedWorkflowCount: number;
  enabledModuleCount: number;
}): {
  level: TaskApprovalReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];

  if (input.taskCount === 0) {
    actions.push(
      "Seed tasks from discovery go-live or ops seeding — tasks coordinate cross-module reviews."
    );
  }
  if (input.workflowCount === 0) {
    actions.push("Define workflows on the Workflows page — templates link to tasks and evidence.");
  }
  if (input.workflowsWithoutTasks > 0 && input.workflowCount > 0) {
    actions.push(
      `${input.workflowsWithoutTasks} workflow(s) have no linked tasks — add coordination tasks per module hub guidance.`
    );
  }
  if (input.unassignedTaskCount > 0) {
    actions.push(
      `Assign ${input.unassignedTaskCount} unassigned task(s) on Users and Tasks boards.`
    );
  }
  if (input.tasksWithoutWorkflow > 0) {
    actions.push(
      `${input.tasksWithoutWorkflow} task(s) lack workflow linkage — align with Workflows definitions.`
    );
  }
  if (input.matchedWorkflowCount === 0 && input.workflowCount > 0) {
    actions.push("Add approval/review workflows matching module hubs (HR, Finance, Procurement, etc.).");
  }
  if (input.enabledModuleCount >= 3 && input.openTaskCount === 0 && input.taskCount > 0) {
    actions.push("Review completed tasks for evidence trails in CyberCrow when initialized.");
  }

  if (
    input.taskCount >= 5 &&
    input.workflowCount >= 2 &&
    input.workflowsWithTasks >= 1 &&
    input.unassignedTaskCount === 0 &&
    input.matchedWorkflowCount >= 1
  ) {
    return {
      level: "operational",
      label: "Operational task coordination",
      detail:
        "Tasks and workflows support cross-module review readiness — operator-guided, not autonomous BPM or RPA.",
      actions,
    };
  }
  if (input.taskCount >= 1 || input.workflowCount >= 1) {
    return {
      level: "building",
      label: "Building task & approval readiness",
      detail:
        "Some task/workflow structure exists — strengthen linkage, assignees, and module-specific approval paths.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs task engine structure",
    detail:
      "Task and approval readiness mode — use Tasks and Workflows for coordination; no external workflow engine in this phase.",
    actions,
  };
}

export async function getTaskApprovalEngineReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined
): Promise<TaskApprovalEngineReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const erpKeys = new Set(
    enabledModuleKeys.filter((k) =>
      MODULE_TASK_APPROVAL_MAP.some((m) => m.moduleKey === k)
    )
  );

  const moduleApprovalMap = MODULE_TASK_APPROVAL_MAP.filter((m) =>
    erpKeys.has(m.moduleKey)
  );

  const [ops, workflows, tasks] = await Promise.all([
    getCemOperationsSnapshot(tenantId),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
  ]);

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    TASK_APPROVAL_ENGINE_WORKFLOW_KEYWORDS,
    TASK_APPROVAL_RECOMMENDED_WORKFLOWS
  );

  const completedTaskCount =
    (ops.tasksByStatus.completed ?? 0) + (ops.tasksByStatus.done ?? 0);

  const derived = deriveTaskApprovalReadiness({
    taskCount: ops.taskCount,
    workflowCount: ops.workflowCount,
    workflowsWithTasks: ops.workflowsWithTasks,
    workflowsWithoutTasks: ops.workflowsWithoutTasks,
    unassignedTaskCount: ops.unassignedTaskCount,
    tasksWithoutWorkflow: ops.tasksWithoutWorkflow,
    openTaskCount: ops.openTaskCount,
    matchedWorkflowCount: matched.length,
    enabledModuleCount: moduleApprovalMap.length,
  });

  return {
    sectorKey,
    enabledModuleKeys,
    moduleApprovalMap,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    taskCount: ops.taskCount,
    openTaskCount: ops.openTaskCount,
    completedTaskCount,
    unassignedTaskCount: ops.unassignedTaskCount,
    tasksWithoutWorkflow: ops.tasksWithoutWorkflow,
    workflowCount: ops.workflowCount,
    workflowsWithTasks: ops.workflowsWithTasks,
    workflowsWithoutTasks: ops.workflowsWithoutTasks,
    activeWorkflowCount: ops.activeWorkflowCount,
    tasksByStatus: ops.tasksByStatus,
    cybercrowInitialized: ops.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}
