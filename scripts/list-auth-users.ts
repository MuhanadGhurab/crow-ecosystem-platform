import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;

  for (const u of data.users) {
    const providers = u.identities?.map((i) => i.provider).join(",") ?? "email";
    const role = u.app_metadata?.crow_role ?? "(none)";
    console.log(`${role} | ${u.email ?? u.id} | ${providers}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
