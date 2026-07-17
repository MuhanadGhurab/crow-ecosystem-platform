import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { lookupSupabaseUserByEmail } from "@/lib/services/membership.service";
import { normalizeEmail } from "@/lib/account/email-normalize";
import {
  createPendingPlatformAccount,
  findPlatformAccountByEmailNormalized,
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";

export const C3_GENERIC_REGISTRATION_MESSAGE =
  "If this email is eligible for registration, check your inbox for the next step. If you already have an account, sign in.";

export type RegistrationEmailPolicy =
  | { kind: "provision_new" }
  | {
      kind: "continue_pending";
      supabaseUserId: string;
      platformAccountId: string;
    }
  | { kind: "generic_response" };

export async function classifyRegistrationEmail(
  email: string
): Promise<RegistrationEmailPolicy> {
  const normalized = normalizeEmail(email);
  const platformAccount = await findPlatformAccountByEmailNormalized(normalized);
  const authUser = await lookupSupabaseUserByEmail(normalized);

  if (platformAccount && isPlatformAccountActive(platformAccount)) {
    return { kind: "generic_response" };
  }

  if (platformAccount?.status === "PENDING_EMAIL_VERIFICATION") {
    return {
      kind: "continue_pending",
      supabaseUserId: platformAccount.supabaseUserId,
      platformAccountId: platformAccount.id,
    };
  }

  if (authUser && !platformAccount) {
    return { kind: "generic_response" };
  }

  if (authUser?.email_confirmed_at && !platformAccount) {
    return { kind: "generic_response" };
  }

  return { kind: "provision_new" };
}

export type ProvisionAuthUserResult =
  | { ok: true; userId: string; created: boolean }
  | { ok: false; reason: "duplicate" | "create_failed" };

export async function provisionUnconfirmedAuthUser(input: {
  email: string;
  password: string;
}): Promise<ProvisionAuthUserResult> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.password,
    email_confirm: false,
    user_metadata: { registration_source: "c3_email_password" },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || error.status === 422) {
      return { ok: false, reason: "duplicate" };
    }
    throw new Error("Registration could not be completed.");
  }

  if (!data.user) {
    return { ok: false, reason: "create_failed" };
  }

  return { ok: true, userId: data.user.id, created: true };
}

export type CompensationResult = "deleted" | "skipped" | "orphan_recorded";

/** Targeted compensation for a newly created unconfirmed Auth user when app provisioning fails. */
export async function compensateOrphanAuthUser(input: {
  supabaseUserId: string;
  createdInThisOperation: boolean;
}): Promise<CompensationResult> {
  if (!input.createdInThisOperation) return "skipped";

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(input.supabaseUserId);
  if (error || !data.user) return "skipped";
  if (data.user.email_confirmed_at) return "skipped";

  const platformAccount = await findPlatformAccountBySupabaseUserId(input.supabaseUserId);
  if (platformAccount?.status === "ACTIVE") return "skipped";

  const { error: deleteError } = await admin.auth.admin.deleteUser(input.supabaseUserId);
  if (deleteError) {
    if (platformAccount) {
      await recordPlatformAccountAudit(platformAccount.id, "verification_failed", {
        reason: "orphan_registration_detected",
        supabaseUserId: input.supabaseUserId,
      });
    }
    return "orphan_recorded";
  }

  if (platformAccount) {
    await recordPlatformAccountAudit(platformAccount.id, "verification_failed", {
      reason: "activation_compensation_attempted",
      supabaseUserId: input.supabaseUserId,
    });
  }

  return "deleted";
}

export async function ensurePendingPlatformAccountForRegistration(input: {
  supabaseUserId: string;
  email: string;
}): Promise<Awaited<ReturnType<typeof createPendingPlatformAccount>>> {
  const existing = await findPlatformAccountBySupabaseUserId(input.supabaseUserId);
  if (existing) return existing;

  const byEmail = await findPlatformAccountByEmailNormalized(input.email);
  if (byEmail) return byEmail;

  return createPendingPlatformAccount({
    supabaseUserId: input.supabaseUserId,
    email: input.email,
    registrationSource: "email_password",
  });
}
