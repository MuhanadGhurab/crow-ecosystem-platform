import type { EnterpriseBlueprintDecision } from "./blueprint-types";
import type { BlueprintCompileInput } from "./blueprint-types";
import type { EnterpriseModelDraft } from "../types";

export function buildBlueprintDecisionRegister(
  draft: EnterpriseModelDraft,
  input: BlueprintCompileInput,
): EnterpriseBlueprintDecision[] {
  const decisions: EnterpriseBlueprintDecision[] = [];

  for (const u of draft.unresolvedDecisions) {
    decisions.push({
      key: `unresolved_${decisions.length}`,
      category: u.toLowerCase().includes("approval") ? "AUTHORITY" : "ORGANIZATION",
      question: u,
      reason: "Composition requires operator input",
      affectedPaths: ["blueprint.organization"],
      options: ["define_later", "use_default_advisory"],
      recommendedOption: "define_later",
      provenancePath: "blueprint.decisions.organization",
      blocking: u.toLowerCase().includes("approval"),
    });
  }

  decisions.push({
    key: "department_structure",
    category: "DEPARTMENT",
    question: "Confirm department structure at target scale?",
    reason: "Department density varies by scale preset",
    affectedPaths: ["blueprint.departments"],
    options: ["merged_operations", "departmental_hierarchy", "outcome_pods"],
    recommendedOption: draft.dna.scaleProfile.preset === "MICRO" ? "merged_operations" : "departmental_hierarchy",
    provenancePath: "blueprint.decisions.departments",
    blocking: false,
  });

  if ((input.specialistDomains?.length ?? 0) > 2) {
    decisions.push({
      key: "specialist_focus",
      category: "ORGANIZATION",
      question: "Prioritize specialist domains for initial blueprint scope?",
      reason: "Multiple specialist domains increase composition complexity",
      affectedPaths: ["blueprint.organization", "blueprint.capabilities"],
      options: [...(input.specialistDomains ?? [])],
      recommendedOption: input.specialistDomains?.[0] ?? "none",
      provenancePath: "blueprint.decisions.specialist",
      blocking: false,
    });
  }

  return decisions;
}
