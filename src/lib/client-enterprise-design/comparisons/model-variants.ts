import type { ClientOperatingModelVariant, ClientOperatingModelVariantKey, ClientOperatingPriority } from "../types";

function variant(
  key: ClientOperatingModelVariantKey,
  displayName: string,
  team: { min: number; max: number },
  depth: ClientOperatingModelVariant["workflowDepth"],
  approval: ClientOperatingModelVariant["approvalDepth"],
  automation: ClientOperatingModelVariant["automationLevel"],
): ClientOperatingModelVariant {
  return {
    key,
    displayName,
    description: `${displayName} operating reality — advisory model, not a pricing plan.`,
    organizationalStructure:
      key === "STARTER"
        ? "Flat team with shared operating units and combined responsibilities."
        : key === "GROWTH"
          ? "Functional teams with moderate specialization and shared services."
          : key === "ENTERPRISE"
            ? "Departmental structure with stronger separation of duties and governance."
            : "Hybrid structure composed from client selections.",
    estimatedCoreTeamRange: team,
    personaKeys: [],
    mergeRecommendations: [],
    separationRequirements: [],
    departmentKeys: [],
    capabilityKeys: [],
    workflowDepth: depth,
    approvalDepth: approval,
    automationLevel: automation,
    evidenceExpectations: [],
    cyberCrowRecommendations: [],
    sareaRecommendations: [],
    integrationRecommendations: [],
    nextGrowthTriggers: [],
    assumptions: [],
    warnings: [],
  };
}

export const MODEL_VARIANT_BASELINES: Record<ClientOperatingModelVariantKey, ClientOperatingModelVariant> = {
  STARTER: {
    ...variant("STARTER", "Starter", { min: 4, max: 8 }, "light", "minimal", "low"),
    mergeRecommendations: [
      "Operations coordination and customer coordination may be combined in early stages.",
      "Finance administration and invoice preparation may share one responsible role when volumes are low.",
    ],
    separationRequirements: [
      "Payment approval and payment execution should remain separated.",
      "Privileged access changes should not be self-approved.",
    ],
    assumptions: ["Low monthly transaction volume", "Founder or owner remains close to daily operations"],
    warnings: ["Combining financial responsibilities increases concentration risk as volume grows."],
    nextGrowthTriggers: [
      "Add a dedicated operations coordinator when active customer matters exceed the selected capacity assumption.",
    ],
  },
  GROWTH: {
    ...variant("GROWTH", "Growth", { min: 8, max: 20 }, "standard", "balanced", "medium"),
    mergeRecommendations: [
      "Dispatch and field coordination may remain combined until route complexity increases.",
    ],
    separationRequirements: [
      "Invoice review and payment execution should involve different responsible roles.",
      "Contract approval and contract signing should involve different accountable roles.",
    ],
    assumptions: ["Multiple concurrent delivery streams", "Branch or team specialization emerging"],
    warnings: ["Approval shortcuts reduce evidence quality during audits."],
    nextGrowthTriggers: [
      "Split customer success from sales when recurring accounts exceed the selected support capacity.",
    ],
  },
  ENTERPRISE: {
    ...variant("ENTERPRISE", "Enterprise", { min: 20, max: 60 }, "deep", "strict", "high"),
    mergeRecommendations: [],
    separationRequirements: [
      "Financial approval, payment execution, and bank reconciliation should involve distinct responsibilities.",
      "Security administration and routine operations should be separated.",
      "Contract negotiation and contract signing should be separated.",
    ],
    assumptions: ["Multi-branch or multi-entity operations", "Higher regulatory or audit expectations"],
    warnings: ["Enterprise controls increase coordination overhead — plan for management capacity."],
    nextGrowthTriggers: [
      "Introduce a dedicated governance function when cross-entity approvals exceed daily management capacity.",
    ],
  },
  CUSTOM: {
    ...variant("CUSTOM", "Custom", { min: 5, max: 30 }, "standard", "balanced", "medium"),
    mergeRecommendations: ["Custom merges are evaluated per selected hybrid."],
    separationRequirements: ["High-risk financial and security duties must retain separation."],
    assumptions: ["Client selected a hybrid of variant characteristics"],
    warnings: ["Hybrid models require explicit review of responsibility concentration."],
    nextGrowthTriggers: ["Revisit specialization when any single role exceeds selected workload assumptions."],
  },
};

export function adjustVariantForPriority(
  variantDef: ClientOperatingModelVariant,
  priority: ClientOperatingPriority,
): ClientOperatingModelVariant {
  const copy = { ...variantDef, warnings: [...variantDef.warnings], assumptions: [...variantDef.assumptions] };
  if (priority === "LEAN_RESPONSIBLE") {
    copy.estimatedCoreTeamRange = {
      min: Math.max(3, copy.estimatedCoreTeamRange.min - 1),
      max: Math.max(copy.estimatedCoreTeamRange.min, copy.estimatedCoreTeamRange.max - 2),
    };
    copy.approvalDepth = copy.approvalDepth === "strict" ? "balanced" : copy.approvalDepth === "balanced" ? "minimal" : "minimal";
    copy.warnings.push("Lean priority reduces specialization — monitor segregation-of-duties risk.");
  } else if (priority === "CONTROL_FIRST") {
    copy.approvalDepth = "strict";
    copy.estimatedCoreTeamRange = {
      min: copy.estimatedCoreTeamRange.min + 1,
      max: copy.estimatedCoreTeamRange.max + 3,
    };
    copy.warnings.push("Control-first priority increases approval depth and coordination overhead.");
  } else if (priority === "AUTOMATION_FORWARD") {
    copy.automationLevel = copy.automationLevel === "low" ? "medium" : "high";
    copy.warnings.push("Automation-forward designs still require human approval for high-risk decisions.");
  }
  return copy;
}
