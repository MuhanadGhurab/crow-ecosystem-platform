/**
 * C3.10R — Resolver stage UI must reflect confirmed server outcomes only.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const resolver = readFileSync(
  join(process.cwd(), "src/components/auth/crow-post-auth-resolver.tsx"),
  "utf8"
);
const resolution = readFileSync(
  join(process.cwd(), "src/lib/auth/c3-post-auth-resolution.ts"),
  "utf8"
);
const action = readFileSync(
  join(process.cwd(), "src/lib/actions/post-auth-resolution.ts"),
  "utf8"
);

assert(resolver.includes("failedStage"), "resolver tracks failed stage");
assert(resolver.includes("completedStages"), "resolver tracks confirmed stages only");
assert(resolver.includes("could not complete"), "failed stage shows error marker copy");
assert(resolver.includes("Reference:"), "failure shows support reference");
assert(
  resolver.includes("We authenticated your Google account, but could not prepare your Crow account."),
  "user-safe preparation failure copy"
);
assert(!resolver.includes("timeout"), "removed separate timeout phase with fake progress");

assert(
  resolution.includes("failureStage"),
  "server resolution exposes failure stage"
);
assert(
  resolution.includes("PRODUCTION_DATABASE_ENV_MISMATCH"),
  "database env mismatch classified"
);
assert(
  !resolution.match(/stages\.push\("legal_reviewed"\)[\s\S]{0,80}gateAuthSessionForC3/),
  "legal stage not pushed before gate completes"
);

assert(action.includes("resolver_error"), "server action maps configuration failures inline");
assert(action.includes("failureClass === \"RESOLUTION_TIMEOUT\""), "timeout uses failure class");

console.log(
  "PASS — RESOLVER STAGES REFLECT CONFIRMED SERVER OUTCOMES; CONFIGURATION FAILURES STAY ON RESOLVER\n"
);
