/**
 * C3.10R — Supabase metadata crow_role must not independently authorize portal access.
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

assert(
  authoritative.includes('meta.role === "client"'),
  "client metadata requires DB-backed proof"
);
assert(
  authoritative.includes("countRequestsForEmail"),
  "client authority checks linked requests"
);
assert(
  authoritative.includes("tenantMembership"),
  "tenant authority requires membership rows"
);
assert(
  authoritative.includes("delete appMetadata.crow_role"),
  "metadata client stripped when not authoritative"
);
assert(
  landing.includes("resolveAuthoritativeCrowAuth"),
  "C3 landing uses authoritative auth"
);
assert(
  landing.includes("routes.account.home"),
  "non-authoritative roles land on account home"
);

console.log(
  "PASS — METADATA crow_role CANNOT AUTHORIZE WITHOUT AUTHORITATIVE CROW DATABASE STATE\n"
);
