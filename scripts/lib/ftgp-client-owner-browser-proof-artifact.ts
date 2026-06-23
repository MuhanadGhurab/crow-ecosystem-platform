import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT =
  ".ftgp-client-owner-browser-proof.local.json" as const;

export const FTGP_OWNER_PROOF_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type FtgpClientOwnerBrowserProofArtifact = {
  requestFingerprint: string;
  ownerFingerprint: string;
  profileFingerprint: string;
  previewProtected: boolean;
  normalGoogleAuthenticationCompleted: boolean;
  resolvedPlatformAccountMatchesOwner: boolean;
  postAuthLanding: string;
  ownRequestAccess: "pass" | "fail";
  discoveryStageAccess: "pass" | "fail";
  unrelatedRequestAccess: "denied" | "fail";
  internalNotesAccess: "denied" | "fail";
  lifecycleMutation: "denied" | "fail";
  tenantAuthority: "denied" | "fail";
  clientAnswerSaveExecuted: boolean;
  discoveryCompletionExecuted: boolean;
  proofTimestamp: string;
  artifactIntegrity: string;
};

export function computeProofArtifactIntegrity(
  fields: Omit<FtgpClientOwnerBrowserProofArtifact, "artifactIntegrity">
): string {
  const payload = JSON.stringify({
    requestFingerprint: fields.requestFingerprint,
    ownerFingerprint: fields.ownerFingerprint,
    profileFingerprint: fields.profileFingerprint,
    proofTimestamp: fields.proofTimestamp,
    resolvedPlatformAccountMatchesOwner: fields.resolvedPlatformAccountMatchesOwner,
  });
  return createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

export function writeClientOwnerBrowserProofArtifact(
  artifact: Omit<FtgpClientOwnerBrowserProofArtifact, "artifactIntegrity">
): FtgpClientOwnerBrowserProofArtifact {
  const full: FtgpClientOwnerBrowserProofArtifact = {
    ...artifact,
    artifactIntegrity: computeProofArtifactIntegrity(artifact),
  };
  writeFileSync(
    join(process.cwd(), FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT),
    `${JSON.stringify(full, null, 2)}\n`,
    "utf8"
  );
  return full;
}

export function readClientOwnerBrowserProofArtifact():
  | FtgpClientOwnerBrowserProofArtifact
  | null {
  const path = join(process.cwd(), FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as FtgpClientOwnerBrowserProofArtifact;
  } catch {
    return null;
  }
}

export function validateProofArtifactFreshness(
  artifact: FtgpClientOwnerBrowserProofArtifact,
  nowMs = Date.now()
): boolean {
  const at = Date.parse(artifact.proofTimestamp);
  if (Number.isNaN(at)) return false;
  return nowMs - at <= FTGP_OWNER_PROOF_MAX_AGE_MS;
}

export function validateProofArtifactIntegrity(
  artifact: FtgpClientOwnerBrowserProofArtifact
): boolean {
  const expected = computeProofArtifactIntegrity(artifact);
  return artifact.artifactIntegrity === expected;
}
