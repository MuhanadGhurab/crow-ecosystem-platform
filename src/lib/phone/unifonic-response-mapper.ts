import {
  PHONE_DELIVERY_FAILURE_CATEGORIES,
  type PhoneDeliveryFailureCategory,
} from "@/lib/phone/phone-delivery-failure";

export type UnifonicFailureMapping = {
  category: PhoneDeliveryFailureCategory;
  retryable: boolean;
};

export function mapUnifonicHttpStatus(status: number): UnifonicFailureMapping {
  if (status === 429) {
    return {
      category: PHONE_DELIVERY_FAILURE_CATEGORIES.RATE_LIMITED,
      retryable: true,
    };
  }
  if (status === 401 || status === 403) {
    return {
      category: PHONE_DELIVERY_FAILURE_CATEGORIES.CONFIGURATION_MISSING,
      retryable: false,
    };
  }
  if (status === 410 || status === 412 || status === 422 || status === 482) {
    return {
      category: PHONE_DELIVERY_FAILURE_CATEGORIES.INVALID_DESTINATION,
      retryable: false,
    };
  }
  if (status === 480) {
    return {
      category: PHONE_DELIVERY_FAILURE_CATEGORIES.SENDER_NOT_APPROVED,
      retryable: false,
    };
  }
  if (status >= 500) {
    return {
      category: PHONE_DELIVERY_FAILURE_CATEGORIES.PROVIDER_UNAVAILABLE,
      retryable: true,
    };
  }
  return {
    category: PHONE_DELIVERY_FAILURE_CATEGORIES.DELIVERY_REJECTED,
    retryable: false,
  };
}

/** Strip digits from E.164 for Unifonic Recipient parameter (no + or 00). */
export function unifonicRecipientFromE164(e164: string): string {
  return e164.replace(/\D/g, "");
}
