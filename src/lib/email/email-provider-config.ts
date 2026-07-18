/**
 * M4D — Server-only email provider configuration (Resend today; swappable later).
 */

export type EmailProviderConfig = {
  apiKey: string;
  fromAddress: string;
};

export function isBusinessPortalInviteEmailConfigured(): boolean {
  return Boolean(resolveEmailProviderConfig());
}

export function resolveEmailProviderConfig(): EmailProviderConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const fromAddress =
    process.env.NOTIFICATION_FROM_EMAIL?.trim() ??
    process.env.BUSINESS_PORTAL_INVITE_FROM_EMAIL?.trim() ??
    "Crow Ecosystem <onboarding@resend.dev>";

  return { apiKey, fromAddress };
}
