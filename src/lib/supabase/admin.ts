import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/env";

export type SupabaseAdminClient = SupabaseClient;

export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

/** Fail closed when service-role auth administration is required. */
export function assertSupabaseServiceRoleConfigured(): void {
  if (!isSupabaseServiceRoleConfigured()) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for server-side Supabase Auth administration."
    );
  }
}

/** Canonical server-only Supabase Admin client (service role). */
export function getSupabaseAdminClient(): SupabaseAdminClient {
  assertSupabaseServiceRoleConfigured();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
