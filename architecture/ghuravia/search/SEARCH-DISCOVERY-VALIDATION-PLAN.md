# Search and Discovery Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-SRCH-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §26 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-016 · SPK-ARC-025 |
| **Related** | Arabic-first plan · Community moderation · Evidence privacy |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
Search must not expose private profiles, restricted Evidence, or moderation data
NO search vendor lock without evidence
```

## 1. Corpora to assess

| Corpus | Privacy filter | Launch necessity (draft) |
|--------|----------------|--------------------------|
| Routes / Stages / Missions | Publish state only | High |
| Live Sky | Public/eligible events | High |
| Community | Non-removed; visibility rules | High |
| Users (public Crow identity) | Public fields only; minors protected | Medium–High |
| Evidence portfolio (public) | Explicit public artifacts only | Medium |
| Help | Public | High |
| Administration | Role-gated separate index | Medium |

## 2. Technical dimensions

| Dimension | Validation question | Spike |
|-----------|---------------------|-------|
| Indexing source | Catalogue vs projection | SPK-ARC-016 |
| Privacy filtering | Query-time + index-time | SPK-ARC-016 · 025 |
| Arabic normalization | Hamza/alef forms, etc. | SPK-ARC-016 |
| English normalization | Stemming/light | SPK-ARC-016 |
| Mixed technical text | Code tokens preserved | SPK-ARC-002 · 016 |
| Typo handling | Tolerance vs false expose | SPK-ARC-016 |
| Ranking / freshness | Non-gaming | SPK-ARC-016 |
| Deletion / moderation removal | Immediate hide | SPK-ARC-013 · 016 |
| Access control | Authz on admin search | SPK-ARC-019 |
| Degraded behavior | QAS-017 — safe empty/degraded | SPK-ARC-016 |
| DB-search fallback | Acceptable for launch? | SPK-ARC-016 |
| Vendor options | Compare in build-vs-buy | options register |

## 3. Hard non-exposures

* Private legal identity
* Restricted / quarantined Evidence
* Moderation case contents
* Trust internal notes
* Payment/invoice data

## 4. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
```

## 5. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §26 — search/discovery validation plan |
