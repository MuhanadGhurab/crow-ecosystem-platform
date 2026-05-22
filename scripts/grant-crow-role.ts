/**
 * Assign crow_role (and optional tenant_slugs) on an existing Supabase user.
 *
 * Usage:
 *   USER_EMAIL=you@org.com CROW_ROLE=platform_admin npm run auth:grant-role
 *   USER_EMAIL=user@x.com CROW_ROLE=tenant_admin TENANT_SLUG=acme npm run auth:grant-role
 */
import { createClient } from "@supabase/supabase-js";
import type { CrowRole } from "../src/lib/auth/roles";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.USER_EMAIL?.trim();
const role = process.env.CROW_ROLE as CrowRole | undefined;
const tenantSlug = process.env.TENANT_SLUG?.trim();

const PLATFORM_ROLES: CrowRole[] = ["platform_admin", "implementer"];
const TENANT_ROLES: CrowRole[] = ["tenant_admin", "tenant_user"];
const CLIENT_ROLES: CrowRole[] = ["client"];

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!email || !role) {
  console.error("Set USER_EMAIL and CROW_ROLE");
  process.exit(1);
}

if (![...PLATFORM_ROLES, ...TENANT_ROLES, ...CLIENT_ROLES].includes(role)) {
  console.error(`Invalid CROW_ROLE: ${role}`);
  process.exit(1);
}

if (TENANT_ROLES.includes(role) && !tenantSlug) {
  console.error("Set TENANT_SLUG for tenant_admin / tenant_user");
  process.exit(1);
}

if (CLIENT_ROLES.includes(role) && tenantSlug) {
  console.warn("TENANT_SLUG ignored for client role");
}

const userEmail = email;
const crowRole = role;

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;

  const user = data.users.find((u) => u.email?.toLowerCase() === userEmail.toLowerCase());
  if (!user) {
    console.error(`No user with email ${userEmail}. Sign in with Entra or email first.`);
    process.exit(1);
  }

  const existingSlugs = Array.isArray(user.app_metadata?.tenant_slugs)
    ? (user.app_metadata.tenant_slugs as string[])
    : [];
  const tenantSlugs =
    TENANT_ROLES.includes(crowRole) && tenantSlug
      ? Array.from(new Set([...existingSlugs, tenantSlug]))
      : PLATFORM_ROLES.includes(crowRole) || CLIENT_ROLES.includes(crowRole)
        ? []
        : existingSlugs;

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { crow_role: crowRole, tenant_slugs: tenantSlugs },
  });
  if (updateError) throw updateError;

  console.log(`Granted ${crowRole} to ${userEmail} (${user.id})`, { tenant_slugs: tenantSlugs });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
