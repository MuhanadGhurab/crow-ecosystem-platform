# Crow Core — Overview

> **Governance note (2026-07-04):** Canonical product direction and AI entry live in [`docs/crow/START-HERE.md`](../../crow/START-HERE.md) and [`docs/crow/00-CROW-CONSTITUTION.md`](../../crow/00-CROW-CONSTITUTION.md). This document remains the **C0 specialist reference** for Crow Core contracts and Architecture Lab scope.

Crow Core C0 establishes the **canonical operating architecture** for the Crow ecosystem: a persistence-neutral contract layer, constitutional documentation, and a protected Architecture Lab prototype. C0 does not migrate production data, weaken auth, or ship live government integrations.

## Platform model

| Surface | Role |
|---------|------|
| **Public website** | Acquisition, trust, entry to discovery |
| **Client portal** | Discovery, blueprint review, commercial engagement |
| **ProCrow** | Platform console — configure, govern, release |
| **Enterprise business portal** | Tenant runtime — departments, work, decisions |

| Fabric component | Role |
|------------------|------|
| **CEM** | Process fabric — operational work instances |
| **CyberCrow** | Trust, risk, evidence signals (advisory; not SIEM/EDR) |
| **SAREA** | Human experience orchestration — composition only |
| **Crow Intelligence** | Advisory recommendations with human-in-the-loop |
| **Integration gateway** | Scoped external capability cards (assessment-first) |

**Enterprise Blueprint** binds approved intent, commercial artifacts, and deployment targets across surfaces.

## Responsibility boundaries

- **RBAC / Permission** → access only
- **SAREA** → composition only; **never grants permissions or membership**
- **CyberCrow** → trust signals and recommended actions; not autonomous SOC
- **CEM** → operational work instances and handoffs
- **ProCrow** → configuration, governance, release
- **Blueprint** → approved intent + commercial artifacts (ROI, SOW)
- **Government identity (e.g. Nafath)** → identity assurance only; **not** Crow authorization

## Traceability constitution

Every material change must be traceable:

```
Discovery evidence → Blueprint version → Commercial impact → Approval
  → Change request → Configuration release → Runtime deployment
  → Verification evidence → Operating history
```

Actor types include `human`, `system`, `ai_assistant`, and `automation`. AI and automation actors must never bypass approval for material tenant or security changes.

## Canonical contract namespace

TypeScript contracts live under `src/lib/crow-core/`. Existing `*-contract.ts` files remain authoritative where they encode constitutional rules; Crow Core re-exports or extends them without duplicating semantics.

## C0 scope

**In scope:** 15 architecture documents, contracts, Architecture Lab (`/admin/architecture-lab`), verifier (`crow-core-foundation:verify`).

**Out of scope:** Prisma migrations, production auth changes, M4D/PR #2 work, live Saudi government APIs, autonomous AI actions.

## Related documents

See `01`–`14` in this directory and `docs/internal/C0_UNIVERSAL_OPERATING_ARCHITECTURE_EXPERIENCE_FOUNDATION.md`.
