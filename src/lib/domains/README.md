# `src/lib/domains`

Optional **domain anchors** for the ten Crow orchestration engines (01–10). They exist so engineers can colocate domain-specific helpers over time **without** mass-moving existing modules.

- Prefer adding new domain-specific utilities here when they do not belong in a React component or a route folder.
- Existing code under `src/lib/constants`, `src/lib/types`, and feature routes remains valid; migration is incremental.

Subfolders `01-client-engagement` … `10-enterprise-operations` each contain a short `README.md` describing scope.
