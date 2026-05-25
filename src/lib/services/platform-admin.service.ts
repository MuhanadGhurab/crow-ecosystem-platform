import { prisma } from "@/lib/db";
import { PLATFORM_ENGINES } from "@/lib/constants/platform";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import type { LogisticsAuditFilter } from "@/lib/constants/cybercrow-audit-events";
import {
  logisticsAuditActionFilter,
  platformAuditActionFilter,
} from "@/lib/constants/cybercrow-audit-events";

export async function listPlatformAuditFeed(
  limit = 40,
  options?: { category?: LogisticsAuditFilter; tenantSlug?: string }
) {
  const category = options?.category ?? "all";
  const actionFilter =
    category === "logistics"
      ? logisticsAuditActionFilter()
      : category === "platform"
        ? platformAuditActionFilter()
        : {};

  const [cyberLogs, notifications] = await Promise.all([
    prisma.cybercrowAuditLog.findMany({
      where: {
        ...actionFilter,
        ...(options?.tenantSlug
          ? { tenant: { slug: options.tenantSlug } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        tenant: {
          select: { slug: true, organization: { select: { displayName: true } } },
        },
      },
    }),
    prisma.platformNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 20),
    }),
  ]);

  return { cyberLogs, notifications };
}

export function listPlatformDomains() {
  return PLATFORM_ENGINES;
}

export function listSecurityBaselines() {
  return SECURITY_PACKAGES.map((p) => ({
    key: p.key,
    name: p.nameEn,
    monthlyAddonSar: p.monthlyAddonSar,
    description: p.descriptionEn,
  }));
}

export async function listIntegrationConnections() {
  return prisma.integrationConnection.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function listSubscriptionPlansWithUsage() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { baseMonthlySar: "asc" },
    include: {
      _count: { select: { tenantSubscriptions: true } },
    },
  });
  return plans;
}

export async function listTenantSubscriptions() {
  return prisma.tenantSubscription.findMany({
    orderBy: { startedAt: "desc" },
    include: {
      plan: true,
      tenant: {
        select: {
          id: true,
          slug: true,
          organization: { select: { displayName: true } },
        },
      },
    },
  });
}
