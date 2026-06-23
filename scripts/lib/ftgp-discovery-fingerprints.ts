import { createHash } from "node:crypto";

export function discoveryProfileFingerprint(profileId: string): string {
  return createHash("sha256")
    .update(`ftgp-discovery-profile:${profileId}`)
    .digest("hex")
    .slice(0, 16);
}

export function discoveryAnswerFingerprint(answerId: string): string {
  return createHash("sha256")
    .update(`ftgp-discovery-answer:${answerId}`)
    .digest("hex")
    .slice(0, 16);
}
