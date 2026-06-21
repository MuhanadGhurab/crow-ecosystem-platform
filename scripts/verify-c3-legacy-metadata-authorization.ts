/**
 * C3 / FTGP — Supabase metadata crow_role must not independently authorize portal access.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const authoritative = readFileSync(
  join(process.cwd(), "src/lib/auth/authoritative-crow-auth.ts"),
  "utf8"
);
const landing = readFileSync(
  join(process.cwd(), "src/lib/auth/c3-post-auth-landing.ts"),
  "utf8"
);
const session = readFileSync(join(process.cwd(), "src/lib/auth/session.ts"), "utf8");
const middleware = readFileSync(
  join(process.cwd(), "src/lib/supabase/middleware.ts"),
  "utf8"
);
const customerAccess = readFileSync(
  join(process.cwd(), "src/lib/auth/customer-access.service.ts"),
  "utf8"
);
const platformRoles = readFileSync(
  join(process.cwd(), "src/lib/auth/platform-internal-role.service.ts"),
  "utf8"
);

assert(
  authoritative.includes("listActiveInternalRolesForSupabaseUser"),
  "platform authority requires DB internal role assignments"
);
assert(
  authoritative.includes("resolveAuthoritativePlatformRole"),
  "uncorroborated platform metadata must be stripped"
);
assert(
  authoritative.includes("resolveAuthoritativeClientRole"),
  "client authority uses DB customer evidence"
);
assert(
  !authoritative.includes("countRequestsForEmail"),
  "client authority must not use email-only contact matching"
);
assert(
  landing.includes("resolveAuthoritativeCrowAuth"),
  "C3 landing uses authoritative auth"
);
assert(
  landing.includes("routes.account.home"),
  "non-authoritative roles land on account home"
);
assert(
  session.includes("resolveGuardAuth") && session.includes("resolveAuthoritativeCrowAuth"),
  "session guards use authoritative auth"
);
assert(
  session.includes("redirect(routes.account.home)"),
  "client portal denied without authoritative customer access"
);
assert(
  middleware.includes("middleware validates session presence only"),
  "middleware must not authorize from JWT crow_role"
);
assert(
  !middleware.includes("getCrowAuth(user)"),
  "middleware must not read raw crow_role for authorization"
);
assert(
  customerAccess.includes("submittedByUserId") &&
    customerAccess.includes("clientOrganizationMember"),
  "customer access uses ownership and org membership"
);
assert(
  platformRoles.includes("grantInternalPlatformRole") &&
    platformRoles.includes("revokeInternalPlatformRole"),
  "internal role grant/revoke service exists"
);
assert(
  platformRoles.includes("platform_internal_role_granted"),
  "grant audit event recorded"
);

console.log(
  "PASS — METADATA crow_role CANNOT AUTHORIZE WITHOUT AUTHORITATIVE CROW DATABASE STATE\n"
);
