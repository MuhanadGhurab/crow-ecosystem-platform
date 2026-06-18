import {
  assertPublishedVersionImmutable,
  verifyVersionContentHash,
} from "./legal-document-validation";
import { hashLegalDocumentContent } from "./legal-document-hash";
import { LegalAcceptanceValidationError } from "./legal-errors";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const body = "# Privacy\n\nNotice text.";
const sha = hashLegalDocumentContent(body);

assert(
  verifyVersionContentHash({ contentBody: body, contentSha256: sha }),
  "verifyVersionContentHash accepts matching hash"
);
assert(
  !verifyVersionContentHash({ contentBody: body, contentSha256: "deadbeef".repeat(8) }),
  "verifyVersionContentHash rejects mismatch"
);

const published = {
  status: "published" as const,
  contentBody: body,
  contentSha256: sha,
};

let threw = false;
try {
  assertPublishedVersionImmutable(published, { contentBody: "# changed" });
} catch (e) {
  threw = true;
  assert(
    e instanceof Error && e.message.includes("immutable"),
    "immutable guard throws on content change"
  );
}
assert(threw, "assertPublishedVersionImmutable blocks content mutation");

assertPublishedVersionImmutable(published, { status: "superseded" });
assertPublishedVersionImmutable(
  { status: "draft" as const, contentBody: body, contentSha256: sha },
  { contentBody: "# draft edit ok" }
);

const err = new LegalAcceptanceValidationError("stale version");
assert(err.name === "LegalAcceptanceValidationError", "validation error type");

console.log("legal-acceptance.service.test.ts: OK");
