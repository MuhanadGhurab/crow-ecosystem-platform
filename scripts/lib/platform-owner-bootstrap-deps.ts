import type { User } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function findAuthUsersByNormalizedEmail(
  normalizedEmail: string
): Promise<User[]> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);
  return data.users.filter((u) => u.email?.trim().toLowerCase() === normalizedEmail);
}

export async function countExistingPlatformOwners(): Promise<number> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);
  return data.users.filter(
    (u) => String(u.app_metadata?.crow_role ?? "") === "platform_admin"
  ).length;
}
