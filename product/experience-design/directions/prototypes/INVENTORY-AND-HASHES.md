# Experience Direction Visual Prototypes — Inventory and Hashes

| Field | Value |
|-------|-------|
| **Updated** | 2026-07-25 |
| **Authority** | Design exploration / Hybrid H1 final visual review — **not** Product Code |
| **Generated image text** | **NON-AUTHORITATIVE** |
| **Binary commit policy** | Large PNG boards remain **local-only** |
| **Product Code** | Unchanged |

## HTML prototypes (committable)

### Direction exploration (A/B/C)

Path: `prototypes/html/`

| File | Role |
|------|------|
| `index.html` | Index — Hybrid H1 primary + A/B/C sources |
| `direction-a.html` / `b` / `c` | Source direction frames |
| `prototype.css` | Shared A/B/C prototype styles |

### Hybrid H1 (canonical connected journey)

Path: `prototypes/html/hybrid-h1/`

| File | Role |
|------|------|
| `index.html` | Journey index |
| `hybrid-h1.css` | H1 tokenized styles |
| `hybrid-h1.js` | State switching, drawer, reduced-motion |
| `01-world-portal.html` | World Portal desktop |
| `02-mission-briefing.html` | Mission briefing |
| `03-mission-workspace.html` | Active workspace + topology states A/B/C |
| `04-consequence.html` | Consequence transition |
| `05-crowprint-reveal.html` | Crowprint / lineage / boundary |
| `06-flight-log-debrief.html` | Flight Log / Echo / Route |
| `07-world-portal-mobile.html` | Portal mobile |
| `08-mission-workspace-mobile.html` | Mission mobile |
| `09-debrief-mobile.html` | Debrief mobile |

Open via `file://` or local static server. Do **not** serve from the Next.js app.

## Image boards (local-only)

### A/B/C exploration boards

Path: `prototypes/boards-local/` — see prior checksums in git history of this file for A/B/C boards.

### Hybrid H1 boards

Path: `prototypes/boards-local/hybrid-h1/`

| File | Viewport |
|------|----------|
| `h1-portal-desktop.png` | Desktop Portal |
| `h1-mission-desktop.png` | Desktop Mission |
| `h1-debrief-desktop.png` | Desktop Crowprint / Debrief |
| `h1-portal-mobile.png` | Mobile Portal |
| `h1-mission-mobile.png` | Mobile Mission |
| `h1-debrief-mobile.png` | Mobile Debrief |

### SHA-256 (hybrid-h1 boards)

```text
cfe60700dddbfa4b527db61150134c6ad5f2c7cea885ca7534f1fc0cd1ce3194  h1-portal-desktop.png
c1f61501061e06d9a40f1e31449ba02e9aa86636a5569455a2904e120f14b50f  h1-mission-desktop.png
55ac24061143565919b0a7edd17c0975c147967a71c43637acc8394ff3fe2b24  h1-debrief-desktop.png
05b4da72a666717d16288b74f08921500bcfb94198450910d930180f8ccdfcde  h1-portal-mobile.png
54a8f0a010107de19e8051056fa9c85d75e127ad6bacb1048e84c0389db3edd0  h1-mission-mobile.png
07aa60d66d7d1bd5e92f764dbf7b79b0a7268daa6cd814977ad02bbc07b8afa3  h1-debrief-mobile.png
```

Also mirrored at `boards-local/hybrid-h1/CHECKSUMS.sha256` (local working copy).

## Preservation note

1E / 1F / 1G Crow visual evidence remains **untracked / local** and is **not** altered.
