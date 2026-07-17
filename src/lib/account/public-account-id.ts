import { randomBytes } from "crypto";

/** Human-readable public account id (non-sequential). */
export function generatePublicAccountId(): string {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `CRW-${suffix}`;
}
