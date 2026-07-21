# Data Architecture Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-DATA-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §16 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-005 · SPK-ARC-007 · SPK-ARC-010 · SPK-ARC-012 · SPK-ARC-020 · SPK-ARC-021 · SPK-ARC-025 |
| **Related** | [TRANSACTION-CONSISTENCY-MAP.md](./TRANSACTION-CONSISTENCY-MAP.md) · [DATA-CLASSIFICATION-AND-PRIVACY-PLAN.md](../privacy/DATA-CLASSIFICATION-AND-PRIVACY-PLAN.md) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
CONCEPTUAL DATA GROUPS ONLY
NO tables · NO ORM · NO migrations · NO Product Code
```

## 1. Purpose

Define conceptual data groups that future technical validation must cover. This document is **not** a schema.

## 2. Conceptual data groups

For each group: Owner domain · Classification · Consistency · Durability · Retention · Deletion · Export · Audit · Encryption · Backup · Geo/regulatory · Volume · Growth risk · Spike.

Classification codes: PUBLIC / INTERNAL / CONFIDENTIAL / RESTRICTED / HIGHLY_RESTRICTED (detail in privacy plan).

| Group | Owner domain | Classification | Consistency | Durability | Retention (draft) | Deletion | Export | Audit | Encryption | Backup | Geo / regulatory | Volume (launch) | Growth risk | Spike |
|-------|--------------|----------------|-------------|------------|-------------------|----------|--------|-------|------------|--------|------------------|-----------------|-------------|-------|
| Identity Data | Identity | RESTRICTED+ | Strong | High | Account life + legal | Subject + legal hold | Subject export | Yes | At rest + transit | Required | KSA considerations TBD | Low–mod | Moderate | SPK-ARC-003 · 025 |
| Activation Data | Identity | CONFIDENTIAL | Strong | High | Until superseded + audit | Soft then hard per policy | Partial | Yes | Yes | Required | Same | Low | Low | SPK-ARC-003 |
| Profile Data (Crow) | Identity / Experience | PUBLIC–CONFIDENTIAL | Strong for canonical; eventual for projections | High | Account life | Anonymize / delete | Yes | Changes | Yes | Required | Display rules | Mod | Mod | SPK-ARC-025 |
| Learning Catalogue Data | Learning | INTERNAL–PUBLIC | Strong publish | High | Versioned forever for Evidence refs | Deprecate, don’t erase history | Admin | Publish audit | Yes | Required | Content policy | Low | Low | SPK-ARC-005 |
| Learning Graph Data | Learning | INTERNAL | Strong publish | High | Versioned | Deprecate + historical refs | Admin | Yes | Yes | Required | — | Low (166/129) | Low | SPK-ARC-005 |
| Mission State | Learning Runtime | CONFIDENTIAL | Strong writes | High | Progress life | On account delete | Learner | Key transitions | Yes | Required | — | High | High | SPK-ARC-006 |
| Assessment Data | Learning / Evidence | CONFIDENTIAL–RESTRICTED | Strong | High | Policy | Redact / delete | Limited | Yes | Yes | Required | — | Mod | Mod | SPK-ARC-007 |
| Evidence Metadata | Evidence | CONFIDENTIAL–RESTRICTED | Strong | High | Policy + appeal | Cascaded carefully | Limited | Yes | Yes | Required | Region TBD | High | High | SPK-ARC-007 |
| Evidence Objects | Evidence / Storage | HIGHLY_RESTRICTED | Strong object + meta link | High | Policy | Quarantine → delete | No bulk public | Access audit | Yes + signed URL | Object + meta | Region / provider constraints | High | **High** | SPK-ARC-007 · 008 |
| Review Data | Evidence | RESTRICTED | Strong | High | Policy | Redact | Limited | **Mandatory** | Yes | Required | — | Mod | Mod | SPK-ARC-009 |
| Progression Events | Progression | CONFIDENTIAL | Strong append / idempotent | **Immutable intent** | Long / forever for integrity | Compensating events | Learner summary | Yes | Yes | **Critical** | — | High | High | SPK-ARC-010 · 011 |
| Progression Ledgers | Progression | CONFIDENTIAL | Derived / rebuildable | High | Rebuildable from events | Rebuild | Summary export | Snapshot audit | Yes | Critical | Trust non-public | Mod | Mod | SPK-ARC-010 |
| Community Data | Community | PUBLIC–CONFIDENTIAL | Strong post; eventual search | High | Policy / takedown | Takedown | Limited | Moderation | Yes | Required | Arabic/EN | High | High | SPK-ARC-013 |
| Moderation Data | Trust / Community | RESTRICTED | Strong | High | Legal + safety | Restricted | No public | **Mandatory** | Yes | Required | Safety | Mod | Mod | SPK-ARC-013 |
| Live Sky Data | Live | CONFIDENTIAL–PUBLIC (spectator-safe) | Hybrid realtime + final strong | High final | Event archive | Archive policy | Limited | Results | Yes | Required | Latency regions | Burst high | Burst | SPK-ARC-014 · 015 |
| Commercial Entitlements | Commercial | CONFIDENTIAL | Strong | High | Subscription life + audit | End + retain audit | Subject | Yes | Yes | Required | VAT / invoice link | Mod | Mod | SPK-ARC-012 |
| Payment and Invoice Data | Commercial / Finance | HIGHLY_RESTRICTED | Strong reconcile | High | Legal retention | Legal only | Subject limited | **Mandatory** | Yes | Critical | Saudi VAT | Mod | Mod | SPK-ARC-012 |
| Notification Data | Notifications | CONFIDENTIAL | Eventual delivery | Medium | Short–medium | Purge | Preferences | Delivery logs | Yes | Medium | Consent | High | High | SPK-ARC-018 |
| Audit Data | Security / Ops | RESTRICTED | Append-only | High | Long | Legal only | Controlled | Self | Yes | Critical | Access control | High | High | SPK-ARC-019 · 022 |
| Operational Telemetry | Operations | INTERNAL | Eventual | Medium | Short | Aggressive purge | No PII export | Sampling | Transit | Optional | Privacy-safe | High | High | SPK-ARC-022 |

## 3. Cross-group rules

1. **Evidence Objects** never stored inside Progression Ledgers.
2. **Commercial** writes never mutate Progression Events.
3. **Operational Telemetry** is not an authority for progression or entitlement.
4. **Learning Graph** catalogue changes must not erase historical Evidence references (Invariant 22).
5. No tables, ORM models, or migrations in this Gate.

## 4. Volume assumptions (qualitative)

| Tier | Mission State | Evidence Objects | Progression Events |
|------|---------------|------------------|--------------------|
| Founder Development | LOW | LOW | LOW |
| Private Alpha | MODERATE | MODERATE | MODERATE |
| Controlled Launch | HIGH | HIGH | HIGH |
| Early Growth | HIGH | **HIGH** | HIGH |

Exact numbers = **UNKNOWN · VALIDATION REQUIRED** (see capacity plan).

## 5. Limitations

```text
CONCEPTUAL ONLY · NO SCHEMA · SPIKES NOT RUN · DECISION PENDING
Legal retention periods NOT legal advice
```

## 6. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §16 — conceptual data groups |
