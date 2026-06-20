import type {
  HostedSmsDeliveryPort,
  HostedSmsDeliveryOutcome,
  HostedSmsVerificationRequest,
} from "@/lib/phone/hosted-sms-delivery.contract";
import { PHONE_DELIVERY_FAILURE_CATEGORIES } from "@/lib/phone/phone-delivery-failure";

function missingConfig(): HostedSmsDeliveryOutcome {
  return {
    accepted: false,
    providerName: "unconfigured",
    failureCategory: PHONE_DELIVERY_FAILURE_CATEGORIES.CONFIGURATION_MISSING,
    retryable: false,
  };
}

/**
 * Hosted SMS adapter stub — fails closed until provider credentials and sender ID are approved.
 * Does not log OTP, full phone, API keys, or raw provider responses.
 */
export class HostedSmsDeliveryAdapter implements HostedSmsDeliveryPort {
  async sendVerificationCode(
    _input: HostedSmsVerificationRequest
  ): Promise<HostedSmsDeliveryOutcome> {
    const apiKey = process.env.C3_SMS_PROVIDER_API_KEY?.trim();
    const senderId = process.env.C3_SMS_SENDER_ID?.trim();
    const provider = process.env.C3_SMS_PROVIDER_NAME?.trim();

    if (!apiKey || !senderId || !provider) {
      return missingConfig();
    }

    return {
      accepted: false,
      providerName: provider,
      failureCategory: PHONE_DELIVERY_FAILURE_CATEGORIES.CONFIGURATION_MISSING,
      retryable: false,
    };
  }
}

export function resolveHostedSmsAdapter(): HostedSmsDeliveryPort {
  return new HostedSmsDeliveryAdapter();
}
