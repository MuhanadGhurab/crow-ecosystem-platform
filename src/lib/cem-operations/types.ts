export type CemOperationalReadinessLevel = "strong" | "needs_review" | "early" | "draft";

export type CemRecommendedAction = {
  label: string;
  hint: string;
  priority: "high" | "medium" | "low";
};

export type CemWorkflowIntel = {
  id: string;
  name: string;
  status: string;
  stepCount: number;
  taskCount: number;
  openTaskCount: number;
  readinessLabel: string;
  nextAction: string;
};

export type CemOperationsSnapshot = {
  workflowCount: number;
  activeWorkflowCount: number;
  workflowsWithTasks: number;
  workflowsWithoutTasks: number;
  taskCount: number;
  openTaskCount: number;
  tasksByStatus: Record<string, number>;
  unassignedTaskCount: number;
  tasksWithoutWorkflow: number;
  departmentCount: number;
  roleCount: number;
  profileCount: number;
  departmentsWithProfiles: number;
  rolesWithAssignments: number;
  readinessLevel: CemOperationalReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: CemRecommendedAction[];
  workflows: CemWorkflowIntel[];
  cybercrowInitialized: boolean;
};
