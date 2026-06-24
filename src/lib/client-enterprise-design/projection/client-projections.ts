import type {
  ClientEnterpriseDesignSnapshot,
  ClientOperatingPriority,
  LeanResponsibleOperatingModel,
} from "../types";

export type ClientFieldProjection = {
  key: string;
  displayName: string;
  description: string;
  category: string;
  recommendedPurposes: string[];
};

export type ClientPurposeProjection = {
  key: string;
  displayName: string;
  description: string;
  exampleOutcomes: string[];
};

export type ClientPersonaProjection = {
  key: string;
  operatingResponsibility: string;
  description: string;
  mayCombineWith: string[];
  shouldStaySeparateFrom: string[];
};

export type ClientWorkflowProjection = {
  key: string;
  displayName: string;
  purpose: string;
  trigger: string;
  stages: string[];
  responsibleRoles: string[];
  approvals: string[];
};

export type ClientCapabilityProjection = {
  key: string;
  displayName: string;
  group: string;
  clientLabel: string;
  suitability: { starter: boolean; growth: boolean; enterprise: boolean };
};

export type ClientModelVariantProjection = {
  key: string;
  displayName: string;
  estimatedTeamRange: string;
  workflowDepth: string;
  approvalDepth: string;
  automation: string;
  warnings: string[];
};

export type ClientImpactProjection = {
  simpleSummary: string;
  guardrail: string;
  workforce: string[];
  risks: string[];
};

export function projectLeanModel(model: LeanResponsibleOperatingModel): {
  estimatedTeamRange: string;
  assumptions: string[];
  merges: string[];
  separations: string[];
  hiringTriggers: string[];
  disclaimer: string;
} {
  return {
    estimatedTeamRange: `${model.estimatedCoreTeamRange.min}–${model.estimatedCoreTeamRange.max} people`,
    assumptions: model.workloadAssumptions,
    merges: model.mergeRecommendations.map((m) => m.rationale),
    separations: model.separationRequirements.map((s) => s.rationale),
    hiringTriggers: model.nextHiringTriggers,
    disclaimer: model.disclaimer,
  };
}

export function projectOperatingPriority(priority: ClientOperatingPriority): {
  key: ClientOperatingPriority;
  displayName: string;
  summary: string;
} {
  const map: Record<ClientOperatingPriority, { displayName: string; summary: string }> = {
    LEAN_RESPONSIBLE: {
      displayName: "Lean Responsible",
      summary: "Smallest responsible model with essential controls retained.",
    },
    BALANCED_GROWTH: {
      displayName: "Balanced Growth",
      summary: "Moderate specialization prepared for scaling.",
    },
    CONTROL_FIRST: {
      displayName: "Control First",
      summary: "Stronger separation of duties and evidence.",
    },
    AUTOMATION_FORWARD: {
      displayName: "Automation Forward",
      summary: "Automation-oriented workflows with human oversight for high-risk decisions.",
    },
    CUSTOM: {
      displayName: "Custom",
      summary: "Hybrid priority composed from explicit client choices.",
    },
  };
  return { key: priority, ...map[priority] };
}

export function projectSnapshotSummary(snapshot: ClientEnterpriseDesignSnapshot): {
  variants: ClientModelVariantProjection[];
  workflows: ClientWorkflowProjection[];
  lean: ReturnType<typeof projectLeanModel>;
} {
  return {
    variants: snapshot.variants.map((v) => ({
      key: v.key,
      displayName: v.displayName,
      estimatedTeamRange: `${v.estimatedCoreTeamRange.min}–${v.estimatedCoreTeamRange.max}`,
      workflowDepth: v.workflowDepth,
      approvalDepth: v.approvalDepth,
      automation: v.automationLevel,
      warnings: v.warnings,
    })),
    workflows: snapshot.workflowSummaries.map((w) => ({
      key: w.key,
      displayName: w.displayName,
      purpose: w.purpose,
      trigger: w.trigger,
      stages: w.stages,
      responsibleRoles: w.responsiblePersonas.map((p) => p.replace(/_/g, " ")),
      approvals: w.approvals,
    })),
    lean: projectLeanModel(snapshot.leanModel),
  };
}

export const CLIENT_TERMINOLOGY = {
  workPersona: "Operating responsibility",
  cyberCrowPolicy: "Recommended security control",
  sareaExperience: "Recommended workspace experience",
  entityPack: "Business information the system will manage",
} as const;
