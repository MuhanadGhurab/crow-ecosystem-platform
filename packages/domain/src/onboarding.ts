import type {
  CosmeticsExplainableLock,
  NestReadinessAttemptStatus,
  NestReadinessBand,
  OnboardingCommand,
  OnboardingPath,
  OnboardingState,
  OriginStatus,
  PersonalizationStatus,
} from "@ghuravia/contracts/schemas";
import {
  ORIGIN_CATALOGUE_VERSION,
  PERSONALIZATION_CATALOGUE_VERSION,
  NEST_READINESS_CATALOGUE_VERSION,
} from "@ghuravia/contracts/schemas";
import {
  NEST_READINESS_CATALOGUE,
  getNestReadinessItem,
  getNestReadinessOption,
  nestReadinessIdentityImpact,
  nestReadinessProgressionImpact,
  requireNestReadinessCatalogue,
  scoreAttempt,
  type NestAnswerRecord,
} from "./nest-readiness";

export const PERSONALIZATION_VERSION = PERSONALIZATION_CATALOGUE_VERSION;
export const ORIGIN_VERSION = ORIGIN_CATALOGUE_VERSION;
export const NEST_READINESS_VERSION = NEST_READINESS_CATALOGUE_VERSION;

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
  | "ONB-001"
  | "IDN-001"
  | "IDN-002"
  | "IDN-003"
  | "ONB-002"
  | "ONB-003"
  | "ONB-004"
  | "ONB-005"
  | "ONB-006"
  | "ONB-007";

export type Onboarding = {
  id: string;
  state: OnboardingState;
  version: number;
  personalizationCatalogueVersion: string;
  originCatalogueVersion: string;
  nestReadinessCatalogueVersion: string;
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
  nestAttemptId: string | null;
  nestAttemptStatus: NestReadinessAttemptStatus;
  nestAnswers: readonly NestAnswerRecord[];
  nestScore: number | null;
  nestBand: NestReadinessBand | null;
  nestWeakCapabilityIds: readonly string[];
  nestResultAcknowledged: boolean;
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

const COSMETIC_AND_ORIGIN_EDITS = [
  "SAVE_CROW_BASICS",
  "SELECT_HABITAT",
  "SELECT_CHARACTER",
  "SAVE_PERSONALIZATION_REVIEW",
  "SAVE_ORIGIN_DRAFT",
  "COMPLETE_ORIGIN",
] as const;

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
    ...COSMETIC_AND_ORIGIN_EDITS,
    "ACK_NEST_INTRO_HANDOFF",
    "START_NEST_ASSESSMENT",
    "CHOOSE_NEST_LEARNING_PATH",
  ],
  ORIGIN_COMPLETE: [
    "SAVE_CROW_BASICS",
    "SELECT_HABITAT",
    "SELECT_CHARACTER",
    "SAVE_PERSONALIZATION_REVIEW",
    "SAVE_ORIGIN_DRAFT",
    "ACK_NEST_INTRO_HANDOFF",
    "START_NEST_ASSESSMENT",
    "CHOOSE_NEST_LEARNING_PATH",
  ],
  NEST_INTRO_HANDOFF: [
    ...COSMETIC_AND_ORIGIN_EDITS,
    "START_NEST_ASSESSMENT",
    "CHOOSE_NEST_LEARNING_PATH",
  ],
  NEST_ASSESSMENT_IN_PROGRESS: [
    ...COSMETIC_AND_ORIGIN_EDITS,
    "SAVE_NEST_ANSWER",
    "SUBMIT_NEST_ASSESSMENT",
  ],
  NEST_RESULT_READY: [
    ...COSMETIC_AND_ORIGIN_EDITS,
    "ACK_NEST_RESULT",
    "CHOOSE_NEST_LEARNING_PATH",
    "CONTINUE_TO_HORIZON_HANDOFF",
  ],
  NEST_LEARNING_HANDOFF: [...COSMETIC_AND_ORIGIN_EDITS],
  HORIZON_CHOICE_HANDOFF: [
    ...COSMETIC_AND_ORIGIN_EDITS,
    "CHOOSE_NEST_LEARNING_PATH",
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
    nestReadinessCatalogueVersion: NEST_READINESS_VERSION,
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
    nestAttemptId: null,
    nestAttemptStatus: "NONE",
    nestAnswers: [],
    nestScore: null,
    nestBand: null,
    nestWeakCapabilityIds: [],
    nestResultAcknowledged: false,
  };
}

function isNestStatePastIntro(o: Onboarding): boolean {
  return (
    o.state === "NEST_ASSESSMENT_IN_PROGRESS" ||
    o.state === "NEST_RESULT_READY" ||
    o.state === "NEST_LEARNING_HANDOFF" ||
    o.state === "HORIZON_CHOICE_HANDOFF"
  );
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
      return nestIntroHandoffAllowed(o) || isNestStatePastIntro(o);
    case "ONB-004":
      return o.state === "NEST_ASSESSMENT_IN_PROGRESS";
    case "ONB-005":
      return o.state === "NEST_RESULT_READY";
    case "ONB-006":
      return o.state === "NEST_LEARNING_HANDOFF";
    case "ONB-007":
      return o.state === "HORIZON_CHOICE_HANDOFF";
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
    "ONB-004",
    "ONB-005",
    "ONB-006",
    "ONB-007",
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
    nestAnswers: [...current.nestAnswers],
    nestWeakCapabilityIds: [...current.nestWeakCapabilityIds],
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
    case "START_NEST_ASSESSMENT": {
      requireNestReadinessCatalogue(command.nestReadinessCatalogueVersion);
      catalogueVersion = NEST_READINESS_VERSION;
      if (current.nestAttemptStatus === "SUBMITTED") {
        throw new Error(
          "FORBIDDEN: nest assessment already submitted (no retake)",
        );
      }
      if (!command.nestAttemptId) {
        throw new Error("VALIDATION_ERROR: nestAttemptId required");
      }
      fieldCategory = "nest_assessment_start";
      priorStatus = current.nestAttemptStatus;
      next = {
        ...next,
        nestReadinessCatalogueVersion: NEST_READINESS_VERSION,
        nestAttemptId: command.nestAttemptId,
        nestAttemptStatus: "IN_PROGRESS",
        nestAnswers: [],
        nestScore: null,
        nestBand: null,
        nestWeakCapabilityIds: [],
        nestResultAcknowledged: false,
        state: "NEST_ASSESSMENT_IN_PROGRESS",
      };
      resultingStatus = next.nestAttemptStatus;
      break;
    }
    case "SAVE_NEST_ANSWER": {
      requireNestReadinessCatalogue(command.nestReadinessCatalogueVersion);
      catalogueVersion = NEST_READINESS_VERSION;
      if (current.nestAttemptStatus === "SUBMITTED") {
        throw new Error("FORBIDDEN: nest assessment immutable after submit");
      }
      if (
        current.nestAttemptStatus !== "IN_PROGRESS" ||
        !current.nestAttemptId
      ) {
        throw new Error("INVALID_TRANSITION: nest assessment not in progress");
      }
      if (!command.nestItemId || !command.nestOptionId) {
        throw new Error(
          "VALIDATION_ERROR: nestItemId and nestOptionId required",
        );
      }
      const item = getNestReadinessItem(command.nestItemId);
      if (!item) {
        throw new Error("VALIDATION_ERROR: unknown nest item");
      }
      const option = getNestReadinessOption(
        command.nestItemId,
        command.nestOptionId,
      );
      if (!option) {
        throw new Error("VALIDATION_ERROR: unknown nest option");
      }
      // Audit metadata: item id only — never selected option id
      fieldCategory = `nest_answer:${command.nestItemId}`;
      priorStatus = current.nestAttemptStatus;
      const record: NestAnswerRecord = {
        itemId: command.nestItemId,
        optionId: command.nestOptionId,
        correct: command.nestOptionId === item.correctOptionId,
        capabilityIds: [...item.capabilityIds],
      };
      const answers = next.nestAnswers.filter(
        (a) => a.itemId !== command.nestItemId,
      );
      answers.push(record);
      next = {
        ...next,
        nestAnswers: answers,
        nestAttemptStatus: "IN_PROGRESS",
      };
      resultingStatus = next.nestAttemptStatus;
      break;
    }
    case "SUBMIT_NEST_ASSESSMENT": {
      requireNestReadinessCatalogue(command.nestReadinessCatalogueVersion);
      catalogueVersion = NEST_READINESS_VERSION;
      if (current.nestAttemptStatus === "SUBMITTED") {
        throw new Error("FORBIDDEN: nest assessment already submitted");
      }
      if (current.nestAttemptStatus !== "IN_PROGRESS") {
        throw new Error("INVALID_TRANSITION: nest assessment not in progress");
      }
      if (next.nestAnswers.length !== NEST_READINESS_CATALOGUE.length) {
        throw new Error(
          "VALIDATION_ERROR: incomplete assessment — all items required",
        );
      }
      const scored = scoreAttempt(
        next.nestAnswers.map((a) => ({
          itemId: a.itemId,
          optionId: a.optionId,
        })),
        NEST_READINESS_CATALOGUE,
      );
      fieldCategory = "nest_assessment_submit";
      priorStatus = current.nestAttemptStatus;
      next = {
        ...next,
        nestScore: scored.score,
        nestBand: scored.band,
        nestWeakCapabilityIds: [...scored.weakCapabilityIds],
        nestAttemptStatus: "SUBMITTED",
        state: "NEST_RESULT_READY",
      };
      resultingStatus = next.nestAttemptStatus;
      break;
    }
    case "ACK_NEST_RESULT": {
      if (current.state !== "NEST_RESULT_READY") {
        throw new Error("INVALID_TRANSITION: nest result not ready");
      }
      fieldCategory = "nest_result_ack";
      priorStatus = current.state;
      next = { ...next, nestResultAcknowledged: true };
      resultingStatus = next.state;
      break;
    }
    case "CHOOSE_NEST_LEARNING_PATH": {
      fieldCategory = "nest_learning_path";
      priorStatus = current.state;
      next = { ...next, state: "NEST_LEARNING_HANDOFF" };
      resultingStatus = next.state;
      break;
    }
    case "CONTINUE_TO_HORIZON_HANDOFF": {
      if (
        current.nestAttemptStatus !== "SUBMITTED" ||
        current.nestBand === null
      ) {
        throw new Error("INVALID_TRANSITION: nest result required");
      }
      if (current.nestBand === "NEST_RECOMMENDED") {
        throw new Error(
          "FORBIDDEN: Nest Recommended cannot unlock Horizon handoff",
        );
      }
      if (
        current.nestBand !== "READY_TO_FLY" &&
        current.nestBand !== "GUIDED_SKIP"
      ) {
        throw new Error(
          "FORBIDDEN: horizon handoff requires Ready or Guided Skip",
        );
      }
      fieldCategory = "horizon_choice_handoff";
      priorStatus = current.state;
      next = { ...next, state: "HORIZON_CHOICE_HANDOFF" };
      resultingStatus = next.state;
      break;
    }
    default: {
      const _exhaustive: never = command.type;
      void _exhaustive;
      throw new Error("INVALID_TRANSITION");
    }
  }

  // Domain never emits progression / identity side effects
  void personalizationProgressionImpact();
  void originDoesNotAffectTrust();
  void nestReadinessProgressionImpact();
  void nestReadinessIdentityImpact();

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
