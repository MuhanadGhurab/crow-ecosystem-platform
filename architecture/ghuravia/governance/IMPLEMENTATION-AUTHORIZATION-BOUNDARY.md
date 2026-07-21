# Implementation Authorization Boundary

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-IMPL-BND-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |

## Current authorization state

```text
Product Code:        BLOCKED
Implementation:      NOT GRANTED
Production deploy:   NOT GRANTED
External validation: NOT COMPLETE
```

GHV.ARCHITECTURE.1E locks the **Architecture Design Baseline** only. It does **not** grant permission to write Product Code, provision cloud resources, or deploy.

## What 1E authorizes

| Authorized | Description |
|------------|-------------|
| Architecture design baseline lock | ADR-001…038 · spike reconciliation · condition register |
| Continued spike-local harness work | Only under NON-PRODUCT spike rules |
| External validation programme planning | Handoff to GHV.VALIDATION.1A (recommended — not started here) |
| Editorial updates to governance docs | Per ARCHITECTURE-CHANGE-FREEZE-POLICY |

## What 1E does NOT authorize

| Not authorized | Reason |
|----------------|--------|
| `src/` / `apps/` Product Code | Explicit programme boundary |
| Root `package.json` for product app | Docs-first posture retained |
| Database schemas / migrations in product paths | Implementation gate required |
| `.env` / production secrets | No deployment authorization |
| Cloud resource provisioning | External validation required |
| Provider vendor lock-in without sandbox evidence | FINAL-PROVIDER-DEFERRAL-REGISTER |
| Learning / Progression formula edits | Separate locked baselines |

## Locked separations (implementation must preserve)

```text
Auth ≠ Activation ≠ Authorization ≠ Entitlement ≠ Progression
Crow ≠ Private Legal Identity
Evidence Object ↛ Progression Ledger
Commercial ↛ Progression
Notification fail ↛ Business state
Spectator ↛ Participant mutation
Trust non-public non-numeric
Scanning fail-closed
Deny by default
```

## Future gates required before implementation

| Gate / programme | Purpose | Prerequisite |
|------------------|---------|--------------|
| **GHV.VALIDATION.1A** *(recommended)* | External technical validation — providers, Preview, load, a11y, Arabic UX, legal, DR, pen-test | 1E lock complete |
| **GHV.IMPLEMENTATION.1A** *(future)* | Product Code authorization boundary | Validation conditions materially closed or explicitly accepted |
| **Provider sandbox gates** | IdP · storage · scanner · realtime · notify · observability | Per FINAL-PROVIDER-DEFERRAL-REGISTER |
| **Legal clearance gate** | Retention · minor policy · Saudi access | Per FINAL-ARCHITECTURE-CONDITION-REGISTER |
| **Controlled launch gate** | Production SLOs · DR drill · user validation | Per ARCHITECTURE-KNOWN-LIMITATIONS |

## Implementation entry criteria (summary)

Before Product Code is authorized, the programme expects at minimum:

1. Explicit Implementation Gate PASS with Founder approval
2. Material external validation evidence (or documented acceptance of residual risk)
3. Provider selections recorded with sandbox PASS — not adapter-only deferral
4. No RETURN TO SPIKE items open for implementation-blocking architecture questions
5. Screen baseline unchanged or change-controlled via CR
6. Learning and Progression baselines remain compatible (no silent drift)

## Explicit non-claims

Architecture Design Baseline lock is **necessary but not sufficient** for implementation.

## Related

- [EXTERNAL-TECHNICAL-VALIDATION-HANDOFF.md](./EXTERNAL-TECHNICAL-VALIDATION-HANDOFF.md)
- [ARCHITECTURE-KNOWN-LIMITATIONS.md](./ARCHITECTURE-KNOWN-LIMITATIONS.md)
- [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](./GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md)

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — implementation authorization boundary |
