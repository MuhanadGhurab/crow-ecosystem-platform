import { randomUUID } from "node:crypto";

import type {
  PhoneDeliveryPayload,
  PhoneDeliveryResult,
  PhoneVerificationDeliveryPort,
} from "@/lib/phone/phone-verification-delivery.port";
import { resolveHostedSmsAdapter } from "@/lib/phone/hosted-sms-delivery.adapter";
import { userMessageForPhoneDeliveryFailure } from "@/lib/phone/phone-delivery-failure";

const OTP_MESSAGE_PATTERN = /(\d{6})/;

function extractOtpFromMessage(message: string): string | null {
  const match = message.match(OTP_MESSAGE_PATTERN);
  return match?.[1] ?? null;
}

function isHostedRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "production"
  );
}

/** Bridges Crow OTP engine to HostedSmsDeliveryPort without vendor-owned lifecycle. */
export class HostedSmsPhoneVerificationAdapter implements PhoneVerificationDeliveryPort {
  async send(payload: PhoneDeliveryPayload): Promise<PhoneDeliveryResult> {
    const code = extractOtpFromMessage(payload.message);
    if (!code) {
      return {
        channel: "hosted-sms",
        status: "failed",
        error: userMessageForPhoneDeliveryFailure("CONFIGURATION_MISSING"),
      };
    }

    const adapter = resolveHostedSmsAdapter();
    const outcome = await adapter.sendVerificationCode({
      destinationE164: payload.toE164,
      code,
      locale: process.env.C3_SMS_DEFAULT_LOCALE?.trim() || "en",
      correlationId: randomUUID(),
    });

    if (!outcome.accepted) {
      const category = outcome.failureCategory ?? "UNKNOWN_PROVIDER_FAILURE";
      return {
        channel: "hosted-sms",
        status: "failed",
        providerMessageId: outcome.providerMessageReference,
        error: userMessageForPhoneDeliveryFailure(category),
      };
    }

    return {
      channel: "hosted-sms",
      status: "queued",
      providerMessageId: outcome.providerMessageReference,
    };
  }
}

export function assertPhoneDeliveryModeSafeForRuntime(): void {
  const mode = process.env.C3_PHONE_DELIVERY_MODE?.trim().toLowerCase();
  if (!isHostedRuntime()) return;

  if (mode !== "hosted-sms") {
    throw new Error(
      "Hosted Preview/Production requires C3_PHONE_DELIVERY_MODE=hosted-sms. " +
        "Local-dev and in-memory adapters are not permitted."
    );
  }
}
