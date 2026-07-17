/**
 * Hosted SMS delivery failure categories — map to generic user responses only.
 */
export const PHONE_DELIVERY_FAILURE_CATEGORIES = {
  PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",
  INVALID_DESTINATION: "INVALID_DESTINATION",
  DESTINATION_BLOCKED: "DESTINATION_BLOCKED",
  RATE_LIMITED: "RATE_LIMITED",
  SENDER_NOT_APPROVED: "SENDER_NOT_APPROVED",
  DELIVERY_REJECTED: "DELIVERY_REJECTED",
  CONFIGURATION_MISSING: "CONFIGURATION_MISSING",
  UNKNOWN_PROVIDER_FAILURE: "UNKNOWN_PROVIDER_FAILURE",
} as const;

export type PhoneDeliveryFailureCategory =
  (typeof PHONE_DELIVERY_FAILURE_CATEGORIES)[keyof typeof PHONE_DELIVERY_FAILURE_CATEGORIES];

/** Generic user-facing copy — never reveals account ownership or full phone. */
export function userMessageForPhoneDeliveryFailure(
  category: PhoneDeliveryFailureCategory
): string {
  switch (category) {
    case "INVALID_DESTINATION":
      return "Enter a valid mobile number for the selected country.";
    case "RATE_LIMITED":
      return "Too many verification attempts. Try again later.";
    case "SENDER_NOT_APPROVED":
    case "CONFIGURATION_MISSING":
    case "PROVIDER_UNAVAILABLE":
      return "Phone verification is temporarily unavailable. Try again later or contact support.";
    case "DESTINATION_BLOCKED":
    case "DELIVERY_REJECTED":
    case "UNKNOWN_PROVIDER_FAILURE":
    default:
      return "We could not send a verification code right now. Try again shortly.";
  }
}

export function isRetryablePhoneDeliveryFailure(
  category: PhoneDeliveryFailureCategory
): boolean {
  return (
    category === "PROVIDER_UNAVAILABLE" ||
    category === "RATE_LIMITED" ||
    category === "UNKNOWN_PROVIDER_FAILURE"
  );
}
