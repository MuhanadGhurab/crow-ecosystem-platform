# Vercel Project Identity Preflight — GHV.IMPLEMENTATION.0G

| Field | Value |
|-------|-------|
| **Status** | COMPLETE |
| **Date** | 2026-07-25 |
| **Gate** | GHV.IMPLEMENTATION.0G |
| **Auth** | GHV-IMP-AUTH-007 |

## Team scope

| Item | Value |
|------|-------|
| Team slug | `muhanadghurabs-projects` |
| Team ID suffix | `…FnF5` (`team_JsNIQlTitYCs1yjig631FnF5`) |

## Projects discovered

| Role | Display name | Project ID suffix | Git repo | Production branch | In scope |
|------|--------------|-------------------|----------|-------------------|----------|
| **Core Platform** | `crow-ecosystem-platform` | `…8o7h` (`prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h`) | `MuhanadGhurab/crow-ecosystem-platform` | `main` | **IN SCOPE** |
| Certification | `crow-ftgp-certification` | `…7A9n` (`prj_WY9yuGvnlpPWPhxZMjOTFY1h7A9n`) | same org linkage (read-only) | n/a for 0G | **READ-ONLY — NO CHANGES** |

## Core Platform Preview posture (pre-0G)

| Item | Finding |
|------|---------|
| Auto Preview for `feat/ghuravia-foundation` | Was **disabled** (`deploymentEnabled: false`); 0G enables Preview-only Git deploys under auth |
| Production branch | `main` (unchanged) |
| Branch-scoped Preview vars for foundation | Previously **absent**; 0G adds GHURAVIA Preview vars for `feat/ghuravia-foundation` only |
| Shared Preview `NEXT_PUBLIC_SUPABASE_*` | Legacy CyberCrow Production-shared keys exist on generic Preview — **not used** by GHURAVIA `controlled_preview` path |
| Deployment Protection | SSO protection enabled (`all_except_custom_domains`); Git fork protection on |
| Legacy build command (project setting) | Prisma CyberCrow path — **overridden** for this branch via `vercel.json` `buildCommand` to GHURAVIA web workspace build |

## Boundary confirmation

- Core Platform: IN SCOPE for Preview env + Preview deploy
- Certification project: UNCHANGED
- No Production env mutations performed for 0G GHURAVIA variables
- No secrets recorded in this document
