import { readFileSync } from "fs";
import { join } from "path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function checkboxChecked(formData: FormData, name: string): boolean {
  const v = formData.get(name);
  return v === "true" || v === "on";
}

const fd = new FormData();
fd.set("termsAccepted", "true");
fd.set("privacyAcknowledged", "true");
fd.set("aupAccepted", "true");

assert(checkboxChecked(fd, "termsAccepted"), "terms checkbox true");
assert(checkboxChecked(fd, "privacyAcknowledged"), "privacy checkbox true");
assert(checkboxChecked(fd, "aupAccepted"), "aup checkbox true");
assert(!checkboxChecked(fd, "marketingOptIn"), "marketing defaults unchecked");

const accountLegal = readFileSync(
  join(process.cwd(), "src/lib/actions/account-legal.ts"),
  "utf8"
);
assert(
  accountLegal.includes('void formData.get("scrolledToBottom")'),
  "server ignores scrolledToBottom"
);
assert(
  accountLegal.includes("parseMandatoryLegalAcknowledgements"),
  "server parses acknowledgements"
);
assert(
  accountLegal.includes("submitRegistrationLegalFormAction"),
  "plain registration form action"
);
assert(
  accountLegal.includes("resolveRegistrationLegalSubmissionUrl"),
  "shared legal submit resolver"
);
const gate = readFileSync(
  join(process.cwd(), "src/components/account/legal-review-gate.tsx"),
  "utf8"
);
assert(gate.includes('action="/register/legal/submit"'), "legal form posts to submit route");
assert(
  accountLegal.includes("assertC2DatabaseEnvironmentSafe"),
  "legal registration uses C2 guard"
);
assert(
  accountLegal.includes("isC3SessionOnlyPath") === false,
  "account-legal does not own session path"
);

const routeProtection = readFileSync(
  join(process.cwd(), "src/lib/auth/route-protection.ts"),
  "utf8"
);
assert(
  routeProtection.includes("isC3SessionOnlyPath") &&
    routeProtection.includes("isAccountSelfServicePath"),
  "session-only paths exclude legal/verify-email"
);

console.log("registration-legal-gate.test.ts: OK");
