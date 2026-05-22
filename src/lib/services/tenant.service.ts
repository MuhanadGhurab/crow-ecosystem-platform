import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isUseMockData } from "@/lib/mock/env";
import { getMeemMockTenant } from "@/lib/mock/meem-global";
import { slugifyOrganization } from "@/lib/slugify";

const tenantListArgs = {
  include: {
    organization: true,
    blueprint: {
      include: {
        request: { select: { referenceCode: true, status: true } },
      },
    },
    _count: { select: { modules: true, cybercrowAuditLogs: true, profiles: true } },
  },
} satisfies Prisma.TenantFindManyArgs;

export type TenantListItem = Prisma.TenantGetPayload<typeof tenantListArgs>;

const tenantBySlugInclude = {
  organization: true,
  modules: { where: { enabled: true }, orderBy: { moduleKey: "asc" as const } },
  blueprint: {
    include: {
      request: {
        select: {
          id: true,
          referenceCode: true,
          status: true,
          organizationName: true,
          discoveryProfile: {
            select: {
              answers: {
                select: { sectionKey: true, questionKey: true, valueJson: true },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.TenantInclude;

export type TenantBySlug = Prisma.TenantGetPayload<{ include: typeof tenantBySlugInclude }>;

export async function getTenantBySlug(slug: string): Promise<TenantBySlug | null> {
  if (isUseMockData()) {
    const mock = getMeemMockTenant(slug);
    if (mock) return mock as TenantBySlug;
  }
  return prisma.tenant.findUnique({
    where: { slug },
    include: tenantBySlugInclude,
  });
}

export async function getTenantById(id: string) {
  return prisma.tenant.findUnique({
    where: { id },
    include: {
      organization: true,
      modules: { where: { enabled: true } },
      blueprint: {
        include: {
          request: {
            select: { id: true, referenceCode: true, status: true },
          },
        },
      },
    },
  });
}

export async function listTenants(): Promise<TenantListItem[]> {
  return prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    ...tenantListArgs,
  });
}

export async function getTenantWorkspaceSummary(tenantId: string) {
  const [
    auditLogCount,
    sareaProfileCount,
    securityEventCount,
    profiles,
    departments,
    roles,
    workflowCount,
    openTaskCount,
    cybercrowInitialized,
  ] = await Promise.all([
    prisma.cybercrowAuditLog.count({ where: { tenantId } }),
    prisma.sareaExperienceProfile.count({ where: { tenantId } }),
    prisma.securityEvent.count({ where: { tenantId } }),
    prisma.profile.count({ where: { tenantId } }),
    prisma.department.count({ where: { tenantId } }),
    prisma.role.count({ where: { tenantId } }),
    prisma.workflow.count({ where: { tenantId } }),
    prisma.task.count({
      where: { tenantId, status: { in: ["open", "in_progress"] } },
    }),
    prisma.cybercrowAuditLog.findFirst({
      where: { tenantId, action: "CYBERCROW_INITIALIZED" },
      select: { id: true, createdAt: true },
    }),
  ]);
  return {
    auditLogCount,
    sareaProfileCount,
    securityEventCount,
    profileCount: profiles,
    departmentCount: departments,
    roleCount: roles,
    workflowCount,
    openTaskCount,
    cybercrowInitialized: Boolean(cybercrowInitialized),
    cybercrowInitializedAt: cybercrowInitialized?.createdAt ?? null,
  };
}

/** Resolve tenant by slug and verify id matches (defense in depth for tenant routes). */
export async function assertTenantScope(slug: string, tenantId: string) {
  const tenant = await prisma.tenant.findFirst({
    where: { slug, id: tenantId },
    select: { id: true },
  });
  if (!tenant) {
    throw new Error("Tenant scope mismatch");
  }
  return tenant;
}

export async function ensureUniqueTenantSlug(baseName: string): Promise<string> {
  const base = slugifyOrganization(baseName) || "tenant";
  let slug = base;
  let n = 0;
  while (await prisma.tenant.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`.slice(0, 48);
  }
  return slug;
}
