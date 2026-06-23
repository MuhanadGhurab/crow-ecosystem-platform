import assert from "node:assert/strict";

import {
  FTGP_CERTIFICATION_ALLOWED_HOST_ENV,
  FTGP_CERTIFICATION_MODE_ENV,
  FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST,
  evaluateFtgpCertificationHostGate,
  normalizeAllowedHost,
  normalizeRequestHost,
} from "./ftgp-certification-host-gate";

const ALLOWED = "crow-ftgp-certification-bikra9l3r-muhanadghurabs-projects.vercel.app";

function withCertificationEnv(
  allowedHost: string | null,
  run: () => void
): void {
  const prevMode = process.env[FTGP_CERTIFICATION_MODE_ENV];
  const prevAllowed = process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV];
  process.env[FTGP_CERTIFICATION_MODE_ENV] = "true";
  if (allowedHost) {
    process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV] = allowedHost;
  } else {
    delete process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV];
  }
  try {
    run();
  } finally {
    if (prevMode === undefined) delete process.env[FTGP_CERTIFICATION_MODE_ENV];
    else process.env[FTGP_CERTIFICATION_MODE_ENV] = prevMode;
    if (prevAllowed === undefined) delete process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV];
    else process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV] = prevAllowed;
  }
}

{
  assert.equal(
    normalizeRequestHost("Crow-Ftgp-Certification-Bikra9l3r-Muhanadghurabs-Projects.vercel.app:443"),
    ALLOWED
  );
  assert.equal(normalizeRequestHost("host1,host2"), null);
  assert.equal(normalizeRequestHost(""), null);
}

{
  assert.equal(normalizeAllowedHost(FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST), null);
  assert.equal(normalizeAllowedHost("crow-ecosystem-platform.vercel.app"), null);
  assert.equal(normalizeAllowedHost(ALLOWED), ALLOWED);
}

withCertificationEnv(null, () => {
  assert.equal(evaluateFtgpCertificationHostGate(ALLOWED), "deny");
});

withCertificationEnv(ALLOWED, () => {
  assert.equal(evaluateFtgpCertificationHostGate(ALLOWED), "allow");
  assert.equal(
    evaluateFtgpCertificationHostGate(
      "Crow-Ftgp-Certification-Bikra9l3r-Muhanadghurabs-Projects.vercel.app"
    ),
    "allow"
  );
  assert.equal(evaluateFtgpCertificationHostGate(FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST), "deny");
  assert.equal(
    evaluateFtgpCertificationHostGate("crow-ftgp-certification-unknown-muhanadghurabs-projects.vercel.app"),
    "deny"
  );
  assert.equal(evaluateFtgpCertificationHostGate("host1,host2"), "deny");
});

delete process.env[FTGP_CERTIFICATION_MODE_ENV];
delete process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV];
assert.equal(evaluateFtgpCertificationHostGate(FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST), "inactive");
assert.equal(evaluateFtgpCertificationHostGate(ALLOWED), "inactive");

console.log("ftgp-certification-host-gate: all checks passed");
