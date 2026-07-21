# Evidence Upload Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-EV-UPL-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-019 |
| **Evidence** | SPK-ARC-007 |

## Pattern

**Hybrid direct-to-storage with short-lived auth** (ADR-ARC-019 ACCEPTED).

```text
client → beginUpload (server) → chunked put with token → finalize → quarantine
```

## Controls (spike-proven)

| Control | Value |
|---------|-------|
| Token TTL | 15 minutes |
| Media allowlist | pdf, png, plain text (launch candidate) |
| Max size | 5 MB (spike); production TBD |
| Offset resume | Sequential chunk validation |
| Initial location | `quarantine/{ownerId}/...` |
| Admin API | No storage credentials exposed |

## Authorization

- Requires authenticated session + activation.
- Token bound to `ownerId`; chunk puts reject token mismatch.

## Arabic-first / a11y

Upload progress must be announced to screen readers; error strings Arabic-primary.

## Non-claims

Production CDN and multipart S3 not validated — adapter locked (ADR-ARC-020).
