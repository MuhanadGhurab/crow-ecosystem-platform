# J7 — ProCrow Operator Docs & Validation Console (no paid infra)

**Status:** Passed (27 May 2026)  
**Audience:** Internal operators / engineering  
**Scope:** Read-only **documentation index** and **validation command catalog** — manual terminal execution only. **Not** a script runner, not CI/CD, not compliance certification.

---

## 1. Operator / validation audit (Part 1)

### 1.1 Documentation corpus

| Area | Documents indexed |
|------|-------------------|
| Start here | `PROCROW_OPERATOR_INDEX.md`, `J7_OPERATOR_DOCS_VALIDATION_CONSOLE.md`, `VALIDATION_PLAYBOOK.md`, `GIT_SAFETY_GUIDE.md` |
| Deployment | `J6_DEPLOYMENT_GO_NO_GO_CENTER.md`, `F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`, `F16_GO_NO_GO_MATRIX.md`, `F16_DEPLOYMENT_RUNBOOK.md` |
| Client | `CLIENT_PORTAL_RUNBOOK.md`, `I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md` |
| J-track | `J1`–`J6` phase docs + this J7 doc |
| Demo | `OPERATOR_DEMO_INDEX.md`, `H1_PRODUCT_POLISH_DEMO_REHEARSAL.md` |

### 1.2 Validation command source of truth

- **J6** `buildProCrowValidationCommandIndex()` in `procrow-go-no-go-contract.ts` — canonical command list (names, purpose, risk, demo/push/prod flags).
- **J7** `buildProCrowOperatorValidationCommands()` — maps J6 index + overlay maps (`COMMAND_CATEGORY`, `COMMAND_PROVES`, `COMMAND_RELATED_DOC`, risk mapping) — **no duplicate command rows**.

### 1.3 Gap addressed by J7

J6 answers “are we ready to consider deploy?” with gates and a compact command list. Operators still needed a **single runbook-oriented surface** for internal docs, category-grouped commands, proves text, and explicit manual-execution warnings — without duplicating J6 gate logic.

---

## 2. Data model result

**File:** `src/lib/procrow/procrow-operator-console-contract.ts`

- `ProCrowOperatorDocItem`, `ProCrowValidationCommandItem`, `ProCrowOperatorConsoleSnapshot`
- `PROCROW_OPERATOR_DOC_INDEX` — static metadata (paths are repo-relative, not public routes)
- `buildProCrowOperatorValidationCommands()` — J6 index + J7 overlays

---

## 3. Service result

**File:** `src/lib/services/procrow-operator-console.service.ts` (`server-only`)

- `getProCrowOperatorConsoleSnapshot()` — docs, validation commands, recommended reading/commands, safety warnings, next actions
- **Does not:** read markdown from disk, execute shell, access secrets, call Prisma

---

## 4. UI / route result

| Component | Role |
|-----------|------|
| `procrow-operator-console.tsx` | Page shell; links to go/no-go + queue |
| `procrow-docs-index-panel.tsx` | Doc index by category |
| `procrow-validation-command-panel.tsx` | Command index by category + risk badges |
| `procrow-command-risk-badge.tsx` | Risk level chips |
| `procrow-operator-safety-warnings.tsx` | Manual execution warnings |
| `procrow-recommended-next-actions.tsx` | Ordered next steps |
| `procrow-operator-console-overview-link.tsx` | Overview embed card |

**Route:** `/admin/operator-console` · **Nav:** Admin shell “Operator console”  
**Linkage:** Overview card, queue copy, go/no-go cross-links (gates vs docs/commands split)

---

## 5. Go/no-go vs operator console

| Surface | Purpose |
|---------|---------|
| `/admin/go-no-go` | Advisory readiness gates, F23 posture, blockers, compact validation list |
| `/admin/operator-console` | Full doc index + extended command metadata (proves, related docs, categories) |

Shared command list; J7 does not re-run or contradict J6 risk labels.

---

## 6. Verification

```bash
npm run procrow-operator:verify
npm run procrow:verify   # includes J1–J7 chain
```

**Guards:** required files, routes, nav, cross-links, forbidden UI phrases, no shell/Prisma in service, manual-execution copy, J1–J7 in operator index.

---

## 7. Safety boundaries (unchanged)

- No command execution from browser UI
- No migrations, seeds, deploy, or payment activation from ProCrow
- No production-ready / launch approved / compliance certified claims
- F23 production commercial launch remains deferred
- No `service_role` in operator console UI

---

## 8. Acceptance

| Criterion | Result |
|-----------|--------|
| Audit + phase doc | This document |
| Typed contract + doc index | `procrow-operator-console-contract.ts` |
| Read-only service | `procrow-operator-console.service.ts` |
| UI components | `procrow-operator-console*.tsx` + panels |
| Admin route | `/admin/operator-console` |
| Go/no-go + overview + queue linkage | Yes |
| J6 index reuse + J7 overlay | Yes |
| `procrow-operator:verify` + `procrow:verify` | Yes |
| No paid infra / no scope creep | Yes |

**Recommended next:** **J8 — ProCrow Demo Rehearsal** (or pause if no demo pressure).
