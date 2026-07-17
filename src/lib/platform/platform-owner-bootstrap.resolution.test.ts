import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { detectForbiddenPlatformOwnerCredentials } from "@/lib/platform/platform-owner-bootstrap.guards";

const prev = { ...process.env };
process.env.PLATFORM_OWNER_PASSWORD = "must-not-be-used";
assert.equal(detectForbiddenPlatformOwnerCredentials(), "password_supplied_forbidden");
process.env = { ...prev };

const resolutionSource = readFileSync(
  join(process.cwd(), "src/lib/platform/platform-owner-bootstrap.resolution.ts"),
  "utf8"
);
assert(resolutionSource.includes("hasMandatoryLegalAcceptanceComplete"));
assert(resolutionSource.includes("isPhoneVerificationRequiredForAccount"));
assert(resolutionSource.includes("tenant_membership_collision"));
assert(resolutionSource.includes("provider_identity_collision"));
assert(resolutionSource.includes("ambiguous_auth_identity"));
assert(!resolutionSource.includes("mkkaweg4mer"), "no designated owner email in source");

const constantsSource = readFileSync(
  join(process.cwd(), "src/lib/platform/platform-owner-bootstrap.constants.ts"),
  "utf8"
);
assert(!constantsSource.includes("@"), "no email addresses in constants");

const planScript = readFileSync(
  join(process.cwd(), "scripts/platform-owner-bootstrap-plan.ts"),
  "utf8"
);
assert(planScript.includes("PLATFORM_OWNER_DESIGNATED_EMAIL"));
assert(planScript.includes("do not commit"));

console.log("platform-owner-bootstrap.resolution: passed");
