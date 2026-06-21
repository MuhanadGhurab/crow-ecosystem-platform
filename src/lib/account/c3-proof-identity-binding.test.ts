import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const root = process.cwd();

const route = readFileSync(
  join(root, "src/app/api/c3/proof-identity/route.ts"),
  "utf8"
);
const diagnostics = readFileSync(
  join(root, "src/lib/account/c3-proof-identity-diagnostics.ts"),
  "utf8"
);
const fingerprint = readFileSync(
  join(root, "src/lib/account/c3-proof-identity-fingerprint.ts"),
  "utf8"
);
const resolver = readFileSync(
  join(root, "src/components/auth/crow-post-auth-resolver.tsx"),
  "utf8"
);
const panel = readFileSync(
  join(root, "src/components/auth/crow-proof-identity-panel.tsx"),
  "utf8"
);
const routeProtection = readFileSync(
  join(root, "src/lib/auth/route-protection.ts"),
  "utf8"
);
const googleResolution = readFileSync(
  join(root, "scripts/lib/c3-google-proof-identity-resolution.ts"),
  "utf8"
);

assert(route.includes("isC3ProofDiagnosticsEnabled()"), "route gated by proof diagnostics flag");
assert(route.includes('status: 404'), "disabled diagnostics return 404");
assert(route.includes('status: 401'), "unauthenticated request denied");
assert(route.includes("buildC3ProofIdentitySnapshot"), "route uses sanitized snapshot builder");
assert(!route.includes("user.email"), "route must not expose email");
assert(!route.includes("user.id"), "route must not expose raw auth id in response body");

assert(diagnostics.includes('VERCEL_ENV === "preview"'), "diagnostics limited to preview");
assert(diagnostics.includes("identityFingerprint"), "snapshot includes identityFingerprint");
assert(!diagnostics.includes("email:"), "snapshot builder must not return email field");

assert(
  fingerprint.includes("C3_PROOF_IDENTITY_FINGERPRINT_SECRET"),
  "fingerprint uses server-only secret"
);
assert(
  routeProtection.includes('pathname === "/api/c3/proof-identity"'),
  "middleware allows proof-identity through for handler 401"
);
assert(
  googleResolution.includes("computeC3ProofIdentityFingerprint"),
  "CLI verifier uses canonical fingerprint function"
);

assert(resolver.includes("CrowProofIdentityPanel"), "resolver integrates proof panel");
assert(panel.includes("/api/c3/proof-identity"), "panel reads proof identity API");
assert(!panel.includes("email"), "panel must not display email");

console.log(
  "PASS — PREVIEW PROOF IDENTITY DIAGNOSTIC IS GATED, SANITIZED, AND SHARED WITH CLI VERIFIER\n"
);
