# Implementation 0B — sharp Runtime Reachability (ADV-003)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0B-SHARP-REACH-001 |
| **Gate** | GHV.IMPLEMENTATION.0B-CLOSURE-01 |
| **Date** | 2026-07-22 |
| **Package** | `sharp` (via Next.js Image Optimization stack) |
| **Pre-closure classification** | **RUNTIME REACHABLE** (inconclusive → treated as reachable) |
| **Post-closure classification** | Advisory **FIXED**; residual Image Optimization path remains **disabled** and **guarded** |

## Classification rubric (applied)

| Class | Meaning |
|-------|---------|
| NOT INSTALLED | Package absent from install tree |
| INSTALLED BUT NOT LOADED | Present but never imported/initialized |
| LOADED BUT VULNERABLE OPERATION UNREACHABLE | Module load possible; vulnerable ops not callable via authorized routes |
| RUNTIME REACHABLE | Vulnerable path can be exercised (or cannot be ruled out) |
| REACHABILITY INCONCLUSIVE | Treated as **RUNTIME REACHABLE** for Gate purposes |

## Authorized 0B surface reviewed

- Activation routes: ACT-003 / ACT-011 / ACT-005 / ACT-013 / ACT-012 / ACT-006
- APIs: `/api/activation`, `/api/activation/commands/[command]`, `/api/health`, `/api/local/*`
- Synthetic session + mock mailbox only
- No attacker-facing image upload endpoints in the authorized slice

## Static import review

| Check | Result |
|-------|--------|
| Product `import` of `next/image` | **None** (only `apps/web/next-env.d.ts` type reference) |
| Product `import` of `sharp` | **None** |
| Activation screen image handling | Text / layout only — no image optimizer usage |
| Remote `images.domains` / `remotePatterns` | Not configured for Product image CDN intake |

Absence of `next/image` imports alone is **not** sufficient proof of unreachability: Next.js may still load `sharp` when Image Optimization is enabled.

## Image optimizer / server path

| Check | Result |
|-------|--------|
| Next Image Optimization | Default Next behavior can load optional `sharp` for `/_next/image` |
| Pre-closure `images.unoptimized` | Was **not** set — optimizer path considered available |
| Attacker-controlled image input via authorized routes | **No** upload/optimizer API in 0B Product Code |
| Synthetic local-only execution | Reduces likelihood; **does not** eliminate installed vulnerable package |

### Pre-closure conclusion

```text
RUNTIME REACHABLE
```

Rationale: vulnerable `sharp@&lt;0.35.0` was installed in the Production dependency tree of the Next server build, and Image Optimization was not explicitly disabled. Environment prohibitions (Preview/Production blocked) **must not** reclassify High runtime-reachable advisories as non-blocking.

## Remediation effect

| Measure | Effect |
|---------|--------|
| Pin / override `sharp@0.35.3` | Removes GHSA-f88m-g3jw-g9cj from `npm audit` (High → 0) |
| `images.unoptimized: true` | Disables Image Optimization for this app config |
| `validate:high-advisory-boundaries` | Fails CI if `next/image` is imported, if High/Critical advisories return, or if installed sharp &lt; 0.35.0 |

### Post-closure conclusion for ADV-003

```text
FIXED — SAFE COMPATIBLE UPDATE
```

Residual product policy: Image Optimization remains unauthorized for 0B. Future introduction of `next/image` or Image Optimization requires a governed dependency review before enablement.

## Future feature that would re-open review

- Enabling Next Image Optimization without a patched sharp chain
- Adding `next/image` or routes that process untrusted image bytes through sharp/libvips
- Removing the npm override / direct pin while Next still pulls `sharp@&lt;0.35.0`

## CI enforcement

Script: `scripts/validation/validate-high-advisory-boundaries.mjs`  
npm script: `validate:high-advisory-boundaries` (wired into `npm run ci`)
