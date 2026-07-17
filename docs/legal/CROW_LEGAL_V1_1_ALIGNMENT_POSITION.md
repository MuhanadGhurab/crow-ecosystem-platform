# Crow Legal v1.1 — ISO, NCA, and PDPL alignment position

**Status:** Draft for qualified counsel review — not final legally approved terms.

## Positioning rule

Crow may state that its security and governance program is **designed with reference to**:

- ISO/IEC 27001:2022
- ISO/IEC 27002:2022
- ISO/IEC 27701:2025
- applicable NCA Essential Cybersecurity Controls
- applicable NCA Data Cybersecurity Controls
- applicable NCA Cloud Cybersecurity Controls
- Saudi Personal Data Protection Law and its implementing framework

Crow must **not** state that it is ISO certified, NCA certified, universally NCA compliant, guaranteed PDPL compliant, or approved by a regulator unless an authorized current assessment supports that exact statement.

## Required user-facing language

> Designed with reference to recognized international standards and applicable Saudi cybersecurity and data-protection requirements.

> Alignment does not constitute certification or regulatory approval. Applicability is assessed per service, customer, sector, and deployment.

## Legal versioning (v1.1)

- Three mandatory documents at version **1.1** (`versionNumber` 2): Terms of Service, Privacy Notice, Acceptable Use Policy.
- v1.0 acceptance does **not** satisfy v1.1 (`reacceptancePolicy: required_before_protected_activity`).
- Acceptance evidence is append-only; v1.0 records are preserved.

## Contact placeholders

Until monitored addresses are approved, documents use centrally configured placeholders:

- `LEGAL_CONTACT_EMAIL`
- `PRIVACY_CONTACT_EMAIL`
- `DATA_RIGHTS_CONTACT_EMAIL`
- `SECURITY_CONTACT_EMAIL`
- `ABUSE_CONTACT_EMAIL`
- `CROW_LEGAL_ENTITY_NAME`

Production-readiness verifiers fail if `.example` contact domains appear in releasable legal content.

## Verification

```bash
npm run crow-legal-v1-1:verify
```
