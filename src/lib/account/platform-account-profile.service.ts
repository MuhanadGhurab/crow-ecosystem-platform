import type { PlatformAccountProfile } from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { recordPlatformAccountAudit } from "@/lib/account/platform-account.service";

export type PlatformAccountProfileRecord = PlatformAccountProfile;

export type PlatformProfileUpdateInput = {
  displayName?: string | null;
  handle?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  preferredLanguage?: string | null;
  bio?: string | null;
  isPrivate?: boolean;
};

const PROFILE_FIELD_LIMITS = {
  displayName: 120,
  handle: 64,
  jobTitle: 120,
  phone: 32,
  preferredLanguage: 16,
  bio: 2000,
} as const;

function assertProfileFieldLimits(input: PlatformProfileUpdateInput): void {
  const checks: Array<[keyof typeof PROFILE_FIELD_LIMITS, string | null | undefined]> = [
    ["displayName", input.displayName],
    ["handle", input.handle],
    ["jobTitle", input.jobTitle],
    ["phone", input.phone],
    ["preferredLanguage", input.preferredLanguage],
    ["bio", input.bio],
  ];

  for (const [field, value] of checks) {
    if (value == null) continue;
    const trimmed = value.trim();
    if (trimmed.length > PROFILE_FIELD_LIMITS[field]) {
      throw new Error(`${field} is too long.`);
    }
  }
}

export async function getPlatformAccountProfile(
  platformAccountId: string
): Promise<PlatformAccountProfileRecord | null> {
  return prisma.platformAccountProfile.findUnique({
    where: { platformAccountId },
  });
}

export async function updatePlatformAccountProfile(
  platformAccountId: string,
  input: PlatformProfileUpdateInput
): Promise<PlatformAccountProfileRecord> {
  await assertC2DatabaseEnvironmentSafe();
  assertProfileFieldLimits(input);

  const data: PlatformProfileUpdateInput = {};
  if (input.displayName !== undefined) data.displayName = trimOrNull(input.displayName);
  if (input.handle !== undefined) data.handle = normalizeHandle(input.handle);
  if (input.jobTitle !== undefined) data.jobTitle = trimOrNull(input.jobTitle);
  if (input.phone !== undefined) data.phone = trimOrNull(input.phone);
  if (input.preferredLanguage !== undefined) {
    data.preferredLanguage = trimOrNull(input.preferredLanguage);
  }
  if (input.bio !== undefined) data.bio = trimOrNull(input.bio);
  if (input.isPrivate !== undefined) data.isPrivate = input.isPrivate;

  const profile = await prisma.platformAccountProfile.upsert({
    where: { platformAccountId },
    create: {
      platformAccountId,
      isPrivate: input.isPrivate ?? true,
      ...data,
    },
    update: data,
  });

  await recordPlatformAccountAudit(platformAccountId, "profile_updated", {
    fields: Object.keys(data),
  });

  return profile;
}

function trimOrNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeHandle(value: string | null | undefined): string | null {
  const trimmed = trimOrNull(value);
  if (!trimmed) return null;
  return trimmed.replace(/^@+/, "").toLowerCase();
}
