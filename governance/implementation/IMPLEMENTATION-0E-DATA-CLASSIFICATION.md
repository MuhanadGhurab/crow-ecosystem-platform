# IMPLEMENTATION-0E — Data Classification

| Field | Value |
|-------|-------|
| **Gate** | GHV.IMPLEMENTATION.0E |
| **Date** | 2026-07-22 |
| **Authorization** | GHV-IMP-AUTH-005 |

## Classification table

| Data | Classification | Public render | Trust input | Progression input | Payment | Crow Lineage | Origin scoring |
|------|----------------|---------------|-------------|--------------------|---------|--------------|----------------|
| Readiness answers | **PRIVATE LEARNING READINESS DATA** | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED |
| Readiness score | **PRIVATE LEARNING READINESS DATA** | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | N/A (server-only) |
| Readiness band | **PRIVATE ONBOARDING DECISION DATA** | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | N/A |
| Weak capability IDs | **PRIVATE LEARNING SUPPORT DATA** | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED |

## Audit / outbox metadata only

Allowed: action · attempt ID · item ID · catalogue version · answer count · prior/resulting status · band after submission · actor · authority · reason · correlation ID.

**Forbidden in audit/outbox:** selected option values · full answer payloads · free-text personal responses.

**Forbidden in general analytics:** score · weak areas · option selections.

## Storage prohibitions

Never store: free-text personal responses · real credentials · secrets · Origin fields on the attempt · Trust/Mastery/Lineage/Prestige/payment state on nest readiness tables.
