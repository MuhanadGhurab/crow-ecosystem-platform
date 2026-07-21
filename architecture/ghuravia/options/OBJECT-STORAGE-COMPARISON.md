# Object Storage Comparison

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-OPT-OBJ-001 |
| **Version** | 1.0.0 |
| **Status** | **COMPARISON · DECISION DEFERRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-020 |

```text
DEFERRED WITH S3-COMPATIBLE ADAPTER LOCKED
```

## Options

| Option | S3 API | Notes |
|--------|--------|-------|
| AWS S3 | Native | Residency via region selection — legal TBD |
| Cloudflare R2 | Compatible | Egress savings |
| MinIO (self) | Compatible | Ops burden |
| Backblaze B2 | Compatible | Cost |
| Azure Blob (S3 gateway) | Partial | Interop caveats |

## Architecture requirement

All options must implement common port:

- `beginMultipart` / presign PUT
- Server-side encryption
- Quarantine prefix isolation
- No credential exposure to admin list APIs

## Decision

Provider **DEFERRED** — S3-compatible adapter locked (SPK-ARC-007 simulates locally).

## Non-claims

Regional compliance not validated. Cost projections not included.
