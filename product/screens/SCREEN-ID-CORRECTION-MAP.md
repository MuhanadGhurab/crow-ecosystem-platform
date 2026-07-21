# Screen ID Correction Map

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — CORRECTED BASELINE |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 |
| **Change Request** | **CR-001** |
| **Related** | [MASTER-SCREEN-REGISTRY.md](./MASTER-SCREEN-REGISTRY.md) · [SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md](./SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md) |
| **Prior registry** | v1.0.0 — 90 screen IDs |
| **Corrected registry** | v1.1.0 — **92 screen IDs** |

```text
NO SILENT REWRITE · NO GLOBAL RENUMBERING · PRESERVE ALL NON-ACT CANONICAL IDs
ACT-004 PRESERVED AS SUPERSEDED_ALIAS · NET +2 (ACT-011, ACT-012)
```

---

## Purpose

Map every Activation (ACT) identity change under GHV.BASELINE-CORRECTION.1 so journeys, wireframes, and future Product Code can reconcile historical references without inventing new IDs or deleting superseded ones.

---

## Locked ID correction model

| Previous ID | Previous title | Treatment | Corrected ID | Corrected title | Registry status |
|-------------|----------------|-----------|--------------|-----------------|-----------------|
| ACT-003 | Verify Email Prompt | **RETAINED** — rename | ACT-003 | **Email Verification Pending** | ACTIVE — CORRECTED |
| ACT-004 | Email Verified | **SUPERSEDED historical alias** — do not delete | ACT-004 | Email Verified *(alias)* | **SUPERSEDED_ALIAS** |
| — | — | **NEW** | ACT-011 | **Email Verification Result** | ACTIVE — NEW |
| — | — | **NEW** | ACT-012 | **Activation Recovery** | ACTIVE — NEW |

Semantics formerly implied by ACT-004 success are now provided by **ACT-011** state **VERIFIED**.

---

## Full old → new mapping

| Old reference | Old meaning | New canonical target | Reason | Historical compatibility |
|---------------|-------------|----------------------|--------|--------------------------|
| ACT-003 “Verify Email Prompt” | Await email after register | **ACT-003** “Email Verification Pending” | Defect A — Pending must be explicit and named | Same ID; title + exit map updated |
| ACT-003 → ACT-004 (success exit) | Prompt exits to “Email Verified” | **ACT-003 → ACT-011** (token consume) | Result outcomes are not a single success screen | Flows that assumed ACT-004 success must call ACT-011 |
| ACT-004 “Email Verified” | Confirm email / continue to terms | **ACT-011** (VERIFIED) → **ACT-005** | Defect A — Result screen owns outcomes | **ACT-004** remains; entry/exit **redirect to ACT-011** |
| ACT-005 entry “from ACT-004” | Terms after verified | **ACT-005** entry from **ACT-011 VERIFIED** | Align terms gate to Result | Alias ACT-004 still reaches ACT-005 only via ACT-011 redirect |
| “Interrupted onboarding resumes via last incomplete ONB/ACT (no separate screen ID)” | No Activation Recovery ID | **ACT-012** for activation interruptions; ONB may still resume last incomplete ONB | Defect B | Docs/journeys that cited the old note must point to ACT-012 for ACT interrupts |
| *(missing)* Email Verification Result | Not in v1.0.0 registry | **ACT-011** | Authoritative 92-screen inventory | New ID only — no renumber of peers |
| *(missing)* Activation Recovery | Not in v1.0.0 registry | **ACT-012** | Authoritative 92-screen inventory | New ID only — no renumber of peers |
| ACT-001…ACT-002, ACT-005…ACT-010 | Unchanged identities | Same IDs | Preserve canonical set | Unchanged |
| All PUB / ONB / IDN / LRN / SKY / WLD / COM / LIV / PRG / PAY / TRU / ADM | Unchanged | Same IDs | No global renumbering | Unchanged |

---

## ACT-004 supersession treatment

| Rule | Requirement |
|------|-------------|
| Delete ID? | **No** — ACT-004 remains a registry record |
| Status | **SUPERSEDED_ALIAS** |
| Count | **Included** in Activation = 12 and Total = 92 |
| UX destination | Not a distinct controlled-launch destination |
| Entry | Any link/flow targeting ACT-004 → **redirect ACT-011** |
| Exit / primary action | Same redirect; VERIFIED continue path is ACT-011 → ACT-005 |
| Implementation | Must not ship a parallel “Email Verified” success path that skips ACT-011 outcome handling |
| Assurance | Alias must not grant A1, tenant membership, or elevated assurance |

---

## Affected flows

| Flow | Before (v1.0.0) | After (v1.1.0) |
|------|-----------------|----------------|
| Register → verify email | ACT-002 → ACT-003 → ACT-004 → ACT-005 | ACT-002 → **ACT-003** → **ACT-011** → ACT-005 (on VERIFIED) |
| Verification token outcomes | Implicit success on ACT-004 only | **ACT-011**: VERIFIED, EXPIRED, INVALID, ALREADY_USED, SUPERSEDED, RISK_REVIEW_REQUIRED |
| Pending management | ACT-003 prompt only | ACT-003 Pending states: MESSAGE_SENT, RESEND_AVAILABLE, RESEND_COOLDOWN, DELIVERY_DELAYED, ADDRESS_CORRECTION_AVAILABLE, REQUEST_EXPIRED, HELP_AVAILABLE *(no final timers in this Gate)* |
| Verification failure / retry | Unclear / back to ACT-003 only | Failures → **ACT-003** and/or **ACT-012** |
| Interrupted activation | “Last incomplete ACT” (no ID) | **ACT-012** diagnosis → resume ACT-003 / ACT-011 / ACT-005 / ACT-009 / ACT-010 / support |
| Interrupted onboarding | Last incomplete ONB/ACT | Last incomplete **ONB** (and IDN-001…003); activation interrupts use **ACT-012** |
| Account / password recovery | TRU-005 | **Unchanged** — ACT-012 does **not** replace TRU-005 |
| Risk block | ACT-009 | ACT-009 retained; may hand off to ACT-012 when recovery diagnosis is needed |

---

## Canonical Activation ID list (post-correction)

| ID | Title | Status |
|----|-------|--------|
| ACT-001 | Create Your Crow | ACTIVE |
| ACT-002 | Create Account | ACTIVE |
| ACT-003 | Email Verification Pending | ACTIVE — CORRECTED |
| ACT-004 | Email Verified | **SUPERSEDED_ALIAS** |
| ACT-005 | Accept Mandatory Terms | ACTIVE |
| ACT-006 | Basic Account Activated | ACTIVE |
| ACT-007 | Mobile Verify Now/Later | ACTIVE |
| ACT-008 | Mobile OTP | ACTIVE |
| ACT-009 | Activation Blocked | ACTIVE |
| ACT-010 | Sign In | ACTIVE |
| ACT-011 | Email Verification Result | ACTIVE — NEW |
| ACT-012 | Activation Recovery | ACTIVE — NEW |

**Activation count = 12. Registry total = 92.**

---

## Unchanged families (summary)

All IDs outside ACT-003/004 treatment and the ACT-011/012 additions are **unchanged**:

PUB-001…008 · ACT-001, ACT-002, ACT-005…010 · IDN-001…006 · ONB-001…011 · LRN-001…012 · SKY-001 · WLD-001…003 · COM-001…008 · LIV-001…006 · PRG-001…006 · PAY-001…006 · TRU-001…006 · ADM-001…007

---

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 / CR-001 — publish old→new map; ACT-004 supersession; Defect A/B |
