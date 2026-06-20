import type { PlatformAccountRecord } from "@/lib/account/platform-account.service";
import {
  findPlatformAccountById,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION } from "@/lib/account/onboarding-generation";

export type PlatformOwnerBootstrapRefusal =
  | "execute_disabled"
  | "account_not_found"
  | "account_not_active"
  | "generation_not_current"
  | "email_not_verified"
  | "phone_not_verified"
  | "existing_platform_owner"
  | "missing_account_reference"
  | "vercel_runtime_forbidden";

export type PlatformOwnerBootstrapPlanInput = {
  platformAccountId: string;
  dryRun: boolean;
  allowMultipleOwners: boolean;
  operatorConfirmationToken?: string;
};

export type PlatformOwnerBootstrapPlanResult = {
  allowed: boolean;
  dryRun: boolean;
  refusal: PlatformOwnerBootstrapRefusal | null;
  accountRef: string | null;
  checks: {
    active: boolean;
    generation2: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    singleOwnerPolicy: boolean;
  };
  auditEventType: "platform_owner_bootstrap_planned" | "platform_owner_bootstrap_executed";
  message: string;
};

function accountChecks(account: PlatformAccountRecord | null): PlatformOwnerBootstrapPlanResult["checks"] {
  return {
    active: Boolean(account && account.status === "ACTIVE" && isPlatformAccountActive(account)),
    generation2: Boolean(
      account && account.onboardingGeneration >= CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION
    ),
    emailVerified: Boolean(account?.emailVerifiedAt),
    phoneVerified: Boolean(account?.phoneVerifiedAt),
    singleOwnerPolicy: true,
  };
}

export async function planPlatformOwnerBootstrap(
  input: PlatformOwnerBootstrapPlanInput,
  deps: {
    countExistingPlatformOwners: () => Promise<number>;
  }
): Promise<PlatformOwnerBootstrapPlanResult> {
  if (
    process.env.VERCEL === "1" &&
    process.env.ALLOW_HOSTED_IDENTITY_CENSUS !== "true"
  ) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "vercel_runtime_forbidden",
      accountRef: null,
      checks: accountChecks(null),
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Platform-owner bootstrap cannot run on Vercel build/runtime.",
    };
  }

  const accountId = input.platformAccountId.trim();
  if (!accountId) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "missing_account_reference",
      accountRef: null,
      checks: accountChecks(null),
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Explicit platform account reference is required.",
    };
  }

  const account = await findPlatformAccountById(accountId);
  const checks = accountChecks(account);

  if (!account) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "account_not_found",
      accountRef: accountId,
      checks,
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Platform account not found.",
    };
  }

  if (!checks.active) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "account_not_active",
      accountRef: accountId,
      checks,
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Account must be ACTIVE with current onboarding generation.",
    };
  }

  if (!checks.generation2) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "generation_not_current",
      accountRef: accountId,
      checks,
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Account must be generation 2 (dual-channel enrollment).",
    };
  }

  if (!checks.emailVerified) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "email_not_verified",
      accountRef: accountId,
      checks,
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Verified email is required before platform-owner bootstrap.",
    };
  }

  if (!checks.phoneVerified) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "phone_not_verified",
      accountRef: accountId,
      checks,
      auditEventType: "platform_owner_bootstrap_planned",
      message: "Verified phone is required before platform-owner bootstrap.",
    };
  }

  const existingOwners = await deps.countExistingPlatformOwners();
  if (existingOwners > 0 && !input.allowMultipleOwners) {
    return {
      allowed: false,
      dryRun: input.dryRun,
      refusal: "existing_platform_owner",
      accountRef: accountId,
      checks: { ...checks, singleOwnerPolicy: false },
      auditEventType: "platform_owner_bootstrap_planned",
      message: "A platform owner already exists; explicit multi-owner approval required.",
    };
  }

  if (!input.dryRun) {
    return {
      allowed: false,
      dryRun: false,
      refusal: "execute_disabled",
      accountRef: accountId,
      checks,
      auditEventType: "platform_owner_bootstrap_executed",
      message: "Execute remains disabled pending separate product-owner authorization.",
    };
  }

  return {
    allowed: true,
    dryRun: true,
    refusal: null,
    accountRef: accountId,
    checks,
    auditEventType: "platform_owner_bootstrap_planned",
    message:
      "Dry-run plan OK — would grant PLATFORM_OWNER via operator command after step-up confirmation.",
  };
}
