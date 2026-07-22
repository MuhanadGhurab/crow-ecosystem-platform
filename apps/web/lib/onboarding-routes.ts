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
  "ONB-004": "/onboarding/nest-assessment",
  "ONB-005": "/onboarding/nest-result",
  "ONB-006": "/onboarding/nest-learning-path",
  "ONB-007": "/onboarding/choose-horizon",
} as const satisfies Record<OnboardingScreenId, string>;

export const ONBOARDING_SCREEN_ORDER: readonly OnboardingScreenId[] = [
  "ONB-001",
  "IDN-001",
  "IDN-002",
  "IDN-003",
  "ONB-002",
  "ONB-003",
  "ONB-004",
  "ONB-005",
  "ONB-006",
  "ONB-007",
];

export function onboardingRouteFor(screenId: OnboardingScreenId): string {
  return ONBOARDING_ROUTES[screenId];
}

export type OnboardingResourceLike = {
  state: string;
  path?: string | null;
  personalizationCatalogueVersion?: string;
  originCatalogueVersion?: string;
  nestReadinessCatalogueVersion?: string;
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
  nestReadiness?: {
    attemptId?: string | null;
    attemptStatus?: string;
    score?: number | null;
    band?: string | null;
    weakCapabilityIds?: readonly string[];
    resultAcknowledged?: boolean;
    answeredItemIds?: readonly string[];
  };
  accessibleScreens?: readonly string[];
};

/** Map API/resource shape into the domain access helper inputs. */
function toAccessAggregate(resource: OnboardingResourceLike): Onboarding {
  const p = resource.personalization;
  const n = resource.nestReadiness;
  return {
    id: "access-check",
    state: resource.state as Onboarding["state"],
    version: 0,
    personalizationCatalogueVersion:
      resource.personalizationCatalogueVersion ?? "0.1.0",
    originCatalogueVersion: resource.originCatalogueVersion ?? "0.1.0",
    nestReadinessCatalogueVersion:
      resource.nestReadinessCatalogueVersion ?? "0.1.0",
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
    nestAttemptId: n?.attemptId ?? null,
    nestAttemptStatus: (n?.attemptStatus ??
      "NONE") as Onboarding["nestAttemptStatus"],
    nestAnswers: (n?.answeredItemIds ?? []).map((itemId) => ({
      itemId,
      optionId: "",
      correct: false,
      capabilityIds: [],
    })),
    nestScore: n?.score ?? null,
    nestBand: (n?.band as Onboarding["nestBand"]) ?? null,
    nestWeakCapabilityIds: n?.weakCapabilityIds ? [...n.weakCapabilityIds] : [],
    nestResultAcknowledged: n?.resultAcknowledged ?? false,
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
