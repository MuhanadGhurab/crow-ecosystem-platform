import { resolveAppEnvironment } from "@/lib/crow-core/database-environment";
import { getLocalEmailProvider } from "@/lib/auth/local-auth-mode";
import { resolveHostedEmailProviderConfig } from "@/lib/email/email-provider-config";

export type EmailDeliveryProviderKind = "mailpit" | "in-memory" | "resend";

const HOSTED_EMAIL_PROVIDER = "resend";

export function isHostedAppEnvironment(): boolean {
  const appEnv = resolveAppEnvironment();
  return appEnv === "preview" || appEnv === "production";
}

export function resolveEmailDeliveryProvider(): EmailDeliveryProviderKind {
  if (isHostedAppEnvironment()) {
    const provider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
    if (provider !== HOSTED_EMAIL_PROVIDER) {
      throw new Error(
        `EMAIL_PROVIDER must be ${HOSTED_EMAIL_PROVIDER} for Preview and Production deployments.`
      );
    }
    return "resend";
  }

  if (process.env.NODE_ENV === "test") {
    return "in-memory";
  }

  const local = getLocalEmailProvider();
  if (local === "mailpit") return "mailpit";
  if (local === "in-memory") return "in-memory";
  return "in-memory";
}

/** Fail closed when hosted delivery is selected but secrets are missing. */
export function assertHostedEmailProviderConfigured(): void {
  if (!isHostedAppEnvironment()) return;

  const provider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (provider !== HOSTED_EMAIL_PROVIDER) {
    throw new Error(`EMAIL_PROVIDER=${HOSTED_EMAIL_PROVIDER} is required for hosted environments.`);
  }

  if (!resolveHostedEmailProviderConfig()) {
    throw new Error(
      "Hosted email requires RESEND_API_KEY and C3_VERIFICATION_FROM_EMAIL (or NOTIFICATION_FROM_EMAIL)."
    );
  }
}
