/**
 * CLI/script Prisma client — no `server-only` boundary.
 * Use from tsx scripts, prisma seeds, and one-off ops. App code should use `@/lib/db`.
 */
import { PrismaClient } from "@prisma/client";

export function createScriptPrisma(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}
