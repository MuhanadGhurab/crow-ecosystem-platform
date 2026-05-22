import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  const rows = await prisma.$queryRaw`
    SELECT count(*)::bigint AS c
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `;
  const count = Number(rows[0].c);
  console.log(`public_table_count=${count}`);
} finally {
  await prisma.$disconnect();
}
