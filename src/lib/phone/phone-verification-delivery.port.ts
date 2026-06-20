export type PhoneDeliveryPayload = {
  toE164: string;
  message: string;
};

export type PhoneDeliveryResult = {
  channel: string;
  status: "sent" | "queued" | "failed";
  providerMessageId?: string;
  error?: string;
};

/** Provider-neutral SMS / phone OTP delivery port (C3.8). */
export interface PhoneVerificationDeliveryPort {
  send(payload: PhoneDeliveryPayload): Promise<PhoneDeliveryResult>;
}
