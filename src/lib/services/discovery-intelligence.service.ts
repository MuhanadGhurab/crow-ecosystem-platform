import { prisma } from "@/lib/db";
import { computeDiscoveryCompleteness } from "@/lib/discovery-intelligence/completeness";
import { buildAdvisoryRecommendations } from "@/lib/discovery-intelligence/recommendations";
import { resolveSectorGuidance } from "@/lib/discovery-intelligence/sector-guidance";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { evaluateDiscoveryBlueprintGate } from "@/lib/services/discovery-completion-gate.service";

export async function getDiscoveryIntelligenceSnapshot(requestId: string) {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      industry: true,
      requestedModules: { select: { moduleKey: true } },
      requestedSecurityPkgs: { select: { id: true } },
      discoveryProfile: {
        select: {
          answers: {
            select: { sectionKey: true, questionKey: true, valueJson: true },
          },
          departments: { select: { id: true } },
          branches: { select: { id: true } },
          roles: { select: { id: true } },
          workflows: { select: { id: true } },
          securityRequirements: { select: { id: true } },
          orgIntelligence: {
            select: { status: true, sectorTemplateKey: true },
          },
        },
      },
      enterpriseBlueprint: { select: { id: true } },
    },
  });

  if (!request?.discoveryProfile) return null;

  const profile = request.discoveryProfile;
  const answers = profile.answers;
  const moduleKeys = request.requestedModules.map((m) => m.moduleKey);

  const completeness = computeDiscoveryCompleteness({
    answers,
    departments: profile.departments,
    branches: profile.branches,
    roles: profile.roles,
    workflows: profile.workflows,
    securityRequirements: profile.securityRequirements,
    orgIntelligence: profile.orgIntelligence,
    industry: request.industry,
    requestedModuleKeys: moduleKeys,
    requestedSecurityCount: request.requestedSecurityPkgs.length,
    hasExperienceAnswer: answers.some((a) => a.sectionKey === "experience"),
    hasIdentityAnswer: answers.some((a) => a.sectionKey === "identity"),
  });

  const sectorKey = (profile.orgIntelligence?.sectorTemplateKey ??
    resolveSectorTemplateKey({
      industry: request.industry ?? "",
      moduleKeys,
    })) as SectorTemplateKey;

  const guidance = resolveSectorGuidance({
    industry: request.industry,
    moduleKeys,
    sectorTemplateKey: profile.orgIntelligence?.sectorTemplateKey,
  });

  const recommendations = buildAdvisoryRecommendations(sectorKey);

  const gate = await evaluateDiscoveryBlueprintGate(requestId);

  return {
    completeness,
    guidance,
    recommendations,
    gate,
    blueprintId: request.enterpriseBlueprint?.id ?? null,
    orgIntelligenceStatus: profile.orgIntelligence?.status ?? null,
    sectorTemplateKey: profile.orgIntelligence?.sectorTemplateKey ?? guidance.sectorKey,
  };
}
