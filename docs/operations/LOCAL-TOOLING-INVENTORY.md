# Local Tooling Inventory

| Field | Value |
|-------|-------|
| **Status** | COMPLETE for this Gate |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-20 |
| **Source Gate** | GHV.FOUNDATION.1A |

## Inspection targets

| Path | Present on disk (2026-07-20) | Tracked by Git | Ignored by Git |
|------|------------------------------|----------------|----------------|
| `.agents/` | **ABSENT** | No | Pattern in `.gitignore` (`.agents/`) |
| `skills-lock.json` | **ABSENT** | No | Pattern in `.gitignore` |

## History

During `GHV.REPOSITORY-TRANSITION.1A`, leftover Crow-era `.agents/` and `skills-lock.json` were removed as obsolete local agent artifacts after archive verification. They were never required for GHURAVIA governance documents.

## Purpose (when present)

| Artifact | Typical purpose |
|----------|-----------------|
| `.agents/` | Local Cursor/agent skill cache or project agent packs |
| `skills-lock.json` | Lockfile for agent skill versions |

## Assessment for GHURAVIA

| Question | Finding |
|----------|---------|
| Required for Cursor workflows? | Not required for governance baseline; Cursor works without them |
| Contain secrets? | N/A — absent; if recreated, treat as local-only and never commit |
| Belong in GHURAVIA workspace? | Optional local tooling only; keep gitignored |
| Commit? | **Do not commit** unless intentionally approved, reviewed, and secret-free |

## Recommendation

- Keep ignore rules.
- Do not recreate Crow-specific agent packs in this branch.
- If future GHURAVIA agent skills are needed, add them under an explicit Gate with review.
- No deletion action required in this Gate (already absent).
