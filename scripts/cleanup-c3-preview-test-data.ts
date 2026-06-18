/**
 * Remove controlled C3 Preview test data (targeted; does not touch unrelated rows).
 * Run: npm run c3-preview-controlled:cleanup -- --email-hash=<normalized-email>
 *   or: C3_CLEANUP_EMAIL=user+tag@domain npm run c3-preview-controlled:cleanup
 */
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../src/lib/account/email-normalize";

async function findSupabaseUserIdByEmail(emailNormalized: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) return null;

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;
    const match = data.users.find(
      (user) => user.email && normalizeEmail(user.email) === emailNormalized
    );
    if (match) return match.id;
    if (data.users.length < 200) break;
  }

  return null;
}

function parseEmailArg(): string {
  const flag = process.argv.find((a) => a.startsWith("--email="));
  if (flag) return flag.slice("--email=".length);
  const env = process.env.C3_CLEANUP_EMAIL?.trim();
  if (env) return env;
  console.error("Provide --email=<address> or C3_CLEANUP_EMAIL");
  process.exit(1);
}

async function main() {
  const email = parseEmailArg();
  const emailNormalized = normalizeEmail(email);
  const prisma = new PrismaClient();

  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized },
    select: { id: true, supabaseUserId: true },
  });

  if (!account) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const orphanId = await findSupabaseUserIdByEmail(emailNormalized);
    if (orphanId && supabaseUrl && serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await admin.auth.admin.deleteUser(orphanId);
      console.log("Removed orphan Supabase auth user for cleanup target.");
    } else {
      console.log("No PlatformAccount found for cleanup target (already clean).");
    }
    await prisma.$disconnect();
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  const erpDeleted = await prisma.implementationRequest.deleteMany({
    where: { submittedByUserId: account.supabaseUserId },
  });

  await prisma.accountLegalAcceptance.deleteMany({
    where: { platformAccountId: account.id },
  });

  await prisma.accountConsentPreference.deleteMany({
    where: { platformAccountId: account.id },
  });

  await prisma.emailVerificationChallenge.deleteMany({
    where: { platformAccountId: account.id },
  });

  await prisma.platformAccountAuditEvent.deleteMany({
    where: { platformAccountId: account.id },
  });

  await prisma.platformAccountProfile.deleteMany({
    where: { platformAccountId: account.id },
  });

  await prisma.platformAccount.delete({ where: { id: account.id } });

  if (supabaseUrl && serviceKey) {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    await admin.auth.admin.deleteUser(account.supabaseUserId);
  }

  console.log("\n=== C3 Preview test cleanup ===");
  console.log(`  PlatformAccount removed`);
  console.log(`  ERP requests removed: ${erpDeleted.count}`);
  console.log(`  Legal acceptances removed (audit trail not retained for disposable preview tests)`);
  console.log(`  Supabase auth user removed`);
  console.log("  Verification: re-query shows no matching PlatformAccount\n");

  const remaining = await prisma.platformAccount.count({ where: { emailNormalized } });
  if (remaining !== 0) {
    console.error("✗ Cleanup verification failed");
    process.exit(1);
  }
  console.log("✓ Cleanup verification passed");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
