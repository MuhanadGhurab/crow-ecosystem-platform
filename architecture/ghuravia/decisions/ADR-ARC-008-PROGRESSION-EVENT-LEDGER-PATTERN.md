# ADR-ARC-008 - Progression Event Ledger Pattern

| Field | Value |
|-------|-------|
| Decision ID | ADR-ARC-008 |
| Title | Progression Event Ledger Pattern |
| Status | ACCEPTED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Context
Progression logic must withstand retries, reversals, and historical reproduction while preserving strict separation from commercial entitlement events. The 1B progression spikes demonstrated a stable architecture pattern without requiring Product Code.

## Options Considered
- Append-only progression event ledger with derived ledgers.
- Mutable balance tables with in-place edits.
- Event ledger without formula version persistence.
- Commercial and progression events sharing the same XP write path.

## Constraints
- Product Code remains BLOCKED.
- Every progression event requires idempotency.
- Historical replay must preserve original formula behavior.
- Prestige remains human-only.
- Commercial events must never write XP.

## Quality Attributes
Primary drivers are auditability, reversibility, deterministic replay, and integrity under retry.

## Security
Append-only records reduce silent tampering risk. Reversals must be explicit and attributable rather than hidden mutations.

## Privacy
Ledger events should be minimal, purpose-bound, and separated from user-facing projections. Sensitive correction reasons should remain controlled.

## Accessibility
No direct a11y effect. Reliable and explainable progression state improves trust in user-facing feedback.

## Localization
Event semantics remain locale-neutral while allowing localized labels and explanations in projections.

## Cost
Append-only plus derived ledgers increase storage volume modestly but sharply reduce ambiguity and repair cost.

## Operability
Replayable ledgers simplify founder diagnosis of disputes, reversals, and progression anomalies.

## Evidence
- `spikes/ghuravia/architecture-1b/SPK-ARC-010/RESULT.md`
- `spikes/ghuravia/architecture-1b/SPK-ARC-011/RESULT.md`
- `architecture/ghuravia/progression/PROGRESSION-LEDGER-SPIKE-RESULT.md`

## Decision
ACCEPTED:
- Use an append-only progression event ledger.
- Maintain transactional derived ledgers/projections.
- Require an idempotent `eventId`.
- Require `formulaVersion` on replay-relevant records.
- Permit local recalculation from the authoritative ledger.
- Prestige is human-only.
- Commercial events never write XP.

## Consequences
- Progression correction flows must create new compensating events rather than silently overwrite history.
- Formula versioning becomes a hard architectural invariant.
- Projection rebuilds remain possible without re-authoring business history.

## Reversal Cost
High. Replacing this pattern later would affect auditability, replay, support workflows, and domain invariants.

## Validation Status
ACCEPTED based on SPK-ARC-010 and SPK-ARC-011 PASS evidence.

## Related Spike
SPK-ARC-010, SPK-ARC-011

## Revision History
| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B decision accepted |
