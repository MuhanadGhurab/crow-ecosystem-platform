const PLACEHOLDER_SENDER_PATTERN = /^(your[-_]?sender|sender|placeholder|changeme|example|test)$/i;

export type HostedSmsConfigSnapshot = {
  mode: string | null;
  provider: string | null;
  hasApiKey: boolean;
  hasSenderId: boolean;
  senderIdIsPlaceholder: boolean;
  hasPreviewAllowlist: boolean;
  hasMessageCap: boolean;
  hasWebhookSecret: boolean;
  publicSecretLeak: boolean;
  isHostedRuntime: boolean;
  isPreview: boolean;
  isProduction: boolean;
};

export function isHostedSmsRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function resolveHostedSmsProvider(): string | null {
  return process.env.C3_SMS_PROVIDER?.trim().toLowerCase() || null;
}

export function resolveHostedSmsMode(): string | null {
  return process.env.C3_PHONE_DELIVERY_MODE?.trim().toLowerCase() || null;
}

export function isSenderIdPlaceholder(senderId: string): boolean {
  const trimmed = senderId.trim();
  if (trimmed.length < 2) return true;
  return PLACEHOLDER_SENDER_PATTERN.test(trimmed);
}

/** Detect accidental NEXT_PUBLIC_ exposure for provider secrets. */
export function hasPublicSmsSecretLeak(): boolean {
  const env = process.env as Record<string, string | undefined>;
  return Object.keys(env).some(
    (key) =>
      key.startsWith("NEXT_PUBLIC_") &&
      /SMS|UNIFONIC|PHONE.*KEY|APP_?SID/i.test(key) &&
      Boolean(env[key]?.trim())
  );
}

export function getHostedSmsConfigSnapshot(): HostedSmsConfigSnapshot {
  const senderId = process.env.C3_SMS_SENDER_ID?.trim() ?? "";
  return {
    mode: resolveHostedSmsMode(),
    provider: resolveHostedSmsProvider(),
    hasApiKey: Boolean(process.env.C3_SMS_PROVIDER_API_KEY?.trim()),
    hasSenderId: Boolean(senderId),
    senderIdIsPlaceholder: senderId ? isSenderIdPlaceholder(senderId) : true,
    hasPreviewAllowlist: Boolean(process.env.C3_PHONE_SMS_TEST_ALLOWLIST?.trim()),
    hasMessageCap: Boolean(process.env.C3_SMS_MESSAGE_CAP?.trim()),
    hasWebhookSecret: Boolean(process.env.C3_SMS_WEBHOOK_SECRET?.trim()),
    publicSecretLeak: hasPublicSmsSecretLeak(),
    isHostedRuntime: isHostedSmsRuntime(),
    isPreview: process.env.VERCEL_ENV === "preview",
    isProduction: process.env.VERCEL_ENV === "production",
  };
}

export function assertHostedSmsConfigurationComplete(): void {
  const snap = getHostedSmsConfigSnapshot();

  if (snap.mode !== "hosted-sms") {
    throw new Error("C3_PHONE_DELIVERY_MODE must be hosted-sms for hosted SMS transport.");
  }

  if (snap.provider !== "unifonic") {
    throw new Error("C3_SMS_PROVIDER must be unifonic for the current hosted adapter.");
  }

  if (!snap.hasApiKey || !snap.hasSenderId || snap.senderIdIsPlaceholder) {
    throw new Error("Hosted SMS configuration is incomplete (API key or sender ID).");
  }

  if (snap.publicSecretLeak) {
    throw new Error("SMS provider secrets must not use NEXT_PUBLIC_ variables.");
  }

  if (snap.isPreview && !snap.hasPreviewAllowlist) {
    throw new Error("Preview hosted SMS requires C3_PHONE_SMS_TEST_ALLOWLIST.");
  }
}
