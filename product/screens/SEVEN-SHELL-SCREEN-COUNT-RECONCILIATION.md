# Seven-Shell Screen Count Reconciliation

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — CORRECTED BASELINE |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 |
| **Change Request** | **CR-001** |
| **Related** | [MASTER-SCREEN-REGISTRY.md](./MASTER-SCREEN-REGISTRY.md) · [SCREEN-ID-CORRECTION-MAP.md](./SCREEN-ID-CORRECTION-MAP.md) · [CROSS-BASELINE-SCREEN-COUNT-DEFECT.md](../progression/governance/CROSS-BASELINE-SCREEN-COUNT-DEFECT.md) |
| **Authoritative decision** | Seven interface shells · **92** total screens |
| **Prior defective claim** | 90 (registry v1.0.0) |
| **Corrected claim** | **92** (registry v1.1.0) |

```text
8 + 12 + 14 + 39 + 6 + 6 + 7 = 92
Activation net +2 (ACT-011, ACT-012)
ACT-004 SUPERSEDED_ALIAS still counts as one Activation registry record
NO IDs removed · NO global renumbering
```

---

## Purpose

Reconcile previous vs corrected screen counts **per experience shell**, list IDs, and record added / removed / renamed / unchanged sets so GHV.ARCHITECTURE.1A is not blocked by the 90-vs-92 defect.

---

## Headline reconciliation

| Metric | Previous (v1.0.0) | Corrected (v1.1.0) | Delta |
|--------|------------------:|-------------------:|------:|
| Total screen IDs | 90 | **92** | **+2** |
| Interface shells | 7 | 7 | 0 |
| Activation (ACT) family | 10 | **12** | **+2** |
| All other families | 80 | 80 | 0 |

Defects addressed: **Defect A** (Pending vs Result conflation) · **Defect B** (missing Activation Recovery ID).

---

## Per-shell previous / corrected counts

| Shell | Previous count | Corrected count | Delta | Notes |
|-------|---------------:|----------------:|------:|-------|
| Public | 8 | **8** | 0 | Unchanged |
| Activation | 10 | **12** | **+2** | +ACT-011, +ACT-012; ACT-003 renamed; ACT-004 retained as SUPERSEDED_ALIAS |
| Onboarding | 14 | **14** | 0 | ONB 11 + IDN-001…003 |
| Core | 39 | **39** | 0 | IDN-004…006 + LRN + SKY/WLD + COM + LIV + PRG |
| Commercial | 6 | **6** | 0 | Unchanged |
| Trust | 6 | **6** | 0 | Unchanged (TRU-005 boundary vs ACT-012 clarified) |
| Admin | 7 | **7** | 0 | Unchanged |
| **Total** | **90** | **92** | **+2** | |

---

## Shell 1 — Public (8)

| Set | IDs |
|-----|-----|
| **IDs** | PUB-001, PUB-002, PUB-003, PUB-004, PUB-005, PUB-006, PUB-007, PUB-008 |
| **Added** | — |
| **Removed** | — |
| **Renamed** | — |
| **Unchanged** | All 8 |

---

## Shell 2 — Activation (12) — net +2

| Set | Detail |
|-----|--------|
| **Previous IDs (10)** | ACT-001…ACT-010 |
| **Corrected IDs (12)** | ACT-001, ACT-002, ACT-003, ACT-004, ACT-005, ACT-006, ACT-007, ACT-008, ACT-009, ACT-010, **ACT-011**, **ACT-012** |
| **Added** | **ACT-011** Email Verification Result · **ACT-012** Activation Recovery |
| **Removed** | — *(none; ACT-004 not deleted)* |
| **Renamed** | **ACT-003**: Verify Email Prompt → **Email Verification Pending** |
| **Superseded (retained)** | **ACT-004** Email Verified → status **SUPERSEDED_ALIAS**; semantics → ACT-011 VERIFIED; entry/exit redirect → ACT-011 |
| **Unchanged titles/IDs** | ACT-001, ACT-002, ACT-005, ACT-006, ACT-007, ACT-008, ACT-009, ACT-010 |

| ID | Title (corrected) | Count treatment |
|----|-------------------|-----------------|
| ACT-001 | Create Your Crow | Unchanged |
| ACT-002 | Create Account | Unchanged |
| ACT-003 | Email Verification Pending | Renamed (same ID) |
| ACT-004 | Email Verified | SUPERSEDED_ALIAS — **still counts** |
| ACT-005 | Accept Mandatory Terms | Unchanged ID; entry now ACT-011 VERIFIED |
| ACT-006 | Basic Account Activated | Unchanged |
| ACT-007 | Mobile Verify Now/Later | Unchanged |
| ACT-008 | Mobile OTP | Unchanged |
| ACT-009 | Activation Blocked | Unchanged |
| ACT-010 | Sign In | Unchanged |
| ACT-011 | Email Verification Result | **Added** |
| ACT-012 | Activation Recovery | **Added** |

**Activation shell sum = 12.**

---

## Shell 3 — Onboarding (14)

| Set | IDs |
|-----|-----|
| **Composition** | ONB-001…ONB-011 (**11**) + IDN-001, IDN-002, IDN-003 (**3**) = **14** |
| **Added** | — |
| **Removed** | — |
| **Renamed** | — |
| **Unchanged** | All 14 |
| **Doc-only** | Resume note: activation interrupts → ACT-012; onboarding may still resume last incomplete ONB |

---

## Shell 4 — Core (39)

| Family slice | IDs | Count |
|--------------|-----|------:|
| Identity (Core) | IDN-004, IDN-005, IDN-006 | 3 |
| Learning | LRN-001…LRN-012 | 12 |
| Skyboard / World | SKY-001, WLD-001, WLD-002, WLD-003 | 4 |
| Community | COM-001…COM-008 | 8 |
| Live Sky | LIV-001…LIV-006 | 6 |
| Progression | PRG-001…PRG-006 | 6 |
| **Core total** | | **39** |

| Set | Detail |
|-----|--------|
| **Added** | — |
| **Removed** | — |
| **Renamed** | — |
| **Unchanged** | All 39 |

---

## Shell 5 — Commercial (6)

| Set | IDs |
|-----|-----|
| **IDs** | PAY-001, PAY-002, PAY-003, PAY-004, PAY-005, PAY-006 |
| **Added / Removed / Renamed** | — |
| **Unchanged** | All 6 |

---

## Shell 6 — Trust (6)

| Set | IDs |
|-----|-----|
| **IDs** | TRU-001, TRU-002, TRU-003, TRU-004, TRU-005, TRU-006 |
| **Added / Removed / Renamed** | — |
| **Unchanged** | All 6 |
| **Boundary note** | ACT-012 does **not** replace TRU-005 account recovery / password reset |

---

## Shell 7 — Admin (7)

| Set | IDs |
|-----|-----|
| **IDs** | ADM-001, ADM-002, ADM-003, ADM-004, ADM-005, ADM-006, ADM-007 |
| **Added / Removed / Renamed** | — |
| **Unchanged** | All 7 |

---

## Family roll-up (must equal shell total)

| Family | Previous | Corrected |
|--------|---------:|----------:|
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

- This reconciliation does **not** authorize Product Code.
- This reconciliation does **not** modify `product/learning/`.
- Wireframe visual production remains out of scope for this Gate unless separately gated.
- Timer values for Pending cooldown/expiry are **not** finalized here (states documented only).

---

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 / CR-001 — 90→92 seven-shell reconciliation; Activation net +2 |
