import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaTransaction: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

/** Interactive transactions require a direct/session DB connection (not PgBouncer transaction pooler). */
const prismaForTransactions =
  globalForPrisma.prismaTransaction ??
  (process.env.DIRECT_URL
    ? new PrismaClient({
        datasources: { db: { url: process.env.DIRECT_URL } },
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      })
    : prisma);

export function prismaTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prismaForTransactions.$transaction(fn, {
    maxWait: 10_000,
    timeout: 60_000,
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaTransaction = prismaForTransactions;
}
