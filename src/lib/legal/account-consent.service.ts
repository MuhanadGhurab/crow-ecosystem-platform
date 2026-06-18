import type { ConsentPreferenceSource, ConsentPurpose } from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { recordPlatformAccountAudit } from "@/lib/account/platform-account.service";

export async function getMarketingEmailConsent(
  platformAccountId: string
): Promise<boolean> {
  const pref = await prisma.accountConsentPreference.findUnique({
    where: {
      platformAccountId_purpose: {
        platformAccountId,
        purpose: "marketing_email",
      },
    },
  });
  return pref?.granted === true && !pref.withdrawnAt;
}

export async function setMarketingEmailConsent(input: {
  platformAccountId: string;
  granted: boolean;
  source?: ConsentPreferenceSource;
  registrationCorrelationId?: string;
}): Promise<void> {
  await assertC2DatabaseEnvironmentSafe();
  const now = new Date();
  const source = input.source ?? "account_settings";

  const existing = await prisma.accountConsentPreference.findUnique({
    where: {
      platformAccountId_purpose: {
        platformAccountId: input.platformAccountId,
        purpose: "marketing_email",
      },
    },
  });

  if (existing) {
    await prisma.accountConsentPreference.update({
      where: { id: existing.id },
      data: {
        granted: input.granted,
        grantedAt: input.granted ? now : existing.grantedAt,
        withdrawnAt: input.granted ? null : now,
        source,
        registrationCorrelationId: input.registrationCorrelationId ?? existing.registrationCorrelationId,
      },
    });
  } else {
    await prisma.accountConsentPreference.create({
      data: {
        platformAccountId: input.platformAccountId,
        purpose: "marketing_email",
        granted: input.granted,
        grantedAt: input.granted ? now : undefined,
        withdrawnAt: input.granted ? undefined : now,
        source,
        registrationCorrelationId: input.registrationCorrelationId,
      },
    });
  }

  await recordPlatformAccountAudit(input.platformAccountId, "consent_preference_updated", {
    purpose: "marketing_email" satisfies ConsentPurpose,
    granted: input.granted,
    source,
  });
}

export async function recordInitialMarketingConsent(input: {
  platformAccountId: string;
  granted: boolean;
  registrationCorrelationId: string;
}): Promise<void> {
  await setMarketingEmailConsent({
    platformAccountId: input.platformAccountId,
    granted: input.granted,
    source: "registration_web",
    registrationCorrelationId: input.registrationCorrelationId,
  });
}
