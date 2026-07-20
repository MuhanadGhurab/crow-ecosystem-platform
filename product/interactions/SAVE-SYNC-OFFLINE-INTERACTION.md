# Save, Sync and Offline Interaction

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-SYNC-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [INTERACTION-GRAMMAR.md](./INTERACTION-GRAMMAR.md) · [SCOPE-BASELINE.md](../../governance/scope/SCOPE-BASELINE.md) §3.14 |
| **Scope** | CORE FOUNDATION + CONTROLLED LAUNCH |
| **Unresolved** | Exact offline depth — PENDING TECHNICAL VALIDATION |
| **Change history** | 1.0.0 — PD.3 |

## User-visible states

| State | Meaning | UI |
|-------|---------|-----|
| Saving | Write in flight | Subtle chip / header indicator |
| Saved | Server or durable draft ack | Quiet confirmation; timestamp on demand |
| Offline Draft | Local durable draft | Persistent banner: Offline Draft |
| Syncing | Uploading/reconciling | Chip: Syncing |
| Conflict Detected | Divergent versions | Blocking sheet: keep both until user chooses |
| Sync Failed | Retryable failure | Banner + Retry; work retained |
| Recovery Available | Recovery point exists | List timestamp + device; Restore |

## Rules

1. Saving status is visible but unobtrusive.
2. User work is never silently discarded.
3. Offline limitations are explicit.
4. Supported draft work may continue offline; unsupported actions disabled with reason.
5. Conflicts preserve both versions until confirmed resolution.
6. Recovery points show timestamp and source device.
7. Destructive conflict resolution requires confirmation.
8. **Submit** (Evidence, payment, assessment final) requires confirmed server sync unless a documented exception exists (none at launch without Spike evidence).

## Mission Exit

Save and Exit ≠ Submit. Exit shows current sync state before leaving Mission Focus.
