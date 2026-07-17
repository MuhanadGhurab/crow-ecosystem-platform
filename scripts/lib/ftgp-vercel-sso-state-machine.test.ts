import assert from "node:assert/strict";

import {
  FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST,
} from "../../src/lib/ftgp/ftgp-certification-host-gate";

import {
  VERCEL_OPERATOR_AUTH_WAIT_MS,
  classifyInitialHttpGateStatus,
  classifyProtectedPageLocation,
  isApprovedCertificationProofHost,
  isCrowApplicationReadyPhase,
  isDeniedProofHostForTests,
  isUnauthorizedProofReturnHost,
  isVercelAuthenticationHostname,
  requiresVercelOperatorWait,
} from "./ftgp-vercel-sso-state-machine";

const PROTECTED_BASE =
  "https://crow-ftgp-certification-4o8ymfctt-muhanadghurabs-projects.vercel.app";
const PROTECTED_HOST = new URL(PROTECTED_BASE).hostname;

{
  assert.equal(isVercelAuthenticationHostname("vercel.com"), true);
  assert.equal(isVercelAuthenticationHostname("sso.vercel.com"), true);
  assert.equal(isVercelAuthenticationHostname(PROTECTED_HOST), false);
}

{
  assert.equal(
    classifyProtectedPageLocation(`${PROTECTED_BASE}/login`, PROTECTED_BASE),
    "crow_login_ready"
  );
  assert.equal(
    classifyProtectedPageLocation(`${PROTECTED_BASE}/account`, PROTECTED_BASE),
    "crow_application_ready"
  );
  assert.equal(
    classifyProtectedPageLocation("https://vercel.com/sso-api?url=...", PROTECTED_BASE),
    "vercel_sso_redirect"
  );
}

{
  assert.equal(classifyInitialHttpGateStatus(302), "vercel_sso_redirect");
  assert.equal(classifyInitialHttpGateStatus(401), "vercel_sso_redirect");
  assert.equal(classifyInitialHttpGateStatus(200), null);
}

{
  assert.equal(requiresVercelOperatorWait("vercel_sso_redirect"), true);
  assert.equal(requiresVercelOperatorWait("crow_login_ready"), false);
  assert.equal(isCrowApplicationReadyPhase("crow_login_ready"), true);
  assert.equal(isCrowApplicationReadyPhase("vercel_sso_redirect"), false);
}

{
  assert.equal(isApprovedCertificationProofHost(PROTECTED_HOST, PROTECTED_BASE), true);
  assert.equal(
    isApprovedCertificationProofHost(
      "crow-ftgp-certification-bikra9l3r-muhanadghurabs-projects.vercel.app",
      PROTECTED_BASE
    ),
    true
  );
  assert.equal(
    isUnauthorizedProofReturnHost(FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST, PROTECTED_BASE),
    true
  );
  assert.equal(
    isUnauthorizedProofReturnHost("crow-ecosystem-platform.vercel.app", PROTECTED_BASE),
    true
  );
  assert.equal(
    isUnauthorizedProofReturnHost(
      "crow-ecosystem-platform-oz8qikh7x-muhanadghurabs-projects.vercel.app",
      PROTECTED_BASE
    ),
    true
  );
  assert.equal(isUnauthorizedProofReturnHost("vercel.com", PROTECTED_BASE), false);
  assert.equal(isUnauthorizedProofReturnHost(PROTECTED_HOST, PROTECTED_BASE), false);
}

{
  assert.equal(
    classifyProtectedPageLocation(
      `https://${FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST}/login`,
      PROTECTED_BASE
    ),
    "unauthorized_host"
  );
  assert.equal(
    classifyProtectedPageLocation("https://crow-ecosystem-platform.vercel.app/login", PROTECTED_BASE),
    "unauthorized_host"
  );
  assert.equal(
    classifyProtectedPageLocation(
      "https://crow-ecosystem-platform-oz8qikh7x-muhanadghurabs-projects.vercel.app/login",
      PROTECTED_BASE
    ),
    "unauthorized_host"
  );
}

{
  assert.equal(isDeniedProofHostForTests("localhost"), true);
  assert.equal(isDeniedProofHostForTests(PROTECTED_HOST), false);
}

assert.equal(VERCEL_OPERATOR_AUTH_WAIT_MS, 180_000);

console.log("ftgp-vercel-sso-state-machine: all checks passed");
