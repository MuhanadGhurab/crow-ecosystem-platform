import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { generatePublicAccountId } from "../../src/lib/account/public-account-id";

/** Harness-only ACTIVE user for session proofs when OTP secret is unavailable locally. */
export async function ensureActiveSessionFixtureUser(
  prisma: PrismaClient,
  email: string,
  password: string
): Promise<void> {
  const emailNormalized = normalizeEmail(email);
  const existing = await prisma.platformAccount.findFirst({
    where: { emailNormalized },
  });
  if (existing?.status === "ACTIVE") return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required for session fixture user");
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let supabaseUserId = existing?.supabaseUserId;
  if (!supabaseUserId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const match = listed.users.find(
          (u) => u.email && normalizeEmail(u.email) === emailNormalized
        );
        if (!match) throw new Error(`Supabase user exists but could not resolve id: ${error.message}`);
        supabaseUserId = match.id;
        await admin.auth.admin.updateUserById(supabaseUserId, { password, email_confirm: true });
      } else {
        throw new Error(`Could not create session fixture Supabase user: ${error.message}`);
      }
    } else {
      supabaseUserId = data.user?.id;
    }
  } else {
    await admin.auth.admin.updateUserById(supabaseUserId, { password, email_confirm: true });
  }

  if (!supabaseUserId) {
    throw new Error("Session fixture missing supabaseUserId");
  }

  const now = new Date();
  if (existing) {
    await prisma.platformAccount.update({
      where: { id: existing.id },
      data: {
        status: "ACTIVE",
        onboardingGeneration: 2,
        emailVerifiedAt: now,
        emailVerificationSource: "CROW_EMAIL_OTP",
        activatedAt: now,
        lastVerifiedAt: now,
      },
    });
    return;
  }

  await prisma.platformAccount.create({
    data: {
      supabaseUserId,
      email,
      emailNormalized,
      publicAccountId: generatePublicAccountId(),
      status: "ACTIVE",
      onboardingGeneration: 2,
      emailVerifiedAt: now,
      emailVerificationSource: "CROW_EMAIL_OTP",
      activatedAt: now,
      lastVerifiedAt: now,
      registrationSource: "c3_session_fixture",
    },
  });
}
