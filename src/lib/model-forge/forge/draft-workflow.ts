import type { DraftWorkflow, DraftWorkflowStage } from "@/lib/model-forge/domain-types";
import { getWorkflowTemplate } from "@/lib/model-forge/workflows/index";

export function createDraftWorkflowFromTemplate(templateKey: string): DraftWorkflow | null {
  const template = getWorkflowTemplate(templateKey);
  if (!template) return null;
  const stages: DraftWorkflowStage[] = template.states.map((state) => ({
    key: state,
    label: state.replace(/_/g, " "),
    positions: template.workflowPositions,
  }));
  return {
    key: `draft_${template.key}_${Date.now()}`,
    displayName: `Draft — ${template.displayName}`,
    templateKey: template.key,
    topology: template.topology,
    stages,
    advisory: true,
  };
}

export function addDraftStage(workflow: DraftWorkflow, stageKey: string, label: string): DraftWorkflow {
  return {
    ...workflow,
    stages: [...workflow.stages, { key: stageKey, label, positions: ["COORDINATOR"] }],
  };
}

export function removeDraftStage(workflow: DraftWorkflow, stageKey: string): DraftWorkflow {
  return { ...workflow, stages: workflow.stages.filter((s) => s.key !== stageKey) };
}

export function reorderDraftStages(workflow: DraftWorkflow, from: number, to: number): DraftWorkflow {
  const stages = [...workflow.stages];
  const [item] = stages.splice(from, 1);
  if (!item) return workflow;
  stages.splice(to, 0, item);
  return { ...workflow, stages };
}

export function exportDraftWorkflowJson(workflow: DraftWorkflow): string {
  return JSON.stringify({ ...workflow, _boundary: "ADVISORY — NO RUNTIME WORKFLOW INSTANCES" }, null, 2);
}
