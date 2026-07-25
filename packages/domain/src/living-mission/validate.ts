import type { MissionTemplate } from "../living-mission/types";

export function validateMissionTemplate(template: MissionTemplate): string[] {
  const errors: string[] = [];
  if (!template.missionId || !template.version) {
    errors.push("missionId and version required");
  }
  if (template.classification !== "ALPHA_FIXTURE") {
    errors.push("classification must be ALPHA_FIXTURE for this Gate");
  }
  const nodeIds = new Set(template.nodes.map((n) => n.nodeId));
  if (!nodeIds.has(template.entryNodeId)) {
    errors.push("entryNodeId missing from nodes");
  }
  if (template.nodes.length < 15 || template.nodes.length > 20) {
    errors.push("node count must be 15–20");
  }
  if (template.scenes.length !== 4) {
    errors.push("exactly 4 scenes required");
  }
  if (template.outcomes.length < 4) {
    errors.push("at least 4 outcomes required");
  }
  if (template.echoCandidateNodeIds.length < 3) {
    errors.push("at least 3 echo candidates required");
  }
  for (const id of template.echoCandidateNodeIds) {
    if (!nodeIds.has(id)) errors.push(`echo candidate missing: ${id}`);
  }
  for (const node of template.nodes) {
    if (node.choices.length < 1) {
      errors.push(`node ${node.nodeId} has no choices`);
    }
    for (const c of node.choices) {
      const next = c.effect.nextNodeId;
      if (next !== null && !nodeIds.has(next)) {
        errors.push(`dangling nextNodeId ${next} from ${node.nodeId}`);
      }
    }
  }
  return errors;
}
