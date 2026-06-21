/**
 * Provider-neutral safe error summaries for outbound email.
 * Never surface raw provider bodies or credential hints to callers.
 */

export function summarizeDeliveryError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.trim();
    if (!msg) return "Email delivery failed.";
    if (msg.length > 180) return "Email delivery failed. Check provider configuration.";
    if (/api[_-]?key|authorization|bearer|secret|re_[a-z0-9]/i.test(msg)) {
      return "Email delivery failed. Check provider configuration.";
    }
    return "Email delivery failed. Verify the recipient address and provider settings.";
  }
  return "Email delivery failed.";
}

export function summarizeProviderHttpFailure(status: number): string {
  if (status === 422 || status === 400) {
    return "Email provider rejected the message.";
  }
  if (status === 401 || status === 403) {
    return "Email provider authentication failed.";
  }
  return "Email provider could not deliver the message.";
}
