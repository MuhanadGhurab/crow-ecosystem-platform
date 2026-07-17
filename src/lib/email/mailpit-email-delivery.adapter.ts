import type {
  EmailDeliveryPort,
  EmailDeliveryPayload,
  EmailDeliveryResult,
} from "@/lib/email/email-delivery.port";
import { redactEmailAddress } from "@/lib/email/email-redaction";

type MailpitSendResponse = {
  ID?: string;
};

/**
 * Local-only adapter — delivers via Mailpit HTTP API (inbox UI at :8025).
 * Never logs message bodies (verification codes stay in Mailpit only).
 */
export class MailpitEmailDeliveryAdapter implements EmailDeliveryPort {
  private readonly apiBase: string;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(options?: { apiBase?: string; fromEmail?: string; fromName?: string }) {
    this.apiBase = (options?.apiBase ?? process.env.MAILPIT_API_URL ?? "http://127.0.0.1:8025").replace(
      /\/$/,
      ""
    );
    this.fromEmail = options?.fromEmail ?? process.env.MAILPIT_FROM_EMAIL ?? "noreply@crow.local";
    this.fromName = options?.fromName ?? process.env.MAILPIT_FROM_NAME ?? "Crow";
  }

  async send(payload: EmailDeliveryPayload): Promise<EmailDeliveryResult> {
    const body = {
      From: { Email: this.fromEmail, Name: this.fromName },
      To: [{ Email: payload.to }],
      Subject: payload.subject,
      Text: payload.text,
      HTML: payload.html,
    };

    let response: Response;
    try {
      response = await fetch(`${this.apiBase}/api/v1/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      const hint =
        err instanceof Error ? err.message : "Mailpit unreachable";
      throw new Error(
        `Local email could not be sent. Start Mailpit (npm run local:services:up) and open ${this.apiBase}. ${hint}`
      );
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Mailpit rejected the message (${response.status}). ${detail.slice(0, 120)}`
      );
    }

    let parsed: MailpitSendResponse = {};
    try {
      parsed = (await response.json()) as MailpitSendResponse;
    } catch {
      /* optional body */
    }

    if (process.env.NODE_ENV !== "test") {
      console.info(
        "[C3 email] delivered to Mailpit for",
        redactEmailAddress(payload.to),
        "— open inbox UI to read code"
      );
    }

    return {
      channel: "mailpit",
      status: "sent",
      providerMessageId: parsed.ID ?? `mailpit-${Date.now()}`,
    };
  }
}
