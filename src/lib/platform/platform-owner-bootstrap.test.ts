import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const bootstrapSource = readFileSync(
  join(process.cwd(), "src/lib/platform/platform-owner-bootstrap.resolution.ts"),
  "utf8"
);

assert(bootstrapSource.includes("phone_not_verified"), "bootstrap requires verified phone");
assert(bootstrapSource.includes("email_not_verified"), "bootstrap requires verified email");
assert(bootstrapSource.includes("legal_incomplete"), "bootstrap requires legal evidence");
assert(bootstrapSource.includes("password_supplied_forbidden"), "refuses password in env");
assert(
  bootstrapSource.includes("CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION"),
  "bootstrap requires generation 2"
);
assert(
  bootstrapSource.includes("existing_platform_owner"),
  "refuses conflicting platform owner"
);

const registerSource = readFileSync(join(process.cwd(), "src/lib/actions/auth.ts"), "utf8");
assert(
  !/first.*registered.*admin/i.test(registerSource),
  "registration must not implement first-user admin takeover"
);

const planScript = readFileSync(
  join(process.cwd(), "scripts/platform-owner-bootstrap-plan.ts"),
  "utf8"
);
assert(planScript.includes("dryRun: true"), "bootstrap plan script defaults to dry-run");
assert(planScript.includes("PLATFORM_OWNER_DESIGNATED_EMAIL"));

const executeScript = readFileSync(
  join(process.cwd(), "scripts/platform-owner-bootstrap-execute.ts"),
  "utf8"
);
assert(executeScript.includes("validatePlatformOwnerExecuteGates"));
assert(executeScript.includes("executeAuthorized: false"));

console.log("platform-owner-bootstrap: passed");
