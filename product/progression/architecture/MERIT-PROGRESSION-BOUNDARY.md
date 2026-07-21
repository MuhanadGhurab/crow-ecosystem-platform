# Merit–Progression Boundary

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-MRT-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-UNLOCK-BOUNDARY.md](./PROGRESSION-UNLOCK-BOUNDARY.md) · [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) · [PROGRESSION-SOURCE-AUTHORITY.md](./PROGRESSION-SOURCE-AUTHORITY.md) · [PROGRESSION-SYSTEM-SEPARATION.md](./PROGRESSION-SYSTEM-SEPARATION.md) · [../../../governance/scope/SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) · [../../../governance/commercial/COMMERCIAL-BASELINE.md](../../../governance/commercial/COMMERCIAL-BASELINE.md) · [../../learning/README.md](../../learning/README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: define Merit as entitlement outcome boundary |

---

## Purpose

Define the boundary between **progression standing** and **Merit Access**. Merit is how GHURAVIA may grant temporary or scoped **entitlement** without converting payment or Rank into skill.

Scope Baseline classifies Merit Access as CONTROLLED LAUNCH. Exact Merit criteria remain PENDING later progression work (and must stay consistent with Learning Design Baseline).

---

## Core classification

```text
Merit Access = entitlement outcome
Merit Access ≠ progression score
```

| Concept | Is | Is not |
|---------|----|--------|
| Merit Grant | Commercial/access entitlement (possibly funded by scholarship, partner, Prestige Access, or temporary plan) | XP, Momentum, Maturity, Mastery, Trust score, Prestige Class, Title |
| Progression eligibility for Merit review | Input that may open consideration | Automatic Grant |
| Evidence approval | Learning/Evidence review outcome | Something Merit can perform |

---

## Grant types Merit may include

Exact total: **8** Grant types in architecture scope.

1. **Mission Grant** — entitlement to access a Mission pathway that would otherwise require commercial capacity/access.
2. **Route Grant** — entitlement scoped to a Route.
3. **Cross-Wing Grant** — entitlement scoped to Cross-Wing participation where commercially gated.
4. **Temporary Flight Pass** — temporary plan-like entitlement (commercial identity remains Access Plan; progression IDs must not embed plan names).
5. **Temporary Wing Pass** — temporary plan-like entitlement.
6. **Temporary Expedition Pass** — temporary plan-like entitlement.
7. **Prestige Access** — entitlement associated with Prestige pathways (still entitlement, not automatic Prestige Class award).
8. **Scholarship / partner-funded Access** — externally funded entitlement within Merit policy (Scope Baseline).

Display and billing must label these as **Merit / entitlement**, never as Mastery or Rank purchases.

---

## Binding rules

### R1 — Entitlement outcome, not score

Merit Grants write to entitlement/commercial access state. They must not write Flight XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, or Prestige Class as a side effect of the Grant itself.

### R2 — Expiry does not erase Mastery

When Merit expires, Capability/Route Mastery and Route-Proven standing remain (subject to Evidence validity and freshness rules). Completed work is preserved; grace behavior follows commercial/Merit policy.

### R3 — Expiry does not erase XP

Merit expiration must not erase lifetime Flight XP or approved Evidence.

### R4 — Merit cannot approve Evidence

A Merit Grant must never act as Evidence approval, assessment pass, or Capstone sign-off. Evidence remains under Evidence/Review authority.

### R5 — Governed progression records as criteria inputs

Merit criteria (when defined in 1B+) must use governed progression records (Mastery, Trust, integrity, etc.) as eligibility inputs — not popularity or payment amount.

### R6 — Human review for high-value Grants

High-value Merit Grants may require human review. Automation may shortlist; humans own consequential Grants (Constitution: Human Accountability).

### R7 — Payment must not influence Merit scoring

Commercial payment must not improve Merit “scores,” priority unfairly, or convert paid users into preferential Merit winners. Payment remains a separate entitlement path (buy Access Plan) — not a Merit influence channel.

### R8 — Formulas pending

Exact Merit formulas, quotas, durations, and scoring remain **FORMULA PENDING**. This document locks the boundary only.

---

## Source authority notes

| Event class | Role regarding Merit |
|-------------|----------------------|
| `COMMERCIAL_EVENT` | May affect Merit Grant **availability** / redemption as entitlement |
| `REVIEW_EVENT` | May decide high-value Merit Grants |
| `ADMINISTRATIVE_CORRECTION` | May repair wrongful Grant/denial with audit |
| Progression ledgers | Provide eligibility inputs only |
| `EVIDENCE_EVENT` | Never approved by Merit |

---

## Relationship to Access Plan

Access Plan is commercial and outside progression calculations. Temporary Merit plan Grants may **simulate plan capacity** without:

- Creating progression value
- Embedding plan names in progression identifiers
- Claiming the user “earned” Mastery via Merit

When Merit expires, capacity returns to the user’s true commercial entitlement (or free Open Flight baseline), while learning history remains.

---

## User-facing explanation (required posture)

Recommended explainability:

> “Merit Access can open doors to learning capacity. It does not prove skill, approve Evidence, or replace Mastery. When Merit ends, your approved Evidence and Flight XP remain.”

---

## Sensitive-decision status

| Decision | Sensitivity |
|----------|-------------|
| Merit eligibility consideration | Medium |
| High-value Merit Grant | **Sensitive** — human review may be required |
| Merit denial | Appealable under Merit/commercial policy |
| Merit used as Evidence approval | **Prohibited** |

---

## Exact totals

| Item | Exact total |
|------|------------:|
| Core classification statements | **2** (entitlement outcome; not progression score) |
| Merit Grant types listed | **8** |
| Binding rules (R1–R8) | **8** |
