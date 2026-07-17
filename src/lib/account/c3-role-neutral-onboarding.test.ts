import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readSrc(rel: string): string {
  return readFileSync(resolve(root, rel), "utf8");
}

{
  const link = readSrc("src/lib/services/client-request-link.service.ts");
  assert(
    link.includes("isC3PlatformAccountGateEnabled()") &&
      link.includes("if (isC3PlatformAccountGateEnabled())") &&
      link.includes("return false"),
    "assignDefaultClientRoleOnSignUp must no-op under C3 platform gate"
  );
  assert(
    link.includes("grantClientRole") &&
      link.includes("!isC3PlatformAccountGateEnabled()"),
    "deferred onboarding must not grant client metadata role under C3 gate"
  );
  assert(
    link.includes("resolveAuthoritativeCrowAuth"),
    "intake must use authoritative auth before legacy role assignment"
  );
  assert(
    !/crow_role:\s*PUBLIC_SIGNUP_ALLOWED_ROLE[\s\S]{0,120}isC3PlatformAccountGateEnabled/.test(
      link
    ),
    "must not assign client role when C3 gate enabled"
  );
}

{
  const orch = readSrc("src/lib/account/c3-auth-orchestration.ts");
  assert(
    orch.includes('grantClientRole: false'),
    "runDeferredClientOnboarding must not grant crow_role"
  );
  assert(
    !orch.includes("assignDefaultClientRoleOnSignUp"),
    "C3 orchestration must not call assignDefaultClientRoleOnSignUp"
  );
}

{
  const callback = readSrc("src/app/auth/callback/route.ts");
  assert(callback.includes("isC3PlatformAccountGateEnabled"), "C3 callback bypasses legacy client role");
  assert(callback.includes("gateAuthSessionForC3"), "C3 email OAuth uses gate not client bootstrap");
}

{
  const platform = readSrc("src/lib/account/platform-account.service.ts");
  assert(
    platform.includes("PENDING_LEGAL_ACCEPTANCE"),
    "email verification must converge to pending legal when mandatory legal incomplete"
  );
  assert(
    platform.includes("if (account.emailVerifiedAt)") &&
      platform.includes("isPendingEmailVerification"),
    "verified email must not remain blocked on email verification gate"
  );
}

{
  const reconcile = readSrc("scripts/lib/c3-google-proof-role-reconciliation.ts");
  assert(reconcile.includes("expectedFingerprint"), "controlled reconcile binds fingerprint");
  assert(reconcile.includes("delete nextMeta.crow_role"), "reconcile removes stale client metadata");
  assert(
    reconcile.includes("Authoritative client/request-owner relationship exists"),
    "reconcile fails closed on request ownership"
  );
  assert(
    reconcile.includes("TenantMemberships=0"),
    "reconcile fails closed on tenant membership"
  );
}

{
  const auth = readSrc("src/lib/actions/auth.ts");
  const c3Block = auth.slice(
    auth.indexOf("if (isC3AuthEnabled())"),
    auth.indexOf("try {", auth.indexOf("await linkRequestsForUser(user)"))
  );
  assert(
    c3Block.includes("gateAuthSessionForC3") && !c3Block.includes("assignDefaultClientRoleOnSignUp"),
    "C3 sign-in completion must not assign default client role"
  );
}

{
  const legal = readSrc("src/lib/actions/account-legal.ts");
  assert(
    !legal.includes("assignDefaultClientRole") && !legal.includes("crow_role"),
    "legal acceptance must not assign crow_role"
  );
}

console.log("c3-role-neutral-onboarding: all static checks passed");
