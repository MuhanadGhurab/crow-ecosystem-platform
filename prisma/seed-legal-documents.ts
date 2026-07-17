import type { LegalDocumentType, MandatoryClassification, PrismaClient } from "@prisma/client";
import { hashLegalDocumentContent } from "../src/lib/legal/legal-document-hash";
import { seedLegalV11DraftVersions } from "../src/lib/legal/legal-publication.service";
import {
  assertNoExampleLegalContacts,
  interpolateLegalContactPlaceholders,
} from "../src/lib/legal/legal-contact-config";

const LOCALE = "en-US";
const AUDIENCE = "platform_requester" as const;

type SeedDoc = {
  documentType: LegalDocumentType;
  title: string;
  mandatoryClassification: MandatoryClassification;
  contentBody: string;
  versionNumber: number;
  reacceptancePolicy: "none" | "required_before_protected_activity";
};

const V1_DOCUMENTS: SeedDoc[] = [
  {
    documentType: "TERMS_OF_SERVICE",
    title: "Crow Platform Terms of Service",
    mandatoryClassification: "mandatory_contractual",
    versionNumber: 1,
    reacceptancePolicy: "none",
    contentBody: `# Crow Platform Terms of Service

**Version 1.0 — Effective upon publication**

## 1. Agreement

By creating a Crow platform account you agree to these Terms of Service, our Privacy Notice, and the Acceptable Use Policy.

## 2. Platform scope

These terms govern access to Crow's universal platform account and self-service requester flows. They do not replace separate enterprise, tenant, or ERP agreements.

## 3. Account responsibilities

You must provide accurate registration information, safeguard your credentials, and notify us of unauthorized access.

## 4. Acceptable use

You will comply with the Acceptable Use Policy. We may suspend accounts that violate platform rules or applicable law.

## 5. Service changes

We may update platform features and publish new legal versions. Material changes may require reacceptance before protected activity.

## 6. Limitation of liability

To the maximum extent permitted by law, Crow provides the platform "as is" and limits liability as described in your governing jurisdiction.

## 7. Contact

Questions about these terms: {{LEGAL_CONTACT_EMAIL}}
`,
  },
  {
    documentType: "PRIVACY_NOTICE",
    title: "Crow Platform Privacy Notice",
    mandatoryClassification: "mandatory_notice",
    versionNumber: 1,
    reacceptancePolicy: "none",
    contentBody: `# Crow Platform Privacy Notice

**Version 1.0 — Effective upon publication**

## 1. Overview

This notice explains how Crow processes personal data when you register for a platform account.

## 2. Data we collect

- Account identifiers (email, Supabase user id)
- Legal acceptance evidence (document version, hash, timestamp, locale)
- Optional marketing consent preference
- Technical metadata (truncated user agent summary for audit)

## 3. Purposes

- Account registration and email verification
- Legal compliance and evidence retention
- Optional marketing communications (only with explicit opt-in)

## 4. Retention

Acceptance records are append-only and retained for compliance and dispute resolution.

## 5. Your choices

You may withdraw marketing consent from your account legal page without deactivating your account.

## 6. Contact

Privacy inquiries: {{PRIVACY_CONTACT_EMAIL}}
`,
  },
  {
    documentType: "ACCEPTABLE_USE_POLICY",
    title: "Crow Acceptable Use Policy",
    mandatoryClassification: "mandatory_contractual",
    versionNumber: 1,
    reacceptancePolicy: "none",
    contentBody: `# Crow Acceptable Use Policy

**Version 1.0 — Effective upon publication**

## 1. Purpose

This policy defines permitted and prohibited uses of the Crow platform.

## 2. Permitted use

Use the platform for lawful business requests, collaboration, and authorized Crow ecosystem services.

## 3. Prohibited use

You must not:

- Attempt unauthorized access to systems or data
- Upload malware or interfere with platform availability
- Harass users or submit fraudulent requests
- Scrape or automate access in violation of rate limits or contracts

## 4. Enforcement

Violations may result in suspension or closure of your platform account.

## 5. Reporting

Report abuse to {{ABUSE_CONTACT_EMAIL}}
`,
  },
];

function prepareV1Content(body: string): string {
  const interpolated = interpolateLegalContactPlaceholders(body);
  assertNoExampleLegalContacts(interpolated, "seed legal document v1.0");
  return interpolated;
}

async function seedPublishedVersion(
  prisma: PrismaClient,
  legalDocumentId: string,
  doc: SeedDoc,
  now: Date
): Promise<void> {
  const existingVersion = await prisma.legalDocumentVersion.findFirst({
    where: {
      legalDocumentId,
      versionNumber: doc.versionNumber,
      locale: LOCALE,
      audience: AUDIENCE,
    },
  });

  if (existingVersion) {
    console.log(`  skip ${doc.documentType} v${doc.versionNumber} (${LOCALE}) — already seeded`);
    return;
  }

  const contentBody = prepareV1Content(doc.contentBody);
  const contentSha256 = hashLegalDocumentContent(contentBody);

  await prisma.legalDocumentVersion.create({
    data: {
      legalDocumentId,
      versionNumber: doc.versionNumber,
      locale: LOCALE,
      audience: AUDIENCE,
      title: doc.title,
      contentFormat: "markdown",
      contentBody,
      contentSchemaVersion: "1",
      status: "published",
      mandatoryClassification: doc.mandatoryClassification,
      reacceptancePolicy: doc.reacceptancePolicy,
      effectiveAt: now,
      publishedAt: now,
      contentSha256,
    },
  });

  console.log(`  seeded ${doc.documentType} v${doc.versionNumber} (${LOCALE}) published`);
}

/**
 * Idempotent local seed — publishes v1.0 only. v1.1 remains draft until controlled publication.
 * Do not use for hosted shared-database publication of v1.1.
 */
export async function seedLegalDocuments(prisma: PrismaClient): Promise<void> {
  const now = new Date();

  for (const doc of V1_DOCUMENTS) {
    const legalDocument = await prisma.legalDocument.upsert({
      where: { documentType: doc.documentType },
      create: {
        documentType: doc.documentType,
        title: doc.title,
      },
      update: {},
    });

    await seedPublishedVersion(prisma, legalDocument.id, doc, now);
  }

  await seedLegalV11DraftVersions(prisma);
  console.log("  v1.1 templates seeded as draft only (not current)");
}
