import type { HostedSmsDeliveryPort } from "@/lib/phone/hosted-sms-delivery.contract";
import { resolveHostedSmsProvider } from "@/lib/phone/hosted-sms-config";
import { UnifonicSmsDeliveryAdapter } from "@/lib/phone/unifonic-sms-delivery.adapter";

export function resolveHostedSmsAdapter(): HostedSmsDeliveryPort {
  const provider = resolveHostedSmsProvider();

  if (provider === "unifonic") {
    return new UnifonicSmsDeliveryAdapter();
  }

  throw new Error(
    provider
      ? `Unsupported C3_SMS_PROVIDER: ${provider}. Only unifonic is implemented.`
      : "C3_SMS_PROVIDER is required when C3_PHONE_DELIVERY_MODE=hosted-sms."
  );
}
