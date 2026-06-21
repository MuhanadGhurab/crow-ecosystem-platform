import type { User } from "@supabase/supabase-js";

import { countActivePlatformAdmins } from "@/lib/auth/platform-internal-role.service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function findAuthUsersByNormalizedEmail(
  normalizedEmail: string
): Promise<User[]> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);
  return data.users.filter((u) => u.email?.trim().toLowerCase() === normalizedEmail);
}

/** FTGP — count authoritative PLATFORM_ADMIN assignments (not Supabase metadata). */
export async function countExistingPlatformOwners(): Promise<number> {
  return countActivePlatformAdmins();
}
