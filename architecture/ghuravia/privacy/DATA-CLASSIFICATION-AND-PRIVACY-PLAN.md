# Data Classification and Privacy Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-PRIV-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §33 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-022 · SPK-ARC-025 · SPK-ARC-020 |
| **Related** | [DATA-ARCHITECTURE-VALIDATION-PLAN.md](../data/DATA-ARCHITECTURE-VALIDATION-PLAN.md) · Progression data minimization |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO final legal claims · NOT legal advice
NO Product Code
```

## 1. Classification scale

| Class | Meaning (architectural) |
|-------|-------------------------|
| **PUBLIC** | Intended for unrestricted display when published |
| **INTERNAL** | Staff/ops; not end-user public |
| **CONFIDENTIAL** | User or business sensitive; need-to-know |
| **RESTRICTED** | Elevated sensitivity (identity, moderation, reviews) |
| **HIGHLY_RESTRICTED** | Payment, legal identity, Evidence objects |
| **PROHIBITED** | Must not be collected / stored (policy) |

## 2. Data category mapping

| Category | Class (typical) | Purpose | Minimization | Retention (draft) | Access | Export | Deletion | Audit | Public display | Age-sensitive | Cross-border | Validation |
|----------|-----------------|---------|--------------|-------------------|--------|--------|----------|-------|----------------|---------------|--------------|------------|
| Public Crow identity | PUBLIC–CONFIDENTIAL | Presence | Display fields only | Account life | Self + public rules | Yes | Anonymize | Changes | Username/avatar rules | Yes | Question open | SPK-ARC-025 |
| Private legal identity | HIGHLY_RESTRICTED | Legal/compliance | Collect only if required | Legal | Privileged | Limited | Legal hold | **Yes** | **Never** | Yes | Question open | SPK-ARC-025 |
| Email | CONFIDENTIAL–RESTRICTED | Auth/activation | One primary | Account life | Self + support | Yes | Policy | Yes | Masked | — | — | SPK-ARC-003 |
| Phone | CONFIDENTIAL | Optional verify | Optional | Policy | Self + support | Yes | Policy | Yes | No | — | — | SPK-ARC-003 |
| Age category | RESTRICTED | Safety | Category > DOB if possible | Policy | Restricted | Limited | Policy | Yes | No raw DOB | **Critical** | — | SPK-ARC-025 |
| Activation state | CONFIDENTIAL | Gate access | Formula fields only | Account life | Self | Partial | With account | Yes | Status only | — | — | SPK-ARC-003 |
| Learning history | CONFIDENTIAL | Progress | Need-to-know | Progress life | Self | Yes | Policy | Key events | Limited badges | — | — | SPK-ARC-006 |
| Evidence | RESTRICTED–HIGHLY_RESTRICTED | Assessment | Synthetic where required | Policy | Reviewer scoped | Limited | Cascaded | **Yes** | Sanitized only | Yes | Region TBD | SPK-ARC-007 |
| Reviewer notes | RESTRICTED | Quality | Rubric-bound | Policy | Reviewers/admins | No public | Redact | **Yes** | No | — | — | SPK-ARC-009 |
| Moderation | RESTRICTED | Safety | Case minimum | Legal/safety | Mods/admins | No | Restricted | **Yes** | No | Yes | — | SPK-ARC-013 |
| Trust | RESTRICTED | Integrity | Non-public | Policy | Restricted | Limited | Policy | **Yes** | No raw score public | — | — | SPK-ARC-013 |
| Progression | CONFIDENTIAL | Standing | Event-minimized | Long | Self summary | Summary | Compensating | Yes | Public boards opt rules | — | — | SPK-ARC-010 · 024 |
| Payments | HIGHLY_RESTRICTED | Commerce | Tokenize; no PAN store if avoidable | Legal | Finance | Limited | Legal | **Yes** | Never | — | Provider rules | SPK-ARC-012 |
| Invoices | HIGHLY_RESTRICTED | Tax | Legal fields | Legal | Finance + subject | Yes | Legal | **Yes** | Own invoices | — | VAT | SPK-ARC-012 |
| Support records | CONFIDENTIAL–RESTRICTED | Support | Ticket minimum | Policy | Support | Limited | Policy | Yes | No | Yes | — | SPK-ARC-022 |
| Operational telemetry | INTERNAL | Reliability | Privacy-safe; no unnecessary PII | Short | Ops | No | Aggressive | Sampling | No | Strip PII | — | SPK-ARC-022 |

## 3. Cross-border question

Hosting and subprocessors for Saudi controlled launch remain **VALIDATION REQUIRED / PENDING EXTERNAL VALIDATION**. Do not assert residency compliance in 1A.

## 4. Limitations

```text
ARCHITECTURAL CLASSIFICATION ONLY · NOT RUN · NOT LEGAL ADVICE
```

## 5. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §33 — data classification and privacy plan |
