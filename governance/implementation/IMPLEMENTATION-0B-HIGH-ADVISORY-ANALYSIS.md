# Implementation 0B High Advisory Analysis — ADV-003 (sharp / libvips)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0B-HIGH-ADV-001 |
| **Gate** | GHV.IMPLEMENTATION.0B-CLOSURE-01 |
| **Date** | 2026-07-22 |
| **Advisory** | [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) |
| **Package** | `sharp` |
| **Pre-closure severity** | High |
| **Disposition** | **FIXED — SAFE COMPATIBLE UPDATE** |

## Official advisory (authoritative)

Source: GitHub Security Advisory `GHSA-f88m-g3jw-g9cj` (reviewed 2026-07-21).

| Field | Value |
|-------|-------|
| Summary | sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591 |
| Severity | High (CVSSv4 7.0) |
| Vulnerable range | `sharp` **&lt; 0.35.0** |
| First patched version | **0.35.0** |
| Recommended current | **0.35.3** (provides libvips **8.18.3**) |
| Impact | Processing **untrusted input** with vulnerable sharp/libvips |

Upstream libvips advisories referenced by GHSA-f88m-g3jw-g9cj:

- [GHSA-2fcj-gj27-279x](https://github.com/libvips/libvips/security/advisories/GHSA-2fcj-gj27-279x)
- [GHSA-523x-vhfw-6r76](https://github.com/libvips/libvips/security/advisories/GHSA-523x-vhfw-6r76)
- [GHSA-jmwm-wc68-mhwm](https://github.com/libvips/libvips/security/advisories/GHSA-jmwm-wc68-mhwm)
- [GHSA-r98w-4fp7-m9c7](https://github.com/libvips/libvips/security/advisories/GHSA-r98w-4fp7-m9c7)

Workaround documented by sharp (not used as Closure disposition): block selected foreign loaders via `sharp.block(...)`.

## Pre-closure dependency tree (lockfile + `npm ci`)

| Item | Evidence |
|------|----------|
| Next.js | `next@16.2.10` (direct `@ghuravia/web` dependency) |
| Declared optional | `next@16.2.10` → `optionalDependencies.sharp: ^0.34.5` ([npm metadata](https://www.npmjs.com/package/next)) |
| Installed (pre-fix) | `sharp@0.34.5` (within `^0.34.5`, **&lt; 0.35.0**) |
| Direct / transitive / optional | **Optional transitive** of Next.js; not a Product import |
| Workspace | Root install; consumed under `@ghuravia/web` → `next` |
| Production deps | Present in install tree whenever Next installs optional deps |
| npm High count | **2** (`sharp` + `next` via sharp) — **one root advisory**, duplicate nodes |

Rejected npm audit remediation:

```text
npm audit fix --force → next@9.3.3
```

Prohibited: Architecture-breaking major downgrade. Not used.

## Fixed versions

| Source | Fixed / recommended |
|--------|---------------------|
| GHSA-f88m-g3jw-g9cj | ≥ **0.35.0** |
| sharp release guidance | latest **0.35.3** with libvips **8.18.3** |
| sharp changelog | [v0.35.0](https://sharp.pixelplumbing.com/changelog/v0.35.0/) upgrades libvips for upstream fixes |

## Compatibility constraints (this programme)

| Constraint | Status |
|------------|--------|
| App Router architecture | Retained (`next@16.2.10`) |
| React 19.2.8 | Unchanged |
| TypeScript 6.0.3 | Unchanged |
| No ADR rebaseline | No Next major/minor Architecture change |
| Windows + Linux CI | Build pinned to `next build --webpack` for portable resolution and known Turbopack + sharp 0.35.x packaging issues |

Next.js still declares `sharp@^0.34.5` as optional. Pinning **0.35.3** is outside that caret range (`&lt;0.35.0`), so npm may report `invalid` peer/optional range noise while the installed module is the patched version. Closure treats installed version + `npm audit` JSON as authoritative.

## Closure remediation (Candidate B)

1. Root `package.json` **`overrides`: `{ "sharp": "0.35.3" }`**
2. `@ghuravia/web` **direct dependency** `"sharp": "0.35.3"` (explicit runtime pin)
3. Regenerated `package-lock.json` so installs resolve `node_modules/sharp@0.35.3`
4. `images.unoptimized: true` in `apps/web/next.config.ts` (0B does not authorize Image Optimization)
5. CI guard `validate:high-advisory-boundaries` enforces High/Critical = 0 and sharp ≥ 0.35.0 if present

## Candidates not selected

| Candidate | Result |
|-----------|--------|
| A — Next.js patch/minor that removes vulnerable sharp | No Architecture-compatible Next release reviewed that both retains 16.x App Router stack and updates optional sharp range; not required once override lands |
| C — Remove sharp entirely | Next still optionally installs sharp; omitting without build breakage was not proven across CI OS; override + pin preferred |
| D — Architecture amendment | Not required |
| Forced obsolete Next downgrade | Prohibited |

## Post-fix audit totals

```text
Critical: 0
High: 0
Moderate: 6
Low: 0
Untriaged: 0
Blocking (High runtime-reachable / Critical / Untriaged): 0
```

Retained Moderate groups: ADV-001 (esbuild / drizzle-kit), ADV-002 (PostCSS / Next). See dependency review amendment.
