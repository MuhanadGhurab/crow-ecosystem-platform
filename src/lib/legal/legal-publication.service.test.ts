import type { LegalDocumentType } from "@prisma/client";
import {
  buildLegalV11PublicationPayload,
  payloadsMatch,
} from "./legal-publication-payload";
import { hashLegalDocumentContent } from "./legal-document-hash";
import { finalizeLegalDocumentTemplate } from "./legal-contact-config";
import { CROW_LEGAL_V1_1_DOCUMENTS } from "./crow-legal-v1-1-content";
import {
  computePendingReacceptanceFromFixtures,
  type LegalVersionFixture,
} from "./legal-reacceptance-fixtures";
import {
  assertHostedLegalPublicationSafe,
  isExplicitLegalV11PublicationAuthorized,
} from "./legal-publication-guards";
import { buildLegalContentFidelitySummary } from "./legal-content-fidelity";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

process.env.CROW_LEGAL_ENTITY_NAME = "Crow Legal Entity Test Ltd";
process.env.LEGAL_CONTACT_EMAIL = "legal@test.crow.local";
process.env.PRIVACY_CONTACT_EMAIL = "privacy@test.crow.local";
process.env.DATA_RIGHTS_CONTACT_EMAIL = "privacy@test.crow.local";
process.env.SECURITY_CONTACT_EMAIL = "security@test.crow.local";
process.env.ABUSE_CONTACT_EMAIL = "abuse@test.crow.local";

const finalized = finalizeLegalDocumentTemplate(CROW_LEGAL_V1_1_DOCUMENTS[0]!.contentBody);
assert(!finalized.includes("{{"), "finalized body has no template placeholders");

const payload = buildLegalV11PublicationPayload();
for (const doc of payload.documents) {
  assert(
    doc.contentSha256 === hashLegalDocumentContent(doc.contentBody),
    "publication hash matches finalized body"
  );
  assert(!doc.contentBody.includes("{{"), `${doc.documentType} finalized body immutable-ready`);
}

const v10Published: LegalVersionFixture[] = [
  {
    id: "tos-v1",
    documentType: "TERMS_OF_SERVICE",
    versionNumber: 1,
    status: "published",
    reacceptancePolicy: "none",
  },
  {
    id: "tos-v2-draft",
    documentType: "TERMS_OF_SERVICE",
    versionNumber: 2,
    status: "draft",
    reacceptancePolicy: "required_before_protected_activity",
  },
];

assert(
  computePendingReacceptanceFromFixtures({
    publishedVersions: v10Published,
    acceptances: [{ documentType: "TERMS_OF_SERVICE", legalDocumentVersionId: "tos-v1" }],
  }).length === 0,
  "draft v1.1 does not trigger reacceptance while v1.0 is current"
);

const v11Current: LegalVersionFixture[] = [
  {
    id: "tos-v2",
    documentType: "TERMS_OF_SERVICE",
    versionNumber: 2,
    status: "published",
    reacceptancePolicy: "required_before_protected_activity",
  },
];

assert(
  computePendingReacceptanceFromFixtures({
    publishedVersions: v11Current,
    acceptances: [{ documentType: "TERMS_OF_SERVICE", legalDocumentVersionId: "tos-v1" }],
  }).includes("TERMS_OF_SERVICE"),
  "published v1.1 triggers reacceptance when only v1.0 accepted"
);

const existingPublished = {
  title: payload.documents[0]!.title,
  contentBody: payload.documents[0]!.contentBody,
  contentSha256: payload.documents[0]!.contentSha256,
};
assert(payloadsMatch(existingPublished, payload.documents[0]!), "idempotent payload match");

let blocked = false;
delete process.env.CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED;
delete process.env.ALLOW_HOSTED_LEGAL_PUBLICATION;
try {
  assertHostedLegalPublicationSafe("test");
} catch {
  blocked = true;
}
assert(blocked, "hosted publication blocked without explicit authorization");

assert(!isExplicitLegalV11PublicationAuthorized(), "publication not authorized by env presence alone");

const fidelity = buildLegalContentFidelitySummary();
assert(
  fidelity.overallClassification === "PO_SOURCE_MISSING" || fidelity.poSourceAvailable,
  "fidelity summary reports PO source availability"
);

console.log("legal-publication.service.test.ts: OK");
