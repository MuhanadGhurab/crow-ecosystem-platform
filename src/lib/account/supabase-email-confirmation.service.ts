import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type ConfirmSupabaseEmailResult =
  | { ok: true; alreadyConfirmed: boolean }
  | { ok: false; reason: "user_not_found" | "confirm_failed" };

export async function isSupabaseUserEmailConfirmed(
  supabaseUserId: string
): Promise<boolean> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(supabaseUserId);
  if (error || !data.user) return false;
  return Boolean(data.user.email_confirmed_at);
}

/** Server-side Supabase email confirmation after Crow OTP verification. */
export async function confirmSupabaseUserEmail(
  supabaseUserId: string
): Promise<ConfirmSupabaseEmailResult> {
  const admin = getSupabaseAdminClient();
  const { data: existing, error: fetchError } =
    await admin.auth.admin.getUserById(supabaseUserId);
  if (fetchError || !existing.user) {
    return { ok: false, reason: "user_not_found" };
  }
  if (existing.user.email_confirmed_at) {
    return { ok: true, alreadyConfirmed: true };
  }

  const { error } = await admin.auth.admin.updateUserById(supabaseUserId, {
    email_confirm: true,
  });
  if (error) {
    return { ok: false, reason: "confirm_failed" };
  }
  return { ok: true, alreadyConfirmed: false };
}
