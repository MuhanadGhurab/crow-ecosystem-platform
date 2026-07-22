import type {
  CosmeticsExplainableLock,
  OnboardingCommand,
  OnboardingPath,
  OnboardingState,
  OriginStatus,
  PersonalizationStatus,
} from "@ghuravia/contracts/schemas";
import {
  ORIGIN_CATALOGUE_VERSION,
  PERSONALIZATION_CATALOGUE_VERSION,
} from "@ghuravia/contracts/schemas";

export const PERSONALIZATION_VERSION = PERSONALIZATION_CATALOGUE_VERSION;
export const ORIGIN_VERSION = ORIGIN_CATALOGUE_VERSION;

export const UNLOCKED_CROW = ["crow.classic", "crow.rounded"] as const;
export const UNLOCKED_COLOR = [
  "color.ink_sand",
  "color.dusk_teal",
  "color.ember_slate",
] as const;
export const UNLOCKED_STYLE = [
  "style.calm",
  "style.alert",
  "style.playful",
] as const;
export const UNLOCKED_HABITAT = [
  "habitat.coastal_shelf",
  "habitat.mountain_roost",
  "habitat.city_antenna",
  "habitat.desert_wadi",
] as const;
export const UNLOCKED_CHARACTER = [
  "character.curious_scout",
  "character.steady_builder",
  "character.careful_guardian",
] as const;
export const UNLOCKED_ACCESSORY = [
  "accessory.none",
  "accessory.pattern_soft",
] as const;

export const LOCKED_HABITAT = "habitat.locked_later" as const;
export const LOCKED_CHARACTER = "character.locked_later" as const;
export const LOCKED_ACCESSORY = "accessory.locked_later" as const;

export const QUICK_START_DEFAULTS = {
  crowOptionId: "crow.classic",
  colorOptionId: "color.ink_sand",
  styleOptionId: "style.calm",
  habitatOptionId: "habitat.coastal_shelf",
  characterOptionId: "character.curious_scout",
  accessoryOptionId: "accessory.none",
} as const;

export const ORIGIN_REGION_OPTIONS = [
  "region.gulf",
  "region.levant",
  "region.north_africa",
  "region.wider_mena",
  "region.global_other",
  "region.prefer_not",
] as const;

export const ORIGIN_EXPERIENCE_OPTIONS = [
  "exp.exploring",
  "exp.early_career",
  "exp.switching",
  "exp.building",
  "exp.prefer_not",
] as const;

export const ORIGIN_GOAL_OPTIONS = [
  "goal.foundations",
  "goal.confidence",
  "goal.explore_horizons",
  "goal.community",
  "goal.prefer_not",
] as const;

export type OnboardingScreenId =
  "ONB-001" | "IDN-001" | "IDN-002" | "IDN-003" | "ONB-002" | "ONB-003";

export type Onboarding = {
  id: string;
  state: OnboardingState;
  version: number;
  personalizationCatalogueVersion: string;
  originCatalogueVersion: string;
  path: OnboardingPath | null;
  crowOptionId: string | null;
  colorOptionId: string | null;
  styleOptionId: string | null;
  habitatOptionId: string | null;
  characterOptionId: string | null;
  accessoryOptionId: string | null;
  personalizationStatus: PersonalizationStatus;
  originStatus: OriginStatus;
  originRegionOption: string | null;
  originExperienceOption: string | null;
  originGoalsOptions: readonly string[];
  contrastOverrideAcknowledged: boolean;
  privacyPreviewAcknowledged: boolean;
};

export type OnboardingDomainResult = {
  aggregate: Onboarding;
  events: readonly string[];
  auditIntent: {
    action: string;
    actorRef: string;
    reason?: string;
    authority?: string;
    /** Metadata only — never Origin response bodies */
    fieldCategory?: string;
    priorStatus?: string;
    resultingStatus?: string;
    catalogueVersion?: string;
  };
};

const transitions: Record<
  OnboardingState,
  readonly OnboardingCommand["type"][]
> = {
  NOT_STARTED: ["BEGIN_GUIDED_PERSONALIZATION", "BEGIN_QUICK_START"],
  PERSONALIZATION_STARTED: [
    "SAVE_CROW_BASICS",
    "SELECT_HABITAT",
    "SELECT_CHARACTER",
    "SAVE_PERSONALIZATION_REVIEW",
  ],
  PERSONALIZATION_MINIMUM_COMPLETE: [
    "SAVE_CROW_BASICS",
    "SELECT_HABITAT",
    "SELECT_CHARACTER",
    "SAVE_PERSONALIZATION_REVIEW",
    "SAVE_ORIGIN_DRAFT",
    "MARK_ORIGIN_REVIEW_LATER",
    "COMPLETE_ORIGIN",
  ],
  ORIGIN_DRAFT: [
    "SAVE_ORIGIN_DRAFT",
    "MARK_ORIGIN_REVIEW_LATER",
    "COMPLETE_ORIGIN",
  ],
  ORIGIN_REVIEW_LATER: [
    // Later-edit compatibility (Wingprint Home deferred) — cosmetics remain editable
    "SAVE_CROW_BASICS",
    "SELECT_HABITAT",
    "SELECT_CHARACTER",
    "SAVE_PERSONALIZATION_REVIEW",
    "SAVE_ORIGIN_DRAFT",
    "COMPLETE_ORIGIN",
    "ACK_NEST_INTRO_HANDOFF",
  ],
  ORIGIN_COMPLETE: [
    "SAVE_CROW_BASICS",
    "SELECT_HABITAT",
    "SELECT_CHARACTER",
    "SAVE_PERSONALIZATION_REVIEW",
    "SAVE_ORIGIN_DRAFT",
    "ACK_NEST_INTRO_HANDOFF",
  ],
  NEST_INTRO_HANDOFF: [
    "SAVE_CROW_BASICS",
    "SELECT_HABITAT",
    "SELECT_CHARACTER",
    "SAVE_PERSONALIZATION_REVIEW",
    "SAVE_ORIGIN_DRAFT",
    "COMPLETE_ORIGIN",
  ],
};

function includesId(list: readonly string[], id: string): boolean {
  return list.includes(id);
}

export function createInitialOnboarding(id: string): Onboarding {
  return {
    id,
    state: "NOT_STARTED",
    version: 0,
    personalizationCatalogueVersion: PERSONALIZATION_VERSION,
    originCatalogueVersion: ORIGIN_VERSION,
    path: null,
    crowOptionId: null,
    colorOptionId: null,
    styleOptionId: null,
    habitatOptionId: null,
    characterOptionId: null,
    accessoryOptionId: null,
    personalizationStatus: "NOT_STARTED",
    originStatus: "NOT_STARTED",
    originRegionOption: null,
    originExperienceOption: null,
    originGoalsOptions: [],
    contrastOverrideAcknowledged: false,
    privacyPreviewAcknowledged: false,
  };
}

export function hasCrowBasics(o: Onboarding): boolean {
  return Boolean(
    o.crowOptionId &&
    o.colorOptionId &&
    o.styleOptionId &&
    includesId(UNLOCKED_CROW, o.crowOptionId) &&
    includesId(UNLOCKED_COLOR, o.colorOptionId) &&
    includesId(UNLOCKED_STYLE, o.styleOptionId),
  );
}

export function isMinimumPersonalizationComplete(o: Onboarding): boolean {
  return Boolean(
    hasCrowBasics(o) &&
    o.habitatOptionId &&
    o.characterOptionId &&
    includesId(UNLOCKED_HABITAT, o.habitatOptionId) &&
    includesId(UNLOCKED_CHARACTER, o.characterOptionId),
  );
}

export function nestIntroHandoffAllowed(o: Onboarding): boolean {
  return (
    o.originStatus === "REVIEW_LATER" ||
    o.originStatus === "COMPLETE" ||
    o.state === "NEST_INTRO_HANDOFF"
  );
}

export function canAccessOnboardingScreen(
  o: Onboarding,
  screen: OnboardingScreenId,
): boolean {
  switch (screen) {
    case "ONB-001":
      return true;
    case "IDN-001":
      return o.state !== "NOT_STARTED";
    case "IDN-002":
      return hasCrowBasics(o) || o.path === "QUICK_START";
    case "IDN-003":
      return Boolean(o.habitatOptionId) || o.path === "QUICK_START";
    case "ONB-002":
      return isMinimumPersonalizationComplete(o);
    case "ONB-003":
      return nestIntroHandoffAllowed(o);
    default: {
      const _exhaustive: never = screen;
      return _exhaustive;
    }
  }
}

export function accessibleScreens(o: Onboarding): OnboardingScreenId[] {
  const screens: OnboardingScreenId[] = [
    "ONB-001",
    "IDN-001",
    "IDN-002",
    "IDN-003",
    "ONB-002",
    "ONB-003",
  ];
  return screens.filter((s) => canAccessOnboardingScreen(o, s));
}

export function allowedNextOnboardingActions(o: Onboarding): string[] {
  return [...transitions[o.state]];
}

/** Locked cosmetics: preview + explainable lock only; never required. */
export function explainableLocksForCosmetics(): CosmeticsExplainableLock[] {
  return [
    {
      code: "HABITAT_LOCKED_PREVIEW_ONLY",
      optionId: LOCKED_HABITAT,
      messageAr: "هذا الموطن غير متاح بعد — يمكنك المعاينة فقط.",
      messageEn: "This habitat is locked for later — preview only.",
      missingPrerequisite: "future_unlock",
      nextAction: "preview_only",
      previewAllowed: true,
      requiredForProgress: false,
    },
    {
      code: "CHARACTER_LOCKED_PREVIEW_ONLY",
      optionId: LOCKED_CHARACTER,
      messageAr: "هذه الشخصية غير متاحة بعد — يمكنك المعاينة فقط.",
      messageEn: "This character is locked for later — preview only.",
      missingPrerequisite: "future_unlock",
      nextAction: "preview_only",
      previewAllowed: true,
      requiredForProgress: false,
    },
    {
      code: "ACCESSORY_LOCKED_PREVIEW_ONLY",
      optionId: LOCKED_ACCESSORY,
      messageAr: "هذه الإضافة غير متاحة بعد — يمكنك المعاينة فقط.",
      messageEn: "This accessory is locked for later — preview only.",
      missingPrerequisite: "future_unlock",
      nextAction: "preview_only",
      previewAllowed: true,
      requiredForProgress: false,
    },
  ];
}

/** Visual Identity ≠ Knowledge / Personalization ≠ Skill — always zero. */
export function personalizationProgressionImpact(): {
  xp: 0;
  mastery: 0;
  rank: 0;
  prestige: 0;
  trust: 0;
} {
  return { xp: 0, mastery: 0, rank: 0, prestige: 0, trust: 0 };
}

/** Origin ≠ Trust — Origin never affects Trust. */
export function originDoesNotAffectTrust(): { trust: 0 } {
  return { trust: 0 };
}

function requirePersonalizationCatalogue(command: OnboardingCommand): void {
  if (
    command.personalizationCatalogueVersion !== undefined &&
    command.personalizationCatalogueVersion !== PERSONALIZATION_VERSION
  ) {
    throw new Error("CATALOGUE_VERSION_CONFLICT: personalization catalogue");
  }
  if (command.personalizationCatalogueVersion === undefined) {
    throw new Error(
      "CATALOGUE_VERSION_CONFLICT: personalizationCatalogueVersion required",
    );
  }
}

function requireOriginCatalogue(command: OnboardingCommand): void {
  if (
    command.originCatalogueVersion !== undefined &&
    command.originCatalogueVersion !== ORIGIN_VERSION
  ) {
    throw new Error("CATALOGUE_VERSION_CONFLICT: origin catalogue");
  }
  if (command.originCatalogueVersion === undefined) {
    throw new Error(
      "CATALOGUE_VERSION_CONFLICT: originCatalogueVersion required",
    );
  }
}

function assertUnlockedEquip(
  kind: "habitat" | "character" | "accessory",
  optionId: string,
): void {
  if (kind === "habitat") {
    if (optionId === LOCKED_HABITAT) {
      throw new Error(
        "FORBIDDEN: locked habitat cannot be equipped (preview only)",
      );
    }
    if (!includesId(UNLOCKED_HABITAT, optionId)) {
      throw new Error("VALIDATION_ERROR: unknown habitat option");
    }
    return;
  }
  if (kind === "character") {
    if (optionId === LOCKED_CHARACTER) {
      throw new Error(
        "FORBIDDEN: locked character cannot be equipped (preview only)",
      );
    }
    if (!includesId(UNLOCKED_CHARACTER, optionId)) {
      throw new Error("VALIDATION_ERROR: unknown character option");
    }
    return;
  }
  if (optionId === LOCKED_ACCESSORY) {
    throw new Error(
      "FORBIDDEN: locked accessory cannot be equipped (preview only)",
    );
  }
  if (!includesId(UNLOCKED_ACCESSORY, optionId)) {
    throw new Error("VALIDATION_ERROR: unknown accessory option");
  }
}

function validateCrowBasics(command: OnboardingCommand): void {
  if (
    !command.crowOptionId ||
    !includesId(UNLOCKED_CROW, command.crowOptionId)
  ) {
    throw new Error("VALIDATION_ERROR: invalid crow option");
  }
  if (
    !command.colorOptionId ||
    !includesId(UNLOCKED_COLOR, command.colorOptionId)
  ) {
    throw new Error("VALIDATION_ERROR: invalid color option");
  }
  if (
    !command.styleOptionId ||
    !includesId(UNLOCKED_STYLE, command.styleOptionId)
  ) {
    throw new Error("VALIDATION_ERROR: invalid style option");
  }
  if (command.accessoryOptionId !== undefined) {
    assertUnlockedEquip("accessory", command.accessoryOptionId);
  }
}

function validateOriginSelections(command: OnboardingCommand): void {
  if (
    command.originRegionOption !== undefined &&
    command.originRegionOption !== null
  ) {
    if (!includesId(ORIGIN_REGION_OPTIONS, command.originRegionOption)) {
      throw new Error("ORIGIN_SCHEMA_CONFLICT: invalid region option");
    }
  }
  if (
    command.originExperienceOption !== undefined &&
    command.originExperienceOption !== null
  ) {
    if (
      !includesId(ORIGIN_EXPERIENCE_OPTIONS, command.originExperienceOption)
    ) {
      throw new Error("ORIGIN_SCHEMA_CONFLICT: invalid experience option");
    }
  }
  if (command.originGoalsOptions !== undefined) {
    if (command.originGoalsOptions.length > 3) {
      throw new Error("ORIGIN_SCHEMA_CONFLICT: goals max 3");
    }
    for (const goal of command.originGoalsOptions) {
      if (!includesId(ORIGIN_GOAL_OPTIONS, goal)) {
        throw new Error("ORIGIN_SCHEMA_CONFLICT: invalid goal option");
      }
    }
  }
}

function refreshPersonalizationStatus(
  o: Onboarding,
  reviewed: boolean,
): PersonalizationStatus {
  if (reviewed) return "REVIEWED";
  if (isMinimumPersonalizationComplete(o)) return "MINIMUM_COMPLETE";
  if (
    o.crowOptionId ||
    o.colorOptionId ||
    o.styleOptionId ||
    o.habitatOptionId ||
    o.characterOptionId ||
    o.accessoryOptionId
  ) {
    return "DRAFT";
  }
  return o.personalizationStatus === "NOT_STARTED" ? "NOT_STARTED" : "DRAFT";
}

export function applyOnboardingCommand(
  current: Onboarding,
  command: OnboardingCommand,
  expectedVersion: number,
): OnboardingDomainResult {
  if (expectedVersion !== current.version) {
    throw new Error("CONFLICT: optimistic version mismatch");
  }
  if (!transitions[current.state].includes(command.type)) {
    throw new Error("INVALID_TRANSITION");
  }

  let next: Onboarding = {
    ...current,
    originGoalsOptions: [...current.originGoalsOptions],
  };
  let fieldCategory: string | undefined;
  let priorStatus: string | undefined;
  let resultingStatus: string | undefined;
  let catalogueVersion: string | undefined;

  switch (command.type) {
    case "BEGIN_GUIDED_PERSONALIZATION": {
      requirePersonalizationCatalogue(command);
      catalogueVersion = PERSONALIZATION_VERSION;
      fieldCategory = "personalization_path";
      priorStatus = current.personalizationStatus;
      next = {
        ...next,
        state: "PERSONALIZATION_STARTED",
        path: "GUIDED",
        personalizationStatus: "DRAFT",
        privacyPreviewAcknowledged:
          command.privacyPreviewAcknowledged ?? next.privacyPreviewAcknowledged,
      };
      resultingStatus = next.personalizationStatus;
      break;
    }
    case "BEGIN_QUICK_START": {
      requirePersonalizationCatalogue(command);
      catalogueVersion = PERSONALIZATION_VERSION;
      fieldCategory = "personalization_path";
      priorStatus = current.personalizationStatus;
      next = {
        ...next,
        state: "PERSONALIZATION_MINIMUM_COMPLETE",
        path: "QUICK_START",
        crowOptionId: QUICK_START_DEFAULTS.crowOptionId,
        colorOptionId: QUICK_START_DEFAULTS.colorOptionId,
        styleOptionId: QUICK_START_DEFAULTS.styleOptionId,
        habitatOptionId: QUICK_START_DEFAULTS.habitatOptionId,
        characterOptionId: QUICK_START_DEFAULTS.characterOptionId,
        accessoryOptionId: QUICK_START_DEFAULTS.accessoryOptionId,
        personalizationStatus: "MINIMUM_COMPLETE",
        privacyPreviewAcknowledged:
          command.privacyPreviewAcknowledged ?? next.privacyPreviewAcknowledged,
      };
      resultingStatus = next.personalizationStatus;
      break;
    }
    case "SAVE_CROW_BASICS": {
      requirePersonalizationCatalogue(command);
      catalogueVersion = PERSONALIZATION_VERSION;
      validateCrowBasics(command);
      fieldCategory = "crow_basics";
      priorStatus = current.personalizationStatus;
      next = {
        ...next,
        crowOptionId: command.crowOptionId!,
        colorOptionId: command.colorOptionId!,
        styleOptionId: command.styleOptionId!,
        accessoryOptionId:
          command.accessoryOptionId ??
          next.accessoryOptionId ??
          "accessory.none",
        contrastOverrideAcknowledged:
          command.contrastOverrideAcknowledged ??
          next.contrastOverrideAcknowledged,
      };
      next.personalizationStatus = refreshPersonalizationStatus(next, false);
      if (
        next.state === "PERSONALIZATION_STARTED" &&
        isMinimumPersonalizationComplete(next)
      ) {
        next.state = "PERSONALIZATION_MINIMUM_COMPLETE";
      }
      resultingStatus = next.personalizationStatus;
      break;
    }
    case "SELECT_HABITAT": {
      requirePersonalizationCatalogue(command);
      catalogueVersion = PERSONALIZATION_VERSION;
      if (!command.habitatOptionId) {
        throw new Error("VALIDATION_ERROR: habitatOptionId required");
      }
      assertUnlockedEquip("habitat", command.habitatOptionId);
      fieldCategory = "habitat";
      priorStatus = current.personalizationStatus;
      next = { ...next, habitatOptionId: command.habitatOptionId };
      next.personalizationStatus = refreshPersonalizationStatus(next, false);
      if (
        next.state === "PERSONALIZATION_STARTED" &&
        isMinimumPersonalizationComplete(next)
      ) {
        next.state = "PERSONALIZATION_MINIMUM_COMPLETE";
      }
      resultingStatus = next.personalizationStatus;
      break;
    }
    case "SELECT_CHARACTER": {
      requirePersonalizationCatalogue(command);
      catalogueVersion = PERSONALIZATION_VERSION;
      if (!command.characterOptionId) {
        throw new Error("VALIDATION_ERROR: characterOptionId required");
      }
      assertUnlockedEquip("character", command.characterOptionId);
      fieldCategory = "character";
      priorStatus = current.personalizationStatus;
      next = { ...next, characterOptionId: command.characterOptionId };
      next.personalizationStatus = refreshPersonalizationStatus(next, false);
      if (
        next.state === "PERSONALIZATION_STARTED" &&
        isMinimumPersonalizationComplete(next)
      ) {
        next.state = "PERSONALIZATION_MINIMUM_COMPLETE";
      }
      resultingStatus = next.personalizationStatus;
      break;
    }
    case "SAVE_PERSONALIZATION_REVIEW": {
      requirePersonalizationCatalogue(command);
      catalogueVersion = PERSONALIZATION_VERSION;
      if (!isMinimumPersonalizationComplete(next)) {
        throw new Error(
          "INVALID_TRANSITION: minimum personalization not complete",
        );
      }
      fieldCategory = "personalization_review";
      priorStatus = current.personalizationStatus;
      next = {
        ...next,
        state: "PERSONALIZATION_MINIMUM_COMPLETE",
        personalizationStatus: "REVIEWED",
      };
      resultingStatus = next.personalizationStatus;
      break;
    }
    case "SAVE_ORIGIN_DRAFT": {
      requireOriginCatalogue(command);
      catalogueVersion = ORIGIN_VERSION;
      if (!isMinimumPersonalizationComplete(next)) {
        throw new Error(
          "INVALID_TRANSITION: origin requires minimum personalization",
        );
      }
      validateOriginSelections(command);
      fieldCategory = "origin_draft";
      priorStatus = current.originStatus;
      next = {
        ...next,
        state: "ORIGIN_DRAFT",
        originStatus: "DRAFT",
        originRegionOption:
          command.originRegionOption !== undefined
            ? command.originRegionOption
            : next.originRegionOption,
        originExperienceOption:
          command.originExperienceOption !== undefined
            ? command.originExperienceOption
            : next.originExperienceOption,
        originGoalsOptions:
          command.originGoalsOptions !== undefined
            ? [...command.originGoalsOptions]
            : [...next.originGoalsOptions],
      };
      resultingStatus = next.originStatus;
      break;
    }
    case "MARK_ORIGIN_REVIEW_LATER": {
      requireOriginCatalogue(command);
      catalogueVersion = ORIGIN_VERSION;
      if (!isMinimumPersonalizationComplete(next)) {
        throw new Error(
          "INVALID_TRANSITION: origin requires minimum personalization",
        );
      }
      fieldCategory = "origin_review_later";
      priorStatus = current.originStatus;
      next = {
        ...next,
        state: "ORIGIN_REVIEW_LATER",
        originStatus: "REVIEW_LATER",
      };
      resultingStatus = next.originStatus;
      break;
    }
    case "COMPLETE_ORIGIN": {
      requireOriginCatalogue(command);
      catalogueVersion = ORIGIN_VERSION;
      if (!isMinimumPersonalizationComplete(next)) {
        throw new Error(
          "INVALID_TRANSITION: origin requires minimum personalization",
        );
      }
      validateOriginSelections(command);
      fieldCategory = "origin_complete";
      priorStatus = current.originStatus;
      next = {
        ...next,
        state: "ORIGIN_COMPLETE",
        originStatus: "COMPLETE",
        originRegionOption:
          command.originRegionOption !== undefined
            ? command.originRegionOption
            : next.originRegionOption,
        originExperienceOption:
          command.originExperienceOption !== undefined
            ? command.originExperienceOption
            : next.originExperienceOption,
        originGoalsOptions:
          command.originGoalsOptions !== undefined
            ? [...command.originGoalsOptions]
            : [...next.originGoalsOptions],
      };
      resultingStatus = next.originStatus;
      break;
    }
    case "ACK_NEST_INTRO_HANDOFF": {
      if (!nestIntroHandoffAllowed(next)) {
        throw new Error(
          "INVALID_TRANSITION: nest handoff requires REVIEW_LATER or COMPLETE",
        );
      }
      fieldCategory = "nest_intro_handoff";
      priorStatus = current.state;
      next = { ...next, state: "NEST_INTRO_HANDOFF" };
      resultingStatus = next.state;
      break;
    }
    default: {
      const _exhaustive: never = command.type;
      void _exhaustive;
      throw new Error("INVALID_TRANSITION");
    }
  }

  // Domain never emits progression side effects
  void personalizationProgressionImpact();
  void originDoesNotAffectTrust();

  next = { ...next, version: current.version + 1 };

  return {
    aggregate: next,
    events: [`Onboarding.${command.type}`],
    auditIntent: {
      action: command.type,
      actorRef: command.actorRef,
      reason: command.reason,
      authority: command.authority,
      fieldCategory,
      priorStatus,
      resultingStatus,
      catalogueVersion,
    },
  };
}
