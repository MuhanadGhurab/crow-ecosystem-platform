# Screen ID Correction Map

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — CORRECTED BASELINE (alias-safe) |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 · amended **CR-002** |
| **Change Request** | **CR-001** · **CR-002** |
| **Related** | [MASTER-SCREEN-REGISTRY.md](./MASTER-SCREEN-REGISTRY.md) · [SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md](./SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md) |
| **Prior registry** | v1.1.0 — 92 table rows including ACT-004 alias |
| **Corrected registry** | v1.2.0 — **92 ACTIVE** · **0 aliases** in inventory |

```text
NO SILENT REWRITE · NO GLOBAL RENUMBERING
ACT-004 PRESERVED AS HISTORICAL ALIAS APPENDIX ONLY (does NOT count)
ACT-013 NEW ACTIVE — Accept Account Risk
NET GOVERNED TOTAL REMAINS 92
```

---

## Purpose

Map Activation (ACT) identity changes under GHV.BASELINE-CORRECTION.1 and CR-002 so journeys, wireframes, and Architecture Gate counting remain alias-safe without inventing email-verification duplicates.

---

## Locked ID correction model

| Previous ID | Previous title | Treatment | Corrected ID | Corrected title | Registry status |
|-------------|----------------|-----------|--------------|-----------------|-----------------|
| ACT-003 | Verify Email Prompt | **RETAINED** — rename | ACT-003 | **Email Verification Pending** | ACTIVE |
| ACT-004 | Email Verified | **Historical alias** — appendix only; do not delete ID | ACT-004 | Email Verified *(alias)* | **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** (not in inventory) |
| — | — | **NEW** (CR-001) | ACT-011 | **Email Verification Result** | ACTIVE |
| — | — | **NEW** (CR-001) | ACT-012 | **Activation Recovery** | ACTIVE |
| — | — | **NEW** (CR-002) | ACT-013 | **Accept Account Risk** | ACTIVE — NEW |

Semantics formerly implied by ACT-004 success are provided by **ACT-011** state **VERIFIED**. Risk acceptance formerly folded into ACT-006 entry is provided by **ACT-013**.

---

## Full old → new mapping

| Old reference | Old meaning | New canonical target | Reason | Historical compatibility |
|---------------|-------------|----------------------|--------|--------------------------|
| ACT-003 “Verify Email Prompt” | Await email after register | **ACT-003** “Email Verification Pending” | Defect A | Same ID |
| ACT-003 → ACT-004 (success exit) | Prompt exits to “Email Verified” | **ACT-003 → ACT-011** | Result outcomes | Flows must call ACT-011 |
| ACT-004 “Email Verified” | Confirm email / continue to terms | **ACT-011** (VERIFIED) → **ACT-005** | Defect A | ACT-004 redirects to ACT-011; **does not count** |
| ACT-005 → ACT-006 (v1.1.0) | Terms then activated | **ACT-005 → ACT-013 → ACT-006** | Scope risk formula | Risk no longer implicit on ACT-006 alone |
| ACT-005 entry “from ACT-004” | Terms after verified | **ACT-005** from **ACT-011 VERIFIED** | Align terms gate | Alias reaches ACT-005 only via ACT-011 |
| Interrupted activation | No Recovery ID / last incomplete | **ACT-012** | Defect B | Unchanged |
| *(missing)* Accept Account Risk | Folded into ACT-006 | **ACT-013** | CR-002 / Scope formula | New ID only |
| ACT-001…002, 005…010 (pre-CR-002) | Unchanged identities | Same IDs (+ ACT-013) | Preserve set | Unchanged titles/roles for ACT-003/011/012 |

---

## ACT-004 supersession treatment (CR-002)

| Rule | Requirement |
|------|-------------|
| Delete ID? | **No** — ACT-004 remains documented |
| Location | **Historical Alias Appendix** only (not inventory table) |
| Status | **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** |
| Count | **Excluded** from Activation = 12 ACTIVE and Total = 92 |
| UX destination | Not a distinct controlled-launch destination |
| Entry | Any link/flow targeting ACT-004 → **redirect ACT-011** |
| Exit / primary action | Same redirect; VERIFIED continue path is ACT-011 → ACT-005 |
| Implementation | Must not ship a parallel “Email Verified” success path that skips ACT-011 |
| Assurance | Alias must not grant A1, tenant membership, or elevated assurance |

---

## ACT-013 treatment (CR-002)

| Rule | Requirement |
|------|-------------|
| Status | **ACTIVE** — CONTROLLED LAUNCH |
| Purpose | `account_risk_status = acceptable` |
| Entry | After ACT-005; or ACT-012 when TERMS done / risk incomplete |
| Exit | acceptable → ACT-006; else ACT-009 / ACT-012 |
| Grants | **None** — no entitlement, XP, Mastery, or tenant membership |
| Not | An email-verification screen |

---

## Affected flows

| Flow | After CR-001 (v1.1.0) | After CR-002 (v1.2.0) |
|------|----------------------|------------------------|
| Register → activate | … ACT-003 → ACT-011 → ACT-005 → ACT-006 … | … ACT-003 → ACT-011 → ACT-005 → **ACT-013** → ACT-006 … |
| Risk deny | Implicit at ACT-006 / ACT-009 | Explicit **ACT-013** → ACT-009 / ACT-012 |
| Interrupted activation | ACT-012 | ACT-012 (+ RISK_ACCEPTANCE_INCOMPLETE → ACT-013) |
| ACT-004 routing | SUPERSEDED_ALIAS in table | Appendix only; redirect ACT-011 |

---

## Canonical Activation ID list (post-CR-002)

### Inventory table (counts toward 92)

| ID | Title | Status |
|----|-------|--------|
| ACT-001 | Create Your Crow | ACTIVE |
| ACT-002 | Create Account | ACTIVE |
| ACT-003 | Email Verification Pending | ACTIVE |
| ACT-005 | Accept Mandatory Terms | ACTIVE |
| ACT-006 | Basic Account Activated | ACTIVE |
| ACT-007 | Mobile Verify Now/Later | ACTIVE |
| ACT-008 | Mobile OTP | ACTIVE |
| ACT-009 | Activation Blocked | ACTIVE |
| ACT-010 | Sign In | ACTIVE |
| ACT-011 | Email Verification Result | ACTIVE |
| ACT-012 | Activation Recovery | ACTIVE |
| ACT-013 | Accept Account Risk | ACTIVE — NEW |

**Activation ACTIVE count = 12. Registry ACTIVE total = 92. Aliases in inventory = 0.**

### Historical Alias Appendix (does NOT count)

| ID | Title | Status |
|----|-------|--------|
| ACT-004 | Email Verified | HISTORICAL_REFERENCE / SUPERSEDED_ALIAS → ACT-011 |

---

## Unchanged families (summary)

PUB-001…008 · IDN-001…006 · ONB-001…011 · LRN-001…012 · SKY-001 · WLD-001…003 · COM-001…008 · LIV-001…006 · PRG-001…006 · PAY-001…006 · TRU-001…006 · ADM-001…007

ACT-003, ACT-011, ACT-012 titles/roles **unchanged** under CR-002.

---

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 / CR-001 — ACT-004 supersession; Defect A/B |
| 1.1.0 | 2026-07-21 | CR-002 — ACT-004 appendix (non-counting); ACT-013 NEW; alias-safe 92 |
