import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

// Role-neutral legal gate — internal roles do not bypass mandatory acceptance
{
  const orch = readSrc("src/lib/account/c3-auth-orchestration.ts");
  assert(
    orch.includes("hasMandatoryLegalAcceptanceComplete") &&
      !orch.includes("PLATFORM_ADMIN") &&
      !orch.includes("IMPLEMENTER"),
    "C3 gate checks legal completion without internal-role bypass branches"
  );
}

{
  const session = readSrc("src/lib/auth/session.ts");
  assert(session.includes("enforceC3HumanAccessGate"), "human portals share legal gate");
}

{
  const session = readSrc("src/lib/auth/session.ts");
  assert(
    session.includes("requireActivePlatformAccount") &&
      session.includes("enforceC3HumanAccessGate"),
    "active platform account helpers enforce legal gate"
  );
}

{
  const middleware = readSrc("src/lib/supabase/middleware.ts");
  assert(
    middleware.includes("isC3PlatformAccountGateEnabled"),
    "middleware applies platform gate when C3 enabled"
  );
}

console.log("ftgp-certification-legal-gate: all static checks passed");
