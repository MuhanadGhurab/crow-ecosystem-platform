# Client Enterprise Design Journey

> **Status:** PARTIAL — CROW.DISCOVERY.2 certification implementation  
> **Authority:** Advisory client selections only; no tenant provisioning, no Blueprint persistence, no authority grants.

## Canonical routes

| Route | Purpose |
| ----- | ------- |
| `/client` | Authenticated landing with enterprise-design entry points |
| `/client/requests/[requestId]/discovery/design` | Primary guided journey (10 steps) |
| `/client/requests/[requestId]/discovery/compare` | Starter / Growth / Enterprise comparison |
| `/client/requests/[requestId]/discovery/summary` | Submission summary |
| `/admin/requests/[requestId]` | ProCrow review panel + Model Forge handoff |

Legacy L4 wizard remains at `/client/requests/[requestId]/discovery`.

## Journey steps

1. Choose field (industry + specialist domains)
2. Define purpose
3. Current and target scale
4. Operating capabilities
5. Operating priority (Lean Responsible default)
6. Compare Starter / Growth / Enterprise
7. Lean responsible workforce
8. Workflow exploration
9. Customize with consequence preview
10. Review and submit to Discovery

## Product principles

- Crow recommends; client explores and confirms.
- Lean Responsible Operating Model uses **estimated ranges** and assumptions — never guaranteed headcount.
- Submission is a Discovery artifact reviewed by ProCrow before Blueprint finalization.

## Module boundary

`src/lib/client-enterprise-design/` — domain, composition, lean model, consequences, projections.  
Persistence: `client_enterprise_design` Discovery answer section via audited FTGP write path.

## Deployment

Certification only (`crow-ftgp-certification`). Production `main` unchanged.
