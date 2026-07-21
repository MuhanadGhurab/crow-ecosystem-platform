# Architecture Readiness Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-READY-001 |
| **Version** | 1.2.0 |
| **Status** | **POST-1C — DOMAIN ARCHITECTURE ACCEPTED · PROVIDER/LEGAL CONDITIONS OPEN · PRODUCT CODE BLOCKED** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Last updated** | 2026-07-21 |

```text
Core Platform: PARTIAL — ACCEPTED WITH CONDITIONS
Identity Domain: ACCEPTED WITH CONDITIONS
Activation: DECISION ACCEPTED
Sessions: ACCEPTED WITH CONDITIONS
Authorization: DECISION ACCEPTED
Data Ownership: DECISION ACCEPTED
Data Classification: DECISION ACCEPTED
Retention: ACCEPTED WITH LEGAL CONDITIONS
Evidence Upload: DECISION ACCEPTED
Evidence Storage: DEFERRED WITH ADAPTER LOCKED
Evidence Scanning: PIPELINE ACCEPTED · PROVIDER DEFERRED
Audit: DECISION ACCEPTED
Minor Privacy: ACCEPTED WITH LEGAL CONDITIONS
Realtime: DEFERRED TO 1D
Search: DEFERRED TO 1D
Observability: DEFERRED TO 1D
Hosting: DEFERRED
Technical Validation: PARTIAL — CORE AND 1C DOMAIN SPIKES COMPLETE
Implementation Readiness: BLOCKED
Product Code: BLOCKED
```

## Domain readiness (post-1C highlights)

| Domain | Decision status | Spike evidence | Implementation |
|--------|-----------------|----------------|----------------|
| Core Platform | PARTIAL — ACCEPTED WITH CONDITIONS | P0 6/6 | **BLOCKED** |
| Identity / Activation | ACCEPTED WITH CONDITIONS | 003 · adapters | **BLOCKED** |
| Sessions / Assurance | ACCEPTED WITH CONDITIONS | 003 · ADR-014 | **BLOCKED** |
| Authorization / Privileged | ACCEPTED | ADR-015 · 019 | **BLOCKED** |
| Data Ownership / Classification | ACCEPTED | docs | **BLOCKED** |
| Retention / Export | ACCEPTED WITH LEGAL CONDITIONS | ADR-017 | **BLOCKED** |
| Evidence Upload | ACCEPTED | SPK-ARC-007 | **BLOCKED** |
| Evidence Storage | DEFERRED WITH ADAPTER LOCKED | SPK-ARC-007 | **BLOCKED** |
| Evidence Scanning | PIPELINE ACCEPTED · PROVIDER DEFERRED | SPK-ARC-008 | **BLOCKED** |
| Evidence → Progression | ACCEPTED | SPK-ARC-009 | **BLOCKED** |
| Trust / Moderation privacy | ACCEPTED | SPK-ARC-013 | **BLOCKED** |
| Audit / Corrections | ACCEPTED | SPK-ARC-019 | **BLOCKED** |
| Minor Privacy | ACCEPTED WITH LEGAL CONDITIONS | SPK-ARC-025 | **BLOCKED** |
| Realtime / Live Sky | DEFERRED TO 1D | — | **BLOCKED** |
| Search / Observability / Hosting | DEFERRED TO 1D | — | **BLOCKED** |

## Roll-up

| Question | Answer |
|----------|--------|
| Core + 1C domain architecture accepted? | **Yes** — with provider/legal conditions |
| RETURN TO SPIKE for required 1C decisions? | **0** |
| Conflicting active ADRs? | **0** |
| Any domain ready for Product Code? | **No** |
| Product Code? | **BLOCKED** |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.2.0 | 2026-07-21 | GHV.ARCHITECTURE.1C — identity/security/data/evidence domain readiness |
| 1.1.0 | 2026-07-21 | GHV.ARCHITECTURE.1B — post-1B readiness |
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §45 |
