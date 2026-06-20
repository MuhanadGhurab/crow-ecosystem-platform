import type { User } from "@supabase/supabase-js";
import type { PlatformAuthProvider } from "@prisma/client";

import { prisma } from "@/lib/db";
import { normalizeEmail } from "@/lib/account/email-normalize";
import {
  createPendingPlatformAccount,
  findPlatformAccountByEmailNormalized,
  findPlatformAccountBySupabaseUserId,
  recordEmailVerificationEvidence,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { EMAIL_VERIFICATION_SOURCES } from "@/lib/account/verification-sources";

export type LinkProviderResult =
  | { ok: true; platformAccountId: string; created: boolean }
  | { ok: false; reason: "email_conflict" | "blocked" | "provider_collision" };

function isGoogleEmailVerified(user: User): boolean {
  const meta = user.user_metadata ?? {};
  const identities = user.identities ?? [];
  const google = identities.find((i) => i.provider === "google");
  return Boolean(
    google?.identity_data?.email_verified === true ||
      meta.email_verified === true
  );
}

/** One Supabase user → one PlatformAccount; link provider identity safely. */
export async function resolvePlatformAccountForOAuthUser(
  user: User,
  provider: PlatformAuthProvider
): Promise<LinkProviderResult> {
  await assertC2DatabaseEnvironmentSafe();

  if (!user.email) {
    return { ok: false, reason: "email_conflict" };
  }

  const emailNormalized = normalizeEmail(user.email);
  const existingByAuth = await findPlatformAccountBySupabaseUserId(user.id);
  const existingByEmail = await findPlatformAccountByEmailNormalized(user.email);

  if (
    existingByAuth &&
    existingByEmail &&
    existingByAuth.id !== existingByEmail.id
  ) {
    return { ok: false, reason: "email_conflict" };
  }

  let account = existingByAuth ?? existingByEmail;
  let created = false;

  if (!account) {
    account = await createPendingPlatformAccount({
      supabaseUserId: user.id,
      email: user.email,
      registrationSource: provider,
    });
    created = true;
    await recordPlatformAccountAudit(account.id, "registration_started", {
      source: provider,
    });
  } else if (account.supabaseUserId !== user.id) {
    return { ok: false, reason: "email_conflict" };
  }

  if (account.status === "SUSPENDED" || account.status === "LOCKED" || account.status === "DEACTIVATED") {
    return { ok: false, reason: "blocked" };
  }

  const providerUserId =
    user.identities?.find((i) => i.provider === provider)?.id ?? user.id;

  const collision = await prisma.platformProviderIdentity.findFirst({
    where: {
      provider,
      providerUserId,
      NOT: { platformAccountId: account.id },
    },
  });
  if (collision) {
    return { ok: false, reason: "provider_collision" };
  }

  const emailVerified = provider === "google" && isGoogleEmailVerified(user);

  await prisma.platformProviderIdentity.upsert({
    where: {
      provider_providerUserId: { provider, providerUserId },
    },
    create: {
      platformAccountId: account.id,
      provider,
      providerUserId,
      emailNormalized,
      emailVerified,
    },
    update: {
      emailNormalized,
      emailVerified,
    },
  });

  await recordPlatformAccountAudit(account.id, "provider_identity_linked", {
    provider,
    emailVerified,
  });

  if (emailVerified && !account.emailVerifiedAt) {
    await recordEmailVerificationEvidence({
      platformAccountId: account.id,
      source: EMAIL_VERIFICATION_SOURCES.GOOGLE_OAUTH_VERIFIED,
    });
  }

  return { ok: true, platformAccountId: account.id, created };
}
