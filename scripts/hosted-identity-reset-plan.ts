#!/usr/bin/env npx tsx
/** Sets ALLOW_HOSTED_IDENTITY_CENSUS for read-only hosted census (plan mode only). */
import { mergeStagingSupabaseEnvIfMissing } from "./lib/merge-staging-supabase-env";

process.env.ALLOW_HOSTED_IDENTITY_CENSUS = "true";
mergeStagingSupabaseEnvIfMissing();
void import("./identity-reset-plan");
