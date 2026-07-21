# Seven-Shell Screen Count Reconciliation

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — CORRECTED BASELINE (alias-safe) |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 · amended **CR-002** |
| **Change Request** | **CR-001** · **CR-002** |
| **Related** | [MASTER-SCREEN-REGISTRY.md](./MASTER-SCREEN-REGISTRY.md) · [SCREEN-ID-CORRECTION-MAP.md](./SCREEN-ID-CORRECTION-MAP.md) · [CROSS-BASELINE-SCREEN-COUNT-DEFECT.md](../progression/governance/CROSS-BASELINE-SCREEN-COUNT-DEFECT.md) · [SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md](../../architecture/ghuravia/validation/SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md) |
| **Authoritative decision** | Seven interface shells · **92 ACTIVE** screens · **0 aliases** in inventory |
| **Prior defective claim** | 90 (registry v1.0.0) |
| **CR-001 claim** | 92 table rows including ACT-004 alias (alias inflation when Architecture rules applied) |
| **Corrected claim** | **92 ACTIVE** (registry v1.2.0) |

```text
8 + 12 + 14 + 39 + 6 + 6 + 7 = 92
ACT-004 HISTORICAL_REFERENCE — does NOT count
ACT-013 NEW ACTIVE — Accept Account Risk
Activation ACTIVE = 12 (ACT-001…003, 005…013)
NO email-verification duplicate
```

---

## Purpose

Reconcile previous vs corrected screen counts **per experience shell** under alias-safe Architecture Gate counting so GHV.ARCHITECTURE.1A is not blocked by alias inflation.

---

## Headline reconciliation

| Metric | v1.0.0 | v1.1.0 (CR-001) | v1.2.0 (CR-002) |
|--------|-------:|----------------:|----------------:|
| Inventory table rows | 90 | 92 (incl. alias) | **92 ACTIVE** |
| ACTIVE when aliases excluded | 90 | **91** (defect) | **92** |
| Aliases in inventory | 0 | 1 (ACT-004) | **0** |
| Interface shells | 7 | 7 | 7 |
| Activation ACTIVE | 10 | 11 (+alias row = 12 rows) | **12** |

Defects addressed: **Defect A/B** (CR-001) · **Alias inflation** + underspecified risk gate (CR-002).

---

## Per-shell previous / corrected counts

| Shell | v1.0.0 | v1.1.0 rows | v1.2.0 ACTIVE | Notes |
|-------|-------:|------------:|--------------:|-------|
| Public | 8 | 8 | **8** | Unchanged |
| Activation | 10 | 12 (incl. ACT-004 alias) | **12** ACTIVE | −ACT-004 from table · +ACT-013 |
| Onboarding | 14 | 14 | **14** | Unchanged |
| Core | 39 | 39 | **39** | Unchanged |
| Commercial | 6 | 6 | **6** | Unchanged |
| Trust | 6 | 6 | **6** | Unchanged |
| Admin | 7 | 7 | **7** | Unchanged |
| **Total** | **90** | **92** | **92** | |

---

## Shell 1 — Public (8)

| Set | IDs |
|-----|-----|
| **IDs** | PUB-001…PUB-008 |
| **Added / Removed / Renamed** | — |

---

## Shell 2 — Activation (12 ACTIVE)

| Set | Detail |
|-----|--------|
| **ACTIVE IDs (12)** | ACT-001, ACT-002, ACT-003, ACT-005, ACT-006, ACT-007, ACT-008, ACT-009, ACT-010, ACT-011, ACT-012, **ACT-013** |
| **Added (CR-002)** | **ACT-013** Accept Account Risk |
| **Removed from inventory** | **ACT-004** (moved to Historical Alias Appendix — ID preserved) |
| **Unchanged titles/roles** | ACT-003 Pending · ACT-011 Result · ACT-012 Recovery |
| **Appendix (non-counting)** | ACT-004 → ACT-011 VERIFIED |

| ID | Title | Count treatment |
|----|-------|-----------------|
| ACT-001 | Create Your Crow | ACTIVE |
| ACT-002 | Create Account | ACTIVE |
| ACT-003 | Email Verification Pending | ACTIVE |
| ACT-004 | Email Verified | HISTORICAL — **does NOT count** |
| ACT-005 | Accept Mandatory Terms | ACTIVE · exit → ACT-013 |
| ACT-006 | Basic Account Activated | ACTIVE · entry from ACT-013 |
| ACT-007 | Mobile Verify Now/Later | ACTIVE |
| ACT-008 | Mobile OTP | ACTIVE |
| ACT-009 | Activation Blocked | ACTIVE |
| ACT-010 | Sign In | ACTIVE |
| ACT-011 | Email Verification Result | ACTIVE |
| ACT-012 | Activation Recovery | ACTIVE |
| ACT-013 | Accept Account Risk | ACTIVE — **Added** |

**Activation ACTIVE shell sum = 12.**

---

## Shells 3–7

Unchanged from CR-001 reconciliation: Onboarding **14** · Core **39** · Commercial **6** · Trust **6** · Admin **7**.

---

## Family roll-up (must equal shell total)

| Family | v1.0.0 | v1.2.0 ACTIVE |
|--------|-------:|--------------:|
| PUB | 8 | 8 |
| ACT | 10 | **12** |
| IDN | 6 | 6 |
| ONB | 11 | 11 |
| LRN | 12 | 12 |
| SKY+WLD | 4 | 4 |
| COM | 8 | 8 |
| LIV | 6 | 6 |
| PRG | 6 | 6 |
| PAY | 6 | 6 |
| TRU | 6 | 6 |
| ADM | 7 | 7 |
| **Total** | **90** | **92** |

---

## Explicit non-claims

- Does **not** authorize Product Code.
- Does **not** modify `product/learning/` or Progression formulas.
- Does **not** invent a duplicate email-verification screen.
- ACT-004 ID is preserved historically and must not be silently deleted.

---

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | CR-001 — 90→92; Activation net +2 |
| 1.1.0 | 2026-07-21 | CR-002 — alias-safe 92; ACT-004 appendix; ACT-013 added |
