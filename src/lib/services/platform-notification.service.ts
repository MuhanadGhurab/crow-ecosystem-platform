/**
 * Platform notification inbox — advisory subscription events, pipeline email log, go-live signals.
 * Pure link/category helpers live in `platform-notification-links.ts` (CLI-safe, no Prisma).
 */

import { prisma } from "@/lib/db";
import type { PlatformNotification, Prisma } from "@prisma/client";
export {
  ADVISORY_SUBSCRIPTION_EVENT_TYPES,
  PIPELINE_EVENT_TYPES,
  categorizeNotificationEvent,
  severityForNotification,
  resolveNotificationActionLinks,
  resolveNotificationActionLink,
  displayTitleForNotification,
  enrichPlatformNotificationRow,
  summarizeNotificationLinkReliability,
  parsePlatformNotificationMetadata,
  type PlatformNotificationCategory,
  type PlatformNotificationSeverity,
  type PlatformNotificationMetadata,
  type PlatformNotificationRow,
  type NotificationActionLink,
  type NotificationLinkReliabilityBucket,
  type NotificationLinkReliabilitySummary,
} from "@/lib/services/platform-notification-links";

import {
  ADVISORY_SUBSCRIPTION_EVENT_TYPES,
  PIPELINE_EVENT_TYPES,
  enrichPlatformNotificationRow,
  parsePlatformNotificationMetadata,
  type PlatformNotificationCategory,
  type PlatformNotificationSeverity,
  type PlatformNotificationRow,
} from "@/lib/services/platform-notification-links";

export type PlatformNotificationStatusFilter =
  | "logged"
  | "sent"
  | "skipped"
  | "failed"
  | "reviewed"
  | "dismissed"
  | "open";

export type PlatformNotificationInboxFilters = {
  tenantSlug?: string;
  tenantId?: string;
  category?: PlatformNotificationCategory;
  severity?: PlatformNotificationSeverity;
  status?: PlatformNotificationStatusFilter;
  createdFrom?: Date;
  createdTo?: Date;
  limit?: number;
};

/** Delivery / inbox-open states — not reviewed or dismissed. */
export const PLATFORM_NOTIFICATION_DELIVERY_STATUSES = [
  "logged",
  "sent",
  "skipped",
  "failed",
] as const;

/** Admin triage terminal states (no email retry). */
export const PLATFORM_NOTIFICATION_INBOX_TRIAGE_STATUSES = ["reviewed", "dismissed"] as const;

const OPEN_STATUSES = PLATFORM_NOTIFICATION_DELIVERY_STATUSES;

function buildWhere(filters: PlatformNotificationInboxFilters): Prisma.PlatformNotificationWhereInput {
  const where: Prisma.PlatformNotificationWhereInput = {};
  const and: Prisma.PlatformNotificationWhereInput[] = [];

  if (filters.tenantId) {
    and.push({ metadata: { path: ["tenantId"], equals: filters.tenantId } });
  } else if (filters.tenantSlug) {
    and.push({ metadata: { path: ["tenantSlug"], equals: filters.tenantSlug } });
  }

  if (filters.category && filters.category !== "all") {
    const types =
      filters.category === "subscription"
        ? ADVISORY_SUBSCRIPTION_EVENT_TYPES.filter(
            (t) => t !== "tenant_near_plan_limit" && t !== "tenant_over_recommended_limit"
          )
        : filters.category === "usage"
          ? ["tenant_near_plan_limit", "tenant_over_recommended_limit"]
          : filters.category === "go_live"
            ? ["blueprint_ready", "tenant_provisioned"]
            : [...PIPELINE_EVENT_TYPES];
    and.push({ eventType: { in: types } });
  }

  if (filters.status) {
    if (filters.status === "open") {
      and.push({ status: { in: [...OPEN_STATUSES] } });
    } else {
      and.push({ status: filters.status });
    }
  }

  if (filters.createdFrom || filters.createdTo) {
    where.createdAt = {
      ...(filters.createdFrom ? { gte: filters.createdFrom } : {}),
      ...(filters.createdTo ? { lte: filters.createdTo } : {}),
    };
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

function matchesSeverity(
  row: PlatformNotificationRow,
  severity?: PlatformNotificationSeverity
): boolean {
  if (!severity) return true;
  return row.parsed.severity === severity;
}

export async function listPlatformNotificationInbox(
  filters: PlatformNotificationInboxFilters = {}
): Promise<PlatformNotificationRow[]> {
  const limit = filters.limit ?? 80;
  const rows = await prisma.platformNotification.findMany({
    where: buildWhere(filters),
    orderBy: { createdAt: "desc" },
    take: limit * 2,
  });

  return rows
    .map(enrichPlatformNotificationRow)
    .filter((r) => matchesSeverity(r, filters.severity))
    .slice(0, limit);
}

export async function listTenantAdvisoryNotifications(
  tenantId: string,
  tenantSlug: string,
  limit = 12
): Promise<PlatformNotificationRow[]> {
  const rows = await prisma.platformNotification.findMany({
    where: {
      OR: [
        { metadata: { path: ["tenantId"], equals: tenantId } },
        { metadata: { path: ["tenantSlug"], equals: tenantSlug } },
      ],
      eventType: { in: [...ADVISORY_SUBSCRIPTION_EVENT_TYPES] },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(enrichPlatformNotificationRow);
}

export type PlatformNotificationInboxSummary = {
  recentAdvisoryCount: number;
  highPriorityCount: number;
  tenantsNeedingReview: number;
  latest: PlatformNotificationRow[];
  /** When summary aggregates were computed (overview / notification center). */
  lastUpdatedAt: Date;
};

export async function getPlatformNotificationInboxSummary(): Promise<PlatformNotificationInboxSummary> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentRows, highRows, latestRaw] = await Promise.all([
    prisma.platformNotification.findMany({
      where: {
        createdAt: { gte: since },
        eventType: { in: [...ADVISORY_SUBSCRIPTION_EVENT_TYPES] },
        status: { in: [...OPEN_STATUSES] },
      },
      select: { id: true, metadata: true },
    }),
    prisma.platformNotification.findMany({
      where: {
        status: { in: [...OPEN_STATUSES] },
        eventType: {
          in: [
            "subscription_missing",
            "plan_mismatch_detected",
            "tenant_over_recommended_limit",
            "upgrade_recommended",
          ],
        },
      },
      select: { id: true, metadata: true },
    }),
    prisma.platformNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const tenantIds = new Set<string>();
  for (const row of highRows) {
    const m = parsePlatformNotificationMetadata(row.metadata);
    if (m.tenantId) tenantIds.add(m.tenantId);
  }

  return {
    recentAdvisoryCount: recentRows.length,
    highPriorityCount: highRows.length,
    tenantsNeedingReview: tenantIds.size,
    latest: latestRaw.map(enrichPlatformNotificationRow),
    lastUpdatedAt: new Date(),
  };
}

export async function updatePlatformNotificationStatus(
  id: string,
  status: "reviewed" | "dismissed"
): Promise<PlatformNotification> {
  return prisma.platformNotification.update({
    where: { id },
    data: { status },
  });
}
