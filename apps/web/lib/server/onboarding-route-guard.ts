import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ActivationCommandService,
  OnboardingCommandService,
} from "@ghuravia/data";
import type {
  ActivationResource,
  OnboardingResource,
} from "@ghuravia/contracts/schemas";
import type { OnboardingScreenId } from "@ghuravia/domain";
import {
  assertLocalRuntime,
  decodeSession,
  getSessionSecret,
  sessionCookieName,
} from "../session";
import {
  canAccessOnboardingRoute,
  onboardingRouteFor,
} from "../onboarding-routes";
import { resolveAuthorizedScreen, routeFor } from "../activation-routes";
import { getDb } from "./db";

export type OnboardingAccessResult = {
  activation: ActivationResource;
  onboarding: OnboardingResource | null;
};

async function loadActivatedSession(): Promise<{
  activation: ActivationResource | null;
  onboarding: OnboardingResource | null;
  sessionPresent: boolean;
}> {
  assertLocalRuntime();
  const jar = await cookies();
  const raw = jar.get(sessionCookieName())?.value;
  if (!raw) {
    return { activation: null, onboarding: null, sessionPresent: false };
  }
  const session = decodeSession(raw, getSessionSecret());
  if (!session) {
    return { activation: null, onboarding: null, sessionPresent: false };
  }
  const { db } = getDb();
  const activationSvc = new ActivationCommandService(db);
  const onboardingSvc = new OnboardingCommandService(db);
  const [activation, onboarding] = await Promise.all([
    activationSvc.get(session.accountId),
    onboardingSvc.get(session.accountId),
  ]);
  return { activation, onboarding, sessionPresent: true };
}

/**
 * Onboarding screens: require ACTIVATED activation resource AND onboarding
 * screen access. Redirects before any protected page content renders.
 * When no onboarding row yet: ONB-001 allowed if ACTIVATED.
 */
export async function requireOnboardingScreenAccess(
  screenId: OnboardingScreenId,
): Promise<OnboardingAccessResult> {
  const result = await loadActivatedSession();
  if (!result.activation || result.activation.state !== "ACTIVATED") {
    // Preserve activation progression — do not always bounce to ACT-003.
    if (result.activation) {
      redirect(routeFor(resolveAuthorizedScreen(result.activation)));
    }
    redirect(routeFor("ACT-003"));
  }
  const access = canAccessOnboardingRoute(screenId, result.onboarding);
  if (!access.allowed) {
    redirect(onboardingRouteFor(access.redirectTo ?? "ONB-001"));
  }
  return {
    activation: result.activation,
    onboarding: result.onboarding,
  };
}
