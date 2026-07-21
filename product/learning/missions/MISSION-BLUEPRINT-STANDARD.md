# Mission Blueprint Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-STD-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [LEARNING-INTENSITY-MODEL.md](./LEARNING-INTENSITY-MODEL.md) · [MISSION-MODALITY-MATRIX.md](./MISSION-MODALITY-MATRIX.md) · [MISSION-CATEGORY-REGISTRY.md](../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [ROUTE-ARCHITECTURE-STANDARD.md](../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [ASSESSMENT-ANCHOR-STANDARD.md](../assessments/ASSESSMENT-ANCHOR-STANDARD.md) · [EVIDENCE-BLUEPRINT-STANDARD.md](../evidence/EVIDENCE-BLUEPRINT-STANDARD.md) |
| **Scope classification** | CONTROLLED LAUNCH (RT-ANL-001 packs: CONDITIONAL / RESERVE) |
| **Supporting sources** | SRC-001 · SRC-002 · SRC-006 · SRC-010 · SRC-011 (methodology and capability framing from GHV.LEARNING.1A) |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Expert panel adjudication; pilot of first Mission packs; GHV.PROGRESSION.1 numeric thresholds; GHV.LEARNING.1D catalogue lock; bilingual template finalization |
| **Limitations** | Architecture / blueprint depth only — no complete lesson prose, quiz banks, Product Code, XP, Mastery percentages, or LOCKED / PUBLISHED content |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Mission Blueprint Standard |

## Purpose

Define the **required fields**, **status vocabulary**, **depth rules**, **portfolio size controls**, **identifier patterns**, and **category requirements** for every Mission Blueprint under GHV.LEARNING.1C.

```text
STATUS RULE: Never use PUBLISHED, LOCKED CONTENT, or IMPLEMENTED for Missions in 1C.
Expert review: NOT RUN. Pilot: NOT RUN. No Product Code. No XP / Mastery numbers.
```

---

## Allowed Mission Blueprint statuses (§6)

| Status | Meaning |
|--------|---------|
| **ARCHITECTURE BLUEPRINT** | Blueprint complete enough for 1C architecture; not content-locked |
| **CONDITIONAL BLUEPRINT** | Blueprint valid only under stated capacity / bridge / Change Control conditions |
| **RESERVE BLUEPRINT** | Representative depth for launch-reserve constructs (e.g. RT-ANL-001) |
| **DEFERRED** | Blueprint paused; not in controlled-launch Mission set |

Forbidden in Mission Blueprint headers:

```text
PUBLISHED
LOCKED CONTENT
IMPLEMENTED
PRODUCTION READY
EXPERT APPROVED
VALIDATED WITH USERS
```

Document-level packaging status for this standard and launch packs:

```text
BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW
```

---

## Required Mission Blueprint fields (§6)

Every Mission Blueprint record MUST include the following fields.

| Field | Requirement |
|-------|-------------|
| **Mission ID** | Canonical ID per §9 |
| **Working title** | Non-final display name |
| **Route ID** | Owning `RT-*` / `CXW-*` / `SEX-*` / Bridge owner |
| **Stage ID** | Owning Stage (or Capstone / Integration position where applicable) |
| **Mission category** | From approved category list (§10) |
| **Status** | One of allowed Mission statuses above |
| **Scope classification** | CONTROLLED LAUNCH · CONDITIONAL · RESERVE as applicable |
| **Learner state** | Entry state expectations (Nest / Stage / prior Mission) |
| **Capability outcomes** | Observable capabilities developed (non-employment) |
| **Prerequisite capabilities** | Hard prerequisites |
| **Corequisites** | Parallel requirements |
| **Recommended preparation** | Soft preparation |
| **Learner objective** | What the learner aims to accomplish |
| **Real-world context** | Bounded, synthetic or permitted context |
| **Mission brief** | Short problem framing (not full lesson prose) |
| **Expected learner actions** | Decisions and actions the learner performs |
| **Expected output** | Artifact or result produced |
| **Evidence contribution** | Which `*-EVD-*` / Capstone / pack this feeds |
| **Assessment method** | How performance is checked (link to ASM where applicable) |
| **Feedback method** | How feedback is delivered |
| **Remediation trigger** | When `RMD-*` / remediation Missions fire |
| **Accessibility considerations** | A11y adjustments and alternatives |
| **Arabic-first considerations** | Arabic-first / bilingual direction |
| **Safety considerations** | Lab / defensive / prohibited behaviors |
| **Privacy considerations** | Data and Evidence privacy |
| **Integrity risks** | Known authenticity / collusion / AI risks |
| **AI-assistance policy** | Category from [AI-ASSISTANCE-POLICY.md](../integrity/AI-ASSISTANCE-POLICY.md) |
| **Collaboration policy** | Solo / peer / Team rules |
| **Estimated intensity** | LIGHT · STANDARD · DEEP · EXTENDED |
| **Tooling classification** | Browser-safe · local-safe · container · cloud-sandbox · none |
| **Online/offline suitability** | Primary and fallback |
| **Reviewer requirement** | Review method / role from Evidence review model |
| **Freshness classification** | Stable · slow · fast · regulatory |
| **Source research IDs** | Supporting `SRC-*` |
| **Unresolved dependencies** | Open Gate / staffing / tooling items |
| **Acceptance criteria** | Qualitative recognition of success (no numeric pass formula) |

---

## Depth rules (§7)

A Mission Blueprint **must** describe:

1. The problem.
2. The learner’s role.
3. The decisions the learner makes.
4. The artifact or result produced.
5. How success is recognized.
6. How failure leads to useful remediation.

A Mission Blueprint **must not** contain:

* Complete lesson prose.
* Exact final quiz banks.
* Copyrighted training material.
* Final UI implementation.
* Exact XP.
* Final Mastery percentages.
* Detailed unsafe exploitation instructions.
* Final assessment answers.

---

## Portfolio size control (§8)

Manageable architectural blueprint portfolio for this Gate:

| Construct | Minimum | Normal range | Maximum (1C) |
|-----------|--------:|-------------:|-------------:|
| Each five-Stage **P0 Route** | 10 | 12–16 | 18 |
| **CXW-001** | — | 8–12 | 12 |
| **SEX-001** | — | 6–10 | 10 |
| **RT-ANL-001** reserve | — | 6–10 representative | 10 |

P0 Route counts **include**: orientation; knowledge or scenario Missions; practical Missions; assessment anchors; Evidence-preparation Missions; Capstone.

Do **not** inflate counts merely to appear comprehensive.

RT-ANL-001 does **not** require full production-level depth; mark packs **RESERVE BLUEPRINT** / Scope **CONDITIONAL**.

---

## Mission identifier rules (§9)

Use IDs established in GHV.LEARNING.1B. Do not renumber existing Stage, Evidence, or Capstone IDs.

| Kind | Pattern | Example |
|------|---------|---------|
| Stage Mission | `<STAGE-ID>-MSN-NN` | `RT-OPR-001-STG-01-MSN-01` |
| Assessment anchor | `<STAGE-ID>-ASM-01` | `RT-OPR-001-STG-03-ASM-01` |
| Evidence-preparation | `<STAGE-ID>-EPM-01` | `RT-BLD-001-STG-05-EPM-01` |
| Integration Mission | `<CXW-ID>-INT-01` | `CXW-001-INT-01` |
| Team / Live Sky | `LIV-MSN-<NUMBER>` | `LIV-MSN-001` |

Bridge Missions remain under Bridge pack IDs (e.g. `BRG-PRT-BLD-01-MSN-*`) without renumbering Capstone / EVD anchors.

---

## Required Mission categories (§10)

### Approved categories only

```text
ORIENTATION
KNOWLEDGE
SCENARIO
GUIDED_PRACTICE
INDEPENDENT_PRACTICE
LABORATORY
ANALYSIS
TROUBLESHOOTING
DESIGN
DOCUMENTATION
ASSESSMENT
EVIDENCE_PREPARATION
TEAM_MISSION
LIVE_SKY_MISSION
REMEDIATION
INTEGRATION
CAPSTONE
```

Category semantics: [MISSION-CATEGORY-REGISTRY.md](../architecture/MISSION-CATEGORY-REGISTRY.md).

### Every P0 Route must include

1. At least one **ORIENTATION**.
2. At least one **SCENARIO**.
3. At least **two** practical categories (from GUIDED_PRACTICE · INDEPENDENT_PRACTICE · LABORATORY).
4. At least one **TROUBLESHOOTING**, **ANALYSIS**, or **DESIGN** Mission.
5. At least one **DOCUMENTATION** Mission.
6. Stage-level **assessment anchors** (ASSESSMENT / `*-ASM-01`).
7. At least one **EVIDENCE_PREPARATION** Mission.
8. One **CAPSTONE**.

Not every Stage requires every category.

---

## Cross-links

| Concern | Standard |
|---------|----------|
| Intensity | [LEARNING-INTENSITY-MODEL.md](./LEARNING-INTENSITY-MODEL.md) |
| Modality | [MISSION-MODALITY-MATRIX.md](./MISSION-MODALITY-MATRIX.md) |
| Assessment anchors | [ASSESSMENT-ANCHOR-STANDARD.md](../assessments/ASSESSMENT-ANCHOR-STANDARD.md) |
| Evidence blueprints | [EVIDENCE-BLUEPRINT-STANDARD.md](../evidence/EVIDENCE-BLUEPRINT-STANDARD.md) |
| Capstones | [CAPSTONE-BLUEPRINT-STANDARD.md](../capstones/CAPSTONE-BLUEPRINT-STANDARD.md) |
| AI assistance | [AI-ASSISTANCE-POLICY.md](../integrity/AI-ASSISTANCE-POLICY.md) |

## Explicit non-goals

* No LOCKED Mission content.
* No Product Code or runtime Mission engine.
* No XP allocation or Mastery formulas.
* No employment / “job ready” claims.
* No offensive exploitation instructions.
