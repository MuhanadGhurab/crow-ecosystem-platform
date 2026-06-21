/**
 * Crow security, privacy, and compliance positioning — advisory only; not certification claims.
 */

export const COMPLIANCE_ALIGNMENT_STATEMENT =
  "Designed with reference to recognized international standards and applicable Saudi cybersecurity and data-protection requirements." as const;

export const COMPLIANCE_ALIGNMENT_DISCLAIMER =
  "Alignment does not constitute certification or regulatory approval. Applicability is assessed per service, customer, sector, and deployment." as const;

export const COMPLIANCE_REFERENCE_STANDARDS = [
  "ISO/IEC 27001:2022",
  "ISO/IEC 27002:2022",
  "ISO/IEC 27701:2025",
  "applicable NCA Essential Cybersecurity Controls",
  "applicable NCA Data Cybersecurity Controls",
  "applicable NCA Cloud Cybersecurity Controls",
  "Saudi Personal Data Protection Law and its implementing framework",
] as const;

/** Phrases that must not appear in user-facing copy without authorized evidence. */
export const FORBIDDEN_UNSUPPORTED_COMPLIANCE_CLAIMS = [
  "ISO certified",
  "NCA certified",
  "universally NCA compliant",
  "guaranteed PDPL compliant",
  "approved by a regulator",
  "PDPL approved",
  "NCA compliant",
] as const;

export const DISCOVERY_COMPLIANCE_BOUNDARY =
  "CyberCrow recommendations may support security and compliance planning, but they do not constitute certification, regulatory approval, legal advice, or confirmation that the organization complies with ISO, NCA, PDPL, or sector-specific requirements." as const;

export const DISCOVERY_SENSITIVE_DATA_WARNING =
  "Do not enter passwords, private keys, authentication codes, production credentials, classified information, or regulated personal data in this form. ProCrow will provide an approved secure channel when sensitive evidence is required." as const;

export const DISCOVERY_AUTHORITY_CONFIRMATION_VERSION = "1.0" as const;

export const DISCOVERY_AUTHORITY_CONFIRMATION_TEXT =
  "By submitting, you confirm that you are authorized to provide this organization's information and request Crow services on its behalf." as const;

/** Advisory readiness labels for discovery security selections — not compliance verdicts. */
export const DISCOVERY_READINESS_LABELS = [
  "Alignment target",
  "Readiness status",
  "Evidence required",
  "Not assessed",
  "Partially evidenced",
  "ProCrow review required",
] as const;

export const DISCOVERY_FORBIDDEN_COMPLIANCE_LABELS = [
  "NCA compliant",
  "ISO certified",
  "PDPL approved",
] as const;
