# SAREA — Human Experience Orchestration

**SAREA** (Structured Adaptive Role Experience Architecture) maps authenticated users to the right experience for their context — **without granting access**.

## Constitutional rule

> SAREA **never grants permissions**, **never grants membership**, and **does not replace RBAC**.

Re-exported from `src/lib/sarea/sarea-experience-mapping-contract.ts` and `src/lib/crow-core/sarea/`.

## Experience chain

```
Identity → Membership → Role → Permissions → Context → Responsibility → Work → Experience
```

SAREA operates only after permissions are resolved.

## Personas

| Persona | Experience emphasis |
|---------|---------------------|
| Requester | Simple intake |
| Frontline | Queue + next action |
| Specialist | Deep entity workspace |
| Manager | Team queue + SLA |
| Approver | Decision workspace |
| Executive | Exceptions + KPIs |
| Security operator | Signals + evidence |
| Auditor | Read-only timeline |
| Implementation operator | Configuration console |

## Studio vs runtime

- **Studio** (`/sarea/*`): design-time mapping (ProCrow)
- **Runtime** (`/[tenant]/*`): composed tenant surfaces

C5 will wire runtime composer; C0 documents target end state.
