/**
 * Advisory notification digest core — CLI-safe (no server-only db import).
 * App wrapper: notification-digest.service.ts
 */

import type { PrismaClient } from "@prisma/client";
import { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import {
  legacyStatusFromSplit,
  severityForNotification,
} from "@/lib/services/platform-notification-links";
import { routes } from "@/lib/routes";
import {
  ADVISORY_SUBSCRIPTION_EVENT_TYPES,
  enrichPlatformNotificationRow,
  resolveNotificationActionLinks,
  type PlatformNotificationCategory,
  type PlatformNotificationRow,
  type PlatformNotificationSeverity,
} from "@/lib/services/platform-notification-links";

/** Digest counts open advisories by inbox triage, not delivery state. */
const DIGEST_OPEN_INBOX = "open" as const;

const GO_LIVE_ADVISORY_EVENT_TYPES = ["blueprint_ready", "tenant_provisioned"] as const;

export const DIGEST_ADVISORY_EVENT_TYPES = [
  ...ADVISORY_SUBSCRIPTION_EVENT_TYPES,
  ...GO_LIVE_ADVISORY_EVENT_TYPES,
] as const;


export type NotificationDigestPeriod = "daily" | "weekly" | "custom";

export type NotificationDigestCategoryCounts = {
  subscription: number;
  usage: number;
  go_live: number;
  plan_mismatch: number;
  missing_subscription: number;
  enterprise_capability: number;
};

export type NotificationDigestTenantSummary = {
  tenantId: string | null;
  tenantSlug: string | null;
  displayName: string | null;
  openCount: number;
  highCount: number;
};

export type NotificationDigestMeemSection = {
  tenantSlug: string;
  liveIdsSource: "live" | "unavailable";
  tenantId: string | null;
  requestId: string | null;
  blueprintId: string | null;
  referenceCode: string | null;
  notificationCountInPeriod: number;
  openCountInPeriod: number;
};

export type NotificationDigest = {
  period: NotificationDigestPeriod;
  generatedAt: Date;
  from: Date;
  to: Date;
  filters: {
    tenantSlug?: string;
    severity?: PlatformNotificationSeverity;
    category?: PlatformNotificationCategory;
  };
  totals: {
    advisoriesInPeriod: number;
    openAdvisories: number;
    reviewedCount: number;
    dismissedCount: number;
    highPriorityOpen: number;
    tenantsNeedingReview: number;
  };
  byCategory: NotificationDigestCategoryCounts;
  topTenants: NotificationDigestTenantSummary[];
  latestImportant: Array<{
    id: string;
    title: string;
    eventType: string;
    severity: PlatformNotificationSeverity;
    deliveryStatus: string;
    inboxStatus: string;
    createdAt: Date;
    tenantSlug: string | null;
    displayName: string | null;
    primaryLink: string | null;
    primaryLinkLabel: string | null;
  }>;
  meem: NotificationDigestMeemSection;
  actionLinks: {
    notificationCenter: string;
    adminOverview: string;
    meemInbox: string;
    meemPlanTab: string | null;
    meemLogisticsAudit: string;
  };
};

export type GenerateNotificationDigestInput = {
  from: Date;
  to: Date;
  tenantSlug?: string;
  severity?: PlatformNotificationSeverity;
  category?: PlatformNotificationCategory;
  period?: NotificationDigestPeriod;
};

/** Overrides shared by CLI and admin digest preview (no date window). */
export type NotificationDigestFilterOverrides = Omit<
  GenerateNotificationDigestInput,
  "from" | "to" | "period"
>;

function endOfDay(d: Date): Date {
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return end;
}

function parseDateOnly(raw: string | undefined): Date | undefined {
  if (!raw?.trim()) return undefined;
  const d = new Date(`${raw.trim()}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function parseDigestSeverity(
  raw: string | undefined
): PlatformNotificationSeverity | undefined {
  if (raw === "high" || raw === "medium" || raw === "low") return raw;
  return undefined;
}

export function parseDigestCategory(
  raw: string | undefined
): PlatformNotificationCategory | undefined {
  const normalized = raw?.trim().replace(/-/g, "_");
  if (
    normalized === "subscription" ||
    normalized === "usage" ||
    normalized === "go_live"
  ) {
    return normalized;
  }
  return undefined;
}

export function parseDigestFilterOverrides(input: {
  tenant?: string;
  category?: string;
  severity?: string;
}): NotificationDigestFilterOverrides {
  const tenantSlug = input.tenant?.trim() || undefined;
  const category = parseDigestCategory(input.category);
  const severity = parseDigestSeverity(input.severity);
  return { tenantSlug, category, severity };
}

function getCliArgValue(argv: string[], key: string): string | undefined {
  const prefix = `--${key}=`;
  for (let i = argv.length - 1; i >= 0; i--) {
    const arg = argv[i];
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
    if (arg === `--${key}` && argv[i + 1] && !argv[i + 1].startsWith("--")) {
      return argv[i + 1];
    }
  }
  return undefined;
}

export type ParsedDigestCliArgs = {
  mode: "dry" | "send";
  weekly: boolean;
  window: { from: Date; to: Date; period: NotificationDigestPeriod };
  filters: NotificationDigestFilterOverrides;
};

export function parseDigestCliArgs(argv: string[]): ParsedDigestCliArgs {
  const mode = argv.includes("--send") ? "send" : "dry";
  const weekly = argv.includes("--weekly");
  const filters = parseDigestFilterOverrides({
    tenant: getCliArgValue(argv, "tenant"),
    category: getCliArgValue(argv, "category"),
    severity: getCliArgValue(argv, "severity"),
  });

  const toRaw = getCliArgValue(argv, "to");
  const fromRaw = getCliArgValue(argv, "from");
  const daysRaw = getCliArgValue(argv, "days");

  const to = toRaw ? (parseDateOnly(toRaw) ? endOfDay(parseDateOnly(toRaw)!) : new Date()) : new Date();
  const fromParsed = parseDateOnly(fromRaw);

  if (fromParsed && (fromRaw || toRaw)) {
    return {
      mode,
      weekly,
      window: { from: fromParsed, to, period: "custom" },
      filters,
    };
  }

  const days = daysRaw ? Number.parseInt(daysRaw, 10) : NaN;
  if (!Number.isNaN(days) && days > 0) {
    return {
      mode,
      weekly,
      window: {
        from: new Date(to.getTime() - days * 24 * 60 * 60 * 1000),
        to,
        period: days === 7 && !fromRaw && !toRaw ? "weekly" : "custom",
      },
      filters,
    };
  }

  if (weekly) {
    return {
      mode,
      weekly: true,
      window: {
        from: new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000),
        to,
        period: "weekly",
      },
      filters,
    };
  }

  return {
    mode,
    weekly: false,
    window: {
      from: new Date(to.getTime() - 24 * 60 * 60 * 1000),
      to,
      period: "daily",
    },
    filters,
  };
}

function formatActiveFilters(digest: NotificationDigest): string | null {
  const parts: string[] = [];
  if (digest.filters.tenantSlug) parts.push(`tenant=${digest.filters.tenantSlug}`);
  if (digest.filters.severity) parts.push(`severity=${digest.filters.severity}`);
  if (digest.filters.category) parts.push(`category=${digest.filters.category}`);
  return parts.length > 0 ? parts.join(", ") : null;
}

async function resolveMeemIdsForDigest(db: PrismaClient): Promise<{
  tenantId: string | null;
  requestId: string | null;
  blueprintId: string | null;
  referenceCode: string | null;
  source: "live" | "unavailable";
}> {
  const fallback = {
    tenantId: null,
    requestId: null,
    blueprintId: null,
    referenceCode: MEEM_REFERENCE_CODE,
    source: "unavailable" as const,
  };

  const tenant = await db.tenant.findUnique({
    where: { slug: MEEM_TENANT_SLUG },
    select: {
      id: true,
      blueprint: {
        select: {
          id: true,
          request: { select: { id: true, referenceCode: true } },
        },
      },
    },
  });

  if (!tenant?.blueprint) return fallback;

  return {
    tenantId: tenant.id,
    requestId: tenant.blueprint.request.id,
    blueprintId: tenant.blueprint.id,
    referenceCode: tenant.blueprint.request.referenceCode,
    source: "live",
  };
}

function isDigestAdvisoryRow(row: PlatformNotificationRow): boolean {
  if ((DIGEST_ADVISORY_EVENT_TYPES as readonly string[]).includes(row.eventType)) {
    return true;
  }
  return row.parsed.isAdvisory && row.parsed.category !== "pipeline";
}

function matchesDigestCategory(
  row: PlatformNotificationRow,
  category?: PlatformNotificationCategory
): boolean {
  if (!category || category === "all") return true;
  return row.parsed.category === category;
}

function incrementCategoryCounts(
  counts: NotificationDigestCategoryCounts,
  row: PlatformNotificationRow
): void {
  const cat = row.parsed.category;
  if (cat === "subscription") counts.subscription += 1;
  if (cat === "usage") counts.usage += 1;
  if (cat === "go_live") counts.go_live += 1;
  if (row.eventType === "plan_mismatch_detected") counts.plan_mismatch += 1;
  if (row.eventType === "subscription_missing") counts.missing_subscription += 1;
  if (row.eventType === "enterprise_capability_detected") counts.enterprise_capability += 1;
}

function severityRank(severity: PlatformNotificationSeverity): number {
  if (severity === "high") return 0;
  if (severity === "medium") return 1;
  return 2;
}

export async function generateNotificationDigestWithPrisma(
  db: PrismaClient,
  input: GenerateNotificationDigestInput
): Promise<NotificationDigest> {
  const { from, to, tenantSlug, severity, category, period = "custom" } = input;

  const rows = await db.platformNotification.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      eventType: { in: [...DIGEST_ADVISORY_EVENT_TYPES] },
      ...(tenantSlug
        ? { metadata: { path: ["tenantSlug"], equals: tenantSlug } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const enriched = rows
    .map(enrichPlatformNotificationRow)
    .filter(isDigestAdvisoryRow)
    .filter((r) => matchesDigestCategory(r, category))
    .filter((r) => !severity || r.parsed.severity === severity);

  const byCategory: NotificationDigestCategoryCounts = {
    subscription: 0,
    usage: 0,
    go_live: 0,
    plan_mismatch: 0,
    missing_subscription: 0,
    enterprise_capability: 0,
  };

  let openAdvisories = 0;
  let reviewedCount = 0;
  let dismissedCount = 0;
  let highPriorityOpen = 0;
  const tenantOpen = new Map<
    string,
    {
      tenantId: string | null;
      slug: string | null;
      name: string | null;
      open: number;
      high: number;
    }
  >();

  for (const row of enriched) {
    incrementCategoryCounts(byCategory, row);
    if (row.parsed.inboxStatus === DIGEST_OPEN_INBOX) {
      openAdvisories += 1;
      if (row.parsed.severity === "high") highPriorityOpen += 1;
      const key = row.parsed.tenantId ?? row.parsed.tenantSlug ?? row.id;
      const existing = tenantOpen.get(key) ?? {
        tenantId: row.parsed.tenantId,
        slug: row.parsed.tenantSlug,
        name: row.parsed.displayName,
        open: 0,
        high: 0,
      };
      existing.open += 1;
      if (row.parsed.severity === "high") existing.high += 1;
      tenantOpen.set(key, existing);
    } else if (row.parsed.inboxStatus === "reviewed") {
      reviewedCount += 1;
    } else if (row.parsed.inboxStatus === "dismissed") {
      dismissedCount += 1;
    }
  }

  const topTenants: NotificationDigestTenantSummary[] = [...tenantOpen.values()]
    .map((v) => ({
      tenantId: v.tenantId,
      tenantSlug: v.slug,
      displayName: v.name,
      openCount: v.open,
      highCount: v.high,
    }))
    .sort((a, b) => b.highCount - a.highCount || b.openCount - a.openCount)
    .slice(0, 8);

  const latestImportant = enriched
    .filter((r) => r.parsed.inboxStatus === DIGEST_OPEN_INBOX)
    .sort(
      (a, b) =>
        severityRank(a.parsed.severity) - severityRank(b.parsed.severity) ||
        b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, 12)
    .map((row) => {
      const link = resolveNotificationActionLinks(row)[0] ?? null;
      return {
        id: row.id,
        title: row.parsed.title,
        eventType: row.eventType,
        severity: row.parsed.severity,
        deliveryStatus: row.parsed.deliveryStatus,
        inboxStatus: row.parsed.inboxStatus,
        createdAt: row.createdAt,
        tenantSlug: row.parsed.tenantSlug,
        displayName: row.parsed.displayName,
        primaryLink: link?.href ?? null,
        primaryLinkLabel: link?.label ?? null,
      };
    });

  const meemLive = await resolveMeemIdsForDigest(db);
  const meemRows = enriched.filter((r) => r.parsed.tenantSlug === MEEM_TENANT_SLUG);
  const meemOpen = meemRows.filter((r) => r.parsed.inboxStatus === DIGEST_OPEN_INBOX).length;

  const tenantsNeedingReview = new Set(
    enriched
      .filter(
        (r) =>
          r.parsed.inboxStatus === DIGEST_OPEN_INBOX &&
          r.parsed.severity === "high" &&
          r.parsed.tenantId
      )
      .map((r) => r.parsed.tenantId as string)
  ).size;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";

  return {
    period,
    generatedAt: new Date(),
    from,
    to,
    filters: { tenantSlug, severity, category },
    totals: {
      advisoriesInPeriod: enriched.length,
      openAdvisories,
      reviewedCount,
      dismissedCount,
      highPriorityOpen,
      tenantsNeedingReview,
    },
    byCategory,
    topTenants,
    latestImportant,
    meem: {
      tenantSlug: MEEM_TENANT_SLUG,
      liveIdsSource: meemLive.source,
      tenantId: meemLive.tenantId,
      requestId: meemLive.requestId,
      blueprintId: meemLive.blueprintId,
      referenceCode: meemLive.referenceCode,
      notificationCountInPeriod: meemRows.length,
      openCountInPeriod: meemOpen,
    },
    actionLinks: {
      notificationCenter: `${baseUrl}${routes.admin.notifications}`,
      adminOverview: `${baseUrl}${routes.admin.overview}`,
      meemInbox: `${baseUrl}${routes.admin.notifications}?tenant=${MEEM_TENANT_SLUG}`,
      meemPlanTab: meemLive.tenantId
        ? `${baseUrl}${routes.admin.tenant(meemLive.tenantId)}?tab=plan`
        : null,
      meemLogisticsAudit: `${baseUrl}${routes.admin.audit}?category=logistics&tenant=${MEEM_TENANT_SLUG}`,
    },
  };
}

export async function generateDailyNotificationDigestWithPrisma(
  db: PrismaClient,
  overrides: Omit<GenerateNotificationDigestInput, "from" | "to" | "period"> = {}
): Promise<NotificationDigest> {
  const to = new Date();
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
  return generateNotificationDigestWithPrisma(db, { ...overrides, from, to, period: "daily" });
}

export async function generateWeeklyNotificationDigestWithPrisma(
  db: PrismaClient,
  overrides: Omit<GenerateNotificationDigestInput, "from" | "to" | "period"> = {}
): Promise<NotificationDigest> {
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  return generateNotificationDigestWithPrisma(db, { ...overrides, from, to, period: "weekly" });
}

function formatDateRange(digest: NotificationDigest): string {
  return `${digest.from.toISOString().slice(0, 10)} → ${digest.to.toISOString().slice(0, 10)}`;
}

export function formatNotificationDigestText(digest: NotificationDigest): string {
  const activeFilters = formatActiveFilters(digest);
  const lines: string[] = [
    `Crow Ecosystem — advisory notification digest (${digest.period})`,
    `Generated: ${digest.generatedAt.toISOString()}`,
    `Window: ${formatDateRange(digest)}`,
    ...(activeFilters ? [`Filters: ${activeFilters}`] : []),
    "",
    "Summary",
    `  Advisories in period:     ${digest.totals.advisoriesInPeriod}`,
    `  Open (needs triage):      ${digest.totals.openAdvisories}`,
    `  Reviewed in period:       ${digest.totals.reviewedCount}`,
    `  Dismissed in period:      ${digest.totals.dismissedCount}`,
    `  High priority (open):     ${digest.totals.highPriorityOpen}`,
    `  Tenants needing review:   ${digest.totals.tenantsNeedingReview}`,
    "",
    "By category",
    `  Subscription:             ${digest.byCategory.subscription}`,
    `  Usage warnings:           ${digest.byCategory.usage}`,
    `  Go-live:                  ${digest.byCategory.go_live}`,
    `  Plan mismatch:            ${digest.byCategory.plan_mismatch}`,
    `  Missing subscription:     ${digest.byCategory.missing_subscription}`,
    `  Enterprise capability:    ${digest.byCategory.enterprise_capability}`,
    "",
    "MEEM (meem-global)",
    `  Live IDs source:          ${digest.meem.liveIdsSource}`,
    `  Notifications in window:  ${digest.meem.notificationCountInPeriod} (${digest.meem.openCountInPeriod} open)`,
    `  Tenant id:                ${digest.meem.tenantId ?? "—"}`,
    `  Reference:                ${digest.meem.referenceCode ?? "—"}`,
    "",
    "Top tenants (open advisories)",
  ];

  if (digest.topTenants.length === 0) {
    lines.push("  (none)");
  } else {
    for (const t of digest.topTenants) {
      const label = t.displayName ?? t.tenantSlug ?? t.tenantId ?? "unknown";
      lines.push(`  • ${label} — open ${t.openCount}, high ${t.highCount}`);
    }
  }

  lines.push("", "Latest important (open)");
  if (digest.latestImportant.length === 0) {
    lines.push("  (none)");
  } else {
    for (const n of digest.latestImportant) {
      const who = n.displayName ?? n.tenantSlug ?? "platform";
      lines.push(
        `  • [${n.severity}] ${n.title} — ${who} (inbox:${n.inboxStatus}, delivery:${n.deliveryStatus}, ${n.createdAt.toISOString().slice(0, 10)})`
      );
      if (n.primaryLink) lines.push(`      ${n.primaryLink}`);
    }
  }

  lines.push(
    "",
    "Action links",
    `  Notification center:  ${digest.actionLinks.notificationCenter}`,
    `  Admin overview:       ${digest.actionLinks.adminOverview}`,
    `  MEEM inbox:           ${digest.actionLinks.meemInbox}`,
    `  MEEM logistics audit: ${digest.actionLinks.meemLogisticsAudit}`
  );
  if (digest.actionLinks.meemPlanTab) {
    lines.push(`  MEEM plan tab:        ${digest.actionLinks.meemPlanTab}`);
  }

  lines.push(
    "",
    "Advisory only — no billing enforcement, tenant blocking, or automated schedules.",
    "— Crow Ecosystem platform"
  );

  return lines.join("\n");
}

export function formatNotificationDigestHtml(digest: NotificationDigest): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const row = (label: string, value: string | number) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${esc(label)}</td><td style="padding:4px 0"><strong>${esc(String(value))}</strong></td></tr>`;

  const latestItems = digest.latestImportant
    .map((n) => {
      const link = n.primaryLink
        ? `<a href="${esc(n.primaryLink)}">${esc(n.primaryLinkLabel ?? "Open")}</a>`
        : "";
      return `<li><strong>[${esc(n.severity)}]</strong> ${esc(n.title)} — ${esc(n.displayName ?? n.tenantSlug ?? "platform")} <span style="color:#64748b">(${esc(n.inboxStatus)} / ${esc(n.deliveryStatus)})</span> ${link}</li>`;
    })
    .join("");

  const filterNote = formatActiveFilters(digest);
  const actionLinkItems = [
    `<a href="${esc(digest.actionLinks.notificationCenter)}">Notification center</a>`,
    `<a href="${esc(digest.actionLinks.adminOverview)}">Admin overview</a>`,
    `<a href="${esc(digest.actionLinks.meemInbox)}">MEEM inbox</a>`,
    `<a href="${esc(digest.actionLinks.meemLogisticsAudit)}">MEEM logistics audit</a>`,
    ...(digest.actionLinks.meemPlanTab
      ? [`<a href="${esc(digest.actionLinks.meemPlanTab)}">MEEM plan tab</a>`]
      : []),
  ].join(" · ");

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;color:#0f172a;max-width:640px">
<h1 style="font-size:18px">Advisory notification digest (${esc(digest.period)})</h1>
<p style="color:#64748b;font-size:13px">Generated ${esc(digest.generatedAt.toISOString())} · ${esc(formatDateRange(digest))}${filterNote ? ` · Filters: ${esc(filterNote)}` : ""}</p>
<table>${row("Advisories in period", digest.totals.advisoriesInPeriod)}
${row("Open", digest.totals.openAdvisories)}
${row("Reviewed", digest.totals.reviewedCount)}
${row("Dismissed", digest.totals.dismissedCount)}
${row("High priority (open)", digest.totals.highPriorityOpen)}
${row("Tenants needing review", digest.totals.tenantsNeedingReview)}</table>
<h2 style="font-size:14px;margin-top:20px">By category</h2>
<table>
${row("Subscription", digest.byCategory.subscription)}
${row("Usage", digest.byCategory.usage)}
${row("Go-live", digest.byCategory.go_live)}
${row("Plan mismatch", digest.byCategory.plan_mismatch)}
${row("Missing subscription", digest.byCategory.missing_subscription)}
${row("Enterprise capability", digest.byCategory.enterprise_capability)}
</table>
<h2 style="font-size:14px;margin-top:20px">MEEM (${esc(MEEM_TENANT_SLUG)})</h2>
<p style="font-size:13px">Live IDs: ${esc(digest.meem.liveIdsSource)} · ${digest.meem.notificationCountInPeriod} in window (${digest.meem.openCountInPeriod} open)</p>
<h2 style="font-size:14px;margin-top:20px">Latest important</h2>
<ul style="font-size:13px;padding-left:20px">${latestItems || "<li>(none)</li>"}</ul>
<p style="font-size:12px;color:#64748b;margin-top:24px">Advisory only — no billing enforcement, tenant blocking, or automated schedules.</p>
<p style="font-size:13px">${actionLinkItems}</p>
</body></html>`;
}

export function resolveDigestRecipientEmail(): string | null {
  const candidates = [
    process.env.PIPELINE_NOTIFY_EMAIL_OVERRIDE,
    process.env.PLATFORM_NOTIFY_EMAIL,
    process.env.PLATFORM_ADMIN_EMAIL,
    process.env.NOTIFICATION_TEST_EMAIL,
  ];
  for (const raw of candidates) {
    const email = raw?.trim().toLowerCase();
    if (email) return email;
  }
  return null;
}

export const DIGEST_EVENT_TYPE = "advisory_digest";

export async function logDigestDeliveryWithPrisma(
  db: PrismaClient,
  input: {
    recipientEmail: string;
    subject: string;
    body: string;
    status: "logged" | "sent" | "skipped" | "failed";
    period: NotificationDigestPeriod;
    errorMessage?: string;
  }
) {
  const deliveryStatus = input.status;
  const inboxStatus = "open" as const;
  const metadata = {
    advisory: false,
    digest: true,
    period: input.period,
    manualSend: true,
  };
  await db.platformNotification.create({
    data: {
      eventType: DIGEST_EVENT_TYPE,
      recipientEmail: input.recipientEmail,
      subject: input.subject,
      body: input.body,
      status: legacyStatusFromSplit(deliveryStatus, inboxStatus),
      deliveryStatus,
      inboxStatus,
      severity: severityForNotification(DIGEST_EVENT_TYPE, deliveryStatus, metadata),
      errorMessage: input.errorMessage,
      metadata,
    },
  });
}
