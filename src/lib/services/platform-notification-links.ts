/**
 * Pure notification inbox helpers (no Prisma) — shared by app services and CLI backfill scripts.
 */

import { routes } from "@/lib/routes";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import type { PlatformNotification } from "@prisma/client";

export const ADVISORY_SUBSCRIPTION_EVENT_TYPES = [
  "tenant_near_plan_limit",
  "tenant_over_recommended_limit",
  "enterprise_capability_detected",
  "subscription_missing",
  "plan_mismatch_detected",
  "upgrade_recommended",
] as const;

export const PIPELINE_EVENT_TYPES = [
  "request_received",
  "discovery_started",
  "blueprint_ready",
  "tenant_provisioned",
  "client_scope_approved",
  "client_review_note",
  "client_request_changes",
] as const;

export type PlatformNotificationCategory =
  | "subscription"
  | "usage"
  | "go_live"
  | "pipeline"
  | "all";

export type PlatformNotificationSeverity = "high" | "medium" | "low";

export type PlatformNotificationDeliveryStatus = "logged" | "sent" | "skipped" | "failed";
export type PlatformNotificationInboxStatus = "open" | "reviewed" | "dismissed";

export const PLATFORM_NOTIFICATION_DELIVERY_STATUSES = [
  "logged",
  "sent",
  "skipped",
  "failed",
] as const satisfies readonly PlatformNotificationDeliveryStatus[];

export const PLATFORM_NOTIFICATION_INBOX_STATUSES = [
  "open",
  "reviewed",
  "dismissed",
] as const satisfies readonly PlatformNotificationInboxStatus[];

const DELIVERY_STATUS_SET = new Set<string>(PLATFORM_NOTIFICATION_DELIVERY_STATUSES);
const INBOX_TRIAGE_STATUS_SET = new Set<string>(["reviewed", "dismissed"]);

export function resolveDeliveryStatus(row: {
  deliveryStatus?: string | null;
  status: string;
}): PlatformNotificationDeliveryStatus {
  if (row.deliveryStatus && DELIVERY_STATUS_SET.has(row.deliveryStatus)) {
    return row.deliveryStatus as PlatformNotificationDeliveryStatus;
  }
  if (DELIVERY_STATUS_SET.has(row.status)) {
    return row.status as PlatformNotificationDeliveryStatus;
  }
  return "logged";
}

export function resolveInboxStatus(row: {
  inboxStatus?: string | null;
  status: string;
}): PlatformNotificationInboxStatus {
  if (
    row.inboxStatus === "open" ||
    row.inboxStatus === "reviewed" ||
    row.inboxStatus === "dismissed"
  ) {
    return row.inboxStatus;
  }
  if (INBOX_TRIAGE_STATUS_SET.has(row.status)) {
    return row.status as PlatformNotificationInboxStatus;
  }
  return "open";
}

/** Legacy `status` column value for readers not yet on split fields. */
export function legacyStatusFromSplit(
  deliveryStatus: PlatformNotificationDeliveryStatus,
  inboxStatus: PlatformNotificationInboxStatus
): string {
  if (inboxStatus === "reviewed" || inboxStatus === "dismissed") return inboxStatus;
  return deliveryStatus;
}

export function buildNotificationDedupeKey(
  tenantId: string,
  eventType: string,
  at: Date = new Date()
): string {
  const dateBucket = at.toISOString().slice(0, 10);
  return `${tenantId}:${eventType}:${dateBucket}`;
}

export type PlatformNotificationMetadata = {
  tenantId?: string;
  tenantSlug?: string;
  displayName?: string;
  advisory?: boolean;
  blueprintId?: string;
  requestId?: string;
  referenceCode?: string;
  planKey?: string;
  organizationName?: string;
  [key: string]: string | number | boolean | null | undefined;
};

export type PlatformNotificationRow = PlatformNotification & {
  parsed: {
    category: PlatformNotificationCategory;
    severity: PlatformNotificationSeverity;
    deliveryStatus: PlatformNotificationDeliveryStatus;
    inboxStatus: PlatformNotificationInboxStatus;
    title: string;
    tenantSlug: string | null;
    tenantId: string | null;
    displayName: string | null;
    blueprintId: string | null;
    requestId: string | null;
    isAdvisory: boolean;
  };
};

export type NotificationActionLink = {
  href: string;
  label: string;
  kind:
    | "tenant_plan"
    | "blueprint"
    | "go_live"
    | "request"
    | "audit"
    | "meem_logistics"
    | "tenant_plan_by_slug";
};

export function parsePlatformNotificationMetadata(
  raw: unknown
): PlatformNotificationMetadata {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as PlatformNotificationMetadata;
}

export function categorizeNotificationEvent(eventType: string): PlatformNotificationCategory {
  if ((ADVISORY_SUBSCRIPTION_EVENT_TYPES as readonly string[]).includes(eventType)) {
    if (
      eventType === "tenant_near_plan_limit" ||
      eventType === "tenant_over_recommended_limit"
    ) {
      return "usage";
    }
    return "subscription";
  }
  if (eventType === "blueprint_ready" || eventType === "tenant_provisioned") {
    return "go_live";
  }
  if ((PIPELINE_EVENT_TYPES as readonly string[]).includes(eventType)) {
    return "pipeline";
  }
  return "pipeline";
}

export function severityForNotification(
  eventType: string,
  deliveryStatus: string,
  metadata: PlatformNotificationMetadata
): PlatformNotificationSeverity {
  if (deliveryStatus === "failed") return "high";
  if (
    eventType === "subscription_missing" ||
    eventType === "plan_mismatch_detected" ||
    eventType === "tenant_over_recommended_limit"
  ) {
    return "high";
  }
  if (
    eventType === "upgrade_recommended" ||
    eventType === "enterprise_capability_detected" ||
    eventType === "tenant_near_plan_limit"
  ) {
    return "medium";
  }
  if (metadata.advisory) return "medium";
  if (eventType === "client_request_changes" || eventType === "client_review_note") {
    return "medium";
  }
  return "low";
}

export function resolveNotificationActionLinks(
  row: PlatformNotificationRow
): NotificationActionLink[] {
  const links: NotificationActionLink[] = [];
  const { category, tenantId, tenantSlug, blueprintId, requestId, displayName } = row.parsed;
  const seen = new Set<string>();

  const push = (link: NotificationActionLink) => {
    if (seen.has(link.href)) return;
    seen.add(link.href);
    links.push(link);
  };

  if (category === "subscription" || category === "usage") {
    if (tenantId) {
      push({
        href: `${routes.admin.tenant(tenantId)}?tab=plan`,
        label: displayName ? `${displayName} — plan` : "Tenant plan",
        kind: "tenant_plan",
      });
    } else if (tenantSlug) {
      push({
        href: `${routes.admin.audit}?tenant=${encodeURIComponent(tenantSlug)}`,
        label: displayName ? `${displayName} — audit` : `/${tenantSlug} audit`,
        kind: "tenant_plan_by_slug",
      });
    }
  }

  if (category === "go_live" && blueprintId) {
    push({
      href: routes.blueprint(blueprintId).goLive,
      label: "Go-live",
      kind: "go_live",
    });
  }

  if (row.eventType === "blueprint_ready" && blueprintId) {
    push({
      href: routes.blueprint(blueprintId).overview,
      label: "Blueprint overview",
      kind: "blueprint",
    });
  }

  if (requestId) {
    push({
      href: routes.admin.request(requestId),
      label: "Request",
      kind: "request",
    });
  }

  if (tenantSlug && category !== "subscription" && category !== "usage") {
    push({
      href: `${routes.admin.audit}?tenant=${encodeURIComponent(tenantSlug)}`,
      label: "Tenant audit",
      kind: "audit",
    });
  }

  if (tenantSlug === MEEM_TENANT_SLUG) {
    push({
      href: `${routes.admin.audit}?category=logistics&tenant=${MEEM_TENANT_SLUG}`,
      label: "MEEM logistics audit",
      kind: "meem_logistics",
    });
  }

  if (
    tenantId &&
    (category === "pipeline" || category === "go_live") &&
    !links.some((l) => l.kind === "tenant_plan")
  ) {
    push({
      href: `${routes.admin.tenant(tenantId)}?tab=plan`,
      label: displayName ? `${displayName} — plan` : "Tenant plan",
      kind: "tenant_plan",
    });
  }

  return links;
}

export function resolveNotificationActionLink(
  row: PlatformNotificationRow
): NotificationActionLink | null {
  const links = resolveNotificationActionLinks(row);
  return links[0] ?? null;
}

export function displayTitleForNotification(n: {
  eventType: string;
  subject: string;
  metadata: PlatformNotificationMetadata;
}): string {
  const advisoryTitles: Record<string, string> = {
    tenant_near_plan_limit: "Review recommended — approaching plan limits",
    tenant_over_recommended_limit: "Review recommended — over recommended limits",
    enterprise_capability_detected: "Review recommended — enterprise-like capability",
    subscription_missing: "Review recommended — subscription record missing",
    plan_mismatch_detected: "Review recommended — plan key mismatch",
    upgrade_recommended: "Upgrade recommended",
    request_received: "Request received",
    discovery_started: "Discovery started",
    blueprint_ready: "Blueprint ready for review",
    tenant_provisioned: "Tenant provisioned — go-live advisory",
    client_scope_approved: "Client scope approved — ProCrow review",
    client_review_note: "Client review note — ProCrow inbox",
    client_request_changes: "Client requested changes — ProCrow review",
  };
  return advisoryTitles[n.eventType] ?? n.subject;
}

export function enrichPlatformNotificationRow(
  row: PlatformNotification
): PlatformNotificationRow {
  const metadata = parsePlatformNotificationMetadata(row.metadata);
  const category = categorizeNotificationEvent(row.eventType);
  const deliveryStatus = resolveDeliveryStatus(row);
  const inboxStatus = resolveInboxStatus(row);
  const computedSeverity = severityForNotification(
    row.eventType,
    deliveryStatus,
    metadata
  );
  return {
    ...row,
    parsed: {
      category,
      deliveryStatus,
      inboxStatus,
      severity:
        row.severity === "high" || row.severity === "medium" || row.severity === "low"
          ? row.severity
          : computedSeverity,
      title: displayTitleForNotification({
        eventType: row.eventType,
        subject: row.subject,
        metadata,
      }),
      tenantSlug: metadata.tenantSlug ?? null,
      tenantId: metadata.tenantId ?? null,
      displayName: metadata.displayName ?? null,
      blueprintId: metadata.blueprintId ?? null,
      requestId: metadata.requestId ?? null,
      isAdvisory:
        Boolean(metadata.advisory) ||
        (ADVISORY_SUBSCRIPTION_EVENT_TYPES as readonly string[]).includes(
          row.eventType as (typeof ADVISORY_SUBSCRIPTION_EVENT_TYPES)[number]
        ),
    },
  };
}

export type NotificationLinkReliabilityBucket =
  | "valid_tenant"
  | "valid_blueprint"
  | "valid_request"
  | "audit_only"
  | "none";

export type NotificationLinkReliabilitySummary = Record<
  NotificationLinkReliabilityBucket,
  number
>;

export function summarizeNotificationLinkReliability(
  rows: PlatformNotificationRow[]
): NotificationLinkReliabilitySummary {
  const summary: NotificationLinkReliabilitySummary = {
    valid_tenant: 0,
    valid_blueprint: 0,
    valid_request: 0,
    audit_only: 0,
    none: 0,
  };

  for (const row of rows) {
    const links = resolveNotificationActionLinks(row);
    const { tenantId, blueprintId, requestId } = row.parsed;

    const hasTenantPlan = links.some((l) => l.kind === "tenant_plan");
    const hasBlueprint = links.some((l) => l.kind === "blueprint" || l.kind === "go_live");
    const hasRequest = links.some((l) => l.kind === "request");
    const hasAuditFallback = links.some(
      (l) =>
        l.kind === "audit" ||
        l.kind === "tenant_plan_by_slug" ||
        l.kind === "meem_logistics"
    );

    if (tenantId && hasTenantPlan) summary.valid_tenant++;
    if (blueprintId && hasBlueprint) summary.valid_blueprint++;
    if (requestId && hasRequest) summary.valid_request++;

    if (links.length === 0) {
      summary.none++;
    } else if (
      !hasTenantPlan &&
      !hasBlueprint &&
      !hasRequest &&
      hasAuditFallback
    ) {
      summary.audit_only++;
    }
  }

  return summary;
}
