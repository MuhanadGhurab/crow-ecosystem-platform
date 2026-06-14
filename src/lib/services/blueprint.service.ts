import type { Prisma } from "@prisma/client";
import {
  getBlueprintByTenantAndId,
  listBlueprintsForScope,
} from "@/lib/crow-core/blueprint-persistence/blueprint.repository";
import { mapPersistedRowToEnterpriseBlueprintDetail } from "@/lib/crow-core/blueprint-persistence/blueprint-detail-mapper";
import type { TenantScope } from "@/lib/crow-core/blueprint-persistence/tenant-scope";
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

function mapListItemFromPersistedRow(
  row: Awaited<ReturnType<typeof listBlueprintsForScope>>[number]
): EnterpriseBlueprintListItem {
  const { tenantOwner, ...rest } = row;
  return {
    ...rest,
    tenant: tenantOwner ? { id: tenantOwner.id, slug: tenantOwner.slug } : null,
  } as EnterpriseBlueprintListItem;
}

export async function getEnterpriseBlueprint(
  blueprintId: string,
  scope?: TenantScope
): Promise<EnterpriseBlueprintDetail | null> {
  if (shouldUseMockBlueprint(blueprintId)) {
    return getMockEnterpriseBlueprint(blueprintId);
  }
  if (scope) {
    const row = await getBlueprintByTenantAndId(scope, blueprintId);
    if (!row) return null;
    return mapPersistedRowToEnterpriseBlueprintDetail(row);
  }
  return prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    include: enterpriseBlueprintDetailInclude,
  });
}

export async function listEnterpriseBlueprints(
  scope?: TenantScope
): Promise<EnterpriseBlueprintListItem[]> {
  if (scope) {
    const rows = await listBlueprintsForScope(scope);
    return rows.map(mapListItemFromPersistedRow);
  }
  return prisma.enterpriseBlueprint.findMany({
    orderBy: { updatedAt: "desc" },
    ...blueprintListArgs,
  });
}
