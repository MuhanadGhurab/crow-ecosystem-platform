# Development Operating Model

| Field | Value |
|-------|-------|
| **Title** | Development Operating Model |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Ad-hoc milestone practices |
| **Related decisions** | [ADR-012](decisions/ADR-012-define-design-build-certify-promote.md), [ADR-013](decisions/ADR-013-owner-acceptance-before-promotion.md), [ADR-014](decisions/ADR-014-repository-documentation-durable-ai-truth.md) |
| **Implementation state** | Process — applies immediately |

## Sequence

```
DEFINE → DESIGN → BUILD → CERTIFY → PROMOTE
```

### DEFINE

Lock: purpose, actors, domain states, transitions, artifacts, permissions, portal ownership, failure behavior, audit requirements.

### DESIGN

Lock: user journey, information hierarchy, visual composition, responsive behavior, interaction states, accessibility, representative data.

### BUILD

Implement **only** approved scope.

### CERTIFY

Validate in certification environment: behavior, visual output, authority boundaries, responsive behavior, state transitions, hosted-state effects, bundle containment, tests.

### PROMOTE

Only after **explicit owner acceptance:**

- Merge approved work
- Update canonical documentation
- Authorize Production promotion **separately**

**A Cursor report does not equal acceptance.** The deployed result is evidence. Owner review remains required.

## Milestone families

`CROW.PUBLIC.*` · `CROW.REQUEST.*` · `CROW.DISCOVERY.*` · `CROW.BLUEPRINT.*` · `CROW.COMMERCIAL.*` · `CROW.SUBSCRIPTION.*` · `CROW.TENANT.*` · `CROW.RUNTIME.*` · `CROW.CYBERCROW.*` · `CROW.SAREA.*` · `CROW.CROAI.*` · `CROW.GOVERNANCE.*` · `CROW.PM.*` · `CROW.PROCROW.*` · `CROW.CEM.*`

Delivery methodology (adaptive / predictive / hybrid) is defined in [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](12-PROJECT-MANAGEMENT-OPERATING-MODEL.md).

## Definition of Done

- Canonical rules respected
- Scope boundaries preserved
- Tests pass
- No unauthorized migration or hosted-state changes
- No cross-tenant exposure
- No payment/SAREA/CroAI-to-authority coupling
- Certification evidence exists
- Documentation matches implementation
- Owner reviewed the actual result
- Promotion explicitly authorized

## Durable milestone outputs

- Implementation or design artifact
- Tests
- Decision record when required
- Milestone evidence
- `CURRENT-STATE.md` update
- `GAP-LEDGER.md` update

## Repository validation commands

```bash
npm run typecheck
npm run lint
npm run build
```

Use domain-specific `*:verify` scripts per milestone. See `package.json` scripts.

## Related documents

- [`milestones/MILESTONE-TEMPLATE.md`](milestones/MILESTONE-TEMPLATE.md)
- [`AI-HANDOFF-PROTOCOL.md`](AI-HANDOFF-PROTOCOL.md)
- [`docs/internal/VALIDATION_PLAYBOOK.md`](../internal/VALIDATION_PLAYBOOK.md)
