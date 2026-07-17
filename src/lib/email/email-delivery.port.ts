export type EmailDeliveryPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type EmailDeliveryResult = {
  channel: string;
  status: "sent" | "queued" | "failed";
  providerMessageId?: string;
  error?: string;
};

/** Provider-neutral outbound email port (C3 Path 2). */
export interface EmailDeliveryPort {
  send(payload: EmailDeliveryPayload): Promise<EmailDeliveryResult>;
}
