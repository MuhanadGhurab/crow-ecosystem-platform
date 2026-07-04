# Milestone Template

| Field | Value |
|-------|-------|
| **Title** | Crow Milestone Template |
| **Status** | CANONICAL |
| **Authority** | CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Usage** | Copy for each new milestone under `docs/crow/milestones/` or `docs/internal/` |

---

## [MILESTONE-ID] — [Title]

| Field | Value |
|-------|-------|
| **Status** | Draft / In Progress / Certifying / Pending Owner / Passed / Blocked |
| **Owner decision** | [Explicit owner authorization reference or Pending] |
| **Branch** | |
| **PR** | |

### Purpose

[One paragraph — why this milestone exists]

### Source documents

- [`docs/crow/...`](../...)
- [Specialist references]

### Current repository truth

[What exists today — cite `CURRENT-STATE.md` and evidence paths]

### In scope

- [ ]

### Out of scope

- [ ]

### Protected boundaries

- [ ] Payment ≠ authority
- [ ] SAREA ≠ authority
- [ ] CroAI ≠ authority
- [ ] No unauthorized migrations
- [ ] No hosted writes
- [ ] No Production changes
- [Other domain-specific]

### Expected artifacts

- [ ] Code / design artifact
- [ ] Tests
- [ ] Decision record (if required)
- [ ] Milestone evidence doc
- [ ] `CURRENT-STATE.md` update
- [ ] `GAP-LEDGER.md` update

### Domain states

| State | Transitions | Guards |
|-------|-------------|--------|
| | | |

### Authority effects

[What roles/permissions may change — usually NONE]

### Database effects

[Models/migrations — or NONE]

### Public-route effects

[Routes affected — or NONE]

### Test gates

```bash
npm run typecheck
npm run lint
npm run build
# domain-specific:
npm run [milestone]:verify
```

### Certification plan

[Environment, evidence type, owner UAT steps]

### Owner acceptance criteria

- [ ] Deployed/preview result reviewed by owner
- [ ] Authority boundaries verified
- [ ] Documentation matches implementation

### Promotion requirements

- [ ] Explicit owner authorization to merge
- [ ] Separate authorization for Production (if applicable)

### Final evidence

[Links to commits, screenshots, verifier output, PR URL]

---

## Milestone ID families

`CROW.PUBLIC.*` · `CROW.REQUEST.*` · `CROW.DISCOVERY.*` · `CROW.BLUEPRINT.*` · `CROW.COMMERCIAL.*` · `CROW.SUBSCRIPTION.*` · `CROW.TENANT.*` · `CROW.RUNTIME.*` · `CROW.CYBERCROW.*` · `CROW.SAREA.*` · `CROW.CROAI.*` · `CROW.GOVERNANCE.*`

## Definition of Done

Per [`11-DEVELOPMENT-OPERATING-MODEL.md`](../11-DEVELOPMENT-OPERATING-MODEL.md).
