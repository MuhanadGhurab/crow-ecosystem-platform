import type { TenantScaleDimensions, TenantScalePreset, TenantScaleProfile } from "../types";

export const SCALE_PRESETS: Record<TenantScalePreset, TenantScaleDimensions> = {
  SOLO: { workforceScale: 1, branchScale: 1, workflowVolume: 1, workflowComplexity: 1, approvalDepth: 1, externalActorVolume: 1, assetIntensity: 1, projectIntensity: 1, dataSensitivity: 2, regulatoryIntensity: 1, geographicDistribution: 1, automationMaturity: 1, fieldWorkforceIntensity: 1 },
  MICRO: { workforceScale: 2, branchScale: 1, workflowVolume: 2, workflowComplexity: 2, approvalDepth: 1, externalActorVolume: 2, assetIntensity: 2, projectIntensity: 2, dataSensitivity: 2, regulatoryIntensity: 1, geographicDistribution: 1, automationMaturity: 1, fieldWorkforceIntensity: 2 },
  SMALL_TEAM: { workforceScale: 3, branchScale: 1, workflowVolume: 3, workflowComplexity: 2, approvalDepth: 2, externalActorVolume: 3, assetIntensity: 2, projectIntensity: 3, dataSensitivity: 3, regulatoryIntensity: 2, geographicDistribution: 2, automationMaturity: 2, fieldWorkforceIntensity: 3 },
  GROWING_ORGANIZATION: { workforceScale: 5, branchScale: 2, workflowVolume: 5, workflowComplexity: 4, approvalDepth: 3, externalActorVolume: 4, assetIntensity: 3, projectIntensity: 4, dataSensitivity: 4, regulatoryIntensity: 3, geographicDistribution: 3, automationMaturity: 3, fieldWorkforceIntensity: 4 },
  MULTI_DEPARTMENT: { workforceScale: 6, branchScale: 2, workflowVolume: 6, workflowComplexity: 5, approvalDepth: 4, externalActorVolume: 5, assetIntensity: 4, projectIntensity: 5, dataSensitivity: 5, regulatoryIntensity: 4, geographicDistribution: 3, automationMaturity: 4, fieldWorkforceIntensity: 4 },
  MULTI_BRANCH: { workforceScale: 7, branchScale: 7, workflowVolume: 7, workflowComplexity: 5, approvalDepth: 4, externalActorVolume: 6, assetIntensity: 5, projectIntensity: 5, dataSensitivity: 5, regulatoryIntensity: 4, geographicDistribution: 6, automationMaturity: 4, fieldWorkforceIntensity: 5 },
  ENTERPRISE: { workforceScale: 9, branchScale: 8, workflowVolume: 9, workflowComplexity: 8, approvalDepth: 7, externalActorVolume: 8, assetIntensity: 7, projectIntensity: 7, dataSensitivity: 8, regulatoryIntensity: 7, geographicDistribution: 8, automationMaturity: 7, fieldWorkforceIntensity: 6 },
  GROUP_OR_ECOSYSTEM: { workforceScale: 10, branchScale: 10, workflowVolume: 10, workflowComplexity: 9, approvalDepth: 8, externalActorVolume: 10, assetIntensity: 8, projectIntensity: 8, dataSensitivity: 9, regulatoryIntensity: 8, geographicDistribution: 10, automationMaturity: 8, fieldWorkforceIntensity: 7 },
};

export function buildScaleProfile(preset: TenantScalePreset, overrides?: Partial<TenantScaleDimensions>): TenantScaleProfile {
  const base = SCALE_PRESETS[preset];
  const dimensions = { ...base, ...overrides };
  return {
    preset,
    dimensions,
    displayName: preset.replace(/_/g, " "),
    description: `Scale preset ${preset} — starting point; dimensions may be refined individually.`,
  };
}

export function scaleAffectsPersonaGranularity(scale: TenantScaleProfile): "merged" | "balanced" | "split" {
  if (scale.dimensions.workforceScale <= 3) return "merged";
  if (scale.dimensions.workforceScale >= 8) return "split";
  return "balanced";
}

export function recommendApprovalDepth(scale: TenantScaleProfile): number {
  return Math.min(10, Math.max(1, Math.round(scale.dimensions.approvalDepth)));
}
