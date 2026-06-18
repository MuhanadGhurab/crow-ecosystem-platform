import {
  isLegalAcknowledgementChecked,
  parseMandatoryLegalAcknowledgements,
  validateMandatoryAcknowledgements,
} from "./c3-legal-form-acknowledgement";
import { LegalAcceptanceValidationError } from "@/lib/legal/legal-errors";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const fd = new FormData();
fd.set("termsAccepted", "true");
fd.set("privacyAcknowledged", "true");
fd.set("aupAccepted", "true");

assert(isLegalAcknowledgementChecked(fd, "termsAccepted"), "true value accepted");
assert(isLegalAcknowledgementChecked(fd, "privacyAcknowledged"), "privacy true");
assert(isLegalAcknowledgementChecked(fd, "aupAccepted"), "aup true");
assert(!isLegalAcknowledgementChecked(fd, "marketingOptIn"), "marketing off");

const legacy = new FormData();
legacy.set("termsAccepted", "on");
assert(isLegalAcknowledgementChecked(legacy, "termsAccepted"), "legacy on accepted");

const parsed = parseMandatoryLegalAcknowledgements(fd);
assert(parsed.termsAccepted && parsed.privacyAcknowledged && parsed.aupAccepted, "parsed mandatory");

try {
  validateMandatoryAcknowledgements({
    mandatoryTypes: ["TERMS_OF_SERVICE", "PRIVACY_NOTICE", "ACCEPTABLE_USE_POLICY"],
    termsAccepted: false,
    privacyAcknowledged: true,
    aupAccepted: true,
  });
  throw new Error("expected throw");
} catch (err) {
  assert(err instanceof LegalAcceptanceValidationError, "missing terms rejected");
}

validateMandatoryAcknowledgements({
  mandatoryTypes: ["TERMS_OF_SERVICE"],
  termsAccepted: true,
  privacyAcknowledged: false,
  aupAccepted: false,
});

console.log("c3-legal-form-acknowledgement.test.ts: OK");
