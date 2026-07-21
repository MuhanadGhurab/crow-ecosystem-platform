# Public Evidence Sanitization Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-EV-SAN-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-025 |

## Principle

Raw Evidence never appears on public surfaces. Only **admin-approved sanitized derivatives** enter Crow public profile.

## Sanitization pipeline (conceptual)

```text
Evidence approved → optional public share request → redaction review → sanitized artifact → public profile projection
```

## Allowed on public profile

- Title/caption (user-authored, moderated)
- Thumbnail or static preview (no EXIF/metadata leak)
- Achievement linkage (capability id, non-sensitive label)

## Prohibited

- Original file download link on public profile
- Reviewer notes, scan diagnostics, quarantine paths
- Embedded PII detected in scan

## Minor accounts

Stricter subset — see MINOR-PUBLIC-PROFILE-SPIKE-RESULT.md.

## Conditions

Automated redaction tooling not validated; manual review path assumed for launch.

## Non-claims

DLP perfection not claimed. OCR-based PII strip deferred.
