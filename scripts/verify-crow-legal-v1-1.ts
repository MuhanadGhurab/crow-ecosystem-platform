/**
 * Crow Legal v1.1 — static verifier for legal versioning, trust positioning, and discovery boundaries.
 * Run: npm run crow-legal-v1-1:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  CROW_LEGAL_V1_1_DOCUMENTS,
  CROW_LEGAL_V1_1_SEMVER,
  CROW_LEGAL_V1_1_VERSION_NUMBER,
} from "../src/lib/legal/crow-legal-v1-1-content";
import { hashLegalDocumentContent } from "../src/lib/legal/legal-document-hash";
import {
  containsExampleLegalContact,
  LEGAL_CONTACT_PLACEHOLDER_KEYS,
} from "../src/lib/legal/legal-contact-config";
import {
  COMPLIANCE_ALIGNMENT_DISCLAIMER,
  COMPLIANCE_ALIGNMENT_STATEMENT,
  DISCOVERY_AUTHORITY_CONFIRMATION_TEXT,
  DISCOVERY_COMPLIANCE_BOUNDARY,
  DISCOVERY_SENSITIVE_DATA_WARNING,
  FORBIDDEN_UNSUPPORTED_COMPLIANCE_CLAIMS,
} from "../src/lib/legal/compliance-positioning";
import { CYBERCROW_LAYER_COUNT, CYBERCROW_SECURITY_LAYERS } from "../src/lib/constants/cybercrow-security-layers";
import { PORTAL_GATEWAY_SAFETY_NOTES } from "../src/lib/portal/portal-access-contract";
import { PIPELINE_STATE_OWNERSHIP } from "../src/lib/constants/platform";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "src/lib/legal/crow-legal-v1-1-content.ts",
  "src/lib/legal/legal-contact-config.ts",
  "src/lib/legal/compliance-positioning.ts",
  "src/lib/constants/cybercrow-security-layers.ts",
  "src/lib/constants/discovery-security-advisory.ts",
  "src/components/trust/cybercrow-security-trust-panel.tsx",
  "prisma/seed-legal-documents.ts",
  "docs/legal/CROW_LEGAL_V1_1_ALIGNMENT_POSITION.md",
] as const;

const FORBIDDEN_CLAIM_SCAN_PATHS = [
  "src/lib/legal/crow-legal-v1-1-content.ts",
  "src/components/trust/cybercrow-security-trust-panel.tsx",
  "src/components/client-portal/client-discovery-wizard.tsx",
  "src/components/account/account-legal-panel.tsx",
  "src/app/(public)/security/page.tsx",
  "prisma/seed-legal-documents.ts",
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
    "Three v1.1 legal documents defined",
    "Expected three v1.1 documents"
  );

  check(
    CROW_LEGAL_V1_1_VERSION_NUMBER === 2,
    "v1.1 maps to versionNumber 2 (distinct from v1.0)",
    "v1.1 versionNumber must be 2"
  );

  for (const doc of CROW_LEGAL_V1_1_DOCUMENTS) {
    check(
      doc.title.includes("Version 1.1") || doc.contentBody.includes("Version 1.1"),
      `${doc.documentType} marked as Version 1.1`,
      `${doc.documentType} missing Version 1.1 marker`
    );
    check(
      !containsExampleLegalContact(doc.contentBody),
      `${doc.documentType} has no .example contacts`,
      `${doc.documentType} contains .example contact — use placeholders`
    );
    const placeholdersInDoc = LEGAL_CONTACT_PLACEHOLDER_KEYS.filter((key) =>
      doc.contentBody.includes(`{{${key}}}`)
    );
    check(
      placeholdersInDoc.length >= 2,
      `${doc.documentType} uses ${placeholdersInDoc.length} contact/entity placeholders`,
      `${doc.documentType} must include at least two placeholders`
    );
    const hash = hashLegalDocumentContent(doc.contentBody);
    check(hash.length === 64, `${doc.documentType} SHA-256 computable (${hash.slice(0, 12)}…)`, "Hash failed");
  }

  const seedText = read("prisma/seed-legal-documents.ts");
  check(
    seedText.includes("required_before_protected_activity"),
    "Seed sets reacceptance policy for v1.1",
    "Seed missing required_before_protected_activity for v1.1"
  );
  check(
    seedText.includes("CROW_LEGAL_V1_1_DOCUMENTS"),
    "Seed imports v1.1 document package",
    "Seed does not import v1.1 documents"
  );
  check(
    seedText.includes('status: "superseded"') || seedText.includes("superseded"),
    "Seed supersedes prior published version when v1.1 is added",
    "Seed missing supersede handling"
  );

  const acceptanceService = read("src/lib/legal/legal-acceptance.service.ts");
  check(
    acceptanceService.includes("required_before_protected_activity"),
    "Reacceptance gate uses required_before_protected_activity policy",
    "legal-acceptance.service missing reacceptance policy handling"
  );
  check(
    acceptanceService.includes("versionNumber") && acceptanceService.includes("latestByType"),
    "Acceptance compares per-type latest published version (v1.0 ≠ v1.1)",
    "Acceptance service may not distinguish v1.0 from v1.1"
  );

  const wizard = read("src/components/client-portal/client-discovery-wizard.tsx");
  check(
    wizard.includes("authority_confirmed") &&
      wizard.includes("DISCOVERY_AUTHORITY_CONFIRMATION_TEXT"),
    "Discovery submit requires authority confirmation checkbox",
    "Discovery authority confirmation missing"
  );
  check(
    wizard.includes("DISCOVERY_SENSITIVE_DATA_WARNING"),
    "Sensitive-information warning renders on review step",
    "Sensitive-data warning missing"
  );
  check(
    wizard.includes("DISCOVERY_COMPLIANCE_BOUNDARY"),
    "Compliance boundary renders on discovery review",
    "Compliance boundary missing from discovery"
  );

  const trustPanel = read("src/components/trust/cybercrow-security-trust-panel.tsx");
  check(
    CYBERCROW_LAYER_COUNT === 7,
    "Seven CyberCrow security layers defined",
    `Expected 7 layers, found ${CYBERCROW_LAYER_COUNT}`
  );
  check(
    trustPanel.includes("CYBERCROW_SECURITY_LAYERS") && trustPanel.includes("layer.name"),
    "Trust panel renders all seven CyberCrow layers from canonical source",
    "Trust panel missing dynamic seven-layer rendering"
  );
  check(
    trustPanel.includes("COMPLIANCE_ALIGNMENT_STATEMENT"),
    "Trust panel includes alignment statement",
    "Trust panel missing alignment statement"
  );
  check(
    trustPanel.includes("COMPLIANCE_ALIGNMENT_DISCLAIMER"),
    "Trust panel includes alignment disclaimer",
    "Trust panel missing alignment disclaimer"
  );

  const settings = read("src/app/client/settings/page.tsx");
  check(
    settings.includes("Coming soon") && settings.includes("Planned"),
    "Client settings show planned/disabled notification features",
    "Planned feature disabled state missing in client settings"
  );
  check(
    settings.includes("cursor-not-allowed") || settings.includes('aria-disabled="true"'),
    "Planned controls are not presented as active click targets",
    "Planned controls may appear clickable"
  );

  for (const note of PORTAL_GATEWAY_SAFETY_NOTES) {
    check(
      settings.includes(note) || read("src/lib/portal/portal-access-contract.ts").includes(note),
      `Portal boundary note present: ${note.slice(0, 40)}…`,
      `Missing portal boundary: ${note}`
    );
  }

  check(PIPELINE_STATE_OWNERSHIP.length >= 8, "Pipeline state ownership copy defined", "Pipeline ownership missing");

  const accountLegal = read("src/components/account/account-legal-panel.tsx");
  check(
    accountLegal.includes("Withdraw marketing consent") || accountLegal.includes("Opt in to marketing"),
    "Marketing consent withdrawal supported",
    "Marketing withdrawal UI missing"
  );
  check(
    accountLegal.includes("Data export") && accountLegal.includes("Planned"),
    "Data-rights entry marked Planned",
    "Data-rights planned state missing"
  );
  check(
    accountLegal.includes("does not grant roles") || accountLegal.includes("does not grant roles, tenant"),
    "Legal acceptance does not grant roles or billing",
    "Account legal missing authority boundary copy"
  );

  let forbiddenHit: string | null = null;
  for (const rel of FORBIDDEN_CLAIM_SCAN_PATHS) {
    if (rel === "src/lib/legal/crow-legal-v1-1-content.ts") continue;
    const text = read(rel);
    for (const phrase of FORBIDDEN_UNSUPPORTED_COMPLIANCE_CLAIMS) {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        forbiddenHit = `${phrase} in ${rel}`;
        break;
      }
    }
    if (forbiddenHit) break;
  }
  check(
    read("src/lib/legal/crow-legal-v1-1-content.ts").includes("does **not** represent"),
    "Legal v1.1 explicitly negates unsupported certification claims",
    "Legal v1.1 missing certification negation language"
  );
  check(!forbiddenHit, "No unsupported certification claims in scanned surfaces", forbiddenHit ?? "Forbidden claim found");

  console.log("\n--- v1.1 document integrity hashes (canonical content, pre-interpolation) ---\n");
  for (const doc of CROW_LEGAL_V1_1_DOCUMENTS) {
    console.log(`  ${doc.documentType}: ${hashLegalDocumentContent(doc.contentBody)}`);
  }

  console.log("");
  if (passed) {
    console.log("PASS — CROW LEGAL V1.1, SECURITY-TRUST POSITIONING AND DISCOVERY BOUNDARIES VERIFIED\n");
    process.exit(0);
  } else {
    console.error("FAILED — see errors above\n");
    process.exit(1);
  }
}

main();
