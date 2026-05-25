/**
 * Advisory notification digest — app entry (uses server prisma).
 * CLI scripts import notification-digest-core.ts directly.
 */

import { prisma } from "@/lib/db";
import {
  generateDailyNotificationDigestWithPrisma,
  generateNotificationDigestWithPrisma,
  generateWeeklyNotificationDigestWithPrisma,
  logDigestDeliveryWithPrisma,
  type GenerateNotificationDigestInput,
  type NotificationDigest,
  type NotificationDigestPeriod,
} from "@/lib/services/notification-digest-core";

export {
  DIGEST_ADVISORY_EVENT_TYPES,
  DIGEST_EVENT_TYPE,
  formatNotificationDigestHtml,
  formatNotificationDigestText,
  parseDigestCategory,
  parseDigestFilterOverrides,
  parseDigestSeverity,
  resolveDigestRecipientEmail,
  type NotificationDigest,
  type NotificationDigestCategoryCounts,
  type NotificationDigestFilterOverrides,
  type NotificationDigestMeemSection,
  type NotificationDigestPeriod,
  type NotificationDigestTenantSummary,
  type GenerateNotificationDigestInput,
} from "@/lib/services/notification-digest-core";

export async function generateNotificationDigest(
  input: GenerateNotificationDigestInput
): Promise<NotificationDigest> {
  return generateNotificationDigestWithPrisma(prisma, input);
}

export async function generateDailyNotificationDigest(
  overrides: Omit<GenerateNotificationDigestInput, "from" | "to" | "period"> = {}
): Promise<NotificationDigest> {
  return generateDailyNotificationDigestWithPrisma(prisma, overrides);
}

export async function generateWeeklyNotificationDigest(
  overrides: Omit<GenerateNotificationDigestInput, "from" | "to" | "period"> = {}
): Promise<NotificationDigest> {
  return generateWeeklyNotificationDigestWithPrisma(prisma, overrides);
}

export async function logDigestDelivery(input: {
  recipientEmail: string;
  subject: string;
  body: string;
  status: "logged" | "sent" | "skipped" | "failed";
  period: NotificationDigestPeriod;
  errorMessage?: string;
}) {
  return logDigestDeliveryWithPrisma(prisma, input);
}
