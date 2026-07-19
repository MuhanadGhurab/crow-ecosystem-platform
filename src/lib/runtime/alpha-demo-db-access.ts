/**
 * CROW.DEVFLOW.5 — Narrow Prisma escape hatch for allowlisted alpha demo writes.
 *
 * Preview DB-disabled remains fail-closed for all normal `prisma` access.
 * This path may touch the DB only after DEVFLOW.4 write-guard success,
 * and only for explicitly allowlisted actions (demo_feedback_save in DEVFLOW.5).
 */

import type { PrismaClient } from "@prisma/client";
import {
  assertAlphaDemoWriteAllowed,
  type AlphaDemoWriteAction,
  type AlphaDemoWriteGuardContext,
  type AlphaDemoWriteMarkers,
} from "@/lib/runtime/alpha-demo-write-guard";

/** Actions authorized to use the unguarded Prisma client in current milestones. */
const ALPHA_DEMO_PRISMA_ESCAPE_ACTIONS = ["demo_feedback_save"] as const;

export type AlphaDemoPrismaEscapeAction =
  (typeof ALPHA_DEMO_PRISMA_ESCAPE_ACTIONS)[number];

export function isAlphaDemoPrismaEscapeAction(
  action: string,
): action is AlphaDemoPrismaEscapeAction {
  return (ALPHA_DEMO_PRISMA_ESCAPE_ACTIONS as readonly string[]).includes(action);
}

type RawPrismaHolder = {
  __crowRawPrismaForAlphaDemo?: PrismaClient;
};

/**
 * Register the unguarded Prisma client (called once from db.ts).
 * Not a public API for domain services.
 */
export function registerAlphaDemoRawPrisma(client: PrismaClient): void {
  (globalThis as RawPrismaHolder).__crowRawPrismaForAlphaDemo = client;
}

function getRawPrisma(): PrismaClient {
  const client = (globalThis as RawPrismaHolder).__crowRawPrismaForAlphaDemo;
  if (!client) {
    throw new Error(
      "Alpha demo Prisma escape hatch is not registered. Import @/lib/db before use.",
    );
  }
  return client;
}

/**
 * Run a Prisma write only after alpha demo write-guard passes.
 * Does not loosen Preview DB-disabled for general `prisma` usage.
 */
export async function withAlphaDemoAllowlistedPrismaWrite<T>(
  action: AlphaDemoWriteAction,
  markers: AlphaDemoWriteMarkers,
  context: AlphaDemoWriteGuardContext,
  fn: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  assertAlphaDemoWriteAllowed(action, markers, context);
  if (!isAlphaDemoPrismaEscapeAction(action)) {
    throw new Error(
      `Alpha demo Prisma escape hatch is not authorized for action "${action}".`,
    );
  }
  // Ensure unguarded client is registered (side-effect of db module).
  await import("@/lib/db");
  return fn(getRawPrisma());
}
