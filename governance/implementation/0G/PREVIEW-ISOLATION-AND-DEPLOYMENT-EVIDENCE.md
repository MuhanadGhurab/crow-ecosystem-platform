# Preview Isolation and Deployment Evidence — GHV.IMPLEMENTATION.0G

| Field | Value |
|-------|-------|
| **Status** | COMPLETE — HOSTED SMOKE PASS |
| **Date** | 2026-07-25 |
| **Gate** | GHV.IMPLEMENTATION.0G |
| **Auth** | GHV-IMP-AUTH-007 |
| **Git SHA** | `c61505a15081e6ecd87a4f412d4b23829141391f` |
| **Branch** | `feat/ghuravia-foundation` |

## Core Vercel project

| Item | Value |
|------|-------|
| Project | `crow-ecosystem-platform` |
| Project ID suffix | `…8o7h` |
| Team | `muhanadghurabs-projects` |
| Environment | **Preview only** |
| Deployment ID | `dpl_LQFRGwjRSMmTAfSTtrsfZ6NoAd1h` |
| Deployment status | Ready |
| Protected Preview alias | `https://crow-ecosystem-platform-git-feat-9e7a86-muhanadghurabs-projects.vercel.app` |
| Deployment URL | `https://crow-ecosystem-platform-fnrnnw268-muhanadghurabs-projects.vercel.app` |
| Access | Vercel SSO Deployment Protection (`all_except_custom_domains`) · `X-Robots-Tag: noindex` |
| Certification project | **UNCHANGED** |

## Preview / Production isolation

| Check | Result |
|-------|--------|
| Preview Supabase project-ref | `…xqpt` (`xmuawtodfuavwebxrqpt`) |
| Production-like ref denylist | `…urms` (`wbwnsndcxrgyqwppurms`) |
| Fingerprints distinct | **PASS** |
| Branch Preview vars (`feat/ghuravia-foundation`) | `GHURAVIA_RUNTIME_MODE`, `GHURAVIA_DATA_CLASSIFICATION`, `GHURAVIA_PREVIEW_PROJECT_REF`, `GHURAVIA_DATABASE_URL`, `GHURAVIA_APP_VERSION`, `GHURAVIA_SYNTHETIC_SESSION_SECRET`, `ALLOW_SHARED_DEMO_BACKEND` |
| Production GHURAVIA_* variables | **Absent / unchanged** (no 0G Production mutations) |
| Data classification | `demo_only` / synthetic |
| Runtime guard | Verified Preview ALLOW · Production DENY |
| Shared demo backend | `false` |

## Migration

| Item | Value |
|------|-------|
| Authority | Repository Drizzle SQL `0000`–`0004` |
| Target | Preview project isolated `postgres` only |
| Production migration | **NOT RUN** |
| Seed | Synthetic only |

## Local / remote CI

| Check | Result |
|-------|--------|
| Local `npm run ci` | PASS (prior 0G commits) |
| Remote exact-SHA CI (`c61505a`) | **SUCCESS** — Actions run `30166480257` |
| Mid-Mission resume / Echo / ownership Playwright | PASS (commit `cbe518e`) |

## Hosted Preview smoke (2026-07-25T17:06:00.700Z)

Authenticated Founder-path access used Vercel protection bypass after verifying unauthenticated SSO 302. No access secrets committed.

| Step | Result |
|------|--------|
| Protected access (SSO 302) | PASS |
| Synthetic learner session (`controlledPreview: true`) | PASS |
| Start Black Signal | PASS |
| ≥3 decisions | PASS |
| Refresh / resume (same run, node, version, hash, history) | PASS |
| Finish canonical | PASS |
| Debrief · Crowprint · Suggested Lineage · Flight Log | PASS |
| Echo Flight start + alternate decision | PASS |
| Canonical unchanged after Echo | PASS |
| Echo resume | PASS |
| Route override | PASS |
| Second synthetic learner cannot read/mutate | PASS |
| Overall | **PASS** |

Redacted DB fingerprint recorded: Supabase `…xqpt` / pooler `aws-1-eu-central-2` · demo_only.

## DEP-134

| Condition | Status |
|-----------|--------|
| Core Platform Preview project identified | SATISFIED |
| Preview database identity verified | SATISFIED |
| Preview ≠ Production | SATISFIED |
| Preview variables correctly scoped | SATISFIED |
| Production variables unchanged | SATISFIED |
| Migration non-production only | SATISFIED |
| Synthetic classification enforced | SATISFIED |
| Runtime guard denies Production | SATISFIED |
| Protected Preview works | SATISFIED |
| Hosted smoke passes | SATISFIED |
| **DEP-134** | **SATISFIED** |

## Non-claims

No Production deployment · No Production env/migration · No real customer data · No Certification changes · No trusted-user pilot · Founder acceptance verdict **PENDING** (not inferred).
