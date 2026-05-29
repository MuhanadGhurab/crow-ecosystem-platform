import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Reload session JWT so app_metadata.crow_role updates apply after admin role assignment. */
export async function refreshSessionUser(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<User | null> {
  await supabase.auth.refreshSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
