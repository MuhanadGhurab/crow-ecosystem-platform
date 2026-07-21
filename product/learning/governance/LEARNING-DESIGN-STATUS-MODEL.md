# Learning Design Status Model

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-GOV-STS-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1D |
| **Last updated** | 2026-07-21 |
| **Related** | [LEARNING-PORTFOLIO-MANIFEST.md](./LEARNING-PORTFOLIO-MANIFEST.md) · [PUBLICATION-READINESS-MATRIX.md](./PUBLICATION-READINESS-MATRIX.md) · [LEARNING-DESIGN-FREEZE-POLICY.md](./LEARNING-DESIGN-FREEZE-POLICY.md) |
| **Limitations** | Status vocabulary only — does not grant Expert Approved, Pilot Validated, Publication Ready, Accredited, or Certified |
| **Expert review** | NOT RUN |
| **Pilot** | NOT RUN |
| **Technical validation** | NOT RUN |
| **Publication** | BLOCKED |
| **Implementation** | BLOCKED |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1D Final Design Status Model |

## Purpose

Separate **design status** from **readiness fields** so `LOCKED` cannot be misread as expert approval, pilot validation, publication readiness, or implementation readiness.

```text
LOCKED means: LOCKED AS GOVERNED DESIGN BASELINE
LOCKED does NOT mean: EXPERT APPROVED | PILOT VALIDATED | PUBLICATION READY | IMPLEMENTED | PRODUCTION READY | ACCREDITED | CERTIFIED
```

---

## Design statuses (authoritative)

Use only these design statuses:

| Status | Meaning |
|--------|---------|
| `RESEARCHED` | Research complete; not architecture-locked |
| `ARCHITECTURE RECOMMENDED` | Architecture recommended; awaiting baseline lock |
| `BLUEPRINT RECOMMENDED` | Blueprints recommended; awaiting baseline lock |
| `LOCKED AS DESIGN BASELINE` | Governed design baseline locked under GHV.LEARNING.1D |
| `LOCKED AS RESERVE DESIGN BASELINE` | Reserve design locked; not a Controlled-Launch commitment |
| `CONDITIONAL` | Design accepted only under stated conditions |
| `DEFERRED` | Intentionally postponed |
| `SUPERSEDED` | Replaced by a later versioned baseline |
| `REJECTED` | Explicitly rejected |

### Special Live construct label

| Status | Meaning |
|--------|---------|
| `LOCKED AS DESIGN BLUEPRINT` | Live/Team Sky blueprint locked as design; technical validation still NOT RUN |

Do not invent alternate lock labels.

---

## Readiness fields (authoritative)

Every learning construct must record these readiness fields **separately** from design status:

| Field | Allowed values |
|-------|----------------|
| **Expert Review** | `NOT RUN` · `IN PROGRESS` · `PASSED` · `FAILED` · `NOT APPLICABLE` · `BLOCKED` |
| **Pilot** | `NOT RUN` · `IN PROGRESS` · `PASSED` · `FAILED` · `NOT APPLICABLE` · `BLOCKED` |
| **Technical Validation** | `NOT RUN` · `IN PROGRESS` · `PASSED` · `FAILED` · `NOT APPLICABLE` · `BLOCKED` |
| **Publication** | `NOT RUN` · `IN PROGRESS` · `PASSED` · `FAILED` · `NOT APPLICABLE` · `BLOCKED` |
| **Implementation** | `NOT RUN` · `IN PROGRESS` · `PASSED` · `FAILED` · `NOT APPLICABLE` · `BLOCKED` |

### Post-1D default for Controlled-Launch constructs

| Field | Default after GHV.LEARNING.1D |
|-------|-------------------------------|
| Expert Review | NOT RUN |
| Pilot | NOT RUN |
| Technical Validation | NOT RUN |
| Publication | BLOCKED |
| Implementation | BLOCKED |

---

## Rules

1. Design status and publication status must never be combined into one ambiguous label.
2. `LOCKED AS DESIGN BASELINE` may coexist with `Publication: BLOCKED`.
3. `LOCKED AS RESERVE DESIGN BASELINE` (RT-ANL-001) is **not** a Controlled-Launch commitment and remains **CAPACITY CONDITIONAL**.
4. Expert findings or pilot findings that change design require a Change Request, new document version, and register updates — no silent modification.
5. No XP, no numeric Mastery, no Product Code in design-status records.

## Explicit non-claims

* Not Expert Approved.
* Not Pilot Validated.
* Not Publication Ready.
* Not Accredited.
* Not Certified.
