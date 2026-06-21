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
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
  effectiveAt: new Date("2026-01-01T00:00:00.000Z"),
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

let threwTimestamp = false;
try {
  assertPublishedVersionImmutable(published, {
    publishedAt: new Date(published.publishedAt!.getTime() + 1000),
  });
} catch (e) {
  threwTimestamp = true;
  assert(
    e instanceof Error && e.message.includes("publishedAt"),
    "immutable guard throws on publishedAt change"
  );
}
assert(threwTimestamp, "publishedAt is immutable on published versions");
assertPublishedVersionImmutable(
  {
    status: "draft" as const,
    contentBody: body,
    contentSha256: sha,
    publishedAt: null,
    effectiveAt: new Date(0),
  },
  { contentBody: "# draft edit ok" }
);

const err = new LegalAcceptanceValidationError("stale version");
assert(err.name === "LegalAcceptanceValidationError", "validation error type");

console.log("legal-acceptance.service.test.ts: OK");
