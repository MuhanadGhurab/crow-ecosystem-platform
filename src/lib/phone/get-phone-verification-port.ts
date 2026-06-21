import { getInMemoryPhoneVerificationAdapter } from "@/lib/phone/in-memory-phone-delivery.adapter";
import { HostedSmsPhoneVerificationAdapter } from "@/lib/phone/hosted-sms-phone-verification.adapter";
import { LocalDevPhoneVerificationDeliveryAdapter } from "@/lib/phone/local-dev-phone-delivery.adapter";
import type { PhoneVerificationDeliveryPort } from "@/lib/phone/phone-verification-delivery.port";

function isHostedRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function getPhoneVerificationDeliveryPort(): PhoneVerificationDeliveryPort {
  const mode = process.env.C3_PHONE_DELIVERY_MODE?.trim().toLowerCase();

  if (isHostedRuntime()) {
    if (mode !== "hosted-sms") {
      throw new Error(
        "C3_PHONE_DELIVERY_MODE must be hosted-sms on Vercel Preview/Production. " +
          "Console, local-dev, and in-memory adapters are blocked."
      );
    }
    return new HostedSmsPhoneVerificationAdapter();
  }

  if (mode === "in-memory" || process.env.NODE_ENV === "test") {
    return getInMemoryPhoneVerificationAdapter();
  }

  if (mode === "hosted-sms") {
    return new HostedSmsPhoneVerificationAdapter();
  }

  if (mode === "local-dev" || !mode) {
    return new LocalDevPhoneVerificationDeliveryAdapter();
  }

  throw new Error(`Unsupported C3_PHONE_DELIVERY_MODE: ${mode}`);
}
