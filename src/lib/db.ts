import "@/lib/server-only-guard";

import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import {
  assertPreviewDbAccessAllowed,
  isPreviewDbDisabledMode,
} from "@/lib/runtime/preview-db-safety";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaTransaction: PrismaClient | undefined;
};

function createBaseClient(url?: string): PrismaClient {
  return new PrismaClient({
    ...(url ? { datasources: { db: { url } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Fail closed on every Prisma access when Preview DB-disabled mode is active.
 * Mode is re-checked on each property access (not only at module load).
 */
function guardPrismaClient(client: PrismaClient): PrismaClient {
  return new Proxy(client, {
    get(target, prop, receiver) {
      if (typeof prop === "symbol") {
        return Reflect.get(target, prop, receiver);
      }
      if (
        prop === "then" ||
        prop === "catch" ||
        prop === "finally" ||
        prop === "toString" ||
        prop === "valueOf" ||
        prop === "$$typeof"
      ) {
        return Reflect.get(target, prop, receiver);
      }
      if (isPreviewDbDisabledMode()) {
        assertPreviewDbAccessAllowed(`Prisma.${String(prop)}`);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as PrismaClient;
}

const rawPrisma = globalForPrisma.prisma ?? createBaseClient();
export const prisma = guardPrismaClient(rawPrisma);

/** Interactive transactions require a direct/session DB connection (not PgBouncer transaction pooler). */
const rawPrismaForTransactions =
  globalForPrisma.prismaTransaction ??
  (process.env.DIRECT_URL ? createBaseClient(process.env.DIRECT_URL) : rawPrisma);

const prismaForTransactions = guardPrismaClient(rawPrismaForTransactions);

export function prismaTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  assertPreviewDbAccessAllowed("Prisma.$transaction");
  return prismaForTransactions.$transaction(fn, {
    maxWait: 10_000,
    timeout: 60_000,
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = rawPrisma;
  globalForPrisma.prismaTransaction = rawPrismaForTransactions;
}
