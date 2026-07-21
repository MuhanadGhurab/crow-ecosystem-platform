# Runtime and Package Manager Validation

| Field | Value |
|---|---|
| Date | 2026-07-21 |
| Node observed | `v24.15.0` |
| npm observed | `11.12.1` |
| Architecture Node baseline | `24.15.0` |
| Package baselines | next `16.2.10`, react `19.2.8`, typescript `7.0.2` (or recorded 5.x fallback), drizzle-orm `0.45.2` |
| Harness TypeScript pin | `7.0.2` (available and selected; no 5.x fallback used) |
| Verdict | **PASS WITH CONDITIONS** |

## Candidate pin strategy

Future Product Code must use exact dependency pins initially: Node `24.15.0`, Next `16.2.10`, React `19.2.8`, TypeScript `7.0.2`, and Drizzle ORM `0.45.2`. This validation harness intentionally installs only TypeScript for its non-product workspace proof; it does not create a Product dependency manifest.

## Windows notes

- Use npm workspaces and `npm exec` rather than shell-specific glob expansion.
- Use Node `path` APIs; do not compare slash-delimited paths directly.
- Keep the database URL in the parent process environment only.
- Cleanup with `npm --prefix local-workspace run clean`; do not commit `node_modules` or generated output.

This verdict validates the local toolchain only. It does not authorize Product Code, Preview, provider sandboxes, or deployment.
