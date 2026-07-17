import { createClient, type User } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

function scriptSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function findAuthUsersByNormalizedEmail(
  normalizedEmail: string
): Promise<User[]> {
  const admin = scriptSupabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);
  return data.users.filter((u) => u.email?.trim().toLowerCase() === normalizedEmail);
}

/** FTGP — countActivePlatformAdmins via Prisma (authoritative table, not metadata). */
export async function countExistingPlatformOwners(): Promise<number> {
  return countActivePlatformAdmins();
}

export async function countActivePlatformAdmins(): Promise<number> {
  const prisma = new PrismaClient();
  try {
    return prisma.platformInternalRoleAssignment.count({
      where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
