/**
 * C3 — Server-only hosted email provider configuration (Resend).
 */

export type HostedEmailProviderConfig = {
  apiKey: string;
  fromAddress: string;
};

export function resolveVerificationFromAddress(): string | null {
  const explicit =
    process.env.C3_VERIFICATION_FROM_EMAIL?.trim() ??
    process.env.NOTIFICATION_FROM_EMAIL?.trim();
  return explicit || null;
}

export function resolveHostedEmailProviderConfig(): HostedEmailProviderConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const fromAddress = resolveVerificationFromAddress();
  if (!fromAddress) return null;

  return { apiKey, fromAddress };
}
