# Arabic-First Technical Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-LOC-AR-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §29 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-002 · SPK-ARC-016 · SPK-ARC-017 |
| **Related** | Frontend plan · Search plan · Accessibility plan |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
Arabic-first ≠ Arabic-only
English expansion must not require architecture replacement
NO Product Code
```

## 1. Principles

1. Default learner experience is Arabic-first for controlled Saudi launch.
2. English must be a first-class locale without forking architecture.
3. Technical islands remain logically LTR inside RTL shells.
4. Missing translation must fail safely (fallback + visible gap), never silent wrong language for legal/activation.

## 2. Validation surfaces

| Surface | Requirement | Spike |
|---------|-------------|-------|
| RTL shells | 7 shells mirror correctly | SPK-ARC-002 |
| LTR technical islands | Code, CLI, IPs, paths, URLs | SPK-ARC-002 |
| Tables / charts / timelines | Axis and column order correct | SPK-ARC-002 |
| Diagrams (incl. Mermaid) | Direction policy documented | SPK-ARC-002 |
| Number / date / currency / percent | Locale formats | SPK-ARC-002 |
| Search | Arabic + English normalization | SPK-ARC-016 |
| Error messages | Localized contracts | SPK-ARC-002 |
| Notification templates | AR/EN | SPK-ARC-018 |
| Evidence rubrics | Bilingual reviewer/learner | SPK-ARC-002 |
| Progression explanations | Localized explainability | SPK-ARC-002 |
| Screen-reader order | Matches visual RTL | SPK-ARC-017 |
| Language switching | Runtime switch without reload corruption | SPK-ARC-002 |
| Content fallback | Explicit | SPK-ARC-002 |
| Missing translation handling | Block legal flows if mandatory string missing | SPK-ARC-002 · 003 |

## 3. Pass / fail (future)

| Pass | Fail |
|------|------|
| Code block selectable LTR in Arabic shell | Mirrored code / broken copy |
| Activation legal strings correct locale | English-only terms for AR user without consent |
| EN locale works on same architecture | Separate EN-only rewrite required |

## 4. Limitations

```text
VALIDATION PLAN ONLY · Linguist EXT review NOT RUN · SPIKES NOT RUN
```

## 5. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §29 — Arabic-first technical validation plan |
