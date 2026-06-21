import { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";

const prisma = new PrismaClient();

async function main() {
  const groupBy = await prisma.platformAccount.groupBy({
    by: ["status", "onboardingGeneration"],
    _count: true,
  });
  console.log("status/generation:", JSON.stringify(groupBy));

  const activeGen2 = await prisma.platformAccount.count({
    where: { status: "ACTIVE", onboardingGeneration: 2, emailVerifiedAt: { not: null } },
  });
  console.log("ACTIVE gen2 email-verified:", activeGen2);

  const platformAdminNorm = process.env.PLATFORM_ADMIN_EMAIL?.trim()
    ? normalizeEmail(process.env.PLATFORM_ADMIN_EMAIL.trim())
    : null;

  const rows = await prisma.platformAccount.findMany({
    where: { onboardingGeneration: 2 },
    include: { legalAcceptances: true, providerIdentities: true },
    take: 30,
  });

  for (const r of rows) {
    const isAdmin = platformAdminNorm && r.emailNormalized === platformAdminNorm;
    console.log(
      JSON.stringify({
        opaque: r.id.slice(0, 8),
        status: r.status,
        legal: r.legalAcceptances.length,
        verified: r.emailVerifiedAt != null,
        providers: r.providerIdentities.length,
        excludedAdmin: isAdmin,
      })
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
