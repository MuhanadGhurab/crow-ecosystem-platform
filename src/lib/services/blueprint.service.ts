import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  getMockEnterpriseBlueprint,
  shouldUseMockBlueprint,
} from "@/lib/mock/blueprint";

const blueprintListArgs = {
  include: {
    modules: true,
    request: {
      select: {
        id: true,
        organizationName: true,
        referenceCode: true,
        status: true,
      },
    },
    tenant: { select: { id: true, slug: true } },
  },
} satisfies Prisma.EnterpriseBlueprintFindManyArgs;

export type EnterpriseBlueprintListItem = Prisma.EnterpriseBlueprintGetPayload<
  typeof blueprintListArgs
>;

export const enterpriseBlueprintDetailInclude = {
  modules: true,
  request: {
    include: {
      contacts: true,
      requestedModules: true,
      requestedSecurityPkgs: true,
      requestedPlans: true,
      discoveryProfile: {
        include: { answers: true, experienceRequirements: true },
      },
    },
  },
  tenant: { include: { organization: true } },
} as const;

export type EnterpriseBlueprintDetail = Prisma.EnterpriseBlueprintGetPayload<{
  include: typeof enterpriseBlueprintDetailInclude;
}>;

export async function getEnterpriseBlueprint(
  blueprintId: string
): Promise<EnterpriseBlueprintDetail | null> {
  if (shouldUseMockBlueprint(blueprintId)) {
    return getMockEnterpriseBlueprint(blueprintId);
  }
  return prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    include: enterpriseBlueprintDetailInclude,
  });
}

export async function listEnterpriseBlueprints(): Promise<EnterpriseBlueprintListItem[]> {
  return prisma.enterpriseBlueprint.findMany({
    orderBy: { updatedAt: "desc" },
    ...blueprintListArgs,
  });
}
