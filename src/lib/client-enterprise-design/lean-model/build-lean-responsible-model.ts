import type { TenantScaleProfile } from "@/lib/model-forge/types";
import type { ClientEnterpriseDesignInput, ClientOperatingModelVariant, LeanResponsibleOperatingModel } from "../types";

const LEAN_DISCLAIMER =
  "Estimated ranges are advisory planning assumptions — not legal, financial, safety, or employment guarantees.";

export function buildLeanResponsibleOperatingModel(args: {
  input: ClientEnterpriseDesignInput;
  variant: ClientOperatingModelVariant;
  personaKeys: string[];
  currentScale: TenantScaleProfile;
  targetScale: TenantScaleProfile;
}): LeanResponsibleOperatingModel {
  const { input, variant, personaKeys, currentScale, targetScale } = args;
  const volume = Math.max(currentScale.dimensions.workflowVolume, targetScale.dimensions.workflowVolume);
  const workforce = variant.estimatedCoreTeamRange;

  const workloadAssumptions = [
    `Current workforce scale signal: ${currentScale.preset.replace(/_/g, " ")}`,
    `Target workforce scale signal: ${targetScale.preset.replace(/_/g, " ")}`,
    `Planning assumption: up to ${volume * 5} active operational items per month at current scale selection`,
  ];

  const mergeRecommendations = variant.mergeRecommendations.map((r) => ({
    personaKeys: personaKeys.slice(0, 2),
    rationale: r,
  }));

  const separationRequirements = variant.separationRequirements.map((r) => ({
    personaKeys: ["finance_specialist", "supervisor"],
    rationale: r,
  }));

  const capacityWarnings: string[] = [];
  if (input.operatingPriority === "LEAN_RESPONSIBLE" && personaKeys.length > 6) {
    capacityWarnings.push("Lean priority with many responsibilities may exceed realistic core-team capacity.");
  }

  const nextHiringTriggers = [
    ...variant.nextGrowthTriggers,
    `Consider splitting operations coordination from customer coordination when monthly active volume exceeds ${volume * 8}.`,
  ];

  return {
    estimatedCoreTeamRange: workforce,
    workloadAssumptions,
    requiredPersonaResponsibilities: personaKeys,
    mergeRecommendations,
    separationRequirements,
    automationOpportunities: [
      "Route routine status updates automatically",
      "Pre-fill repeat customer information",
      "Surface exception queues to supervisors",
    ],
    capacityWarnings,
    singlePointOfFailureWarnings:
      input.operatingPriority === "LEAN_RESPONSIBLE"
        ? ["Owner may become a single point of failure for approvals and customer escalations."]
        : [],
    segregationOfDutiesWarnings: separationRequirements.map((s) => s.rationale),
    nextHiringTriggers,
    nextPersonaSplitTriggers: [
      "Split dispatch from field supervision when route complexity exceeds daily management capacity.",
    ],
    confidenceLimitations: [
      "Estimates depend on client-provided scale signals and selected purposes.",
      "Local regulations may require additional roles not modeled here.",
    ],
    disclaimer: LEAN_DISCLAIMER,
  };
}
