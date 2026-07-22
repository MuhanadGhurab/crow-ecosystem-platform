/**
 * Governed onboarding / identity routes (screen IDs from Master Registry).
 * Composed with activation routes for ALLOWED_RETURN_TO.
 */
import {
  canAccessOnboardingScreen,
  type Onboarding,
  type OnboardingScreenId,
} from "@ghuravia/domain";

export type { OnboardingScreenId };

export const ONBOARDING_ROUTES = {
  "ONB-001": "/onboarding/entry",
  "IDN-001": "/onboarding/crow",
  "IDN-002": "/onboarding/habitat",
  "IDN-003": "/onboarding/character",
  "ONB-002": "/onboarding/origin",
  "ONB-003": "/onboarding/nest-intro",
} as const satisfies Record<OnboardingScreenId, string>;

export const ONBOARDING_SCREEN_ORDER: readonly OnboardingScreenId[] = [
  "ONB-001",
  "IDN-001",
  "IDN-002",
  "IDN-003",
  "ONB-002",
  "ONB-003",
];

export function onboardingRouteFor(screenId: OnboardingScreenId): string {
  return ONBOARDING_ROUTES[screenId];
}

export type OnboardingResourceLike = {
  state: string;
  path?: string | null;
  personalization?: {
    path?: string | null;
    crowOptionId?: string | null;
    colorOptionId?: string | null;
    styleOptionId?: string | null;
    habitatOptionId?: string | null;
    characterOptionId?: string | null;
    accessoryOptionId?: string | null;
    status?: string;
  };
  origin?: {
    status?: string;
  };
  accessibleScreens?: readonly string[];
};

/** Map API/resource shape into the domain access helper inputs. */
function toAccessAggregate(resource: OnboardingResourceLike): Onboarding {
  const p = resource.personalization;
  return {
    id: "access-check",
    state: resource.state as Onboarding["state"],
    version: 0,
    personalizationCatalogueVersion: "0.1.0",
    originCatalogueVersion: "0.1.0",
    path: (p?.path ?? resource.path ?? null) as Onboarding["path"],
    crowOptionId: p?.crowOptionId ?? null,
    colorOptionId: p?.colorOptionId ?? null,
    styleOptionId: p?.styleOptionId ?? null,
    habitatOptionId: p?.habitatOptionId ?? null,
    characterOptionId: p?.characterOptionId ?? null,
    accessoryOptionId: p?.accessoryOptionId ?? null,
    personalizationStatus: (p?.status ??
      "NOT_STARTED") as Onboarding["personalizationStatus"],
    originStatus: (resource.origin?.status ??
      "NOT_STARTED") as Onboarding["originStatus"],
    originRegionOption: null,
    originExperienceOption: null,
    originGoalsOptions: [],
    contrastOverrideAcknowledged: false,
    privacyPreviewAcknowledged: false,
  };
}

/**
 * When no onboarding row yet: only ONB-001 (requires ACTIVATED — enforced by guard).
 * Otherwise defer to domain canAccessOnboardingScreen.
 */
export function canAccessOnboardingRoute(
  screenId: OnboardingScreenId,
  resource: OnboardingResourceLike | null,
): { allowed: boolean; redirectTo?: OnboardingScreenId } {
  if (!resource) {
    if (screenId === "ONB-001") {
      return { allowed: true };
    }
    return { allowed: false, redirectTo: "ONB-001" };
  }

  if (resource.accessibleScreens) {
    const allowed = resource.accessibleScreens.includes(screenId);
    if (allowed) return { allowed: true };
    return {
      allowed: false,
      redirectTo: resolveResumeScreen(resource),
    };
  }

  const aggregate = toAccessAggregate(resource);
  if (canAccessOnboardingScreen(aggregate, screenId)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    redirectTo: resolveResumeScreen(resource),
  };
}

/** Furthest screen the learner may open (server resume point). */
export function resolveResumeScreen(
  resource: OnboardingResourceLike | null,
): OnboardingScreenId {
  if (!resource) return "ONB-001";
  if (resource.accessibleScreens?.length) {
    let last: OnboardingScreenId = "ONB-001";
    for (const id of ONBOARDING_SCREEN_ORDER) {
      if (resource.accessibleScreens.includes(id)) last = id;
    }
    return last;
  }
  const aggregate = toAccessAggregate(resource);
  let last: OnboardingScreenId = "ONB-001";
  for (const id of ONBOARDING_SCREEN_ORDER) {
    if (canAccessOnboardingScreen(aggregate, id)) last = id;
  }
  return last;
}
