import { InMemoryEmailDeliveryAdapter } from "@/lib/email/in-memory-email-delivery.adapter";
import { MailpitEmailDeliveryAdapter } from "@/lib/email/mailpit-email-delivery.adapter";
import { ResendEmailDeliveryAdapter } from "@/lib/email/resend-email-delivery.adapter";
import type { EmailDeliveryPort } from "@/lib/email/email-delivery.port";
import { resolveHostedEmailProviderConfig } from "@/lib/email/email-provider-config";
import {
  assertHostedEmailProviderConfigured,
  resolveEmailDeliveryProvider,
} from "@/lib/email/email-provider-selection";

let port: EmailDeliveryPort | null = null;

export function getEmailDeliveryPort(): EmailDeliveryPort {
  if (port) return port;

  const provider = resolveEmailDeliveryProvider();

  if (provider === "resend") {
    assertHostedEmailProviderConfigured();
    const config = resolveHostedEmailProviderConfig();
    if (!config) {
      throw new Error("Hosted Resend configuration is incomplete.");
    }
    port = new ResendEmailDeliveryAdapter(config);
    return port;
  }

  if (provider === "mailpit") {
    port = new MailpitEmailDeliveryAdapter();
    return port;
  }

  if (provider === "in-memory") {
    port = new InMemoryEmailDeliveryAdapter();
    return port;
  }

  throw new Error(`Unsupported email delivery provider: ${String(provider)}`);
}

/** Test helper — reset singleton between tests. */
export function resetEmailDeliveryPortForTests(): void {
  port = null;
  InMemoryEmailDeliveryAdapter.reset();
}
