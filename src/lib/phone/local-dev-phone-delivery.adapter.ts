import type {
  PhoneDeliveryPayload,
  PhoneDeliveryResult,
  PhoneVerificationDeliveryPort,
} from "@/lib/phone/phone-verification-delivery.port";

/**
 * Local development adapter — logs masked destination only (never the OTP body in production logs).
 * Wire to Mailpit SMS webhook or console in dev.
 */
export class LocalDevPhoneVerificationDeliveryAdapter
  implements PhoneVerificationDeliveryPort
{
  async send(payload: PhoneDeliveryPayload): Promise<PhoneDeliveryResult> {
    const masked = payload.toE164.replace(/\d(?=\d{2})/g, "•");
    console.info("[C3 phone-dev] SMS queued", { to: masked, bytes: payload.message.length });
    return { channel: "local-dev", status: "sent", providerMessageId: "local-dev" };
  }
}
