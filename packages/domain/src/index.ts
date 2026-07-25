import type {
  ActivationCommand,
  ActivationState,
  ExplainableLock,
  ActivationGates,
} from "@ghuravia/contracts/schemas";

export type Activation = {
  id: string;
  state: ActivationState;
  version: number;
  emailVerified: boolean;
  termsAccepted: boolean;
  accountRiskAcceptable: boolean;
  termsVersion?: string;
  riskDisclosureVersion?: string;
  contactRef?: string;
};

export type DomainResult = {
  aggregate: Activation;
  events: readonly string[];
  auditIntent: {
    action: string;
    actorRef: string;
    reason?: string;
    authority?: string;
  };
};

const transitions: Record<
  ActivationState,
  readonly ActivationCommand["type"][]
> = {
  ACCOUNT_CLAIMED: ["REQUEST_EMAIL_VERIFICATION"],
  EMAIL_VERIFICATION_PENDING: [
    "CONFIRM_EMAIL_VERIFICATION",
    "REQUEST_REPLACEMENT_VERIFICATION",
    "BEGIN_ACTIVATION_RECOVERY",
  ],
  EMAIL_VERIFIED: ["ACCEPT_TERMS", "BEGIN_ACTIVATION_RECOVERY"],
  TERMS_ACCEPTED: ["ACCEPT_ACCOUNT_RISK", "BEGIN_ACTIVATION_RECOVERY"],
  ACCOUNT_RISK_ACCEPTED: ["ACTIVATE", "BEGIN_ACTIVATION_RECOVERY"],
  ACTIVATION_RECOVERY_REQUIRED: [
    "REQUEST_EMAIL_VERIFICATION",
    "REQUEST_REPLACEMENT_VERIFICATION",
    "PRIVILEGED_CORRECTION",
  ],
  RISK_REVIEW_REQUIRED: ["PRIVILEGED_CORRECTION"],
  ACTIVATED: ["SUSPEND", "CLOSE"],
  SUSPENDED: ["PRIVILEGED_CORRECTION", "CLOSE"],
  CLOSED: [],
};

export function gatesOf(a: Activation): ActivationGates {
  return {
    emailVerified: a.emailVerified,
    termsAccepted: a.termsAccepted,
    accountRiskAcceptable: a.accountRiskAcceptable,
  };
}

export function isActivationComplete(a: Activation): boolean {
  return a.emailVerified && a.termsAccepted && a.accountRiskAcceptable;
}

export function canAcceptTerms(a: Activation): boolean {
  return a.emailVerified && !a.termsAccepted;
}

export function canAcceptRisk(a: Activation): boolean {
  return a.emailVerified && a.termsAccepted && !a.accountRiskAcceptable;
}

export function explainableLocksFor(a: Activation): ExplainableLock[] {
  const locks: ExplainableLock[] = [];
  if (a.state === "SUSPENDED") {
    locks.push({
      code: "ACCOUNT_SUSPENDED",
      messageAr: "الحساب معلّق ولا يمكن إكمال التفعيل.",
      messageEn: "Account is suspended; activation cannot complete.",
      missingPrerequisite: "account_active",
      nextAction: "contact_support",
      recoveryAvailable: false,
      operatorReviewRequired: true,
    });
  }
  if (a.state === "CLOSED") {
    locks.push({
      code: "ACCOUNT_CLOSED",
      messageAr: "الحساب مغلق.",
      messageEn: "Account is closed.",
      missingPrerequisite: "account_open",
      nextAction: "none",
      recoveryAvailable: false,
      operatorReviewRequired: true,
    });
  }
  if (a.state === "RISK_REVIEW_REQUIRED") {
    locks.push({
      code: "RISK_REVIEW_REQUIRED",
      messageAr: "مطلوب مراجعة مخاطر قبل المتابعة.",
      messageEn: "Risk review is required before continuing.",
      missingPrerequisite: "risk_review",
      nextAction: "wait_for_review",
      recoveryAvailable: false,
      operatorReviewRequired: true,
    });
  }
  if (!a.emailVerified) {
    locks.push({
      code: "EMAIL_NOT_VERIFIED",
      messageAr: "يجب التحقق من البريد الإلكتروني أولاً.",
      messageEn: "Email must be verified first.",
      missingPrerequisite: "email_verified",
      nextAction: "ACT-003",
      recoveryAvailable: true,
      operatorReviewRequired: false,
    });
  } else if (!a.termsAccepted) {
    locks.push({
      code: "TERMS_NOT_ACCEPTED",
      messageAr: "يجب قبول الشروط الحالية.",
      messageEn: "Current terms must be accepted.",
      missingPrerequisite: "current_terms_accepted",
      nextAction: "ACT-005",
      recoveryAvailable: true,
      operatorReviewRequired: false,
    });
  } else if (!a.accountRiskAcceptable) {
    locks.push({
      code: "ACCOUNT_RISK_NOT_ACCEPTED",
      messageAr: "يجب قبول إقرار مخاطر الحساب.",
      messageEn: "Account risk disclosure must be accepted.",
      missingPrerequisite: "account_risk_status=acceptable",
      nextAction: "ACT-013",
      recoveryAvailable: true,
      operatorReviewRequired: false,
    });
  }
  if (a.state === "ACTIVATION_RECOVERY_REQUIRED") {
    locks.push({
      code: "RECOVERY_REQUIRED",
      messageAr: "يلزم مسار استعادة التفعيل.",
      messageEn: "Activation recovery is required.",
      missingPrerequisite: "activation_progress",
      nextAction: "ACT-012",
      recoveryAvailable: true,
      operatorReviewRequired: false,
    });
  }
  return locks;
}

export function allowedNextActions(a: Activation): string[] {
  return [...transitions[a.state]];
}

export function applyActivationCommand(
  current: Activation,
  command: ActivationCommand,
  expectedVersion: number,
): DomainResult {
  if (expectedVersion !== current.version) {
    throw new Error("CONFLICT: optimistic version mismatch");
  }
  if (
    command.type === "PRIVILEGED_CORRECTION" &&
    (!command.authority || !command.reason || !command.actorRef)
  ) {
    throw new Error(
      "FORBIDDEN: correction requires actor, authority, and reason",
    );
  }
  if (command.type === "ACCEPT_TERMS" && !canAcceptTerms(current)) {
    throw new Error("INVALID_TRANSITION: terms require email_verified");
  }
  if (command.type === "ACCEPT_ACCOUNT_RISK" && !canAcceptRisk(current)) {
    throw new Error(
      "INVALID_TRANSITION: risk requires email_verified and terms",
    );
  }
  if (command.type === "ACTIVATE" && !isActivationComplete(current)) {
    throw new Error("INVALID_TRANSITION: activation requires full formula");
  }
  if (command.type === "BEGIN_ACTIVATION_RECOVERY") {
    if (current.state === "ACTIVATED" || current.state === "CLOSED") {
      throw new Error("INVALID_TRANSITION: recovery not available");
    }
  }
  if (!transitions[current.state].includes(command.type)) {
    throw new Error("INVALID_TRANSITION");
  }

  let nextState: ActivationState = current.state;
  let emailVerified = current.emailVerified;
  let termsAccepted = current.termsAccepted;
  let accountRiskAcceptable = current.accountRiskAcceptable;
  let termsVersion = current.termsVersion;
  let riskDisclosureVersion = current.riskDisclosureVersion;

  switch (command.type) {
    case "CLAIM_SYNTHETIC_ACCOUNT":
      nextState = "ACCOUNT_CLAIMED";
      break;
    case "REQUEST_EMAIL_VERIFICATION":
    case "REQUEST_REPLACEMENT_VERIFICATION":
      nextState = "EMAIL_VERIFICATION_PENDING";
      break;
    case "CONFIRM_EMAIL_VERIFICATION":
      nextState = "EMAIL_VERIFIED";
      emailVerified = true;
      break;
    case "ACCEPT_TERMS":
      nextState = "TERMS_ACCEPTED";
      termsAccepted = true;
      termsVersion = command.termsVersion ?? "local-test-terms-v0";
      break;
    case "ACCEPT_ACCOUNT_RISK":
      nextState = "ACCOUNT_RISK_ACCEPTED";
      accountRiskAcceptable = true;
      riskDisclosureVersion =
        command.riskDisclosureVersion ?? "local-test-risk-v0";
      break;
    case "ACTIVATE":
      nextState = "ACTIVATED";
      break;
    case "BEGIN_ACTIVATION_RECOVERY":
      nextState = "ACTIVATION_RECOVERY_REQUIRED";
      break;
    case "SUSPEND":
      nextState = "SUSPENDED";
      break;
    case "CLOSE":
      nextState = "CLOSED";
      break;
    case "PRIVILEGED_CORRECTION":
      nextState = "ACTIVATION_RECOVERY_REQUIRED";
      break;
    default: {
      const _exhaustive: never = command.type;
      void _exhaustive;
      throw new Error("INVALID_TRANSITION");
    }
  }

  const next: Activation = {
    ...current,
    state: nextState,
    version: current.version + 1,
    emailVerified,
    termsAccepted,
    accountRiskAcceptable,
    termsVersion,
    riskDisclosureVersion,
  };

  return {
    aggregate: next,
    events: [`Activation.${command.type}`],
    auditIntent: {
      action: command.type,
      actorRef: command.actorRef,
      reason: command.reason,
      authority: command.authority,
    },
  };
}

export function commercialEventCannotProgress(event: {
  kind: "payment" | "subscription" | "purchase";
}): { xp: 0; mastery: 0; trust: 0; prestige: 0 } {
  void event;
  return { xp: 0, mastery: 0, trust: 0, prestige: 0 };
}

export function evidenceOutcome(
  scannerAvailable: boolean,
  passed: boolean,
): "quarantine" | "accepted" {
  return scannerAvailable && passed ? "accepted" : "quarantine";
}

export const publicProfile = (input: { displayName: string }) => ({
  displayName: input.displayName,
});

/** Mobile is not part of the controlled-launch activation formula. */
export const MOBILE_VERIFICATION_IN_ACTIVATION_FORMULA = false as const;

export {
  PERSONALIZATION_VERSION,
  ORIGIN_VERSION,
  NEST_READINESS_VERSION,
  UNLOCKED_CROW,
  UNLOCKED_COLOR,
  UNLOCKED_STYLE,
  UNLOCKED_HABITAT,
  UNLOCKED_CHARACTER,
  UNLOCKED_ACCESSORY,
  LOCKED_HABITAT,
  LOCKED_CHARACTER,
  LOCKED_ACCESSORY,
  QUICK_START_DEFAULTS,
  ORIGIN_REGION_OPTIONS,
  ORIGIN_EXPERIENCE_OPTIONS,
  ORIGIN_GOAL_OPTIONS,
  createInitialOnboarding,
  hasCrowBasics,
  isMinimumPersonalizationComplete,
  nestIntroHandoffAllowed,
  canAccessOnboardingScreen,
  accessibleScreens,
  allowedNextOnboardingActions,
  explainableLocksForCosmetics,
  personalizationProgressionImpact,
  originDoesNotAffectTrust,
  applyOnboardingCommand,
  type Onboarding,
  type OnboardingDomainResult,
  type OnboardingScreenId,
} from "./onboarding";

export {
  NEST_READINESS_CATALOGUE,
  NEST_READINESS_ITEMS,
  getNestReadinessItem,
  getNestReadinessOption,
  requireNestReadinessCatalogue,
  computeReadinessBand,
  scorePercentage,
  scoreAttempt,
  scoreNestAttempt,
  buildAnswerRecord,
  nestReadinessProgressionImpact,
  nestReadinessIdentityImpact,
  nestReadinessCapabilityCoverage,
  nestReadinessTotalItems,
  type NestAnswerRecord,
  type NestScoreResult,
  type NestCapabilityId,
  type NestReadinessItem,
  type NestReadinessOption,
} from "./nest-readiness";

export * from "./living-mission";
export {
  BLACK_SIGNAL_V010,
  BLACK_SIGNAL_MISSION_ID,
  BLACK_SIGNAL_VERSION,
} from "./missions/black-signal/black-signal-v0.1.0";
