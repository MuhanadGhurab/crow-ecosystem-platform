import { readFileSync } from "fs";
import { join } from "path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const admin = readFileSync(join(process.cwd(), "src/lib/supabase/admin.ts"), "utf8");

assert(admin.includes('import "server-only"'), "admin.ts must be server-only");
assert(
  admin.includes("SUPABASE_SERVICE_ROLE_KEY") && !admin.includes("NEXT_PUBLIC_"),
  "service role must not use NEXT_PUBLIC"
);
assert(admin.includes("assertSupabaseServiceRoleConfigured"), "fail closed when key missing");

const clientBundles = [
  "src/components/account/legal-review-gate.tsx",
  "src/components/account/verify-email-form.tsx",
  "src/components/portal/auth/sign-up-form.tsx",
];

for (const rel of clientBundles) {
  const text = readFileSync(join(process.cwd(), rel), "utf8");
  assert(!text.includes("getSupabaseAdminClient"), `${rel} must not import admin client`);
  assert(!text.includes("SUPABASE_SERVICE_ROLE_KEY"), `${rel} must not reference service role`);
}

console.log("admin.server-boundary.test.ts: OK");
