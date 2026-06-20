import { randomUUID } from "node:crypto";
import { normalizeEmail } from "@/lib/account/email-normalize";
import {
  findPlatformAccountByEmailNormalized,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";
import { buildCrowPasswordChangedEmail } from "@/lib/email/templates/crow-password-changed-email";
import { getEmailDeliveryPort } from "@/lib/email/get-email-delivery-port";

export type PasswordRecoveryOutcomeCategory =
  | "accepted"
  | "throttled"
  | "provider_error"
  | "misconfigured";

export function createPasswordRecoverySupportRef(): string {
  return randomUUID().slice(0, 8);
}

type PasswordRecoveryAuditEvent =
  | "password_recovery_requested"
  | "password_recovery_succeeded"
  | "password_recovery_failed";

export async function recordPasswordRecoveryAuditIfKnown(
  email: string,
  eventType: PasswordRecoveryAuditEvent,
  metadata: Record<string, string | number | boolean>
): Promise<void> {
  try {
    const account = await findPlatformAccountByEmailNormalized(normalizeEmail(email));
    if (!account) return;
    await recordPlatformAccountAudit(
      account.id,
      eventType as Parameters<typeof recordPlatformAccountAudit>[1],
      metadata
    );
  } catch {
    /* audit must not block recovery UX */
  }
}

export async function sendPasswordChangedNotification(
  email: string,
  supportRef: string
): Promise<{ sent: boolean }> {
  const changedAtIso = new Date().toISOString();
  const content = buildCrowPasswordChangedEmail({ changedAtIso });
  try {
    const port = getEmailDeliveryPort();
    await port.send({
      to: email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    return { sent: true };
  } catch (err) {
    console.warn("[password-recovery] notification failed", {
      ref: supportRef,
      outcome: "notification_failed",
      detail: err instanceof Error ? err.message.slice(0, 120) : "unknown",
    });
    return { sent: false };
  }
}

export function logPasswordRecoveryOutcome(
  category: PasswordRecoveryOutcomeCategory,
  supportRef: string
): void {
  console.info("[password-recovery]", {
    ref: supportRef,
    outcome: category,
  });
}
