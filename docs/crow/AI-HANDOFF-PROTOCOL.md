# AI Handoff Protocol

| Field | Value |
|-------|-------|
| **Title** | AI Handoff Protocol |
| **Status** | CANONICAL |
| **Authority** | CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Ad-hoc session handoffs |
| **Implementation state** | Process — required for agent transitions |

When one AI agent hands work to another (or to a human), include **all** fields below in the handoff message or milestone evidence doc.

## Required handoff fields

| Field | Description |
|-------|-------------|
| **milestone** | Active milestone ID (e.g. `CROW.GOVERNANCE.1`, `FTGP_1H`) |
| **objective** | What the next agent should accomplish |
| **repository** | Path and remote URL |
| **branch** | Working branch name |
| **starting HEAD** | Commit SHA at handoff start |
| **final HEAD** | Commit SHA at handoff end |
| **files changed** | List of created/modified/deleted files |
| **decisions made** | Locked decisions during the session |
| **canonical docs read** | Which `docs/crow/` files were consulted |
| **tests run** | Commands and pass/fail results |
| **migrations** | Any migration files created or applied (must be NONE unless authorized) |
| **hosted-state delta** | Any hosted DB or Vercel changes (must be NONE unless authorized) |
| **environment** | local / preview / certification / production |
| **known gaps** | References to `GAP-LEDGER.md` IDs |
| **protected areas** | Domains that must not be touched |
| **next safe action** | Single recommended next step within scope |
| **owner review status** | Pending / Accepted / Rejected — **never assume Accepted** |

## Handoff template

```markdown
## AI Handoff — [Milestone ID]

- **Objective:**
- **Repository:** D:/CYBERCROW
- **Branch:**
- **Starting HEAD:**
- **Final HEAD:**
- **Files changed:**
- **Decisions made:**
- **Canonical docs read:**
- **Tests run:**
- **Migrations:** NONE | [details]
- **Hosted-state delta:** NONE | [details]
- **Environment:**
- **Known gaps:** GAP-xxx, ...
- **Protected areas:**
- **Next safe action:**
- **Owner review status:** Pending
```

## Rules

1. Never claim owner acceptance in a handoff unless explicitly confirmed
2. If authority conflict was found, document it — do not hide resolution
3. Link to `CURRENT-STATE.md` updates if implementation changed
4. Prefer committing durable evidence before handoff

## Related documents

- [`milestones/MILESTONE-TEMPLATE.md`](milestones/MILESTONE-TEMPLATE.md)
- [`AGENTS.md`](../../AGENTS.md)
