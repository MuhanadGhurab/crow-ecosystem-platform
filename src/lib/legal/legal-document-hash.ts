import { createHash } from "crypto";

/** Canonical SHA-256 over UTF-8 legal document body (publish + acceptance evidence). */
export function hashLegalDocumentContent(contentBody: string): string {
  return createHash("sha256").update(contentBody, "utf8").digest("hex");
}
