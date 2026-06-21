/**
 * Crow Legal v1.1 — approved package bodies (placeholder contacts until counsel configures).
 * Do not paraphrase away material protections. Counsel review required before production release.
 */

import type { LegalDocumentType, MandatoryClassification } from "@prisma/client";

export const CROW_LEGAL_V1_1_SEMVER = "1.1" as const;
export const CROW_LEGAL_V1_1_VERSION_NUMBER = 2 as const;

export type CrowLegalV11Document = {
  documentType: LegalDocumentType;
  title: string;
  mandatoryClassification: MandatoryClassification;
  contentBody: string;
};

const ENTITY = "{{CROW_LEGAL_ENTITY_NAME}}";
const LEGAL = "{{LEGAL_CONTACT_EMAIL}}";
const PRIVACY = "{{PRIVACY_CONTACT_EMAIL}}";
const DATA_RIGHTS = "{{DATA_RIGHTS_CONTACT_EMAIL}}";
const SECURITY = "{{SECURITY_CONTACT_EMAIL}}";
const ABUSE = "{{ABUSE_CONTACT_EMAIL}}";

const ALIGNMENT =
  "Crow's security and governance program is designed with reference to ISO/IEC 27001:2022, ISO/IEC 27002:2022, ISO/IEC 27701:2025, applicable NCA Essential Cybersecurity Controls, applicable NCA Data Cybersecurity Controls, applicable NCA Cloud Cybersecurity Controls, and the Saudi Personal Data Protection Law and its implementing framework.";

const ALIGNMENT_DISCLAIMER =
  "Designed with reference to recognized international standards and applicable Saudi cybersecurity and data-protection requirements. Alignment does not constitute certification or regulatory approval. Applicability is assessed per service, customer, sector, and deployment.";

export const CROW_LEGAL_V1_1_DOCUMENTS: readonly CrowLegalV11Document[] = [
  {
    documentType: "TERMS_OF_SERVICE",
    title: "Crow Platform Terms of Service — Version 1.1",
    mandatoryClassification: "mandatory_contractual",
    contentBody: `# Crow Platform Terms of Service

**Version 1.1 — Effective upon publication**

## 1. Agreement

By creating or continuing to use a Crow platform account operated by ${ENTITY} ("Crow", "we", "us"), you agree to these Terms of Service, our Privacy Notice, and the Acceptable Use Policy. If you do not agree, do not use protected platform services.

## 2. Platform scope

These terms govern access to Crow's universal platform account, self-service requester flows, and Client Portal capabilities that do not yet have a separate enterprise or tenant agreement. Organization-level ERP, tenant runtime, and commercial contracts may impose additional terms that prevail where explicitly stated.

## 3. Account responsibilities

You must provide accurate registration information, safeguard your credentials, notify us promptly of unauthorized access, and ensure that anyone acting through your account is authorized to do so on behalf of the organization you represent.

## 4. Security and governance

${ALIGNMENT}

${ALIGNMENT_DISCLAIMER}

Crow does **not** represent that the platform is ISO certified, NCA certified, universally NCA compliant, guaranteed PDPL compliant, or approved by any regulator unless a separate written attestation explicitly states otherwise for your deployment.

## 5. Acceptable use

You will comply with the Acceptable Use Policy. You must not submit passwords, private keys, authentication codes, production credentials, classified information, or regulated personal data through unsecured intake forms when Crow has designated a secure channel.

## 6. Service changes and legal versions

We may update platform features and publish new legal document versions. Material changes may require reacceptance before protected activity. Prior acceptance evidence remains append-only and is not overwritten.

## 7. No automatic production or billing

Discovery submission, proposal review, blueprint work, or legal acceptance does **not** by itself activate billing, tenant production runtime, or additional authority beyond what your role explicitly grants.

## 8. Suspension and termination

We may suspend or close accounts that violate these terms, applicable law, or pose a security risk, subject to applicable notice requirements.

## 9. Limitation of liability

To the maximum extent permitted by law, Crow provides the platform "as is" and limits liability as permitted under the governing law identified in your commercial relationship or, absent such identification, the laws applicable to ${ENTITY}.

## 10. Contact

Legal inquiries: ${LEGAL}
`,
  },
  {
    documentType: "PRIVACY_NOTICE",
    title: "Crow Platform Privacy Notice — Version 1.1",
    mandatoryClassification: "mandatory_notice",
    contentBody: `# Crow Platform Privacy Notice

**Version 1.1 — Effective upon publication**

## 1. Overview

This notice explains how ${ENTITY} ("Crow") processes personal data when you register for or use a Crow platform account and related requester services. It is designed with reference to ISO/IEC 27701:2025 privacy management concepts and the Saudi Personal Data Protection Law (PDPL) and its implementing framework.

${ALIGNMENT_DISCLAIMER}

This notice does **not** state that Crow or your organization is PDPL approved or certified unless a separate authorized assessment supports that statement for your deployment.

## 2. Data we collect

- Account identifiers (email, authentication subject identifier)
- Profile and organization context you choose to provide
- Legal acceptance evidence (document version, integrity hash, timestamp, locale, method)
- Optional marketing consent preference (separate from contractual terms)
- Technical metadata (truncated user agent summary and correlation identifiers for audit)

## 3. Purposes and legal bases

- **Account operation and security** — registration, authentication, fraud prevention, and access control
- **Legal compliance** — demonstrating acceptance of mandatory documents and consent choices
- **Service delivery** — implementation requests, discovery, and Client Portal workflows you initiate
- **Optional marketing** — product updates where you have explicitly opted in

## 4. PDPL-oriented rights

Depending on your relationship and applicable law, you may have rights to access, correct, delete, or restrict processing of your personal data, and to withdraw consent where processing is consent-based. Mandatory contractual terms cannot be withdrawn while you continue to use protected services that require them.

Data subject requests: ${DATA_RIGHTS}

## 5. Retention

Acceptance and audit records are append-only and retained for compliance, dispute resolution, and security investigations according to Crow retention schedules.

## 6. Transfers and subprocessors

Crow may use infrastructure and subprocessors subject to contractual safeguards appropriate to the service. Details for enterprise deployments are provided in commercial agreements.

## 7. Marketing consent

Marketing email consent is optional and managed separately on your account legal page. Withdrawing marketing consent does not deactivate your account or erase mandatory contractual acceptance records.

## 8. Security measures

Crow implements administrative, technical, and organizational measures designed with reference to recognized security standards. Details are summarized in our Security & Trust materials. No description herein constitutes a certification claim.

Security inquiries: ${SECURITY}

## 9. Contact

Privacy inquiries: ${PRIVACY}
`,
  },
  {
    documentType: "ACCEPTABLE_USE_POLICY",
    title: "Crow Acceptable Use Policy — Version 1.1",
    mandatoryClassification: "mandatory_contractual",
    contentBody: `# Crow Acceptable Use Policy

**Version 1.1 — Effective upon publication**

## 1. Purpose

This policy defines permitted and prohibited uses of the Crow platform operated by ${ENTITY}. It applies to all platform accounts and requester surfaces unless superseded by a signed enterprise agreement.

## 2. Permitted use

Use the platform for lawful business requests, authorized discovery and blueprint collaboration, and Crow ecosystem services your role entitles you to access.

## 3. Prohibited use

You must not:

- Attempt unauthorized access to systems, tenants, or data
- Upload malware or interfere with platform availability
- Harass users or submit fraudulent or misleading requests
- Scrape or automate access in violation of rate limits or contracts
- Misrepresent your authority to bind an organization
- Enter passwords, private keys, authentication codes, production credentials, classified information, or regulated personal data in unsecured forms when a secure channel is available

## 4. Sensitive information

ProCrow will provide an approved secure channel when sensitive evidence is required. Until then, limit discovery and intake forms to non-sensitive organizational context.

## 5. Compliance boundaries

CyberCrow recommendations and discovery selections support security planning. They do **not** constitute certification, regulatory approval, legal advice, or confirmation that you comply with ISO, NCA, PDPL, or sector-specific requirements.

## 6. Enforcement

Violations may result in suspension or closure of your platform account and referral to appropriate authorities where required by law.

## 7. Reporting

Security concerns: ${SECURITY}

Abuse reports: ${ABUSE}
`,
  },
] as const;

export function getCrowLegalV11Document(type: LegalDocumentType): CrowLegalV11Document | undefined {
  return CROW_LEGAL_V1_1_DOCUMENTS.find((d) => d.documentType === type);
}
