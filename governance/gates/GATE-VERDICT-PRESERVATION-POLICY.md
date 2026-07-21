# Gate Verdict Preservation Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-GOV-POL-VER-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E-AMENDMENT-01 |
| **Related** | [GATE-VERDICT-CONSISTENCY-CHECK.md](./GATE-VERDICT-CONSISTENCY-CHECK.md) · [GATE-REGISTER.md](./GATE-REGISTER.md) · [GHV.ARCHITECTURE.1E-AMENDMENT-01.md](./GHV.ARCHITECTURE.1E-AMENDMENT-01.md) |

## Purpose

Prevent silent normalization of **PARTIAL** Gate verdicts to **PASS** in downstream summaries, registers, and manifests. Preserve auditable Gate history across the GHURAVIA programme.

---

## Rules

### 1. Verdict immutability

A Gate verdict is **immutable** after formal acceptance unless a **governed amendment** explicitly changes it. Informal relabeling in downstream documents is prohibited.

### 2. Exact predecessor quoting

A downstream Gate must quote predecessor Gate verdicts **exactly** from the authoritative Gate report or an accepted amendment record, or use a **clearly defined abbreviated status** that preserves PARTIAL vs PASS distinction (e.g. `PARTIAL — ACCEPTED WITH NON-BLOCKING CONDITIONS`).

### 3. PARTIAL must never normalize to PASS

**PARTIAL** must never be normalized to **PASS** because:

* spike tests passed,
* a baseline was locked,
* ADRs were accepted with conditions,
* the programme reached "complete at governed design level", or
* notes columns mention acceptance language.

Spike PASS, preflight PASS, and ADR "decision accepted" are **distinct** from Gate verdict PASS.

### 4. Programme completion ≠ Gate upgrade

Programme completion (e.g. Architecture **COMPLETE AT GOVERNED DESIGN LEVEL**) does **not** upgrade component-Gate verdicts. A programme may complete while individual Gates remain PARTIAL.

### 5. Baseline lock ≠ condition erasure

Baseline lock does **not** erase validation conditions, provider deferrals, or Product Code blocks recorded at Gate close.

### 6. Historical audibility

Historical Gate reports remain auditable. Corrections use **amendment records** and **amendment notices** — not Git history rewrite or silent deletion of original verdict text.

### 7. Amendment minimum content

Every Gate amendment must state:

* **original verdict**
* **amended verdict** (if changed) or **preserved verdict** (if correcting downstream drift only)
* **reason**
* **substantive impact** (NONE / MINOR GOVERNANCE / MATERIAL)
* **evidence** (audit or review document references)
* **effective date**

### 8. Register and manifest separation

Gate Registers and baseline manifests must distinguish:

| Dimension | Example |
|-----------|---------|
| **Gate verdict** | PARTIAL — ACCEPTED WITH NON-BLOCKING CONDITIONS |
| **Baseline status** | ACTIVE — LOCKED AS GOVERNED DESIGN BASELINE |
| **Programme status** | COMPLETE AT GOVERNED DESIGN LEVEL |
| **Validation status** | External validation NOT COMPLETE |
| **Implementation status** | Product Code BLOCKED · Implementation NOT GRANTED |

Do not collapse these into a single PASS label.

### 9. Automated consistency checks

Automated or manual consistency checks (see [GATE-VERDICT-CONSISTENCY-CHECK.md](./GATE-VERDICT-CONSISTENCY-CHECK.md)) should compare active Gate summaries to authoritative Gate records before programme transitions.

### 10. Drift correction before next Gate

Any detected verdict drift must be **corrected and recorded** (amendment or controlled register update) **before** the next programme Gate begins. Downstream Gates must not start on incorrect predecessor verdicts.

---

## Enforcement

| Control | Location |
|---------|----------|
| Authoritative Gate source | `governance/gates/GHV.*.md` |
| Amendment linkage | `governance/gates/GHV.*-AMENDMENT-*.md` |
| Reference audit | `architecture/ghuravia/governance/ARCHITECTURE-GATE-VERDICT-REFERENCE-AUDIT.md` |
| Pre-next-Gate validation | [GATE-VERDICT-CONSISTENCY-CHECK.md](./GATE-VERDICT-CONSISTENCY-CHECK.md) |

---

## Adoption record

Adopted by **GHV.ARCHITECTURE.1E-AMENDMENT-01** on **2026-07-21** following identification of `GHV.ARCHITECTURE.1B` PASS label drift.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial policy — 10 rules |
