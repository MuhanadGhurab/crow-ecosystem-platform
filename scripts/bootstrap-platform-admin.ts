/**
 * Create (or update) a platform admin in Supabase Auth.
 *
 * Usage (new email/password user):
 *   PLATFORM_ADMIN_EMAIL=admin@example.com PLATFORM_ADMIN_PASSWORD='...' npm run auth:bootstrap
 *
 * Usage (existing Entra / OAuth user — metadata only):
 *   PLATFORM_ADMIN_EMAIL=you@org.com npm run auth:bootstrap
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.PLATFORM_ADMIN_EMAIL?.trim();
const password = process.env.PLATFORM_ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!email) {
  console.error("Set PLATFORM_ADMIN_EMAIL");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const appMetadata = {
  crow_role: "platform_admin" as const,
  tenant_slugs: [] as string[],
};

async function main() {
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list?.users?.find((u) => u.email === email);

  if (existing) {
    const updatePayload: { app_metadata: typeof appMetadata; password?: string } = {
      app_metadata: appMetadata,
    };
    if (password) updatePayload.password = password;

    const { error } = await supabase.auth.admin.updateUserById(existing.id, updatePayload);
    if (error) throw error;
    console.log(
      `Updated platform admin: ${email} (${existing.id})${password ? "" : " — app_metadata only (Entra/OAuth safe)"}`
    );
    return;
  }

  if (!password) {
    console.error(
      "User not found. For a new account set PLATFORM_ADMIN_PASSWORD, or sign in with Entra first then re-run with only PLATFORM_ADMIN_EMAIL."
    );
    process.exit(1);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: appMetadata,
  });
  if (error) throw error;
  console.log(`Created platform admin: ${email} (${data.user?.id})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
