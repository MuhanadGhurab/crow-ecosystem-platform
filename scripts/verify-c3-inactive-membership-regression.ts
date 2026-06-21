import { PrismaClient } from "@prisma/client";
import { evaluateTenantPlatformAccountAuthorization } from "../src/lib/account/tenant-platform-account-authorization";

const prisma = new PrismaClient();

async function main() {
  const memberships = await prisma.tenantMembership.findMany({ take: 50 });
  if (memberships.length === 0) {
    console.log("PASS — inactive-membership regression skipped (no membership rows)");
    return;
  }
  for (const membership of memberships) {
    const account = await prisma.platformAccount.findFirst({
      where: { supabaseUserId: membership.supabaseUserId },
      select: { status: true, onboardingGeneration: true },
    });
    const isActiveGenerationAccount =
      account?.status === "ACTIVE" && (account.onboardingGeneration ?? 0) >= 2;
    if (isActiveGenerationAccount) continue;

    const result = evaluateTenantPlatformAccountAuthorization({
      supabaseUserId: membership.supabaseUserId,
      account,
      requiredGeneration: 2,
      registrationFeatureEnabled: true,
      hasTenantMembership: true,
    });

    if (result.authorized) {
      console.error("FAIL — MEMBERSHIP ALONE CANNOT AUTHORIZE ACCESS");
      process.exit(1);
    }
    console.log("PASS — MEMBERSHIP ALONE CANNOT AUTHORIZE ACCESS");
    return;
  }
  console.log("PASS — inactive-membership regression skipped (no qualifying legacy row)");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
