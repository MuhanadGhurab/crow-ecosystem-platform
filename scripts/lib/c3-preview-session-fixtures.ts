import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { generatePublicAccountId } from "../../src/lib/account/public-account-id";

/** Fixture class for requester Account Portal session proofs. */
export const SESSION_REQUESTER_FIXTURE = "SESSION_REQUESTER_FIXTURE" as const;

/** Fixture class for client-portal session proofs (distinct from requester). */
export const SESSION_CLIENT_FIXTURE = "SESSION_CLIENT_FIXTURE" as const;

export type SessionFixtureKind = "requester" | "client";

export type SessionFixtureCredentials = {
  kind: SessionFixtureKind;
  label: typeof SESSION_REQUESTER_FIXTURE | typeof SESSION_CLIENT_FIXTURE;
  email: string;
  password: string;
};

function baseNotificationEmail(): string {
  const raw =
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!raw?.includes("@")) {
    throw new Error(
      "Set C3_PROVIDER_TEST_EMAIL or NOTIFICATION_TEST_EMAIL for Preview session fixtures"
    );
  }
  const [local, domain] = raw.split("@");
  return normalizeEmail(`${local.split("+")[0]}@${domain}`);
}

export function resolveSessionFixtureCredentials(
  kind: SessionFixtureKind
): SessionFixtureCredentials {
  const password =
    (kind === "requester"
      ? process.env.C3_SESSION_REQUESTER_FIXTURE_PASSWORD
      : process.env.C3_SESSION_CLIENT_FIXTURE_PASSWORD)?.trim() ??
    process.env.C3_PREVIEW_SESSION_PASSWORD?.trim() ??
    "CrowSessionPv!9Controlled";

  const emailRaw =
    kind === "requester"
      ? process.env.C3_SESSION_REQUESTER_FIXTURE_EMAIL?.trim() ||
        process.env.C3_GOOGLE_PROOF_EMAIL?.trim() ||
        process.env.C3_PREVIEW_SESSION_REQUESTER_EMAIL?.trim() ||
        process.env.C3_PREVIEW_SESSION_EMAIL?.trim() ||
        (process.env.C3_PROOF_ACCOUNT_RETENTION?.trim()
          ? undefined
          : baseNotificationEmail())
      : process.env.C3_SESSION_CLIENT_FIXTURE_EMAIL?.trim() ||
        process.env.C3_PREVIEW_SESSION_CLIENT_EMAIL?.trim() ||
        process.env.C3_PREVIEW_SESSION_EMAIL?.trim();

  if (!emailRaw?.includes("@")) {
    throw new Error(
      kind === "client"
        ? "Set C3_SESSION_CLIENT_FIXTURE_EMAIL (client-role ACTIVE user) for SESSION_CLIENT_FIXTURE"
        : process.env.C3_PROOF_ACCOUNT_RETENTION?.trim()
          ? "Set C3_SESSION_REQUESTER_FIXTURE_EMAIL or C3_GOOGLE_PROOF_EMAIL for hosted proof (required when C3_PROOF_ACCOUNT_RETENTION is set)"
          : "Set C3_SESSION_REQUESTER_FIXTURE_EMAIL or NOTIFICATION_TEST_EMAIL for SESSION_REQUESTER_FIXTURE"
    );
  }

  const [local, domain] = emailRaw.split("@");
  const email = normalizeEmail(`${local.split("+")[0]}@${domain}`);

  if (kind === "requester") {
    const platformAdmin = process.env.PLATFORM_ADMIN_EMAIL?.trim();
    if (platformAdmin && email === normalizeEmail(platformAdmin)) {
      throw new Error(
        "C3_SESSION_REQUESTER_FIXTURE_EMAIL must not match PLATFORM_ADMIN_EMAIL — use an ordinary requester inbox"
      );
    }
  }

  return {
    kind,
    label: kind === "requester" ? SESSION_REQUESTER_FIXTURE : SESSION_CLIENT_FIXTURE,
    email,
    password,
  };
}

function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required for session fixtures");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function readCrowRole(supabaseUserId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(supabaseUserId);
  if (error) throw new Error(`Could not read Supabase user metadata: ${error.message}`);
  const role = data.user?.app_metadata?.crow_role;
  return typeof role === "string" && role.length > 0 ? role : null;
}

export async function setCrowRole(supabaseUserId: string, crowRole: string | null): Promise<void> {
  const admin = createAdminClient();
  const { data, error: readError } = await admin.auth.admin.getUserById(supabaseUserId);
  if (readError) throw new Error(`Could not read user for role update: ${readError.message}`);

  const appMetadata = { ...(data.user?.app_metadata ?? {}) } as Record<string, unknown>;
  if (crowRole) {
    appMetadata.crow_role = crowRole;
  } else {
    delete appMetadata.crow_role;
  }

  const { error } = await admin.auth.admin.updateUserById(supabaseUserId, {
    app_metadata: appMetadata,
  });
  if (error) throw new Error(`Could not update crow_role: ${error.message}`);
}

export async function validateSessionFixtureAccount(
  prisma: PrismaClient,
  credentials: SessionFixtureCredentials
): Promise<void> {
  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized: normalizeEmail(credentials.email) },
  });
  if (!account) {
    throw new Error(`${credentials.label}: no PlatformAccount for fixture email`);
  }
  if (account.status !== "ACTIVE") {
    throw new Error(`${credentials.label}: PlatformAccount must be ACTIVE (got ${account.status})`);
  }

  const crowRole = await readCrowRole(account.supabaseUserId);

  if (credentials.kind === "requester") {
    if (crowRole === "client") {
      throw new Error(
        `${credentials.label}: fixture has crow_role=client — use SESSION_CLIENT_FIXTURE or set C3_SESSION_REQUESTER_FIXTURE_EMAIL to a requester identity`
      );
    }
    if (crowRole && crowRole !== "none") {
      throw new Error(`${credentials.label}: unexpected crow_role=${crowRole}`);
    }
    return;
  }

  if (crowRole !== "client") {
    throw new Error(
      `${credentials.label}: fixture must have crow_role=client (got ${crowRole ?? "none"})`
    );
  }
}

export async function ensureSessionFixturePassword(
  supabaseUserId: string,
  password: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(supabaseUserId, { password });
  if (error) throw new Error(`Could not set fixture password: ${error.message}`);
}

/** Harness-only ACTIVE user when OTP secret is unavailable locally. */
export async function ensureActiveSessionFixtureUser(
  prisma: PrismaClient,
  email: string,
  password: string
): Promise<void> {
  await ensureSessionFixtureUser(prisma, {
    kind: "requester",
    label: SESSION_REQUESTER_FIXTURE,
    email,
    password,
  });
}

export async function ensureSessionFixtureUser(
  prisma: PrismaClient,
  credentials: SessionFixtureCredentials
): Promise<void> {
  const emailNormalized = normalizeEmail(credentials.email);
  const existing = await prisma.platformAccount.findFirst({
    where: { emailNormalized },
  });

  const admin = createAdminClient();
  let supabaseUserId = existing?.supabaseUserId;

  if (!supabaseUserId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: credentials.email,
      password: credentials.password,
      email_confirm: true,
    });
    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const match = listed.users.find(
          (u) => u.email && normalizeEmail(u.email) === emailNormalized
        );
        if (!match) {
          throw new Error(`Supabase user exists but could not resolve id: ${error.message}`);
        }
        supabaseUserId = match.id;
      } else {
        throw new Error(`Could not create fixture Supabase user: ${error.message}`);
      }
    } else {
      supabaseUserId = data.user?.id;
    }
  }

  if (!supabaseUserId) {
    throw new Error(`${credentials.label}: missing supabaseUserId`);
  }

  await admin.auth.admin.updateUserById(supabaseUserId, {
    password: credentials.password,
    email_confirm: true,
  });

  await setCrowRole(
    supabaseUserId,
    credentials.kind === "client" ? "client" : null
  );

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
  } else {
    await prisma.platformAccount.create({
      data: {
        supabaseUserId,
        email: credentials.email,
        emailNormalized,
        publicAccountId: generatePublicAccountId(),
        status: "ACTIVE",
        onboardingGeneration: 2,
        emailVerifiedAt: now,
        emailVerificationSource: "CROW_EMAIL_OTP",
        activatedAt: now,
        lastVerifiedAt: now,
        registrationSource: `c3_${credentials.kind}_session_fixture`,
      },
    });
  }

  await validateSessionFixtureAccount(prisma, credentials);
}

export function expectedLandingPattern(kind: SessionFixtureKind): RegExp {
  return kind === "requester" ? /^\/account(\/|$)/ : /^\/client(\/|$)/;
}

export async function assertFixtureLanding(pageUrl: string, kind: SessionFixtureKind): Promise<void> {
  const pathname = new URL(pageUrl).pathname;
  const pattern = expectedLandingPattern(kind);
  if (!pattern.test(pathname)) {
    throw new Error(
      `${kind === "requester" ? SESSION_REQUESTER_FIXTURE : SESSION_CLIENT_FIXTURE}: expected landing ${pattern}, got ${pathname}`
    );
  }
}
