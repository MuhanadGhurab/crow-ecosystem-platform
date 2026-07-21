# Evidence Anchor Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-REG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-EVIDENCE-MAP.md](./ROUTE-EVIDENCE-MAP.md) · [LAUNCH-EVIDENCE-VALUE-MATRIX.md](./LAUNCH-EVIDENCE-VALUE-MATRIX.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · Route / CXW / SEX architecture files |
| **Limitations** | Architecture anchors only — no Mission blueprints, no XP / Mastery formulas, no rubrics locked; Capstones listed for position only |
| **Unresolved** | Exact rubrics and schemas (GHV.LEARNING.1C); Mastery mapping (GHV.PROGRESSION.1); expert review |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B Evidence Anchor Registry |

## Purpose

Register every launch **Evidence anchor** (`*-EVD-NN`) and **Capstone position** (`*-CAP-01`) for P0 Routes, ANALYZE reserve, Cross-Wing, and Secure Extension under GHV.LEARNING.1B.

```text
STATUS RULE: No Route / CXW / SEX is LOCKED in this Gate.
No XP numbers. Expert review: NOT RUN.
```

## Exact count table (authoritative)

| Owner | Evidence anchors (`*-EVD-*`) | Capstone (`*-CAP-01`) | Notes |
|-------|-----------------------------:|----------------------:|-------|
| **RT-OPR-001** | 3 | 1 | P0 OPERATE |
| **RT-BLD-001** | 4 | 1 | P0 BUILD |
| **RT-PRT-001** | 3 | 1 | P0 PROTECT |
| **RT-LED-001** | 4 | 1 | P0 LEAD |
| **RT-ANL-001** | 4 | 1 | Launch reserve — capacity conditional |
| **CXW-001** | 3 | 1 | Cross-Wing |
| **SEX-001** | 3 | 1 | Secure Extension (attaches to RT-OPR-001) |
| **Total Evidence anchors** | **24** | — | Matches Launch Graph Registry `EVIDENCE_ANCHOR` count |
| **Total Capstones** | — | **7** | Matches Launch Graph Registry `CAPSTONE` count |

**Exact Evidence-anchor total: 24.**

---

## RT-OPR-001 — Cloud Systems Operations Foundations

| ID | Title | Artifact class | Primary Stage(s) |
|----|-------|----------------|------------------|
| **RT-OPR-001-EVD-01** | Config Evidence | Sanitized config snapshot / before-after | STG-04 (primary); STG-02 support |
| **RT-OPR-001-EVD-02** | Troubleshooting Evidence | Incident/fault timeline + diagnosis note | STG-03 · STG-05 |
| **RT-OPR-001-EVD-03** | Runbook Evidence | Mini-runbook / change hygiene sample | STG-01 · STG-05 |
| **RT-OPR-001-CAP-01** | Stabilize the Sandbox (position) | Capstone Evidence pack | Capstone eligibility after STG-01…05 + EVD-01…03 |

## RT-BLD-001 — Web Application Delivery Foundations

| ID | Title | Artifact class | Primary Stage(s) |
|----|-------|----------------|------------------|
| **RT-BLD-001-EVD-01** | Repository Evidence | Repo / lab project + history | STG-01 · STG-03 |
| **RT-BLD-001-EVD-02** | Accessibility note | A11y observations + fixes | STG-02 |
| **RT-BLD-001-EVD-03** | Tests Evidence | Test output / checklist results | STG-04 |
| **RT-BLD-001-EVD-04** | Delivery documentation | README / delivery note / preview link | STG-05 |
| **RT-BLD-001-CAP-01** | Ship the Small Feature (position) | Capstone Evidence pack | Capstone eligibility after STG-01…05 + EVD-01…04 |

## RT-PRT-001 — Defensive Security Operations Foundations

| ID | Title | Artifact class | Primary Stage(s) |
|----|-------|----------------|------------------|
| **RT-PRT-001-EVD-01** | Triage Evidence | Alert triage write-up | STG-04 |
| **RT-PRT-001-EVD-02** | Timeline Evidence | Investigation timeline | STG-04 · STG-05 |
| **RT-PRT-001-EVD-03** | Investigation report | Report + escalation brief + ethics | STG-03 · STG-05 |
| **RT-PRT-001-CAP-01** | Defensive Briefing (position) | Capstone Evidence pack | Capstone eligibility after STG-01…05 + EVD-01…03 + ethics |

## RT-LED-001 — Technology Delivery & Risk Foundations

| ID | Title | Artifact class | Primary Stage(s) |
|----|-------|----------------|------------------|
| **RT-LED-001-EVD-01** | Stakeholder / outcome brief | Brief memo | STG-01 |
| **RT-LED-001-EVD-02** | Delivery plan | Plan + RACI-lite | STG-02 · STG-03 |
| **RT-LED-001-EVD-03** | Risk register | Register excerpt + residual risk | STG-04 |
| **RT-LED-001-EVD-04** | Decision record | Decision log + lessons | STG-03 · STG-05 |
| **RT-LED-001-CAP-01** | Constrained Change Delivery Plan (position) | Capstone Evidence pack | Capstone eligibility after STG-01…05 + EVD-01…04 |

## RT-ANL-001 — Practical Data Analysis Foundations (reserve)

| ID | Title | Artifact class | Primary Stage(s) |
|----|-------|----------------|------------------|
| **RT-ANL-001-EVD-01** | Prepared dataset note | Cleaning/prep log + seed ID | STG-02 |
| **RT-ANL-001-EVD-02** | Analysis artifact | Notebook or spreadsheet analysis | STG-03 |
| **RT-ANL-001-EVD-03** | Visualization pack | Charts + alt text + uncertainty | STG-04 |
| **RT-ANL-001-EVD-04** | Decision report | Executive interpretation + limits | STG-01 · STG-05 |
| **RT-ANL-001-CAP-01** | Insight from a Bounded Dataset (position) | Capstone Evidence pack | Only if Route is capacity-activated |

Status: **LAUNCH RESERVE — CAPACITY CONDITIONAL**. Anchors are architected; not a committed launch Evidence load unless Change Control activates the Route.

## CXW-001 — Secure Application Delivery

| ID | Title | Artifact class | Role in integration |
|----|-------|----------------|---------------------|
| **CXW-001-EVD-01** | Delivery delta Evidence | App/repo change artifact unique to Integration Mission | BUILD contribution to integrated pack |
| **CXW-001-EVD-02** | Finding & remediation log | Seeded finding + remediations + threat notes | PROTECT-aware contribution |
| **CXW-001-EVD-03** | Secure delivery checklist | Checklist + residual risk / release decision note | Integrated decision Evidence |
| **CXW-001-CAP-01** | Secure Delivery Integration Studio (position) | Integrated Capstone bundle | Requires EVD-01…03 accepted |

Must demonstrate **integration**, not sequential topic browsing. Distinct from SEX-001 and from base RT-BLD-001 / RT-PRT-001 Capstones.

## SEX-001 — Secure Cloud Operations Extension

| ID | Title | Artifact class | Role |
|----|-------|----------------|------|
| **SEX-001-EVD-01** | Secure baseline checklist | Applied control checklist on ops lab | Extension formative/practical |
| **SEX-001-EVD-02** | Hardening before/after | Config / IAM least-privilege diffs (sanitized) | Core practical Evidence |
| **SEX-001-EVD-03** | Secrets & misconfig note | Secrets-handling attestation + seeded misconfig fix | Integrity-linked Evidence |
| **SEX-001-CAP-01** | Harden the Ops Path (position) | Extension Capstone pack | Attached to RT-OPR-001; not a full PROTECT Capstone |

---

## Registry rules

1. Passive completion ticks alone are **not** Evidence anchors.
2. Every owner above has ≥1 independently reviewable practical artifact and one Capstone position.
3. Capstone IDs are **positions**, not full Mission blueprints (→ GHV.LEARNING.1C).
4. Display-name changes must not change IDs.
5. Content updates do not automatically delete historical approved Evidence (see Proven standards).

## Cross-check

| Check | Result |
|-------|--------|
| Sum of `*-EVD-*` rows | **24** |
| Capstones | **7** |
| Matches `LAUNCH-GRAPH-REGISTRY` EVIDENCE_ANCHOR / CAPSTONE | **Yes** |
| Any status LOCKED | **No** |
| XP / Mastery numbers | **None** |
| Expert review | **NOT RUN** |
