import type { WorkflowTemplate } from "../types";
import { WORKFLOW_TEMPLATE_CATALOG } from "./workflow-template-catalog";
import { WORKFLOW_TEMPLATE_EXTENDED_CATALOG } from "./workflow-template-extended";

export { WORKFLOW_TEMPLATE_CATALOG } from "./workflow-template-catalog";
export { WORKFLOW_TEMPLATE_EXTENDED_CATALOG } from "./workflow-template-extended";

export function listWorkflowTemplates(): WorkflowTemplate[] {
  return [...WORKFLOW_TEMPLATE_CATALOG, ...WORKFLOW_TEMPLATE_EXTENDED_CATALOG];
}

export function getWorkflowTemplate(key: string): WorkflowTemplate | undefined {
  return listWorkflowTemplates().find((w) => w.key === key);
}
