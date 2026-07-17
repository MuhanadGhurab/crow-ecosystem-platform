# C2 — Approval and traceability runtime

## Approval transaction (`approveBlueprintVersion`)

Single transaction:

1. Authorize `blueprint.approve`
2. Load tenant-scoped exact version
3. Verify lifecycle, revision, hash, snapshot validation, readiness, SoD
4. Persist `BlueprintApproval` evidence (version + hash + approver + rationale)
5. Mark version approved and current; supersede prior current-approved
6. Append `BlueprintTraceEvent`

No runtime configuration deployment occurs at approval.

## Trace events

`BlueprintTraceEvent` is append-oriented (no normal update/delete in services). Actor types: `HUMAN`, `AI_ASSISTANT`, `AUTOMATION`, `SERVICE_ACCOUNT`, `INTEGRATION`, `SYSTEM_PROCESS`.

Metadata must not contain secrets or full snapshot payloads.

## Evidence retention

Approval rows use restrictive delete semantics — approved evidence must not disappear via ordinary cascade.
