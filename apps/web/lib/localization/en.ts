import type { MessageCatalog } from "./messages";

export const en: MessageCatalog = {
  productName: "GHURAVIA",
  skipToContent: "Skip to content",
  localOnlyBanner:
    "Local synthetic build only — Preview and Production disabled",
  languageSwitchToEn: "English",
  languageSwitchToAr: "العربية",
  sessionCreate: "Create local synthetic session",
  sessionExpired: "Local session expired. Start a new session to continue.",
  sessionUnauthorized: "No valid session. Create a local session first.",
  loading: "Loading…",
  submitting: "Submitting…",
  retry: "Retry",
  refreshState: "Refresh state from server",
  errorSummary: "There is an error that needs your attention",
  correlationId: "Correlation ID",
  progressTitle: "Activation progress",
  gateEmail: "Email verification",
  gateTerms: "Terms acceptance",
  gateRisk: "Account-risk acceptance",
  gateComplete: "Activation complete",
  mobileOptionalLabel:
    "Mobile verification is optional — not part of the activation formula",
  nextAction: "Next action",
  act003Title: "Email verification pending",
  act003Body:
    "Email verification is required before terms and account-risk. Delivery alone is not verification.",
  act003Request: "Request verification email",
  act003Resend: "Resend verification",
  act003DeliveryAccepted:
    "Delivery accepted locally — verification is not complete yet",
  act003NotVerifiedYet: "Email is not verified yet",
  act003OpenMailboxDev: "Open local mailbox (developer tool)",
  act011Title: "Email verification result",
  act011Confirm: "Confirm verification token",
  act011TokenLabel: "Verification token",
  act011SuccessNext: "Verified. Next required gate: terms acceptance.",
  act005Title: "Accept mandatory terms",
  act005Disclaimer:
    "Terms content is local test only — not legally approved and not a compliance claim.",
  act005Checkbox:
    "I confirm I have read and deliberately accept the displayed terms version",
  act005Accept: "Accept terms",
  act005VersionLabel: "Terms version",
  act013Title: "Accept account risk",
  act013Disclaimer:
    "Disclosure text is local test only — not legally approved and not financial or regulatory scoring.",
  act013Body:
    "Confirm acceptance of the account-risk disclosure required by the activation formula. Internal risk scores are never shown.",
  act013Checkbox:
    "I deliberately accept the displayed account-risk disclosure version",
  act013Accept: "Accept risk disclosure",
  act013VersionLabel: "Disclosure version",
  act012Title: "Activation recovery",
  act012Body:
    "Recovery resumes the next mandatory step without bypassing email, terms, or account-risk gates.",
  act012Recover: "Begin recovery",
  act012Resend: "Request replacement verification",
  act006Title: "Basic account activated",
  act006Success: "All required activation gates are complete on the server.",
  act006Continue: "Continue to optional mobile verification",
  act006MobileOptionalNote:
    "Mobile verification is optional and does not block onboarding entry.",
  act007Title: "Mobile verification (optional)",
  act007Body:
    "You may continue without mobile verification. Ordinary learning is not punished when deferred.",
  act007Skip: "Later / Skip — continue to onboarding entry",
  act007VerifyDeferred:
    "Immediate SMS verification (ACT-008) is deferred — use Skip to continue in this build.",
  onb001Title: "Crow personalization entry",
  onb001Body:
    "Activation is complete. This is a governed handoff into the onboarding path.",
  onb001LocalNotice:
    "This build remains local and synthetic. Origin and Horizon setup are deferred to a later Gate.",
  onb001CtaDeferred: "Onboarding start deferred to the next Gate",
  lockEmailTitle: "Email not verified",
  lockEmailBody: "Complete email verification before terms.",
  lockTermsTitle: "Terms not accepted",
  lockTermsBody: "Accept the current terms version to continue.",
  lockRiskTitle: "Account risk not accepted",
  lockRiskBody:
    "Accept the current account-risk disclosure to finish activation.",
  lockRecoveryTitle: "Recovery required",
  lockRecoveryBody: "Use recovery to return to the correct step.",
  lockReviewTitle: "Operator review required",
  lockReviewBody: "Operator action is required — the UI cannot bypass this.",
  lockSuspendedTitle: "Account suspended",
  lockSuspendedBody: "Activation cannot continue while suspended.",
  lockClosedTitle: "Account closed",
  lockClosedBody: "Activation cannot continue for a closed account.",
  errValidation: "Check your inputs and try again.",
  errUnauthorized: "Session is not authorized.",
  errForbidden: "This action is not allowed.",
  errNotFound: "Resource not found.",
  errConflict: "State conflict. Refresh, then resubmit deliberately.",
  errIdempotencyConflict:
    "Idempotency conflict. Do not automatically retry the operation.",
  errInvalidTransition: "That transition is invalid for the current state.",
  errChallengeExpired: "The verification challenge expired. Request a new one.",
  errActivationLocked: "Activation is locked. Review Explainable Locks.",
  errProviderUnavailable: "The mock provider is temporarily unavailable.",
  errInternal: "An internal error occurred. Retry safely.",
  errStaleVersion:
    "Server state changed. Refresh, then deliberately repeat the action if still applicable.",
  errLocalRuntime: "This path is available in local/test mode only.",
  devToolsTitle: "Local developer tools",
  devToolsWarning: "Synthetic only — not available in Production",
};
