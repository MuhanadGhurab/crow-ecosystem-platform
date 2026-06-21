import { createHash } from "crypto";
import { hashLegalDocumentContent } from "./legal-document-hash";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const body = "# Terms\n\nAccept Crow platform terms.";
const hash1 = hashLegalDocumentContent(body);
const hash2 = hashLegalDocumentContent(body);

assert(hash1.length === 64, "hash is sha256 hex");
assert(hash1 === hash2, "hash is stable for same content");
assert(/^[a-f0-9]+$/.test(hash1), "hash is lowercase hex");

const expected = createHash("sha256").update(body, "utf8").digest("hex");
assert(hash1 === expected, "hash matches Node crypto UTF-8 SHA-256");

assert(
  hashLegalDocumentContent(body + " ") !== hash1,
  "hash changes when content changes"
);

console.log("legal-document-hash.test.ts: OK");
