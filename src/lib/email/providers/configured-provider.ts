/**
 * M4D — Resend-backed email provider (selected when RESEND_API_KEY is configured).
 */

import type { InviteEmailDeliverySummary } from "@/lib/email/email-delivery-result";
import { summarizeDeliveryError } from "@/lib/email/email-delivery-result";
import type { EmailProviderConfig } from "@/lib/email/email-provider-config";
import type { BusinessPortalInviteEmailPayload, EmailProvider } from "@/lib/email/email-provider";
import { buildBusinessPortalInviteEmail } from "@/lib/email/templates/business-portal-invite-email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeRecipient(email: string): string {
  return email.trim().toLowerCase();
}

export function createConfiguredEmailProvider(config: EmailProviderConfig): EmailProvider {
  return {
    async sendBusinessPortalInviteEmail(
      payload: BusinessPortalInviteEmailPayload
    ): Promise<InviteEmailDeliverySummary> {
      const recipientEmail = normalizeRecipient(payload.recipientEmail);
      if (!recipientEmail || !EMAIL_PATTERN.test(recipientEmail)) {
        return {
          outcome: "invalid_recipient",
          operatorMessage: "Invite created, but the email address is not valid for delivery.",
        };
      }

      const { subject, text, html } = buildBusinessPortalInviteEmail(payload);

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: config.fromAddress,
            to: [recipientEmail],
            subject,
            text,
            html,
          }),
        });

        if (!res.ok) {
          const status = res.status;
          if (status === 422 || status === 400) {
            return {
              outcome: "provider_rejected",
              operatorMessage:
                "Invite created, but the email provider rejected delivery. Copy and send the invite link manually.",
            };
          }
          return {
            outcome: "delivery_error",
            operatorMessage:
              "Invite created, but the email could not be delivered. Copy and send the invite link manually.",
          };
        }

        return {
          outcome: "delivered",
          operatorMessage: "Invite email delivered.",
        };
      } catch (err) {
        return {
          outcome: "delivery_error",
          operatorMessage: summarizeDeliveryError(err),
        };
      }
    },
  };
}
