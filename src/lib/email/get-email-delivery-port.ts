import { InMemoryEmailDeliveryAdapter } from "@/lib/email/in-memory-email-delivery.adapter";
import { MailpitEmailDeliveryAdapter } from "@/lib/email/mailpit-email-delivery.adapter";
import type { EmailDeliveryPort } from "@/lib/email/email-delivery.port";
import { getLocalEmailProvider } from "@/lib/auth/local-auth-mode";

let port: EmailDeliveryPort | null = null;

export function getEmailDeliveryPort(): EmailDeliveryPort {
  if (port) return port;

  const provider = getLocalEmailProvider();
  if (provider === "mailpit") {
    port = new MailpitEmailDeliveryAdapter();
    return port;
  }
  if (provider === "in-memory") {
    port = new InMemoryEmailDeliveryAdapter();
    return port;
  }

  port = new InMemoryEmailDeliveryAdapter();
  return port;
}

/** Test helper — reset singleton between tests. */
export function resetEmailDeliveryPortForTests(): void {
  port = null;
  InMemoryEmailDeliveryAdapter.reset();
}
