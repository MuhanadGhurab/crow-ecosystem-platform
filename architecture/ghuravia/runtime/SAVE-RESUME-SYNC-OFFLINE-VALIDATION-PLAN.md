# Save, Resume, Sync and Offline Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-RT-SYNC-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §28 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-006 · SPK-ARC-007 · SPK-ARC-015 |
| **Related** | QAS-001 Resume Active Mission · Frontend plan · Live Sky reconnect |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
DO NOT assume full offline mode
NO Product Code
```

## 1. Capability classes

| Class | Meaning | Examples (conceptual) |
|-------|---------|------------------------|
| **OFFLINE_CAPABLE** | Local draft may be created/edited and later synced with merge policy | Mission draft text answers (non-final) |
| **OFFLINE_READ_ONLY** | Cached read OK; writes blocked offline | Published catalogue; prior Flight Log snapshot |
| **RECONNECT_REQUIRED** | Must re-establish session/server before continue | Live Sky mid-event; Evidence finalize |
| **ONLINE_ONLY** | No meaningful offline | Activation consume; payment; Trust apply; admin correction; Evidence approval |

## 2. Surfaces to validate

| Surface | Class (draft) | Conflict / notes | Spike |
|---------|---------------|------------------|-------|
| Mission draft save | OFFLINE_CAPABLE | Last-write vs server merge explained | SPK-ARC-006 |
| Mission completion | ONLINE_ONLY / RECONNECT_REQUIRED | Eligibility checked server-side | SPK-ARC-006 |
| Evidence draft metadata | OFFLINE_CAPABLE (meta only) | Object bytes upload ONLINE | SPK-ARC-007 |
| Evidence upload / finalize | ONLINE_ONLY | Resumable but server commit | SPK-ARC-007 |
| Assessment draft (if allowed) | OFFLINE_CAPABLE or ONLINE_ONLY per policy | Timed exams ONLINE_ONLY | SPK-ARC-006 |
| Last active location | OFFLINE_CAPABLE → sync | Multi-device: server wins or prompt | SPK-ARC-006 |
| Flight Log | OFFLINE_READ_ONLY cache | Freshness indicator | SPK-ARC-006 |
| Reconnect / retry | RECONNECT_REQUIRED | Idempotent retries | SPK-ARC-006 · 015 |
| Multi-device | Prompt on conflict | User explanation required | SPK-ARC-006 |
| Queued actions | Only for OFFLINE_CAPABLE classes | Flush order defined | SPK-ARC-006 |
| Stale data | Show staleness | No silent authoritative overwrite of server | SPK-ARC-006 |
| Sensitive online-only | Activation, pay, mod, Trust | Hard block offline | SPK-ARC-003 · 012 · 013 |

## 3. Merge policy principles

1. Server is authoritative for completion, eligibility, entitlement, Trust, and progression.
2. Offline drafts never invent “completed” or “activated.”
3. Conflicts require user-visible explanation (Invariant 17 spirit).
4. Live Sky contributions use reconnect + dedupe (SPK-ARC-015).

## 4. Pass / fail (future)

| Pass | Fail |
|------|------|
| Offline draft survives refresh and syncs once | Double mission complete |
| Offline user cannot fake activation | LocalStorage “activated=true” honored |
| Live reconnect does not double-credit | Duplicate contribution |

## 5. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
Class assignments are draft until spike evidence
```

## 6. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §28 — save/resume/sync/offline plan |
