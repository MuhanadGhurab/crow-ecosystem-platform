import { readFileSync } from "fs";
import { join } from "path";
import {
  formatSupportReference,
  userMessageForRegistrationError,
} from "./c3-registration-errors";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const ref = formatSupportReference("550e8400-e29b-41d4-a716-446655440000");
assert(/^CRW-[A-F0-9]{6}$/.test(ref), "support ref format");
assert(!ref.includes("@"), "ref has no email");
assert(!ref.includes("550e8400"), "ref hides correlation uuid");

const msg = userMessageForRegistrationError("registration_failed", ref);
assert(msg.includes("Support reference:"), "user message includes ref");
assert(!msg.includes("password"), "no password in message");

const diagnostics = readFileSync(
  join(process.cwd(), "src/lib/account/c3-registration-diagnostics.ts"),
  "utf8"
);
assert(diagnostics.includes("VERCEL_ENV === \"preview\""), "preview gated");
assert(diagnostics.includes("C3_REGISTRATION_DIAGNOSTICS"), "env flag");
assert(!diagnostics.includes("password"), "no password in diagnostics module");

const accountLegal = readFileSync(
  join(process.cwd(), "src/lib/actions/account-legal.ts"),
  "utf8"
);
assert(accountLegal.includes("resolveMandatoryAcceptancesForLocale"), "server resolves versions");
assert(!accountLegal.includes("mandatoryVersions"), "no client version trust");
assert(accountLegal.includes("submitRegistrationLegalFormAction"), "plain form action");
assert(accountLegal.includes("params.set(\"ref\""), "failure redirect includes ref");

const gate = readFileSync(
  join(process.cwd(), "src/components/account/legal-review-gate.tsx"),
  "utf8"
);
assert(gate.includes('name="termsAccepted"'), "named terms field");
assert(gate.includes('value="true"'), "explicit true value");
assert(!gate.includes("useActionState"), "no useActionState on legal form");
assert(gate.includes('action="/register/legal/submit"'), "HTTP submit route for legal form");
assert(gate.includes('method="POST"'), "legal form uses POST");
assert(accountLegal.includes("resolveRegistrationLegalSubmissionUrl"), "shared legal submit resolver");

console.log("c3-registration-errors.test.ts: OK");
