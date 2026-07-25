# Hybrid H1.1 â€” Prototype inventory and hashes

| Field | Value |
|-------|-------|
| **Status** | COMMITTABLE TEXT ASSETS ONLY |
| **Local boards / GIF / video** | `LOCAL_ONLY_NO_COMMIT` under `../boards-local/hybrid-h1-1/` |
| **npm / animation libs** | None |
| **Product Code** | Unchanged |

## Committable files

| Path | Role |
|------|------|
| `index.html` | Screen index |
| `01-living-portal.html` â€¦ `13-reduced-motion.html` | Interactive screens |
| `05b-consequence-service.html` | Service-first outcome B |
| `h1-1.css` | Interaction styles + H1 tokens |
| `h1-1.js` | Scroll, signals, topology, Crowprint, Echo, RM |
| `INVENTORY-AND-HASHES.md` | This file |

## Dimensions (prototype viewport targets)

| Surface | Target |
|---------|--------|
| Desktop Portal / Mission | â‰¥ 1280Ã—720 logical |
| Mobile frames | ~390Ã—844 framed |
| Topology SVG viewBox | 480Ã—220 |

## SHA-256 (text assets)

Generated at commit time by:

```powershell
Get-FileHash -Algorithm SHA256 @(
  'index.html','h1-1.css','h1-1.js',
  '01-living-portal.html','02-horizon-interaction.html','03-briefing.html',
  '04-workspace.html','05-consequence-evidence.html','05b-consequence-service.html',
  '06-consequence-high-risk.html','07-notifications.html','08-crowprint.html',
  '09-flight-log.html','10-echo.html','11-mobile-portal.html',
  '12-mobile-mission.html','13-reduced-motion.html','INVENTORY-AND-HASHES.md'
) | Format-Table Hash, Path
```

| File | SHA-256 |
|------|---------|
| `index.html` | `8bfc40362a981c55a94904288e90b75059dc09081c7566e8cb28aebe815a135c` |
| `h1-1.css` | `e2c8cdc35acfffbb51bf496299b0e3bb443fadf87f98cc1f6862283e6f6b3be1` |
| `h1-1.js` | `379fa785fee6fcc4a90cdff06764c09b7520040bae82a1a9c6bcb1690cfa211e` |
| `01-living-portal.html` | `31cd645a421d9bc036205e923ec6acfcc00793e096390d73148c1748630aea04` |
| `02-horizon-interaction.html` | `71ac2b3cc50a2d121a90b5a534cb69f5da2e0e76a634efd28dbb0bc34174dea2` |
| `03-briefing.html` | `ee5289c1f1db8ce29fdc10e90ee56c3b481c8eac5f7cb7d20119ca9833498585` |
| `04-workspace.html` | `4462c71500c41b1b752201f7c0c6c2dc4077f0d3177a6ab9d9aca0907602cd29` |
| `05-consequence-evidence.html` | `e8181cb671e1ea2ec58b97ff44a1cec033bee458a3ef7aad5effee0dd3c401fb` |
| `05b-consequence-service.html` | `d078c6c29ba55e54c3a3e07422408a4d524d4757559278b5823f0d1fd7680150` |
| `06-consequence-high-risk.html` | `a55441dd29e2a3ffd5d93c28a0234f4c251cad3455eaad2109d7883d671840ff` |
| `07-notifications.html` | `83adf2d90bc370e6dee2501108c0d673087f1cc280f2f945044d1acb61cb3c2d` |
| `08-crowprint.html` | `1cafb3938b6bcb9a7396d057157aff2b1443f94b5c0b176c2f79f1a263149bc5` |
| `09-flight-log.html` | `aec751331314c6b4879d1bb9defb3c59df7bcf82a9712de8c528d2b382c96dc4` |
| `10-echo.html` | `35086c04edfe5f4e403036516a7a2b439fcd10d4447b064ffb4bd7d27dfc4dce` |
| `11-mobile-portal.html` | `a6a14332c762ce677342a73cbc342bf6b3b8b3dc837a7e00c810840f534bcab7` |
| `12-mobile-mission.html` | `0af26f7ebe5a516faed3d77a5e7528575c2db4197b308da96bed8310c72b526f` |
| `13-reduced-motion.html` | `7cb278ec759a27483bde0edbe532c680e78cfe607f2cf1b78f020da7a782146f` |

`INVENTORY-AND-HASHES.md` self-hash omitted (changes when this table is written).

## Explicitly not committed

- MP4 / WebM / GIF
- Generated Crow PNGs
- Font files
- Third-party / licensed media
- Large screenshot boards (local evidence only)
