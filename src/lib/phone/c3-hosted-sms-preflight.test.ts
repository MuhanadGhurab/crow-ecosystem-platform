import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

{
  const port = read("src/lib/phone/get-phone-verification-port.ts");
  assert(port.includes("VERCEL_ENV"), "hosted runtime must check Vercel");
  assert(port.includes("hosted-sms"), "hosted mode required on Vercel");
  assert(!port.includes("LocalDevPhoneVerificationDeliveryAdapter") || port.includes("isHostedRuntime"), "local-dev blocked on hosted");
}

{
  const migration = read("prisma/migrations/20260618140000_c3_dual_channel_onboarding/migration.sql");
  assert(migration.includes("ENABLE ROW LEVEL SECURITY"), "RLS in migration");
  assert(migration.includes("REVOKE ALL"), "revoke grants in migration");
  assert(!/DROP TABLE/i.test(migration), "no drop table");
}

{
  const resolver = read("src/lib/phone/hosted-sms-delivery.adapter.ts");
  assert(resolver.includes("unifonic"), "unifonic provider routing");
}

{
  const onboarding = read("src/lib/account/onboarding-generation.ts");
  assert(onboarding.includes("CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION"), "enrollment gen split");
}

{
  const failure = read("src/lib/phone/phone-delivery-failure.ts");
  assert(failure.includes("CONFIGURATION_MISSING"), "failure taxonomy present");
}

console.log("c3-dual-channel-hosted-schema: static checks passed");
