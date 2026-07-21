# External Technical Validation Handoff

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-VAL-HAND-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE — HANDOFF READY** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |

## Handoff summary

GHV.ARCHITECTURE.1E completes the **Architecture Design Baseline** lock. The next programme segment addresses **external** proof that cannot be closed by spike harnesses alone.

```text
RECOMMENDED NEXT PROGRAMME: GHV.VALIDATION.1A
STATUS: NOT STARTED — do not begin in this Gate
```

## Scope for external validation

| Workstream | Open items | Authoritative inputs |
|------------|------------|---------------------|
| **Providers** | IdP · email · object storage · scanner · realtime · search · notify · observability · KMS · datastore host | [FINAL-PROVIDER-DEFERRAL-REGISTER.md](./FINAL-PROVIDER-DEFERRAL-REGISTER.md) |
| **Preview environment** | Preview/Production isolation on real infra | ADR-036 · SPK-021 · [DEPLOYMENT-ENVIRONMENT-VALIDATION-PLAN.md](../deployment/DEPLOYMENT-ENVIRONMENT-VALIDATION-PLAN.md) |
| **Load / performance** | Skyboard composition under realistic load | ADR-028 · SPK-023 |
| **Accessibility** | User validation beyond harness | ADR-026 · SPK-017 · [ACCESSIBILITY-TECHNICAL-VALIDATION-PLAN.md](../accessibility/ACCESSIBILITY-TECHNICAL-VALIDATION-PLAN.md) |
| **Arabic UX** | RTL typography · mixed-script · discovery quality | ADR-025 · SPK-002/016 · [ARABIC-FIRST-TECHNICAL-VALIDATION-PLAN.md](../localization/ARABIC-FIRST-TECHNICAL-VALIDATION-PLAN.md) |
| **Legal** | Retention durations · minor policy · regulatory framing | ADR-017 · ADR-023 · SPK-025 |
| **DR / continuity** | Operational backup/restore drill | ADR-035 · SPK-020 |
| **Security** | Penetration test · provider security review | COND-028 · threat models |
| **Saudi integrations** | Official Nafath / national ID access verification | ADR-038 |

## Inputs packaged by 1E

| Artifact | Purpose |
|----------|---------|
| [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](./GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md) | Baseline identity and lock status |
| [FINAL-ADR-REGISTRY.md](./FINAL-ADR-REGISTRY.md) | Decisions to validate against |
| [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](./FINAL-ARCHITECTURE-CONDITION-REGISTER.md) | Conditions to close |
| [FINAL-TECHNICAL-SPIKE-RECONCILIATION.md](./FINAL-TECHNICAL-SPIKE-RECONCILIATION.md) | Harness evidence baseline |
| [ARCHITECTURE-KNOWN-LIMITATIONS.md](./ARCHITECTURE-KNOWN-LIMITATIONS.md) | Limitations that must stay visible |
| [TECHNICAL-VALIDATION-TRACEABILITY.md](./TECHNICAL-VALIDATION-TRACEABILITY.md) | Product → spike → ADR map |

## Recommended programme: GHV.VALIDATION.1A

| Field | Value |
|-------|-------|
| **Proposed Gate ID** | GHV.VALIDATION.1A |
| **Objective** | Close non-blocking external / legal / user validation conditions |
| **Start trigger** | Founder authorization after 1E PARTIAL lock |
| **Explicit rule** | **Do not start** VALIDATION.1A within ARCHITECTURE.1E scope |

### Suggested VALIDATION.1A exit criteria (draft)

* Provider sandboxes PASS for launch-critical categories
* Preview environment isolated from Production on chosen host
* Arabic + a11y user validation reports filed
* Legal sign-off on retention and minor policy (or documented residual risk)
* DR drill executed with measured RPO/RTO
* Pen-test report with remediation plan
* No deferred provider falsely marked accepted

## Carry-forward separations (non-negotiable in validation)

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

## Explicit non-claims

This handoff document does **not** start GHV.VALIDATION.1A or authorize Product Code.

```text
Product Code: BLOCKED
Implementation: NOT GRANTED
External validation: NOT COMPLETE
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — external validation handoff |
