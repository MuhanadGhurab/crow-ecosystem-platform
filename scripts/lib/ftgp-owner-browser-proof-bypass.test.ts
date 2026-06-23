import assert from "node:assert/strict";

import {
  assertCertificationOwnerProofBypassPolicy,
  isAutomationBypassActivelyUsed,
  shouldUsePreviewAutomationBypassContext,
} from "./ftgp-owner-browser-proof-bypass";

{
  assertCertificationOwnerProofBypassPolicy({
    certificationMode: true,
    bypassSecretPresent: false,
    activeBypassUsage: false,
  });
  assertCertificationOwnerProofBypassPolicy({
    certificationMode: true,
    bypassSecretPresent: true,
    activeBypassUsage: false,
  });
}

{
  assert.throws(
    () =>
      assertCertificationOwnerProofBypassPolicy({
        certificationMode: true,
        bypassSecretPresent: true,
        activeBypassUsage: true,
      }),
    /automation bypass must not be used/
  );
}

{
  assert.equal(
    isAutomationBypassActivelyUsed({ useBypassBrowserContext: false }),
    false
  );
  assert.equal(
    isAutomationBypassActivelyUsed({
      useBypassBrowserContext: true,
    }),
    true
  );
  assert.equal(
    isAutomationBypassActivelyUsed({
      extraHttpHeaders: { "x-vercel-protection-bypass": "secret" },
    }),
    true
  );
  assert.equal(
    isAutomationBypassActivelyUsed({
      url: "https://example.vercel.app/login?x-vercel-protection-bypass=secret",
    }),
    true
  );
  assert.equal(
    isAutomationBypassActivelyUsed({
      cookies: [{ name: "_vercel_jwt", value: "x" }],
    }),
    false
  );
  assert.equal(
    isAutomationBypassActivelyUsed({
      cookies: [{ name: "vercel-protection-bypass", value: "secret" }],
    }),
    true
  );
}

{
  assert.equal(shouldUsePreviewAutomationBypassContext(true, true), false);
  assert.equal(shouldUsePreviewAutomationBypassContext(false, true), true);
  assert.equal(shouldUsePreviewAutomationBypassContext(false, false), false);
}

console.log("ftgp-owner-browser-proof-bypass: all checks passed");
