# Architecture Decision Framework

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-ADF-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN LOCKED** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §40 |
| **Last updated** | 2026-07-21 |
| **Related** | [ADR-REGISTER.md](./ADR-REGISTER.md) · [../validation/TECHNICAL-SPIKE-STANDARD.md](../validation/TECHNICAL-SPIKE-STANDARD.md) |

## ADR statuses

```text
PROPOSED
VALIDATION REQUIRED
EXPERIMENTING
RECOMMENDED
ACCEPTED
REJECTED
SUPERSEDED
DEFERRED
```

## Mandatory ADR fields

Every ADR must include:

| Field | Purpose |
|-------|---------|
| Decision ID | Stable `ADR-ARC-NNN` (or programme series) |
| Title | Short decision name |
| Context | Why the decision arises |
| Options | Alternatives considered |
| Constraints | Hard limits from baselines / law / ops |
| Quality attributes | QAS links |
| Security | Threat / control notes |
| Privacy | Data-minimization / PDPL notes |
| Accessibility | A11y impact |
| Localization | Arabic-first / RTL impact |
| Cost | Cost/risk notes |
| Operability | Founder/ops burden |
| Evidence | Spike / study references |
| Decision | Chosen option (when decided) |
| Consequences | Follow-on effects |
| Reversal cost | How hard to undo |
| Validation status | Mapping to ADR statuses above |
| Related spike | `SPK-ARC-*` or none |
| Owner | Accountable party |
| Date | Decision or proposal date |
| Revision history | Versions |

## 1A rules

* Stack ADRs may be **PROPOSED** or **VALIDATION REQUIRED** only.
* **Do not** mark stack ADRs **ACCEPTED** in 1A unless already completed and relevant validation exists (none does).
* Inherited CyberCrow technologies are **not** auto-approved (DEC-158).
* Spike PASS ≠ automatic ACCEPTED.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §40 — ADR framework |
