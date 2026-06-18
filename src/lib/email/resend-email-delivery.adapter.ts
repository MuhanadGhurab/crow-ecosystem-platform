import type {
  EmailDeliveryPort,
  EmailDeliveryPayload,
  EmailDeliveryResult,
} from "@/lib/email/email-delivery.port";
import {
  summarizeDeliveryError,
  summarizeProviderHttpFailure,
} from "@/lib/email/email-delivery-error";
import type { HostedEmailProviderConfig } from "@/lib/email/email-provider-config";
import { redactEmailAddress } from "@/lib/email/email-redaction";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResendSendResponse = {
  id?: string;
};

export class ResendEmailDeliveryAdapter implements EmailDeliveryPort {
  constructor(private readonly config: HostedEmailProviderConfig) {}

  async send(payload: EmailDeliveryPayload): Promise<EmailDeliveryResult> {
    const recipient = payload.to.trim().toLowerCase();
    if (!recipient || !EMAIL_PATTERN.test(recipient)) {
      return {
        channel: "resend",
        status: "failed",
        error: "Invalid recipient address.",
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.config.fromAddress,
          to: [recipient],
          subject: payload.subject,
          text: payload.text,
          html: payload.html,
        }),
      });

  if (!response.ok) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "[C3 email] Resend delivery failed for",
        redactEmailAddress(recipient),
        `status=${response.status}`
      );
    }
    if (
      process.env.C3_REGISTRATION_DIAGNOSTICS === "true" &&
      process.env.VERCEL_ENV === "preview"
    ) {
      console.error(
        "[c3-registration]",
        JSON.stringify({
          c3_registration: true,
          stage: "OTP_DELIVERY_FAILED",
          httpStatus: response.status,
          errorClass: summarizeProviderHttpFailure(response.status),
        })
      );
    }
        return {
          channel: "resend",
          status: "failed",
          error: summarizeProviderHttpFailure(response.status),
        };
      }

      let parsed: ResendSendResponse = {};
      try {
        parsed = (await response.json()) as ResendSendResponse;
      } catch {
        /* optional body */
      }

      if (process.env.NODE_ENV !== "test") {
        console.info(
          "[C3 email] Resend accepted delivery for",
          redactEmailAddress(recipient),
          parsed.id ? `messageId=${parsed.id}` : ""
        );
      }

      return {
        channel: "resend",
        status: "sent",
        providerMessageId: parsed.id,
      };
    } catch (err) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          "[C3 email] Resend transport error for",
          redactEmailAddress(recipient)
        );
      }
      return {
        channel: "resend",
        status: "failed",
        error: summarizeDeliveryError(err),
      };
    }
  }
}
