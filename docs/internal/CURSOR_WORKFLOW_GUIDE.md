# Cursor Workflow Guide

Purpose: keep Cursor-assisted work safe, scoped, and phase-driven.

---

## Core workflow

1. Audit before implementation.
2. Define scope (what is in / out).
3. Implement in small, traceable changes.
4. Run validation commands.
5. Report files changed + outcomes.
6. Commit only when explicitly requested.

---

## Non-negotiable guardrails

- No paid infrastructure activation unless approved.
- No schema changes unless justified and requested.
- No public/internal boundary leaks.
- No fake AI/compliance/production claims.
- No committing forbidden files:
  - `.env*`
  - `tsconfig.tsbuildinfo`
  - `.agents/`
  - `skills-lock.json`

---

## Phase-based execution style

- Treat each phase as a bounded deliverable.
- Keep docs and code aligned with phase status.
- Prefer scoped commits over mixed-batch commits.
- Avoid reworking unrelated files in the same phase.

---

## Reporting standard (every major phase)

- What was changed
- Why it changed
- Validation commands run
- Validation results
- Remaining gaps/risks
- Acceptance decision (pass/in progress/deferred)

---

## UI work guidance

When touching UI:
- improve spacing/placement/visual hierarchy
- keep dark enterprise style consistency
- ensure empty/error/loading states are explicit
- avoid misleading “fully automated” claims

---

## Mock and tenant safety

- Run `npm run mock:verify` for mock-related changes.
- Keep MEEM/Rimal/Najm paths stable.
- Ensure mock shape changes stay aligned with Prisma include expectations.

---

## File tracking reliability

- If a new support file is created and imported, ensure it is tracked in git.
- Missing tracked files can pass locally but fail on Vercel.
