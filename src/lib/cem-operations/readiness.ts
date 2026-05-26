import type {
  CemOperationalReadinessLevel,
  CemRecommendedAction,
  CemWorkflowIntel,
} from "@/lib/cem-operations/types";

const OPEN_STATUSES = new Set(["open", "in_progress", "pending"]);

export function isOpenTaskStatus(status: string): boolean {
  return OPEN_STATUSES.has(status);
}

export function workflowReadinessFor(
  taskCount: number,
  openTaskCount: number,
  status: string
): { readinessLabel: string; nextAction: string } {
  if (status !== "active") {
    return {
      readinessLabel: "Inactive definition",
      nextAction: "Review whether this workflow should remain active or be archived.",
    };
  }
  if (taskCount === 0) {
    return {
      readinessLabel: "No linked tasks",
      nextAction: "Add operational tasks or confirm discovery seeding completed.",
    };
  }
  if (openTaskCount > 0) {
    return {
      readinessLabel: "Tasks in flight",
      nextAction: "Review open tasks on the tasks board and assign owners where needed.",
    };
  }
  return {
    readinessLabel: "Coordinated",
    nextAction: "Periodic review recommended — no open tasks on this workflow.",
  };
}

export function buildWorkflowIntel(
  workflows: {
    id: string;
    name: string;
    status: string;
    steps: { id: string }[];
    _count: { steps: number; tasks: number };
  }[],
  openTasksByWorkflow: Map<string, number>
): CemWorkflowIntel[] {
  return workflows.map((w) => {
    const openTaskCount = openTasksByWorkflow.get(w.id) ?? 0;
    const { readinessLabel, nextAction } = workflowReadinessFor(
      w._count.tasks,
      openTaskCount,
      w.status
    );
    return {
      id: w.id,
      name: w.name,
      status: w.status,
      stepCount: w._count.steps,
      taskCount: w._count.tasks,
      openTaskCount,
      readinessLabel,
      nextAction,
    };
  });
}

export function deriveOperationalReadiness(input: {
  workflowCount: number;
  workflowsWithoutTasks: number;
  taskCount: number;
  openTaskCount: number;
  departmentCount: number;
  roleCount: number;
  profileCount: number;
  unassignedTaskCount: number;
  tasksWithoutWorkflow: number;
}): {
  level: CemOperationalReadinessLevel;
  label: string;
  detail: string;
} {
  const {
    workflowCount,
    workflowsWithoutTasks,
    taskCount,
    openTaskCount,
    departmentCount,
    roleCount,
    profileCount,
    unassignedTaskCount,
    tasksWithoutWorkflow,
  } = input;

  if (workflowCount === 0 && taskCount === 0) {
    return {
      level: "draft",
      label: "Draft operations",
      detail:
        "No workflows or tasks are seeded yet. Complete discovery, blueprint go-live, or ops seeding.",
    };
  }

  if (workflowCount === 0 || departmentCount === 0 || roleCount === 0) {
    return {
      level: "early",
      label: "Early operational setup",
      detail:
        "Structure or workflow definitions are incomplete. Map departments and roles before scaling task coordination.",
    };
  }

  const gaps =
    workflowsWithoutTasks > 0 ||
    unassignedTaskCount > 0 ||
    tasksWithoutWorkflow > 0 ||
    profileCount === 0;

  if (gaps || openTaskCount > 10) {
    return {
      level: "needs_review",
      label: "Review recommended",
      detail:
        "Operational visibility is available, but some workflows lack tasks, assignments, or structure links need attention.",
    };
  }

  return {
    level: "strong",
    label: "Operational visibility ready",
    detail:
      "Workflows, tasks, and org structure are present. Use tasks and CyberCrow for trust signals — no automation engine in this phase.",
  };
}

export function buildRecommendedActions(input: {
  workflowCount: number;
  workflowsWithoutTasks: number;
  openTaskCount: number;
  unassignedTaskCount: number;
  departmentCount: number;
  roleCount: number;
  profileCount: number;
  cybercrowInitialized: boolean;
}): CemRecommendedAction[] {
  const actions: CemRecommendedAction[] = [];

  if (input.openTaskCount > 0) {
    actions.push({
      label: "Review open tasks",
      hint: `${input.openTaskCount} open or in-progress`,
      priority: "high",
    });
  }

  if (input.workflowsWithoutTasks > 0) {
    actions.push({
      label: "Workflows without tasks",
      hint: `${input.workflowsWithoutTasks} definition(s) need operational items`,
      priority: "high",
    });
  }

  if (input.unassignedTaskCount > 0) {
    actions.push({
      label: "Assign task owners",
      hint: `${input.unassignedTaskCount} unassigned task(s)`,
      priority: "medium",
    });
  }

  if (input.departmentCount === 0) {
    actions.push({
      label: "Seed departments",
      hint: "Structure missing from discovery",
      priority: "high",
    });
  }

  if (input.roleCount === 0) {
    actions.push({
      label: "Define roles",
      hint: "RBAC roles required for access control",
      priority: "high",
    });
  } else if (input.profileCount === 0) {
    actions.push({
      label: "Add workspace users",
      hint: "No profiles mapped to roles",
      priority: "medium",
    });
  }

  if (input.workflowCount > 0 && actions.length < 4) {
    actions.push({
      label: "Inspect workflow definitions",
      hint: `${input.workflowCount} workflow(s) — read-only visibility`,
      priority: "low",
    });
  }

  if (!input.cybercrowInitialized) {
    actions.push({
      label: "Initialize CyberCrow",
      hint: "Workflow trust and audit context",
      priority: "medium",
    });
  } else {
    actions.push({
      label: "Review workflow trust in CyberCrow",
      hint: "Audit logs and security events",
      priority: "low",
    });
  }

  actions.push({
    label: "Preview role experience in SAREA",
    hint: "RBAC controls access; SAREA adapts UI",
    priority: "low",
  });

  return actions.slice(0, 6);
}
