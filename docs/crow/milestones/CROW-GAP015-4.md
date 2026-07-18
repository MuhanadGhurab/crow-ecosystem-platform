# CROW.GAP015.4 — Guard-on-main residual fix via minimal PR

| Field | Value |
|-------|-------|
| **Status** | Minimal PR prepared — **not merged** |
| **Date** | 2026-07-18 |
| **Branch** | `fix/gap015-production-guard-main` |
| **Base** | `origin/main` @ `e8cb812` |
| **Source tip** | `feat/first-tenant-golden-path` @ `d4d6b29` |
| **Owner authorization** | Minimal guard-on-main residual fix only — not PR #10, not full FTGP, not Production deploy |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |

## Purpose

Close the GAP-015 residual where Vercel Ignored Build Step is configured to:

```text
node scripts/safety/vercel-production-deploy-guard.mjs
```

but the script is **absent** on current `main`. Missing script → non-zero Node exit → Vercel may **allow** unauthorized Production builds.

## In scope

- `scripts/safety/vercel-production-deploy-guard.mjs`
- `scripts/safety/vercel-production-deploy-guard.test.mjs`
- `package.json` script `vercel-production-deploy-guard:test` only
- Minimal docs: this milestone + `docs/crow/gaps/GAP-015-PRODUCTION-DEPLOY-GUARD.md`

## Out of scope

- Merge this PR (owner decision)
- Merge PR #10 / FTGP monolith
- Discovery / Request / ProCrow / Prisma / migrations / hosted writes
- Production deploy / Instant Promote / env changes
- GitHub branch protection

## Guard behavior (must hold)

| Case | Decision | Exit |
|------|----------|------|
| Preview / non-production | Allow | `1` |
| Unauthorized Production | Skip | `0` |
| Authorized Production (flag + SHA match + reason) | Allow | `1` |

## Owner decision still required

1. **Merge** this minimal PR to `main` (accepts Production-target risk under Ignored Build Step; unauthorized builds should then skip)
2. Confirm live domain stays on `dpl_QeDhnxz…` after merge (no Instant Promote)
3. Optionally proceed to GitHub `main` protection (separate milestone)

## Final verdict (this milestone)

**READY — GAP-015 GUARD-ON-MAIN MINIMAL PR PREPARED**
