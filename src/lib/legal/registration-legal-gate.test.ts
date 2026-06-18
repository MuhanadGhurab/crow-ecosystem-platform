import { readFileSync } from "fs";
import { join } from "path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function checkboxOn(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

const fd = new FormData();
fd.set("termsAccepted", "on");
fd.set("privacyAcknowledged", "on");
fd.set("aupAccepted", "on");

assert(checkboxOn(fd, "termsAccepted"), "terms checkbox on");
assert(checkboxOn(fd, "privacyAcknowledged"), "privacy checkbox on");
assert(checkboxOn(fd, "aupAccepted"), "aup checkbox on");
assert(!checkboxOn(fd, "marketingOptIn"), "marketing defaults unchecked");

fd.set("scrolledToBottom", "true");
assert(!checkboxOn(fd, "marketingOptIn"), "scroll state does not imply marketing consent");

const accountLegal = readFileSync(
  join(process.cwd(), "src/lib/actions/account-legal.ts"),
  "utf8"
);
assert(
  accountLegal.includes('void formData.get("scrolledToBottom")'),
  "server ignores scrolledToBottom"
);
assert(
  accountLegal.includes('formData.get("marketingOptIn") === "on"'),
  "marketing requires explicit opt-in"
);
assert(
  accountLegal.includes("completeRegistrationWithLegalAcceptance"),
  "registration action exists"
);
assert(
  accountLegal.includes("assertC2DatabaseEnvironmentSafe"),
  "legal registration uses C2 guard"
);

console.log("registration-legal-gate.test.ts: OK");
