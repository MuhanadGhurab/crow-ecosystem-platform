import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readSrc(rel: string): string {
  return readFileSync(resolve(root, rel), "utf8");
}

{
  const callback = readSrc("src/app/auth/callback/route.ts");
  assert(callback.includes("C3_OAUTH_PROVIDER_COOKIE"), "provider cookie in callback");
  assert(
    callback.includes("isGoogleSsoEnabled()") &&
      callback.indexOf("assignDefaultClientRoleOnSignUp") >
        callback.lastIndexOf("if (isGoogleSsoEnabled())"),
    "client role assignment unreachable when Google SSO enabled"
  );
}

{
  const resolver = readSrc("src/lib/auth/c3-post-auth-resolution.ts");
  const gateAt = resolver.indexOf("gateAuthSessionForC3");
  const landingAt = resolver.indexOf("resolveC3PostAuthLanding");
  assert(gateAt >= 0 && landingAt > gateAt, "legal gate before landing in resolver");
}

{
  const session = readSrc("src/lib/auth/session.ts");
  const gateAt = session.indexOf("enforceC3HumanAccessGate");
  const clientAt = session.indexOf("export async function requireClientAccess");
  assert(gateAt >= 0 && clientAt > gateAt, "client portal gated");
  assert(session.includes("requirePlatformConsole"), "platform console guarded");
}

{
  const legalPage = readSrc("src/app/register/legal/page.tsx");
  assert(
    legalPage.includes("hasMandatoryLegalAcceptanceComplete") &&
      legalPage.includes("isOnboardingGenerationCurrent"),
    "legal page uses current-version check before exit"
  );
}

{
  const provider = readSrc("src/lib/account/provider-identity.service.ts");
  assert(provider.includes("oauthProviderHint"), "Google eligibility accepts server hint");
}

{
  const flags = readSrc("src/lib/account/feature-flags.ts");
  assert(flags.includes("isGoogleSsoEnabled()"), "Google flag enables platform gate");
}

console.log("c3-google-hosted-routing: all static checks passed");
