# Evidence Platform Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-EVD-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §22 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-007 · SPK-ARC-008 · SPK-ARC-009 · SPK-ARC-020 |
| **Related baselines** | Learning Evidence rubrics · GRAPH-LAYER-SEPARATION · Progression event validity |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO Product Code · NO object-store brand lock · NO schema
Provider-neutral interfaces only (conceptual)
```

## 1. Purpose

Validate Evidence platform concerns while keeping four layers separate.

## 2. Mandatory separation

| Layer | Holds | Must not hold |
|-------|-------|---------------|
| **Evidence Metadata** | IDs, owner, type, hash refs, privacy class, status | Raw bytes; ledger totals |
| **Evidence Object** | Binary/object payload in isolated storage | Progression standing |
| **Evidence Review** | Rubric scores, reviewer notes, decisions | Payment entitlements |
| **Evidence Progression Effect** | Emitted progression events / grants after decision | Object bytes |

**Rule:** Do not store raw Evidence inside progression ledgers.

## 3. Validation surfaces

| Surface | Requirement | Spike |
|---------|-------------|-------|
| Upload initiation | Authz + size/type precheck | SPK-ARC-007 |
| Resumable upload | Safe retry; no corrupt finalize | SPK-ARC-007 |
| Size limits / file types | Policy enforced server-side | SPK-ARC-007 |
| Object storage | Isolated bucket/prefix; signed access | SPK-ARC-007 |
| Metadata | Strong consistency with object pointer | SPK-ARC-007 |
| Hashing | Integrity verification | SPK-ARC-007 |
| Secret scanning | Block/quarantine secrets | SPK-ARC-008 |
| Malware scanning | Quarantine before review | SPK-ARC-008 |
| Quarantine / redaction | Safety workflow | SPK-ARC-008 |
| Synthetic-data enforcement | Launch policy | SPK-ARC-007 |
| Privacy classes | Gate reviewer visibility | SPK-ARC-007 · 025 |
| Reviewer access | Least privilege; time-boxed | SPK-ARC-009 |
| Signed access | Short-lived URLs | SPK-ARC-007 |
| Retention / deletion | Policy + legal hold | SPK-ARC-020 |
| Revocation | Cascade to progression (targeted) | SPK-ARC-009 |
| Public sanitized artifact | Explicit allow-list only | SPK-ARC-007 |
| Appeal / audit | Mandatory decision trail | SPK-ARC-019 |
| Region / provider constraints | Saudi / residency questions | SPK-ARC-007 · integrations |
| Cost | Object + scan cost drivers | capacity plan |

## 4. Progression handoff

```text
Review decision committed
→ emit progression effect event(s) with idempotency key
→ targeted recalculation
≠ rewrite Learning Graph prerequisites
≠ grant entitlement
```

## 5. Provider-neutral conceptual interfaces

| Interface | Responsibility |
|-----------|----------------|
| `ObjectStore` | Put/get/delete/sign |
| `ScanPipeline` | Malware + secret results |
| `EvidenceRegistry` | Metadata state machine |
| `ReviewWorkbench` | Human decisions |
| `ProgressionEmitter` | Idempotent event publish |

Brands: **DECISION PENDING** — compare in build-vs-buy register after evidence.

## 6. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · NO provider selected
```

## 7. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §22 — evidence platform validation plan |
