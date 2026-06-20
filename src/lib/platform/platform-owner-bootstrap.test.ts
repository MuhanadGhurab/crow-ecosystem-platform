import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const bootstrapSource = readFileSync(
  join(process.cwd(), "src/lib/platform/platform-owner-bootstrap.service.ts"),
  "utf8"
);

assert(bootstrapSource.includes("execute_disabled"), "execute remains disabled by default");
assert(bootstrapSource.includes("phone_not_verified"), "bootstrap requires verified phone");
assert(bootstrapSource.includes("email_not_verified"), "bootstrap requires verified email");
assert(
  bootstrapSource.includes("CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION"),
  "bootstrap requires generation 2"
);
assert(
  bootstrapSource.includes("existing_platform_owner"),
  "refuses multiple owners without explicit approval"
);
assert(bootstrapSource.includes("VERCEL"), "cannot run on Vercel build");

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

console.log("platform-owner-bootstrap: passed");
