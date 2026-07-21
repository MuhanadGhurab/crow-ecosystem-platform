# Expert Review Requirements

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EXP-REV-001 |
| **Version** | 1.1.0 |
| **Status** | REQUIREMENTS DEFINED — REVIEW NOT RUN |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B · extended GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [LEARNING-ARCHITECTURE-REVIEW-SCORECARD.md](./LEARNING-ARCHITECTURE-REVIEW-SCORECARD.md) · [LEARNING-HANDOFFS.md](./LEARNING-HANDOFFS.md) · [MISSION-BLUEPRINT-REGISTRY.md](../missions/MISSION-BLUEPRINT-REGISTRY.md) · Route / CXW / SEX architecture files |
| **Limitations** | Names domains and gates only — no reviewers assigned; no review reports exist yet |
| **Unresolved** | Reviewer roster; scheduling; bilingual review sequencing |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B Expert Review Requirements · 1.1.0 (2026-07-21) — LEARNING.1C blueprint-level review domains (§48) |

## Overall status

```text
Expert review: NOT RUN
```

Architecture scorecard scores are **not** a substitute for expert review. Catalogue must not be written as final `LOCKED` or `PUBLISHED` without the blocking milestones below.

## Required future review domains

| Domain ID | Domain | Primary constructs |
|-----------|--------|--------------------|
| EXP-OPR | Cloud operations | RT-OPR-001 · SEX-001 |
| EXP-BLD | Web / software delivery | RT-BLD-001 · CXW-001 (delivery half) |
| EXP-PRT | Defensive security operations | RT-PRT-001 · CXW-001 (security half) |
| EXP-LED | Technology delivery and risk | RT-LED-001 · CXW-001 (release-risk contribution) |
| EXP-ANL | Data analysis (reserve) | RT-ANL-001 |
| EXP-CXW | Secure application delivery | CXW-001 integrated outcome |
| EXP-SEX | Secure cloud operations | SEX-001 |
| EXP-AR | Arabic technical learning | All launch learning surfaces |
| EXP-ID | Instructional design | Stages · Mission categories · remediation |
| EXP-INT | Assessment integrity | Evidence · Capstones · Proven eligibility |
| EXP-A11Y | Accessibility | BUILD a11y Evidence · lab/tooling a11y · content a11y |

---

## Per-domain requirements

### EXP-OPR — Cloud operations

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Practitioner experience operating cloud or hybrid systems (identity, networking, observability, change hygiene) at foundation–intermediate depth |
| **Conflict of interest** | Disclose vendor employment/advocacy; no exclusive single-vendor curriculum mandate |
| **Review evidence** | Stage table · EVD-01…03 · CAP-01 position · lab class feasibility · SEX boundary |
| **Review stage** | After 1B architecture; before PUBLISHED Mission content for OPR/SEX |
| **Blocking milestone** | **Blocks PUBLISHED** for RT-OPR-001 / SEX-001 learning content; **blocks GHV.LEARNING.1D lock** if critical safety/feasibility defects remain |

### EXP-BLD — Web / software delivery

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Delivery engineer / web practitioner familiar with git, accessible UI basics, tests, sandbox deploy |
| **Conflict of interest** | Disclose framework vendor ties; must not require permanent single-framework lock |
| **Review evidence** | Stages · EVD-01…04 · Capstone · CXW non-duplication |
| **Review stage** | Pre-1D; ideally before heavy 1C Mission drafting freeze |
| **Blocking milestone** | **Blocks PUBLISHED** RT-BLD-001; **blocks 1D** if Evidence path or a11y architecture fails |

### EXP-PRT — Defensive security operations

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Defensive SecOps / SOC-lite practitioner; ethics and lab-only discipline |
| **Conflict of interest** | No offensive-training sales pitch influencing scope; refuse live-target content |
| **Review evidence** | Ethics gates · EVD triage/timeline/report · Capstone · unsafe-content scan |
| **Review stage** | Mandatory before any PROTECT Mission PUBLISHED |
| **Blocking milestone** | **Blocks PUBLISHED** RT-PRT-001; **hard block** on 1D if offensive or unsafe instructions appear |

### EXP-LED — Technology delivery and risk

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Delivery / risk coach familiar with plans, RACI-lite, risk registers — **not** senior-title inflation |
| **Conflict of interest** | Disclose PMI/vendor cert sales interests; must not invent employment titles |
| **Review evidence** | EVD briefs/plans/registers/decisions · Capstone · title-boundary compliance |
| **Review stage** | Before PUBLISHED LED content |
| **Blocking milestone** | **Blocks PUBLISHED** RT-LED-001; **blocks 1D** if title overclaim remains |

### EXP-ANL — Data analysis (reserve)

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Analyst / analytics educator; synthetic-data and uncertainty communication |
| **Conflict of interest** | Disclose tool-vendor bias; dual path sheet/notebook must remain |
| **Review evidence** | Reserve architecture · EVD-01…04 · privacy of datasets |
| **Review stage** | Before any capacity activation / PUBLISHED ANL content |
| **Blocking milestone** | **Blocks activation + PUBLISHED** of RT-ANL-001; does not block P0 1D if ANL stays reserve |

### EXP-CXW — Secure application delivery

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | AppSec-aware delivery practitioner (or paired AppSec + delivery reviewers) |
| **Conflict of interest** | Must not collapse CXW into SEX or into base BUILD testing alone |
| **Review evidence** | Semantic-coherence answers · EVD-01…03 · Capstone integration · Bridge map |
| **Review stage** | Before CXW Mission PUBLISHED; before 1D CXW lock |
| **Blocking milestone** | **Blocks PUBLISHED** CXW-001; **blocks 1D** CXW inclusion if integration Evidence fails |

### EXP-SEX — Secure cloud operations

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Cloud security / platform hardening practitioner |
| **Conflict of interest** | Must not expand SEX into full PROTECT Route |
| **Review evidence** | Attachment to RT-OPR-001 · EVD baseline/hardening/secrets · Capstone · duplication vs PRT/CXW |
| **Review stage** | With or after EXP-OPR; before SEX PUBLISHED |
| **Blocking milestone** | **Blocks PUBLISHED** SEX-001; **blocks 1D** if duplication or unsafe lab design remains |

### EXP-AR — Arabic technical learning

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Arabic technical content QA / localization for STEM or ICT learning |
| **Conflict of interest** | Disclose agency/vendor lock-in; prefer bilingual maintainability |
| **Review evidence** | Architecture bilingual readiness notes · ID stability vs display names |
| **Review stage** | Before PUBLISHED localized Missions; sampling across Horizons |
| **Blocking milestone** | **Blocks PUBLISHED** Arabic surfaces; **blocks 1D** for Arabic-first launch claims if unreviewed |

### EXP-ID — Instructional design

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Instructional designer for adult technical learning; remediation literacy |
| **Conflict of interest** | No exclusive LMS vendor mandate |
| **Review evidence** | Stage progression · Mission categories · remediation architecture |
| **Review stage** | During / after 1C Mission blueprints; before PUBLISHED |
| **Blocking milestone** | **Blocks PUBLISHED** Mission sets; **soft-blocks 1D** if Stage→Evidence coherence broken |

### EXP-INT — Assessment integrity

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Assessment / integrity specialist (AI-assist, plagiarism, seed authenticity) |
| **Conflict of interest** | Disclose proctoring-vendor interests; launch must not require expensive proctoring hardware |
| **Review evidence** | Evidence map integrity controls · Proven eligibility · revocation |
| **Review stage** | Before Proven awarding policy goes live; before PUBLISHED Capstones |
| **Blocking milestone** | **Blocks PUBLISHED** Capstone assessment; **blocks 1D** Proven claims if integrity architecture inadequate |

### EXP-A11Y — Accessibility

| Field | Requirement |
|-------|-------------|
| **Minimum expertise** | Digital accessibility practitioner (WCAG-aware) for learning UX and BUILD Evidence |
| **Conflict of interest** | Disclose overlay-widget vendors; prefer structural a11y |
| **Review evidence** | RT-BLD EVD-02 criteria · lab alternatives · content a11y notes |
| **Review stage** | Before PUBLISHED BUILD / CXW UI Missions |
| **Blocking milestone** | **Blocks PUBLISHED** a11y-critical Missions; **blocks 1D** if BUILD a11y Evidence path is decorative only |

---

## Blocking milestones summary

| Milestone | Expert review required |
|-----------|------------------------|
| **PUBLISHED** Mission / Capstone content for a construct | Matching domain(s) for that construct **must** have run (or explicit founder waiver via Change Control — discouraged) |
| **GHV.LEARNING.1D** catalogue lock | EXP-OPR · EXP-BLD · EXP-PRT · EXP-LED · EXP-CXW · EXP-SEX · EXP-INT at minimum for included constructs; EXP-AR if Arabic-first launch claimed; EXP-ANL only if ANL exits reserve |
| **Route-Proven awarding in production** | EXP-INT (+ construct domain) |
| **Horizon-Proven awarding** | Deferred; not in launch path |

## Current run state

| Item | State |
|------|-------|
| Domains listed | **Yes** (this document) |
| Reviewers assigned | **No** |
| Reviews completed | **0** |
| Overall | **NOT RUN** |

## Explicit non-goals

- No fake completed review reports.
- No LOCKED catalogue from Founder scorecard alone.
- No XP or Mastery invented to “pass” integrity review.

---

## Blueprint-level review domains (GHV.LEARNING.1C §48)

In addition to architecture domains above, expert review of **Mission / Evidence / Capstone blueprints** must cover:

| Blueprint review domain | Focus | Primary constructs | 1D blocker? |
|-------------------------|-------|--------------------|-------------|
| **Mission realism** | Missions reflect bounded real practice without employment overclaim | All Mission packs | **Yes** — domain-critical for included packs |
| **Evidence authenticity** | Seed binding, authorship, reviewability of EVD paths | All EVD / Capstone packs | **Yes** — blocks 1D Proven claims |
| **Rubric clarity** | Rubric dimensions usable by reviewers without inventing Mastery math | All 7 rubric packs | **Yes** — domain-critical |
| **Capstone feasibility** | Capstone doable in stated intensity / tooling without unsafe scope | All 7 Capstones | **Yes** — domain-critical |
| **Safe security content** | Defensive-only; no offensive / live-target drift | PRT · CXW · SEX · Bridge · Live | **Yes** — **hard block** if unsafe |
| **Cloud-lab feasibility** | Sandbox / local-safe ops labs viable for founder delivery | OPR · SEX · Live | **Yes** for OPR/SEX inclusion |
| **Web-delivery relevance** | BUILD / CXW delivery Missions match accessible web delivery reality | BLD · CXW · Bridge | **Yes** for BLD/CXW inclusion |
| **Project and risk realism** | Plans, RACI-lite, risk registers stay non-title-inflating | LED · CXW release-risk | **Yes** for LED/CXW inclusion |
| **Arabic technical accuracy** | Arabic-first meaning parity with retained English terms | All launch surfaces | **Yes** if Arabic-first launch claimed |
| **Instructional design** | Stage balance, remediation, intensity coherence | All packs · remediation library | **Yes** if Stage→Evidence coherence broken |
| **Accessibility** | A11y Evidence and lab alternatives are structural, not decorative | BLD · CXW · content a11y | **Yes** for a11y-critical packs |
| **Assessment integrity** | ASM anchors, AI policy, Capstone authenticity | All ASM · Capstones · Proven | **Yes** — blocks Proven awarding path |

```text
Expert review status remains: NOT RUN
Domain-critical blueprint reviews above are blockers for GHV.LEARNING.1D
where the construct is included in the locked catalogue.
```

| Blueprint review item | State |
|-----------------------|-------|
| Domains listed (§48) | **Yes** |
| Reviews completed | **0** |
| Overall | **NOT RUN** |
