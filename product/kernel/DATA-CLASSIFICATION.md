# Living Mission Kernel — Data Classification

| Field | Value |
|-------|-------|
| **Status** | AUTHORITATIVE for GHV.IMPLEMENTATION.0F |
| **Version** | 1.0.0 |

| Asset | Classification |
|-------|----------------|
| Mission templates (Black Signal alpha) | INTERNAL / publishable fixture |
| Mission runs | PRIVATE USER LEARNING DATA |
| Mission events | PRIVATE USER LEARNING DATA / AUDIT-SENSITIVE |
| Crowprint | PRIVATE SENSITIVE LEARNING INFERENCE |
| Suggested Lineage | PRIVATE |
| Flight Log | PRIVATE by default |
| Echo Flights | PRIVATE |
| Public projection | **OFF** |

## Controls (0F)

- Authorization checks; owner-only reads by default
- Least privilege; no cross-user access
- Audit provenance; data minimization; safe error messages
- Idempotency; no client-supplied state effects
- No raw secret storage

## Threat model (0F)

Event tampering · replay · duplicate actions · state skipping · client score manipulation · unauthorized run access · Evidence double counting · Echo mutation of canonical history · suggestion-input policy violation · private Crowprint exposure
