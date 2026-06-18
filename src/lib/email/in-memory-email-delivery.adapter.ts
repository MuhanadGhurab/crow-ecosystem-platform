import type {
  EmailDeliveryPort,
  EmailDeliveryPayload,
  EmailDeliveryResult,
} from "@/lib/email/email-delivery.port";
import { redactEmailAddress } from "@/lib/email/email-redaction";

/** Test/dev adapter — logs delivery instead of sending. */
export class InMemoryEmailDeliveryAdapter implements EmailDeliveryPort {
  static readonly deliveries: EmailDeliveryPayload[] = [];

  async send(payload: EmailDeliveryPayload): Promise<EmailDeliveryResult> {
    InMemoryEmailDeliveryAdapter.deliveries.push(payload);
    if (process.env.NODE_ENV !== "test") {
      console.info("[C3 email]", redactEmailAddress(payload.to), payload.subject);
    }
    return {
      channel: "in-memory",
      status: "sent",
      providerMessageId: `mem-${InMemoryEmailDeliveryAdapter.deliveries.length}`,
    };
  }

  static reset(): void {
    InMemoryEmailDeliveryAdapter.deliveries.length = 0;
  }
}
