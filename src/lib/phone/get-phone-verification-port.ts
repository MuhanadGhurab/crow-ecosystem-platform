import { getInMemoryPhoneVerificationAdapter } from "@/lib/phone/in-memory-phone-delivery.adapter";
import { LocalDevPhoneVerificationDeliveryAdapter } from "@/lib/phone/local-dev-phone-delivery.adapter";
import type { PhoneVerificationDeliveryPort } from "@/lib/phone/phone-verification-delivery.port";

export function getPhoneVerificationDeliveryPort(): PhoneVerificationDeliveryPort {
  const mode = process.env.C3_PHONE_DELIVERY_MODE?.trim().toLowerCase();

  if (mode === "in-memory" || process.env.NODE_ENV === "test") {
    return getInMemoryPhoneVerificationAdapter();
  }

  if (mode === "hosted-sms") {
    throw new Error(
      "C3_PHONE_DELIVERY_MODE=hosted-sms is not configured. Set SMS provider credentials or use local-dev/in-memory."
    );
  }

  return new LocalDevPhoneVerificationDeliveryAdapter();
}
