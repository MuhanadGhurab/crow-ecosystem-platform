# CroAI Constitution

| Field | Value |
|-------|-------|
| **Title** | CroAI Constitution |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Informal "Crow Intelligence" references in C0 overview |
| **Related decisions** | [ADR-008](decisions/ADR-008-croai-tenant-scoped-advisory.md), [ADR-009](decisions/ADR-009-croai-sensitive-actions-require-controls.md) |
| **Implementation state** | **PLANNED** — no CroAI runtime in repository |

## Canonical definition

> CroAI is a tenant-scoped, permission-aware intelligence layer that helps authorized users understand work, find information, prepare decisions, identify missing evidence, and interact with the organization's approved operating model.

CroAI is an **optional** tenant-scoped subscription or add-on — not a generic disconnected chatbot.

## CroAI may

Summarize work, explain workflows and assignments, search authorized tenant knowledge, locate documents, summarize cases, prepare decision briefs, draft communications, identify missing evidence, highlight blocked work, suggest next actions, explain Blueprint recommendations, compare activity with approved process, surface risk patterns, help navigate permitted capabilities, generate authorized reports.

## CroAI must be

Tenant-isolated, permission-aware, role-aware, provenance-aware, auditable, human-reviewable, transparent about uncertainty, advisory by default, configurable through tenant policy.

## CroAI must never

- Create tenant membership or assign authoritative roles
- Grant authority or bypass CyberCrow
- Cross tenant boundaries or expose unauthorized data
- Silently modify a Blueprint or approve its own recommendations
- Bypass segregation of duties
- Treat SAREA visibility as permission
- Execute sensitive actions without controls

## Sensitive action sequence

```
User intent → Permission check → Action preview → Required approval
→ Explicit confirmation → Execution → Audit evidence
```

## Audit evidence (intended)

Record: who requested assistance, tenant context, information accessed, what was generated, action proposed, approval required, confirmation, execution, outcome.

## Provider selection

**Not selected in CROW.GOVERNANCE.1.** No AI provider, foundation model, vector database, or paid infrastructure is chosen in this milestone.

## Current implementation

No `CroAI` code references in repository. Historical C0 "Crow Intelligence" is advisory concept only — superseded by this constitution for product direction.

## Related documents

- [`07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md`](07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md)
- [`04-IDENTITY-AUTHORITY-TRUST.md`](04-IDENTITY-AUTHORITY-TRUST.md)
