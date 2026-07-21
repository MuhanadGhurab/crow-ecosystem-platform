# Community and Moderation Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-COM-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §23 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-013 · SPK-ARC-016 · SPK-ARC-025 |
| **Related** | Community wireframes · Trust standing architecture · no DMs at controlled launch |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO direct messages (DMs) at controlled launch
Automated moderation ≠ final authority
NO Product Code
```

## 1. Purpose

Validate community and moderation architecture for a safe controlled launch Rookery without private DM channels.

## 2. Launch constraints

| Constraint | Status |
|------------|--------|
| No DMs at controlled launch | **LOCKED product constraint** — Team Space messaging only where governed |
| Public Crow identity vs private legal identity | Separated |
| Automated tools assist; humans decide contested cases | Required |
| Moderators do not silently rewrite Trust standing without policy | Required |

## 3. Validation surfaces

| Surface | Validation focus | Spike |
|---------|------------------|-------|
| Rookery content | Posts/comments model | SPK-ARC-013 |
| No DMs | Absence of DM feature in launch scope | SPK-ARC-013 |
| Contribution recognition | Distinct from XP purchase | SPK-ARC-013 |
| Reports | Intake → case | SPK-ARC-013 |
| Moderation actions | Audited; reversible via appeal | SPK-ARC-013 |
| Trust signals | Separate plane from authz | SPK-ARC-013 |
| Rate limiting / anti-spam | Abuse controls | SPK-ARC-013 |
| Arabic + English moderation | Bilingual tooling | SPK-ARC-002 · 013 |
| Minor-user safety | Hard restrictions | SPK-ARC-025 |
| Public identity display | Sanitized | SPK-ARC-025 |
| Private identity access | Restricted roles only | SPK-ARC-019 |
| Moderator decision evidence | Immutable case log | SPK-ARC-013 · 019 |
| Appeals | Due process path | SPK-ARC-019 |
| Retention / takedown | Search removal sync | SPK-ARC-016 |
| Blocking / muting | Only if in Scope | SPK-ARC-013 |
| Accessibility | Report/moderation UX | SPK-ARC-017 |
| Search exposure | No private/moderation leak | SPK-ARC-016 |
| Positive-community safeguards | Design + rate limits | SPK-ARC-013 |

## 4. Trust-state separation

```text
Moderation action (content/user case)
≠ automatic Trust ledger rewrite
Trust changes follow POL-TRU with audit
```

## 5. Pass / fail (future)

| Pass | Fail |
|------|------|
| Launch build has no DM channel | DM feature ships “temporarily” |
| Contested takedown has human path | Auto-mod is sole authority |
| Search hides removed content | Removed content remains discoverable |

## 6. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
Legal takedown SLAs NOT legal advice
```

## 7. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §23 — community/moderation validation plan |
