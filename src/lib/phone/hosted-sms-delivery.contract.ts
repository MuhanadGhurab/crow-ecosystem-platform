import type { PhoneDeliveryFailureCategory } from "@/lib/phone/phone-delivery-failure";

/** Crow-owned OTP transport request — provider sends code only; Crow owns lifecycle. */
export type HostedSmsVerificationRequest = {
  destinationE164: string;
  code: string;
  locale: string;
  correlationId: string;
};

export type HostedSmsDeliveryOutcome = {
  accepted: boolean;
  providerMessageReference?: string;
  providerName: string;
  failureCategory?: PhoneDeliveryFailureCategory;
  retryable: boolean;
};

export interface HostedSmsDeliveryPort {
  sendVerificationCode(input: HostedSmsVerificationRequest): Promise<HostedSmsDeliveryOutcome>;
}
