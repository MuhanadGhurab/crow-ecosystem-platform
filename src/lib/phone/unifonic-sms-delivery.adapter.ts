import type {
  HostedSmsDeliveryPort,
  HostedSmsDeliveryOutcome,
  HostedSmsVerificationRequest,
} from "@/lib/phone/hosted-sms-delivery.contract";
import { buildOtpSmsBody } from "@/lib/phone/otp-sms-templates";
import { PHONE_DELIVERY_FAILURE_CATEGORIES } from "@/lib/phone/phone-delivery-failure";
import { isPreviewPhoneDestinationAllowed } from "@/lib/phone/preview-phone-allowlist";
import {
  mapUnifonicHttpStatus,
  unifonicRecipientFromE164,
} from "@/lib/phone/unifonic-response-mapper";

const DEFAULT_ENDPOINT = "https://el.cloud.unifonic.com/rest/SMS/messages";
const REQUEST_TIMEOUT_MS = 15_000;
const OTP_MINUTES = 10;

function configMissing(): HostedSmsDeliveryOutcome {
  return {
    accepted: false,
    providerName: "unifonic",
    failureCategory: PHONE_DELIVERY_FAILURE_CATEGORIES.CONFIGURATION_MISSING,
    retryable: false,
  };
}

type UnifonicSuccessShape = {
  data?: { MessageID?: string | number; messageId?: string | number };
  messageId?: string | number;
};

function extractMessageReference(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const data = payload as UnifonicSuccessShape;
  const id = data.data?.MessageID ?? data.data?.messageId ?? data.messageId;
  return id != null ? String(id) : undefined;
}

/**
 * Unifonic REST SMS transport — Crow OTP engine remains authoritative.
 * Does not log OTP, full E.164, AppSid, Authorization, or raw provider bodies.
 */
export class UnifonicSmsDeliveryAdapter implements HostedSmsDeliveryPort {
  async sendVerificationCode(
    input: HostedSmsVerificationRequest
  ): Promise<HostedSmsDeliveryOutcome> {
    const appSid = process.env.C3_SMS_PROVIDER_API_KEY?.trim();
    const senderId = process.env.C3_SMS_SENDER_ID?.trim();
    const endpoint = process.env.C3_SMS_API_BASE_URL?.trim() || DEFAULT_ENDPOINT;

    if (!appSid || !senderId) {
      return configMissing();
    }

    if (!isPreviewPhoneDestinationAllowed(input.destinationE164)) {
      return {
        accepted: false,
        providerName: "unifonic",
        failureCategory: PHONE_DELIVERY_FAILURE_CATEGORIES.DESTINATION_BLOCKED,
        retryable: false,
      };
    }

    const recipient = unifonicRecipientFromE164(input.destinationE164);
    if (recipient.length < 8) {
      return {
        accepted: false,
        providerName: "unifonic",
        failureCategory: PHONE_DELIVERY_FAILURE_CATEGORIES.INVALID_DESTINATION,
        retryable: false,
      };
    }

    const body = buildOtpSmsBody({
      code: input.code,
      minutes: OTP_MINUTES,
      locale: input.locale,
    });

    const form = new URLSearchParams({
      AppSid: appSid,
      SenderID: senderId,
      Recipient: recipient,
      Body: body,
      CorrelationID: input.correlationId,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
        signal: controller.signal,
      });

      if (!response.ok) {
        const mapped = mapUnifonicHttpStatus(response.status);
        return {
          accepted: false,
          providerName: "unifonic",
          failureCategory: mapped.category,
          retryable: mapped.retryable,
        };
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        payload = undefined;
      }

      return {
        accepted: true,
        providerName: "unifonic",
        providerMessageReference: extractMessageReference(payload),
        retryable: false,
      };
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return {
        accepted: false,
        providerName: "unifonic",
        failureCategory: aborted
          ? PHONE_DELIVERY_FAILURE_CATEGORIES.PROVIDER_UNAVAILABLE
          : PHONE_DELIVERY_FAILURE_CATEGORIES.UNKNOWN_PROVIDER_FAILURE,
        retryable: true,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
