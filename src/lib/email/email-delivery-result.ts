/**
 * M4D — Provider-neutral transactional email delivery outcomes.
 */

export type InviteEmailDeliveryOutcome =
  | "delivered"
  | "provider_unconfigured"
  | "provider_rejected"
  | "invalid_recipient"
  | "delivery_error";

export type InviteEmailDeliverySummary = {
  outcome: InviteEmailDeliveryOutcome;
  /** Operator-safe message — never includes secrets or raw provider errors. */
  operatorMessage: string;
};

export function summarizeDeliveryError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.trim();
    if (!msg) return "Email delivery failed.";
    if (msg.length > 180) return "Email delivery failed. Check provider configuration.";
    if (/api[_-]?key|authorization|bearer|secret/i.test(msg)) {
      return "Email delivery failed. Check provider configuration.";
    }
    return "Email delivery failed. Verify the recipient address and provider settings.";
  }
  return "Email delivery failed.";
}
