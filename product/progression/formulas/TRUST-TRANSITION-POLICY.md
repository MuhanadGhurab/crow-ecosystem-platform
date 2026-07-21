# Trust Transition Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-POL-TRU-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Policy ID** | POL-TRU-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Policy ID

```text
POL-TRU-001
```

## Progression system

Trust Standing (non-public)

## Purpose

Define rule-based Trust state transitions **without** a public numerical Trust score.

## Prohibited outputs

* Public numerical Trust score.
* Payment-improved Trust.
* Positive signals erasing confirmed serious incidents.

## Signal classes

```text
POSITIVE_SIGNAL
MINOR_CONCERN
MODERATE_CONCERN
SERIOUS_CONCERN
CRITICAL_CONCERN
```

## Candidate state rules

### UNESTABLISHED

No validated platform behavior.

### NORMAL

```text
A1 account assurance
at least one valid learning, Evidence or community event
no active serious concern
```

### POSITIVE_STANDING

```text
At least 3 positive signals
across at least 2 Trust dimensions
within 90 days

No unresolved MODERATE, SERIOUS or CRITICAL concern
```

### ELEVATED_RESPONSIBILITY_ELIGIBLE

```text
A2 assurance
mobile verified where role policy requires
at least 5 positive signals
across at least 3 Trust dimensions
within 180 days
at least 2 approved Evidence, Team, reviewer or contribution records
no confirmed MODERATE-or-higher concern within 180 days
human role review
```

### REVIEW_REQUIRED

```text
One unresolved MODERATE concern
or
three MINOR concerns within 30 days
```

### RESTRICTED

```text
One confirmed SERIOUS concern
or
two confirmed MODERATE concerns within 90 days
```

### SUSPENDED

```text
One confirmed CRITICAL concern
or
an acute account or platform safety risk
```

### REVOKED_AUTHORITY

Confirmed abuse of an elevated role or authority.

## Rules

* Positive signals cannot erase a confirmed serious incident.
* Overturned concerns must reverse related restrictions.
* Inactivity does not reduce Trust.
* Payment cannot improve Trust.
* Public profiles do not show numerical Trust.
* Sensitive details remain private.
* Appeals and separation of duties apply.

All time windows remain candidates pending `1C`.

## Explainability text

“Trust Standing is a private safety and responsibility state. It is not a public score, and buying a plan cannot improve it.”

## Simulation scenarios

PER-013; PER-014; RUN-001

## Known risks

Window gaming; opaque restrictions without explainability; over-restriction of minors.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial non-public Trust transition policy under GHV.PROGRESSION.1B |
