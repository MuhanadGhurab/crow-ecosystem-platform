# Saudi Integration Readiness Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-INT-SA-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §34 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-003 · SPK-ARC-012 · SPK-ARC-021 |
| **Related** | SCOPE trusted external identity = POST-LAUNCH / CONDITIONAL |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
PLANNED CAPABILITIES — NOT GUARANTEED APIs
Do not assume direct access to government APIs
Nafath / Absher / GOSI are readiness questions, not commitments
NO Product Code · NO vendor lock without evidence
```

## 1. Purpose

Assess readiness questions for Saudi-relevant integrations as **capabilities with unknowns**, using adapter boundaries and mocks — never assuming API entitlement.

## 2. Integration readiness register

| Capability | Use case | Controlled launch required? | Provider availability unknowns | Consent | Security | Audit | Fallback | Adapter boundary | Mock/sandbox need | Legal dependency | Spike priority |
|------------|----------|----------------------------|--------------------------------|---------|----------|-------|----------|------------------|-------------------|------------------|----------------|
| National SSO / **Nafath** (where officially supported) | Higher assurance login / verify | **No** for basic activation formula; CONDITIONAL/POST-LAUNCH per Scope | Eligibility, APIs, onboarding, commercial terms **UNKNOWN** | Explicit user consent | OIDC-like patterns TBD | Login/assurance events | Passkey/email activation path | `IdentityAssuranceAdapter` | **Yes** before any claim | PENDING EXTERNAL | P2–P3 |
| **Absher**-related workflows (where officially supported) | Citizen/resident workflows if ever in Scope | **Not** assumed for launch | Channel availability **UNKNOWN**; may be indirect | Strong consent | High | Mandatory | Manual verified alternative or defer | `GovWorkflowAdapter` | **Yes** | PENDING EXTERNAL | P3 |
| **GOSI**-related enterprise workflows (where applicable) | Employer/enterprise verification | Enterprise CONDITIONAL | Coverage, API, contracts **UNKNOWN** | Org + user | High | Mandatory | Manual enterprise SSO / defer | `EnterpriseIdentityAdapter` | **Yes** | PENDING EXTERNAL | P3 |
| Saudi payment providers | Collect pay; VAT-aware | Launch commercial needs | Provider fit TBD | Checkout consent | PCI-aware design | Payment + entitlement | Alternate provider via adapter | `PaymentsAdapter` | Sandbox | Tax/legal | P0–P1 (SPK-ARC-012) |
| VAT invoicing | Compliant invoices | Commercial launch | Fields/provider support TBD | — | Finance restricted | Invoice audit | Manual invoice ops (temporary) | `InvoicingAdapter` | Sample payloads | Accountant EXT | P1 |
| Saudi data/privacy requirements | Residency, PDPL-aligned design intent | Architecture constraint | Interpretation **legal TBD** | Notices | Encryption; access | Processing records | Defer features | Policy pack | — | Lawyer EXT | P1 |
| Arabic identity data | Names, display | Launch | Encoding/normalization | — | Classification | Changes | Latin fallback display rules | Profile validators | Fixtures | — | P1 (SPK-ARC-002) |
| Mobile-verification providers | ACT-007/008 optional path | Policy-driven; not formula substitute | Delivery rates TBD | User | OTP security | Verify events | Skip/later per Scope | `MobileVerifyAdapter` | Sandbox | Telecom regs | P2 |
| Enterprise SSO | B2B tenants later | POST-LAUNCH / CONDITIONAL | Protocol mix | Org admin | Federation security | SSO audit | Local accounts | `EnterpriseSSOAdapter` | Mock IdP | Contracts | P3 |
| Gov/regulated audit requirements | Evidence for audits | If regulated customers | Evidence format UNKNOWN | — | Immutable audit | Audit export | Manual packs | `AuditExportAdapter` | Sample | Legal | P3 |

## 3. Readiness questions (must remain questions until evidenced)

1. Is official programmatic access available for Nafath/Absher/GOSI for this product class?
2. What onboarding, fees, and data-sharing terms apply?
3. What is the fallback if access is denied or delayed?
4. Does controlled launch still succeed on email+terms+risk activation without these?

**Answer for (4) per Scope:** Yes — basic activation does **not** require Nafath/Absher/GOSI.

## 4. Hard rules

* Planned capability ≠ guaranteed API.
* No production calls to government systems from 1A (none exist).
* Adapter + mock first; brand selection only with evidence.

## 5. Limitations

```text
READINESS PLAN ONLY · NOT RUN · DECISION PENDING
NOT an integration contract · NOT regulatory approval
```

## 6. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §34 — Saudi integration readiness plan |
