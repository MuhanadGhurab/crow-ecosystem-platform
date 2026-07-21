# Evidence Blueprint Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-BP-STD-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-CLASSIFICATION.md](./EVIDENCE-CLASSIFICATION.md) · [EVIDENCE-RUBRIC-STANDARD.md](./EVIDENCE-RUBRIC-STANDARD.md) · [EVIDENCE-REVIEW-MODEL.md](./EVIDENCE-REVIEW-MODEL.md) · [SAFE-EVIDENCE-HANDLING.md](./SAFE-EVIDENCE-HANDLING.md) · [EVIDENCE-ANCHOR-REGISTRY.md](./EVIDENCE-ANCHOR-REGISTRY.md) · [ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md) · [MISSION-BLUEPRINT-STANDARD.md](../missions/MISSION-BLUEPRINT-STANDARD.md) |
| **Scope classification** | CONTROLLED LAUNCH (RT-ANL-001 Evidence blueprints: CONDITIONAL) |
| **Supporting sources** | SRC-001 · SRC-006 · SRC-010 · SRC-016 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Per-anchor rubric instances; storage Spike (ARCHITECTURE.1); PROGRESSION.1 aggregation; expert staffing |
| **Limitations** | Blueprint fields only — no database schema; no XP; no LOCKED Evidence catalogue |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Evidence Blueprint Standard |

## Purpose

Define the **required fields** for every Evidence Blueprint bound to Mission outputs and Evidence anchors (`*-EVD-*`), including Capstone bundles.

```text
Expert review: NOT RUN. Pilot: NOT RUN.
No Product Code. No XP / Mastery formulas.
```

---

## Required Evidence Blueprint fields (§15)

| Field | Requirement |
|-------|-------------|
| **Evidence ID** | Canonical `*-EVD-NN` or Capstone bundle ID |
| **Related Route, Stage and Mission** | Traceability to owner construct and contributing Missions |
| **Evidence class** | From [EVIDENCE-CLASSIFICATION.md](./EVIDENCE-CLASSIFICATION.md) |
| **Capability claims supported** | Observable claims (non-employment) |
| **Required artifact** | Must-submit artifact definition |
| **Optional artifact** | Allowed extras |
| **Expected explanation** | Learner narrative / reasoning requirement |
| **Authenticity signals** | Seed ID, timestamps, commit history, lab telemetry notes, etc. |
| **Review method** | From [EVIDENCE-REVIEW-MODEL.md](./EVIDENCE-REVIEW-MODEL.md) |
| **Rubric ID** | Link to rubric blueprint |
| **Privacy classification** | From Safe Evidence Handling privacy classes |
| **Public portfolio suitability** | Yes / conditional / no |
| **Redaction requirements** | Mandatory redacted elements |
| **Data-retention direction** | Retain / purge / learner-controlled notes (policy direction only) |
| **AI-assistance disclosure** | Required disclosure category |
| **Plagiarism risk** | Classified risk notes |
| **Collusion risk** | Classified risk notes |
| **Tampering risk** | Classified risk notes |
| **Storage needs** | Size / type constraints (conceptual) |
| **Accessibility requirements** | Alt text, transcripts, format alternatives |
| **Revision policy** | Link to revision / appeal states |
| **Revocation conditions** | When approval may be revoked |
| **Relationship to Route-Proven** | Required / supporting / Capstone-only |

---

## Blueprint depth rules

Evidence Blueprints **must**:

* Bind to registered anchors where they exist ([EVIDENCE-ANCHOR-REGISTRY.md](./EVIDENCE-ANCHOR-REGISTRY.md)).
* Prefer **synthetic / sanitized** artifacts.
* State integrity and privacy risks explicitly.
* Remain reviewable without employment claims.

Evidence Blueprints **must not**:

* Require real customer / employer-confidential data.
* Embed secrets or malware.
* Define numeric Mastery weights.
* Claim PUBLISHED / LOCKED catalogue status in 1C.

---

## Formative vs practical vs Capstone

| Kind | Role |
|------|------|
| **Formative** | Developmental; may not be Route-Proven-required |
| **Practical / Stage Evidence** | Feeds required EVD anchors |
| **Capstone bundle** | Integrates prior capabilities; Capstone approval required for Proven |

## Explicit non-goals

* No object-storage schema.
* No automatic Proven from file upload alone.
* No public portfolio without privacy classification.
