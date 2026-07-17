import type {
  PhoneDeliveryPayload,
  PhoneDeliveryResult,
  PhoneVerificationDeliveryPort,
} from "@/lib/phone/phone-verification-delivery.port";

/** In-memory adapter for unit tests — never sends real SMS. */
export class InMemoryPhoneVerificationDeliveryAdapter
  implements PhoneVerificationDeliveryPort
{
  readonly sent: PhoneDeliveryPayload[] = [];

  async send(payload: PhoneDeliveryPayload): Promise<PhoneDeliveryResult> {
    this.sent.push(payload);
    return { channel: "in-memory", status: "sent", providerMessageId: "mem-test" };
  }
}

let testAdapter: InMemoryPhoneVerificationDeliveryAdapter | null = null;

export function getInMemoryPhoneVerificationAdapter(): InMemoryPhoneVerificationDeliveryAdapter {
  if (!testAdapter) {
    testAdapter = new InMemoryPhoneVerificationDeliveryAdapter();
  }
  return testAdapter;
}

export function resetInMemoryPhoneVerificationAdapter(): void {
  testAdapter = null;
}
