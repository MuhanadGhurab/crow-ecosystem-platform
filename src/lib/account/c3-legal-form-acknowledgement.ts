import type { LegalDocumentType } from "@prisma/client";
import { LegalAcceptanceValidationError } from "@/lib/legal/legal-errors";

const TRUTHY_ACK_VALUES = new Set(["on", "true", "1"]);

/** Parse explicit legal acknowledgement from native form controls. */
export function isLegalAcknowledgementChecked(formData: FormData, fieldName: string): boolean {
  const raw = formData.get(fieldName);
  if (raw === null) return false;
  return TRUTHY_ACK_VALUES.has(String(raw).toLowerCase());
}

export function parseMandatoryLegalAcknowledgements(formData: FormData): {
  termsAccepted: boolean;
  privacyAcknowledged: boolean;
  aupAccepted: boolean;
  marketingOptIn: boolean;
} {
  return {
    termsAccepted: isLegalAcknowledgementChecked(formData, "termsAccepted"),
    privacyAcknowledged: isLegalAcknowledgementChecked(formData, "privacyAcknowledged"),
    aupAccepted: isLegalAcknowledgementChecked(formData, "aupAccepted"),
    marketingOptIn: isLegalAcknowledgementChecked(formData, "marketingOptIn"),
  };
}

export function validateMandatoryAcknowledgements(input: {
  mandatoryTypes: LegalDocumentType[];
  termsAccepted: boolean;
  privacyAcknowledged: boolean;
  aupAccepted: boolean;
}): void {
  if (input.mandatoryTypes.includes("TERMS_OF_SERVICE") && !input.termsAccepted) {
    throw new LegalAcceptanceValidationError("You must accept the Terms of Service.");
  }
  if (input.mandatoryTypes.includes("PRIVACY_NOTICE") && !input.privacyAcknowledged) {
    throw new LegalAcceptanceValidationError("You must acknowledge the Privacy Notice.");
  }
  if (input.mandatoryTypes.includes("ACCEPTABLE_USE_POLICY") && !input.aupAccepted) {
    throw new LegalAcceptanceValidationError("You must accept the Acceptable Use Policy.");
  }
}
