/** Find most recently activated gen-2 accounts — aggregates only. */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const events = await prisma.platformAccountAuditEvent.findMany({
    where: { eventType: "ACCOUNT_ACTIVATED" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      platformAccount: {
        select: {
          id: true,
          status: true,
          onboardingGeneration: true,
          emailVerifiedAt: true,
        },
      },
    },
  });
  console.log("recent ACCOUNT_ACTIVATED:", events.length);
  for (const e of events) {
    const a = e.platformAccount;
    console.log(
      JSON.stringify({
        opaque: a.id.slice(0, 8),
        status: a.status,
        gen: a.onboardingGeneration,
        verified: a.emailVerifiedAt != null,
        at: e.createdAt.toISOString(),
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
