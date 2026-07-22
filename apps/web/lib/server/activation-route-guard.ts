import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActivationCommandService } from "@ghuravia/data";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import {
  assertLocalRuntime,
  decodeSession,
  getSessionSecret,
  sessionCookieName,
} from "../session";
import {
  canAccessScreen,
  routeFor,
  type GovernedScreenId,
} from "../activation-routes";
import { getDb } from "./db";

export type ActivationAccessResult = {
  resource: ActivationResource | null;
  sessionPresent: boolean;
};

async function loadResourceForSession(): Promise<ActivationAccessResult> {
  assertLocalRuntime();
  const jar = await cookies();
  const raw = jar.get(sessionCookieName())?.value;
  if (!raw) {
    return { resource: null, sessionPresent: false };
  }
  const session = decodeSession(raw, getSessionSecret());
  if (!session) {
    return { resource: null, sessionPresent: false };
  }
  const { db } = getDb();
  const svc = new ActivationCommandService(db);
  const resource = await svc.get(session.accountId);
  return { resource, sessionPresent: true };
}

/**
 * Entry screens (ACT-003 / ACT-011): allow missing session for synthetic bootstrap.
 * Does not redirect when unauthorized bootstrap is allowed.
 */
export async function loadActivationEntryScreen(
  screenId: "ACT-003" | "ACT-011",
): Promise<ActivationAccessResult> {
  const result = await loadResourceForSession();
  if (!result.resource) {
    return result;
  }
  const access = canAccessScreen(screenId, result.resource);
  if (!access.allowed && access.redirectTo) {
    redirect(routeFor(access.redirectTo));
  }
  return result;
}

/**
 * Protected screens: require session + aggregate + policy allow.
 * Redirects before any protected page content renders.
 */
export async function requireActivationScreenAccess(
  screenId: Exclude<GovernedScreenId, "ACT-003" | "ACT-011">,
): Promise<{ resource: ActivationResource }> {
  const result = await loadResourceForSession();
  if (!result.resource) {
    redirect(routeFor("ACT-003"));
  }
  const access = canAccessScreen(screenId, result.resource);
  if (!access.allowed) {
    redirect(routeFor(access.redirectTo ?? "ACT-003"));
  }
  return { resource: result.resource };
}
