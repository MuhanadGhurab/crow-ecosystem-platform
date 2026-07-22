# IMPLEMENTATION-0E — Screen / Journey Preflight

| Field | Value |
|-------|-------|
| **Gate** | GHV.IMPLEMENTATION.0E |
| **Date** | 2026-07-22 |
| **Starting HEAD** | `e28b43a4451da9188069fdc630d52f8c8c1c4f31` |
| **Screen inventory** | **92 ACTIVE · 7 shells · 0 aliases** (unchanged; no new screen IDs) |

## Screen disposition

| Screen | Pre-0E | 0E target |
|--------|--------|-----------|
| ONB-003 | 0D **HANDOFF ONLY** | **FULL** Nest Intro |
| ONB-004 | Not implemented | **FULL** readiness assessment |
| ONB-005 | Not implemented | **FULL** readiness result |
| ONB-006 | Not implemented | **HANDOFF ONLY** |
| ONB-007 | Not implemented | **HANDOFF ONLY** |

## Governed flow

```text
Origin COMPLETE or REVIEW_LATER
→ ONB-003 Nest Intro
→ Take readiness check → ONB-004
→ submit complete attempt → ONB-005
→ ONB-006 when Nest path required/chosen
or
→ ONB-007 when READY_TO_FLY / GUIDED_SKIP after acknowledge
```

Alternate from intro: **Start with The Nest** → ONB-006 handoff without assessment.

## Compatibility

`NEST_INTRO_HANDOFF` state and `ACK_NEST_INTRO_HANDOFF` remain valid. 0E extends meaning: acknowledgement opens readiness or Nest-path choices rather than terminal handoff-only UX.

## Non-changes

No new Master Screen Registry IDs. Activation formula unchanged. Journey phases unchanged.
