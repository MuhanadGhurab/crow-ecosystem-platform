# Implementation Blocker Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-VAL-1A-BLK-001 |
| **Gate ID** | GHV.VALIDATION.1A |
| **Version** | 1.0.0 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |
| **Implementation-authorization blockers (Product Code path)** | **17** |

## Classification key

| Class | Meaning |
|-------|---------|
| **BLOCKS PRODUCT CODE AUTHORIZATION** | Must close before Product Code Authorization |
| **BLOCKS PREVIEW** | Prevents Preview runtime or Preview-scoped proof |
| **BLOCKS LAUNCH** | Blocks controlled launch |
| **NON-BLOCKING** | Tracked; does not block Product Code @ 1A close |

```text
NOT AVAILABLE ≠ waived
NOT AVAILABLE ≠ FAIL
Product Code: BLOCKED
Implementation Authorization: NOT GRANTED
```

## Blocker register

| ID | Blocker | Severity | Class | Condition / tracking | Status @ 1A |
|----|---------|----------|-------|----------------------|-------------|
| BLK-VAL-001 | Preview database absent (`DATABASE_URL` / `DIRECT_URL`) | **CRITICAL** | **BLOCKS PRODUCT CODE** · **BLOCKS PREVIEW** | TECH-018 · COND-022 · COND-032 | **OPEN** |
| BLK-VAL-002 | Governed Preview secrets injection path undefined | **HIGH** | **BLOCKS PRODUCT CODE** · **BLOCKS PREVIEW** | TECH-018 | **OPEN** |
| BLK-VAL-003 | Preview/Production external infra isolation unproven | **HIGH** | **BLOCKS PRODUCT CODE** · **BLOCKS PREVIEW** | COND-022 · ADR-036 | **OPEN** |
| BLK-VAL-004 | IdP provider sandbox NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-009 | **OPEN** |
| BLK-VAL-005 | Email / contact deliverability sandbox NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-010 | **OPEN** |
| BLK-VAL-006 | Object storage isolation proof NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-011 | **OPEN** |
| BLK-VAL-007 | Scanner vendor benchmark NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-012 | **OPEN** |
| BLK-VAL-008 | Payment processor sandbox NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | ADR-029 | **OPEN** |
| BLK-VAL-009 | Realtime provider sandbox NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-016 | **OPEN** |
| BLK-VAL-010 | KMS / encryption provider NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-015 | **OPEN** |
| BLK-VAL-011 | Search at scale NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-017 | **OPEN** |
| BLK-VAL-012 | Notification deliverability sandbox NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-018 | **OPEN** |
| BLK-VAL-013 | Observability provider + cost validation NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-019 | **OPEN** |
| BLK-VAL-014 | Skyboard load budget NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-021 | **OPEN** |
| BLK-VAL-015 | Migration rehearsal NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-026 | **OPEN** |
| BLK-VAL-016 | Rollback rehearsal NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-026 | **OPEN** |
| BLK-VAL-017 | Penetration test NOT RUN | **HIGH** | **BLOCKS PRODUCT CODE** | COND-028 | **OPEN** |
| BLK-VAL-018 | DR restore drill NOT RUN | **HIGH** | **BLOCKS LAUNCH** | COND-020 | **OPEN** |
| BLK-VAL-019 | Legal / privacy NOT APPROVED | **HIGH** | **BLOCKS LAUNCH** | COND-013/014/023/029 | **OPEN** |
| BLK-VAL-020 | Accessibility user validation NOT RUN | **MEDIUM** | **BLOCKS LAUNCH** | COND-008 | **OPEN** |
| BLK-VAL-021 | Arabic UX user validation NOT RUN | **MEDIUM** | **BLOCKS LAUNCH** | COND-007 | **OPEN** |

## Summary by class

| Class | Count | IDs |
|-------|------:|-----|
| **BLOCKS PRODUCT CODE AUTHORIZATION** | **17** | BLK-VAL-001..017 |
| **BLOCKS PREVIEW** (subset) | **3** | BLK-VAL-001..003 |
| **BLOCKS LAUNCH** | **4** | BLK-VAL-018..021 |
| **NON-BLOCKING @ 1A** | **0** |

Controlled launch minimum (identity + storage + scanning + payment): **BLK-VAL-004, 006, 007, 008** — all **OPEN**.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.VALIDATION.1A — implementation blocker register |
