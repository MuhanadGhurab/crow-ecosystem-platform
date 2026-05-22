import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getMockDiscoveryContext, shouldUseMockDiscovery } from "@/lib/mock/discovery";

export const discoveryContextInclude = {
  contacts: true,
  requestedModules: true,
  requestedSecurityPkgs: true,
  requestedPlans: true,
  discoveryProfile: {
    include: {
      answers: true,
      departments: true,
      branches: true,
      roles: true,
      workflows: true,
      securityRequirements: true,
      integrations: true,
      experienceRequirements: true,
    },
  },
  enterpriseBlueprint: true,
} as const;

export type DiscoveryContext = Prisma.ImplementationRequestGetPayload<{
  include: typeof discoveryContextInclude;
}>;

export async function getDiscoveryContext(
  requestId: string
): Promise<DiscoveryContext | null> {
  if (shouldUseMockDiscovery(requestId)) {
    return getMockDiscoveryContext(requestId);
  }
  return prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: discoveryContextInclude,
  });
}

export async function upsertDiscoveryAnswer(
  requestId: string,
  sectionKey: string,
  questionKey: string,
  valueJson: Prisma.InputJsonValue
) {
  const profile = await prisma.discoveryProfile.findUnique({ where: { requestId } });
  if (!profile) {
    throw new Error("Discovery profile not found");
  }

  return prisma.discoveryAnswer.upsert({
    where: {
      profileId_sectionKey_questionKey: {
        profileId: profile.id,
        sectionKey,
        questionKey,
      },
    },
    create: { profileId: profile.id, sectionKey, questionKey, valueJson },
    update: { valueJson },
  });
}

async function requireProfileId(requestId: string) {
  const profile = await prisma.discoveryProfile.findUnique({ where: { requestId } });
  if (!profile) throw new Error("Discovery profile not found");
  return profile.id;
}

export async function addDiscoveryDepartment(
  requestId: string,
  data: { name: string; nameAr?: string; headcount?: number }
) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryDepartment.create({
    data: { profileId, name: data.name, nameAr: data.nameAr, headcount: data.headcount },
  });
}

export async function deleteDiscoveryDepartment(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryDepartment.deleteMany({ where: { id, profileId } });
}

export async function addDiscoveryBranch(
  requestId: string,
  data: { name: string; city?: string; region?: string }
) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryBranch.create({
    data: { profileId, name: data.name, city: data.city, region: data.region },
  });
}

export async function deleteDiscoveryBranch(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryBranch.deleteMany({ where: { id, profileId } });
}

export async function addDiscoveryRole(requestId: string, data: { name: string; level?: string }) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryRole.create({
    data: { profileId, name: data.name, level: data.level },
  });
}

export async function deleteDiscoveryRole(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryRole.deleteMany({ where: { id, profileId } });
}

export async function addDiscoveryWorkflow(
  requestId: string,
  data: { name: string; description?: string }
) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryWorkflow.create({
    data: { profileId, name: data.name, description: data.description },
  });
}

export async function deleteDiscoveryWorkflow(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryWorkflow.deleteMany({ where: { id, profileId } });
}

export async function addDiscoverySecurityRequirement(
  requestId: string,
  data: { requirement: string; priority?: string }
) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoverySecurityRequirement.create({
    data: { profileId, requirement: data.requirement, priority: data.priority },
  });
}

export async function deleteDiscoverySecurityRequirement(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoverySecurityRequirement.deleteMany({ where: { id, profileId } });
}

export async function addDiscoveryIntegration(
  requestId: string,
  data: { providerKey: string; notes?: string }
) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryIntegration.create({
    data: { profileId, providerKey: data.providerKey, notes: data.notes },
  });
}

export async function deleteDiscoveryIntegration(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryIntegration.deleteMany({ where: { id, profileId } });
}

export async function addDiscoveryExperienceRequirement(
  requestId: string,
  data: { personaKey: string; requirement: string }
) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryExperienceRequirement.create({
    data: { profileId, personaKey: data.personaKey, requirement: data.requirement },
  });
}

export async function deleteDiscoveryExperienceRequirement(requestId: string, id: string) {
  const profileId = await requireProfileId(requestId);
  return prisma.discoveryExperienceRequirement.deleteMany({ where: { id, profileId } });
}
