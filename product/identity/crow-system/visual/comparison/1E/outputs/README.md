# Required 1E Outputs

This directory is a specification placeholder. Cursor creates generated outputs
inside the repository's mounted `GHV.CROW-IDENTITY.1E` gate, not inside the
handoff source package.

## Candidate IDs

| Horizon | A | B | C |
|---|---|---|---|
| Operate | `MF-O-A` | `MF-O-B` | `MF-O-C` |
| Build | `MF-B-A` | `MF-B-B` | `MF-B-C` |
| Analyze | `MF-A-A` | `MF-A-B` | `MF-A-C` |
| Protect | `MF-P-A` | `MF-P-B` | `MF-P-C` |
| Lead | `MF-L-A` | `MF-L-B` | `MF-L-C` |

## Per-candidate files

```text
silhouette-v0.1.png
cinematic-source-v0.1.png
cinematic-4k-v0.1.png
portrait-v0.1.png
thumbnail-48px-v0.1.png
prompt.md
candidate.json
```

Analyze A remounts the existing locked silhouette and cinematic master. Its
derivatives may be produced mechanically, but its source art must not be
regenerated or overwritten.

## Boards

```text
boards/operate-blind-xyz-v0.1.png
boards/build-blind-xyz-v0.1.png
boards/analyze-blind-xyz-v0.1.png
boards/protect-blind-xyz-v0.1.png
boards/lead-blind-xyz-v0.1.png
boards/all-15-silhouettes-blind-v0.1.png
boards/all-15-cinematic-labeled-v0.1.png
boards/all-15-48px-v0.1.png
boards/BLIND-REVEAL-MAP.md
```

Labels and boards must be assembled deterministically outside the generative
model so names, IDs, dimensions, and order remain exact.

