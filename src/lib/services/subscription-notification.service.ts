/**
 * Advisory subscription events — platform_notifications + optional CyberCrow audit.
 * Deduped to avoid spam on repeated page loads (24h window per tenant + event).
 */

import { prisma } from "@/lib/db";
import {
  buildNotificationDedupeKey,
  legacyStatusFromSplit,
  severityForNotification,
} from "@/lib/services/platform-notification-links";
import type { SubscriptionPlatformSummary } from "@/lib/services/subscription-capability.service";
import type { TenantUsageSignals } from "@/lib/services/usage-signals.service";
import type { CapabilityReadinessResult } from "@/lib/services/capability-readiness.service";

export type AdvisorySubscriptionEventType =
  | "tenant_near_plan_limit"
  | "tenant_over_recommended_limit"
  | "enterprise_capability_detected"
  | "subscription_missing"
  | "plan_mismatch_detected"
  | "upgrade_recommended";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

const EVENT_SUBJECTS: Record<AdvisorySubscriptionEventType, string> = {
  tenant_near_plan_limit: "Review recommended — approaching plan limits",
  tenant_over_recommended_limit: "Review recommended — over recommended limits",
  enterprise_capability_detected: "Review recommended — enterprise-like capability",
  subscription_missing: "Review recommended — subscription record missing",
  plan_mismatch_detected: "Review recommended — plan key mismatch",
  upgrade_recommended: "Upgrade recommended — usage and capability review",
};

/**
 * Dedupe: same tenant + eventType within 24h, regardless of inbox triage (reviewed/dismissed).
 * Prevents admin overview / tenant plan tab from re-emitting on every load.
 */
async function wasRecentlyNotified(
  eventType: AdvisorySubscriptionEventType,
  tenantId: string
): Promise<boolean> {
  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const dedupeKey = buildNotificationDedupeKey(tenantId, eventType);
  const recent = await prisma.platformNotification.findFirst({
    where: {
      OR: [
        { dedupeKey },
        {
          eventType,
          createdAt: { gte: since },
          metadata: { path: ["tenantId"], equals: tenantId },
        },
      ],
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });
  return Boolean(recent);
}

async function logCybercrowAdvisoryAudit(input: {
  tenantId: string;
  eventType: AdvisorySubscriptionEventType;
  message: string;
}) {
  try {
    await prisma.cybercrowAuditLog.create({
      data: {
        tenantId: input.tenantId,
        action: "SUBSCRIPTION_ADVISORY",
        entityType: "tenant_subscription",
        entityId: input.tenantId,
        metadata: { eventType: input.eventType, message: input.message, advisory: true },
      },
    });
  } catch {
    /* advisory only — never block */
  }
}

/** Idempotent advisory log — skips if same tenant+event within 24h. */
export async function emitAdvisorySubscriptionEvent(input: {
  eventType: AdvisorySubscriptionEventType;
  tenantId: string;
  tenantSlug: string;
  displayName: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
  skipAudit?: boolean;
}): Promise<boolean> {
  if (await wasRecentlyNotified(input.eventType, input.tenantId)) {
    return false;
  }

  const deliveryStatus = "logged" as const;
  const inboxStatus = "open" as const;
  const metadata = {
    tenantId: input.tenantId,
    tenantSlug: input.tenantSlug,
    displayName: input.displayName,
    advisory: true,
    dedupeWindowHours: 24,
    ...input.metadata,
  };
  const severity = severityForNotification(input.eventType, deliveryStatus, metadata);
  const dedupeKey = buildNotificationDedupeKey(input.tenantId, input.eventType);

  await prisma.platformNotification.create({
    data: {
      eventType: input.eventType,
      recipientEmail: PLATFORM_ADVISORY_EMAIL,
      subject: EVENT_SUBJECTS[input.eventType],
      body: `${input.displayName} (/${input.tenantSlug})\n\n${input.message}`,
      status: legacyStatusFromSplit(deliveryStatus, inboxStatus),
      deliveryStatus,
      inboxStatus,
      severity,
      dedupeKey,
      metadata,
    },
  });

  if (!input.skipAudit) {
    await logCybercrowAdvisoryAudit({
      tenantId: input.tenantId,
      eventType: input.eventType,
      message: input.message,
    });
  }

  return true;
}

export async function evaluateTenantSubscriptionAdvisories(input: {
  tenantId: string;
  tenantSlug: string;
  displayName: string;
  usageSignals: TenantUsageSignals | null;
  readiness: CapabilityReadinessResult;
}): Promise<number> {
  let emitted = 0;

  const emit = async (
    eventType: AdvisorySubscriptionEventType,
    message: string,
    metadata?: Record<string, string | number | boolean | null>
  ) => {
    const ok = await emitAdvisorySubscriptionEvent({
      eventType,
      tenantId: input.tenantId,
      tenantSlug: input.tenantSlug,
      displayName: input.displayName,
      message,
      metadata,
    });
    if (ok) emitted += 1;
  };

  for (const w of input.readiness.warnings) {
    if (w.code === "missing_tenant_subscription") {
      await emit("subscription_missing", w.message);
    }
    if (w.code === "plan_key_mismatch") {
      await emit("plan_mismatch_detected", w.message);
    }
  }

  const signals = input.usageSignals;
  if (signals) {
    if (signals.overallStatus === "near_limit") {
      await emit(
        "tenant_near_plan_limit",
        signals.upgradeNote ??
          "Tenant usage is approaching recommended plan bands (advisory only)."
      );
    }
    if (
      signals.overallStatus === "over_recommended_limit" ||
      signals.overallStatus === "upgrade_recommended"
    ) {
      await emit(
        "tenant_over_recommended_limit",
        signals.upgradeNote ?? "Tenant usage exceeds recommended plan bands."
      );
      if (signals.overallStatus === "upgrade_recommended") {
        await emit(
          "upgrade_recommended",
          signals.upgradeNote ?? "Upgrade recommended based on usage signals."
        );
      }
    }
  }

  return emitted;
}

/** Called from admin overview aggregation — evaluates platform summary rows once per load. */
export async function emitSubscriptionAdvisoriesFromPlatformSummary(
  summary: SubscriptionPlatformSummary
): Promise<number> {
  let emitted = 0;

  for (const t of summary.tenantsMissingSubscription) {
    const ok = await emitAdvisorySubscriptionEvent({
      eventType: "subscription_missing",
      tenantId: t.id,
      tenantSlug: t.slug,
      displayName: t.displayName,
      message:
        "No TenantSubscription row — plan capabilities inferred from Tenant.planKey only.",
    });
    if (ok) emitted += 1;
  }

  for (const t of summary.tenantsWithPlanKeyMismatch) {
    const ok = await emitAdvisorySubscriptionEvent({
      eventType: "plan_mismatch_detected",
      tenantId: t.id,
      tenantSlug: t.slug,
      displayName: t.displayName,
      message: `Tenant.planKey (${t.tenantPlan}) differs from TenantSubscription plan (${t.subscriptionPlan}).`,
      metadata: { tenantPlan: t.tenantPlan, subscriptionPlan: t.subscriptionPlan },
    });
    if (ok) emitted += 1;
  }

  for (const t of summary.tenantsNearLimit) {
    const ok = await emitAdvisorySubscriptionEvent({
      eventType: "tenant_near_plan_limit",
      tenantId: t.id,
      tenantSlug: t.slug,
      displayName: t.displayName,
      message: `Usage near recommended limits on ${t.planKey} plan.`,
      metadata: { planKey: t.planKey },
    });
    if (ok) emitted += 1;
  }

  for (const t of summary.tenantsOverRecommendedLimit) {
    const ok = await emitAdvisorySubscriptionEvent({
      eventType: "tenant_over_recommended_limit",
      tenantId: t.id,
      tenantSlug: t.slug,
      displayName: t.displayName,
      message: t.highlight ?? `Usage exceeds recommended limits on ${t.planKey} plan.`,
      metadata: { planKey: t.planKey },
    });
    if (ok) emitted += 1;
    if (t.highlight?.includes("Upgrade") || summary.planHealthSummary.upgradeRecommended > 0) {
      const upgradeOk = await emitAdvisorySubscriptionEvent({
        eventType: "upgrade_recommended",
        tenantId: t.id,
        tenantSlug: t.slug,
        displayName: t.displayName,
        message: t.highlight ?? "Upgrade recommended based on platform usage review.",
      });
      if (upgradeOk) emitted += 1;
    }
  }

  for (const t of summary.tenantsEnterpriseLikeOnLowerPlans) {
    const ok = await emitAdvisorySubscriptionEvent({
      eventType: "enterprise_capability_detected",
      tenantId: t.id,
      tenantSlug: t.slug,
      displayName: t.displayName,
      message: t.highlight ?? "Enterprise-like identity configuration detected on a lower plan tier.",
      metadata: { planKey: t.planKey },
    });
    if (ok) emitted += 1;
  }

  return emitted;
}
