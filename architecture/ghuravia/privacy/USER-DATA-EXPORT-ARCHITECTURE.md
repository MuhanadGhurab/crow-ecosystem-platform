# User Data Export Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-PRIV-EXP-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED WITH LEGAL CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## 1. Purpose

Define export scope, format, and security for user-requested data portability.

## 2. Export bundle (conceptual)

| Included | Excluded |
|----------|----------|
| Account metadata | Other users' PII |
| Crow profile fields | Trust raw signals |
| Learning history summary | Moderation internals |
| Progression summary | Reviewer notes on others |
| Evidence metadata list | Raw Evidence files (optional separate secured delivery) |
| Own invoices (if commerce active) | Audit of other users |

## 3. Security

- Assurance A2 (step-up) required before export generation.
- Async job produces encrypted archive; download link TTL **24h** (candidate).
- Audit export request and completion.

## 4. Arabic-first

Export manifest and field labels available in Arabic where user locale is `ar`.

## 5. Conditions

Legal scope of mandatory fields — **LEGAL VALIDATION REQUIRED**.

## 6. Non-claims

```text
Export UX not implemented — Product Code BLOCKED
Cross-border transfer of export not validated
```
