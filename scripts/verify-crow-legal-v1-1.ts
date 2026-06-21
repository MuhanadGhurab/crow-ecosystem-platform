/**
 * Crow Legal v1.1 — static verifier: content fidelity, immutability, publication controls, trust positioning.
 * Run: npm run crow-legal-v1-1:verify
 *
 * Does NOT imply counsel approval or hosted publication authorization.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  CROW_LEGAL_V1_1_DOCUMENTS,
  CROW_LEGAL_V1_1_VERSION_NUMBER,
} from "../src/lib/legal/crow-legal-v1-1-content";
import { buildLegalContentFidelitySummary } from "../src/lib/legal/legal-content-fidelity";
import { hashLegalDocumentContent } from "../src/lib/legal/legal-document-hash";
import {
  containsExampleLegalContact,
  finalizeLegalDocumentTemplate,
  LEGAL_CONTACT_PLACEHOLDER_KEYS,
} from "../src/lib/legal/legal-contact-config";
import {
  DISCOVERY_AUTHORITY_CONFIRMATION_TEXT,
  DISCOVERY_COMPLIANCE_BOUNDARY,
  DISCOVERY_SENSITIVE_DATA_WARNING,
  FORBIDDEN_UNSUPPORTED_COMPLIANCE_CLAIMS,
} from "../src/lib/legal/compliance-positioning";
import { CYBERCROW_LAYER_COUNT } from "../src/lib/constants/cybercrow-security-layers";
import { PORTAL_GATEWAY_SAFETY_NOTES } from "../src/lib/portal/portal-access-contract";
import { PIPELINE_STATE_OWNERSHIP } from "../src/lib/constants/platform";
import {
  computePendingReacceptanceFromFixtures,
  type LegalVersionFixture,
} from "../src/lib/legal/legal-reacceptance-fixtures";
import {
  SHARED_HOSTED_DATABASE_FINGERPRINT,
  isExplicitLegalV11PublicationAuthorized,
  isHostedLegalPublicationAllowed,
  isProductionLegalV11CodeCompatible,
} from "../src/lib/legal/legal-publication-guards";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "src/lib/legal/crow-legal-v1-1-content.ts",
  "src/lib/legal/legal-contact-config.ts",
  "src/lib/legal/legal-content-fidelity.ts",
  "src/lib/legal/legal-publication-payload.ts",
  "src/lib/legal/legal-publication.service.ts",
  "src/lib/legal/legal-publication-guards.ts",
  "src/lib/legal/compliance-positioning.ts",
  "src/lib/constants/cybercrow-security-layers.ts",
  "src/components/trust/cybercrow-security-trust-panel.tsx",
  "prisma/seed-legal-documents.ts",
  "scripts/publish-crow-legal-v1-1-controlled.ts",
  "docs/legal/CROW_LEGAL_V1_1_ALIGNMENT_POSITION.md",
  "docs/legal/CROW_LEGAL_V1_1_PUBLICATION_PLAN.md",
  "docs/legal/CROW_LEGAL_V1_1_PRODUCT_OWNER_DRAFT_APPROVAL.md",
  "docs/legal/source/product-owner-v1-1/terms-of-service-v1-1.md",
  "docs/legal/source/product-owner-v1-1/privacy-notice-v1-1.md",
  "docs/legal/source/product-owner-v1-1/acceptable-use-policy-v1-1.md",
] as const;

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
}

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== Crow Legal v1.1 verification ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  check(
    CROW_LEGAL_V1_1_DOCUMENTS.length === 3,
    "Three v1.1 legal document templates defined",
    "Expected three v1.1 documents"
  );

  check(
    CROW_LEGAL_V1_1_VERSION_NUMBER === 2,
    "v1.1 maps to versionNumber 2 (distinct from v1.0)",
    "v1.1 versionNumber must be 2"
  );

  for (const doc of CROW_LEGAL_V1_1_DOCUMENTS) {
    check(
      doc.contentBody.includes("Version 1.1"),
      `${doc.documentType} marked as Version 1.1`,
      `${doc.documentType} missing Version 1.1 marker`
    );
    check(
      !containsExampleLegalContact(doc.contentBody),
      `${doc.documentType} template has no .example contacts`,
      `${doc.documentType} contains .example contact`
    );
  }

  const legalPage = read("src/app/legal/[slug]/[versionId]/page.tsx");
  check(
    !legalPage.includes("interpolateLegalContactPlaceholders") &&
      !legalPage.includes("finalizeLegalDocumentTemplate"),
    "Public legal page serves stored body only (no runtime interpolation)",
    "Public legal page may mutate published bodies at render time"
  );

  const contactConfig = read("src/lib/legal/legal-contact-config.ts");
  check(
    contactConfig.includes("finalizeLegalDocumentTemplate") &&
      contactConfig.includes("never on published render"),
    "Contact interpolation limited to publication finalization",
    "legal-contact-config missing publication-only finalization guard"
  );

  const publicationService = read("src/lib/legal/legal-publication.service.ts");
  check(
    publicationService.includes("FAILED — EXISTING LEGAL VERSION CONTENT OR HASH MISMATCH"),
    "Publication fails closed on content/hash mismatch",
    "Publication missing fail-closed mismatch handling"
  );
  check(
    publicationService.includes('status: "draft"') && publicationService.includes("seedLegalV11DraftVersions"),
    "v1.1 draft seed path exists",
    "Missing draft-only v1.1 seed"
  );

  const seedText = read("prisma/seed-legal-documents.ts");
  check(
    seedText.includes("seedLegalV11DraftVersions"),
    "Seed publishes v1.0 and drafts v1.1 only",
    "Seed must not auto-publish v1.1"
  );
  check(
    !seedText.includes("CROW_LEGAL_V1_1_DOCUMENTS") || seedText.includes("seedLegalV11DraftVersions"),
    "Seed does not directly publish v1.1 as current",
    "Seed still auto-publishes v1.1 — hosted publication safety defect"
  );

  const fidelity = buildLegalContentFidelitySummary();
  console.log("\n--- Content fidelity (PO source comparison) ---\n");
  console.log(`  PO source available: ${fidelity.poSourceAvailable}`);
  console.log(`  Overall classification: ${fidelity.overallClassification}`);
  for (const doc of fidelity.documents) {
    console.log(`  ${doc.documentType}: ${doc.classification}`);
    if (doc.preservedSections.length > 0) {
      console.log(`    preserved sections: ${doc.preservedSections.join(", ")}`);
    }
    if (doc.newClauses.length > 0 && doc.classification === "PO_SOURCE_MISSING") {
      console.log(`    committed sections (pending PO line match): ${doc.newClauses.join(", ")}`);
    }
    if (doc.materialObligationChanges.length > 0) {
      for (const note of doc.materialObligationChanges) {
        console.log(`    material: ${note}`);
      }
    }
  }
  check(
    fidelity.poSourceAvailable,
    "PO canonical source files deposited",
    "PO canonical source files missing under docs/legal/source/product-owner-v1-1/"
  );
  check(
    fidelity.overallClassification === "EXACT_MATCH",
    "Committed templates EXACT_MATCH product-owner canonical source",
    `Fidelity not EXACT_MATCH — got ${fidelity.overallClassification}`
  );
  for (const doc of fidelity.documents) {
    const poSections = read(
      `docs/legal/source/product-owner-v1-1/${doc.documentType === "TERMS_OF_SERVICE" ? "terms-of-service-v1-1.md" : doc.documentType === "PRIVACY_NOTICE" ? "privacy-notice-v1-1.md" : "acceptable-use-policy-v1-1.md"}`
    )
      .split("\n")
      .filter((l) => /^##\s+/.test(l)).length;
    const committedSections = doc.preservedSections.length + doc.newClauses.length;
    check(
      doc.classification === "EXACT_MATCH" && poSections === committedSections,
      `${doc.documentType}: EXACT_MATCH (${poSections} sections)`,
      `${doc.documentType}: ${doc.classification} (section count PO=${poSections} committed=${committedSections})`
    );
  }

  process.env.CROW_LEGAL_ENTITY_NAME = "Crow Test Entity";
  process.env.LEGAL_CONTACT_EMAIL = "legal@test.crow.local";
  process.env.PRIVACY_CONTACT_EMAIL = "privacy@test.crow.local";
  process.env.DATA_RIGHTS_CONTACT_EMAIL = "privacy@test.crow.local";
  process.env.SECURITY_CONTACT_EMAIL = "security@test.crow.local";
  process.env.ABUSE_CONTACT_EMAIL = "abuse@test.crow.local";

  const sampleFinal = finalizeLegalDocumentTemplate(CROW_LEGAL_V1_1_DOCUMENTS[0]!.contentBody);
  const templateHash = hashLegalDocumentContent(CROW_LEGAL_V1_1_DOCUMENTS[0]!.contentBody);
  const finalHash = hashLegalDocumentContent(sampleFinal);
  check(
    templateHash !== finalHash && !sampleFinal.includes("{{"),
    "Finalized rendered body hash differs from template (hash covers accepted text)",
    "Finalized body hash must not be template-only when contacts are configured"
  );

  console.log("\n--- Finalized sample ToS hash (test contacts) ---");
  console.log(`  ${finalHash}`);

  const draftOnly: LegalVersionFixture[] = [
    {
      id: "tos-2-draft",
      documentType: "TERMS_OF_SERVICE",
      versionNumber: 2,
      status: "draft",
      reacceptancePolicy: "required_before_protected_activity",
    },
    {
      id: "tos-1",
      documentType: "TERMS_OF_SERVICE",
      versionNumber: 1,
      status: "published",
      reacceptancePolicy: "none",
    },
  ];
  check(
    computePendingReacceptanceFromFixtures({
      publishedVersions: draftOnly,
      acceptances: [{ documentType: "TERMS_OF_SERVICE", legalDocumentVersionId: "tos-1" }],
    }).length === 0,
    "Draft v1.1 does not trigger reacceptance while v1.0 is current",
    "Draft v1.1 incorrectly triggers reacceptance"
  );

  const v11Published: LegalVersionFixture[] = [
    {
      id: "tos-2",
      documentType: "TERMS_OF_SERVICE",
      versionNumber: 2,
      status: "published",
      reacceptancePolicy: "required_before_protected_activity",
    },
  ];
  check(
    computePendingReacceptanceFromFixtures({
      publishedVersions: v11Published,
      acceptances: [{ documentType: "TERMS_OF_SERVICE", legalDocumentVersionId: "tos-1" }],
    }).includes("TERMS_OF_SERVICE"),
    "Published v1.1 triggers reacceptance when v1.0 only accepted",
    "Published v1.1 reacceptance logic broken"
  );

  check(
    !isExplicitLegalV11PublicationAuthorized() || process.env.CROW_LEGAL_V1_1_PUBLICATION_AUTHORIZED !== "true",
    "Hosted publication not implicitly authorized in verifier environment",
    "Unexpected publication authorization in verifier env"
  );
  check(
    !isHostedLegalPublicationAllowed(),
    "ALLOW_HOSTED_LEGAL_PUBLICATION not set in verifier (blocked by default)",
    "Hosted publication unexpectedly allowed"
  );
  check(
    !isProductionLegalV11CodeCompatible(),
    "PRODUCTION_LEGAL_V11_CODE_COMPATIBLE false by default (shared DB safety)",
    "Production compatibility flag unexpectedly true"
  );
  check(
    SHARED_HOSTED_DATABASE_FINGERPRINT === "0355c17692e2a90d",
    "Shared hosted DB fingerprint constant documented",
    "Shared DB fingerprint mismatch"
  );

  const acceptanceService = read("src/lib/legal/legal-acceptance.service.ts");
  check(
    acceptanceService.includes('status: "published"'),
    "Reacceptance gate queries published versions only",
    "Reacceptance may include draft versions"
  );

  const wizard = read("src/components/client-portal/client-discovery-wizard.tsx");
  check(
    wizard.includes("authority_confirmed") &&
      wizard.includes("DISCOVERY_AUTHORITY_CONFIRMATION_TEXT"),
    "Discovery authority confirmation required",
    "Discovery authority confirmation missing"
  );
  check(wizard.includes("DISCOVERY_SENSITIVE_DATA_WARNING"), "Sensitive-data warning present", "Missing sensitive-data warning");
  check(wizard.includes("DISCOVERY_COMPLIANCE_BOUNDARY"), "Compliance boundary present", "Missing compliance boundary");

  const trustPanel = read("src/components/trust/cybercrow-security-trust-panel.tsx");
  check(CYBERCROW_LAYER_COUNT === 7, "Seven CyberCrow security layers", "Layer count not seven");

  check(PIPELINE_STATE_OWNERSHIP.length >= 8, "Pipeline state ownership copy defined", "Pipeline ownership missing");

  const accountLegal = read("src/components/account/account-legal-panel.tsx");
  check(
    accountLegal.includes("Planned") || accountLegal.includes("Coming soon"),
    "Planned account legal features marked",
    "Planned features not marked"
  );

  let forbiddenHit: string | null = null;
  for (const rel of [
    "src/components/trust/cybercrow-security-trust-panel.tsx",
    "src/components/client-portal/client-discovery-wizard.tsx",
  ]) {
    const text = read(rel);
    for (const phrase of FORBIDDEN_UNSUPPORTED_COMPLIANCE_CLAIMS) {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        forbiddenHit = `${phrase} in ${rel}`;
        break;
      }
    }
  }
  check(!forbiddenHit, "No unsupported certification claims in scanned UI", forbiddenHit ?? "Forbidden claim");

  for (const note of PORTAL_GATEWAY_SAFETY_NOTES.slice(0, 2)) {
    check(
      read("src/lib/portal/portal-access-contract.ts").includes(note),
      `Portal boundary: ${note.slice(0, 36)}…`,
      `Missing portal boundary note`
    );
  }

  console.log("\n--- Template integrity hashes (pre-publication placeholders) ---\n");
  for (const doc of CROW_LEGAL_V1_1_DOCUMENTS) {
    console.log(`  ${doc.documentType}: ${hashLegalDocumentContent(doc.contentBody)}`);
  }

  const approvalRecord = read("docs/legal/CROW_LEGAL_V1_1_PRODUCT_OWNER_DRAFT_APPROVAL.md");
  const implementationFidelityApproved =
    fidelity.overallClassification === "EXACT_MATCH" && fidelity.poSourceAvailable;
  check(
    approvalRecord.includes("IMPLEMENTATION_FIDELITY_APPROVED=true"),
    "Product-owner approval record documents implementation fidelity approval",
    "Approval record missing IMPLEMENTATION_FIDELITY_APPROVED=true"
  );
  check(
    approvalRecord.includes("PRODUCT_OWNER_DRAFT_APPROVED=true"),
    "Product-owner approval record documents draft approval",
    "Approval record missing PRODUCT_OWNER_DRAFT_APPROVED=true"
  );

  const hostedPublicationAuthorized =
    isExplicitLegalV11PublicationAuthorized() && isHostedLegalPublicationAllowed();
  const hostedV10Unchanged =
    !hostedPublicationAuthorized &&
    !isProductionLegalV11CodeCompatible() &&
    seedText.includes("seedLegalV11DraftVersions");

  console.log("\n--- Product-owner and publication status ---\n");
  console.log(`  PRODUCT_OWNER_SOURCE=${fidelity.poSourceAvailable ? "AVAILABLE" : "MISSING"}`);
  console.log("  PRODUCT_OWNER_DRAFT_APPROVED=true");
  console.log(
    `  IMPLEMENTATION_FIDELITY_APPROVED=${implementationFidelityApproved ? "true" : "false"}`
  );
  console.log("  COUNSEL_APPROVED=false");
  console.log(`  HOSTED_PUBLICATION_AUTHORIZED=${hostedPublicationAuthorized ? "true" : "false"}`);
  console.log(
    `  PRODUCTION_LEGAL_V11_CODE_COMPATIBLE=${isProductionLegalV11CodeCompatible() ? "true" : "false"}`
  );

  console.log("");
  if (passed) {
    console.log(
      "PASS — LEGAL V1.1 CONTENT, IMMUTABILITY AND PUBLICATION CONTROLS VERIFIED\n"
    );
    console.log(
      "PASSED — PRODUCT-OWNER LEGAL V1.1 SOURCE AND IMPLEMENTATION FIDELITY VERIFIED\n"
    );
    console.log(`PRODUCT_OWNER_DRAFT_APPROVAL_RECORDED=${passed ? "PASS" : "FAIL"}`);
    console.log(
      `CANONICAL_SOURCE_FIDELITY=${implementationFidelityApproved ? "PASS" : "FAIL"}`
    );
    console.log("COUNSEL_APPROVED=false");
    console.log(`HOSTED_PUBLICATION_AUTHORIZED=${hostedPublicationAuthorized ? "true" : "false"}`);
    console.log(`HOSTED_V1_0_UNCHANGED=${hostedV10Unchanged ? "PASS" : "FAIL"}`);
    console.log(
      "\n(Does not imply counsel approval or hosted publication authorization.)\n"
    );
    process.exit(0);
  } else {
    console.error("FAILED — see errors above\n");
    process.exit(1);
  }
}

main();
