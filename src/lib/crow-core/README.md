# Crow Core contract layer (C0)

Persistence-neutral TypeScript contracts for the **Universal Operating Architecture**. These types document constitutional rules and cross-cutting platform semantics without coupling to Prisma, UI, or runtime services.

## Constitutional rules (enforced in docs + verifier)

1. **SAREA** shapes experience only — never grants access or permissions.
2. **Government identity** (e.g. Nafath) is assurance only — not Crow authorization.
3. **Traceability** — material tenant changes follow the discovery → blueprint → commercial → approval → release → runtime → evidence chain.
4. **CyberCrow** — trust signals and evidence; not SIEM/EDR/autonomous SOC.
5. **AI** — labeled actors; prohibited autonomous high-risk actions.
6. **Blueprint** — includes ROI model and SOW draft structures (advisory until approved).

## Relationship to existing contracts

| Crow Core module | Existing repo contract |
|------------------|------------------------|
| `sarea/` | `src/lib/sarea/sarea-experience-mapping-contract.ts` (M2) |
| `process/` | `src/lib/cem/cem-operating-model-contract.ts`, `cem-transaction-workflow-contract.ts` |
| `security/` | `src/lib/procrow/procrow-control-tower-contract.ts`, CyberCrow advisory surfaces |
| `decision/` | `src/lib/constants/task-approval-engine-depth.ts` (G8) |

## Usage

Import from `@/lib/crow-core` in Architecture Lab, verifiers, and future C1+ services. Do not import Prisma or React in this tree.
