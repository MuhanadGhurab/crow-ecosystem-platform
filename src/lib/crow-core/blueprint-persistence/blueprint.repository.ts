import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

import { type TenantScope, tenantWhereClause } from "./tenant-scope";

const listInclude = {
  request: {
    select: {
      id: true,
      organizationName: true,
      referenceCode: true,
      status: true,
    },
  },
  tenantOwner: { select: { id: true, slug: true } },
} satisfies Prisma.EnterpriseBlueprintInclude;

export async function listBlueprintsForScope(scope: TenantScope) {
  const tenantFilter = tenantWhereClause(scope);
  return prisma.enterpriseBlueprint.findMany({
    where: tenantFilter ? { tenantId: tenantFilter.tenantId } : undefined,
    orderBy: { updatedAt: "desc" },
    include: listInclude,
  });
}

export async function getBlueprintByTenantAndId(
  scope: TenantScope,
  blueprintId: string
) {
  const tenantFilter = tenantWhereClause(scope);
  return prisma.enterpriseBlueprint.findFirst({
    where: {
      id: blueprintId,
      ...(tenantFilter ? { tenantId: tenantFilter.tenantId } : {}),
    },
    include: {
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
      tenantOwner: { select: { id: true, slug: true, organization: true } },
      activeDraftVersion: true,
      currentApprovedVersion: true,
    },
  });
}

export async function resolveBlueprintTenantId(
  blueprintId: string
): Promise<string | null> {
  const row = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    select: { tenantId: true, tenant: { select: { id: true } } },
  });
  if (!row) return null;
  return row.tenantId ?? row.tenant?.id ?? null;
}
