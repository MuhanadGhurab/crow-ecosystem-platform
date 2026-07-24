# REPOSITORY-MAPPING.md

| Field | Value |
|-------|-------|
| **Gate** | GHV.CROW-IDENTITY.1E |
| **Date** | 2026-07-24 |
| **External handoff source** | `C:\Users\pc\Downloads\GHV_CROW_IDENTITY_1E_FOUNDER_DIRECTION_GATE\GHV_CROW_IDENTITY_1E_FOUNDER_DIRECTION_GATE` |
| **ZIP path** | `C:\Users\pc\Downloads\GHV_CROW_IDENTITY_1E_FOUNDER_DIRECTION_GATE.zip` |
| **ZIP SHA-256** | `923BF80E6171BF174C5F759DF38A02FCC3DD4C061D690F52CB1910D7BAA204AA` |
| **Handoff CHECKSUMS.sha256** | 28/28 PASS (post-mount) |
| **Starting repository SHA** | `a39d94debae4b544771b8dfcd7552f6cd56591b2` |
| **Existing 1D path** | `product/identity/crow-system/visual/` (+ `governance/gates/GHV.CROW-IDENTITY.1D.md`) |
| **Mounted 1E path** | `product/identity/crow-system/visual/comparison/1E/` |
| **Naming adaptation** | Preferred user path `comparison/1E/` used instead of inventing a parallel identity root; package contents preserved |
| **Authority classification** | FOUNDER-AUTHORIZED EXTERNAL HANDOFF · LOCAL CANDIDATE WORKING SET · Canon authority NONE UNTIL FOUNDER SELECTION |
| **Runtime authorization** | **NO** |
| **Commit status** | **NONE** (required) |
| **Push status** | **NONE** (required) |

## Binary asset policy

| Check | Result |
|-------|--------|
| `.gitattributes` PNG LFS | Not configured for PNG |
| Existing tracked Crow PNGs | None (only 1D SVG plates) |
| Git LFS available | Yes (installed) but not initialized for this asset class |
| Action | Mount binaries **locally only**; do **not** initialize LFS; do **not** commit PNGs |
| Verdict | `LOCAL_ONLY_NO_COMMIT` — satisfies founder-review working set without violating `BLOCKED_BINARY_ASSET_POLICY_REQUIRED` for unauthorized LFS init / large binary commit |

## Renamed or relocated files

| Source | Destination | Notes |
|--------|-------------|-------|
| Handoff package root docs | `comparison/1E/*.md` | Byte-identical |
| `references/**` | `comparison/1E/references/**` | Byte-identical; checksums verified |
| `outputs/README.md` | `comparison/1E/outputs/README.md` | Byte-identical |
| Analyze lock silhouette | `candidates/analyze/a-founder-anchor/silhouette-v0.1.png` | Remount (not regenerated) |
| Analyze cinematic master | `candidates/analyze/a-founder-anchor/cinematic-*.png` | Remount (not regenerated) |

## Missing named binaries (checked, not invented)

| Filename | Status |
|----------|--------|
| `analyze-mother-form-cinematic-4k-v1.0.png` | PRESENT |
| `analyze-mother-form-silhouette-v1.0.png` | PRESENT |
| `five-mother-forms-updated-v1.0.png` | PRESENT |
| `all-25-lineages-v0.2.png` | PRESENT |
| `canonical-species-style-anchor.png` | PRESENT |
| `five-mother-forms-monochrome-blind-v0.1.png` | **NOT PRESENT** |
| `five-mother-forms-monochrome-review-v0.1.png` | **NOT PRESENT** |
| `five-mother-forms-48px-test-v0.1.png` | **NOT PRESENT** |
