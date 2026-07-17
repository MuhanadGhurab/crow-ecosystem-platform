import type { PlatformAccount } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";

import { isPhoneVerificationRequiredForAccount } from "@/lib/account/phone-verification-policy";

export type ActivationReadiness = {
  legalComplete: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  phoneRequired: boolean;
  ready: boolean;
};

export { isPhoneVerificationRequiredForAccount } from "@/lib/account/phone-verification-policy";

export function assessActivationReadiness(account: PlatformAccount): ActivationReadiness {
  const phoneRequired = isPhoneVerificationRequiredForAccount(account);
  const emailVerified = account.emailVerifiedAt != null;
  const phoneVerified = !phoneRequired || account.phoneVerifiedAt != null;

  return {
    legalComplete: false,
    emailVerified,
    phoneVerified,
    phoneRequired,
    ready: false,
  };
}

export async function canActivatePlatformAccount(
  account: PlatformAccount
): Promise<ActivationReadiness> {
  const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id);
  const base = assessActivationReadiness(account);
  const ready =
    legalComplete &&
    base.emailVerified &&
    base.phoneVerified &&
    account.status !== "SUSPENDED" &&
    account.status !== "LOCKED" &&
    account.status !== "DEACTIVATED";

  return { ...base, legalComplete, ready };
}
