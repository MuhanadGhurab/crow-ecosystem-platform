# Repository Mount Map

## Placement

Cursor must discover the real repository path of `GHV.CROW-IDENTITY.1D`, then
create `GHV.CROW-IDENTITY.1E` beside it.

Do not assume a path such as `docs/`, `governance/`, or `design/` without
checking the repository. Do not create a second Crow identity root merely
because the first search was inconvenient.

## Source-to-destination map

| Handoff source | Repository destination inside `1E` |
|---|---|
| `references/canon/*` | `references/canon/` |
| `references/locked/*` | `references/locked/` |
| `references/founder-anchor/*` | `references/founder-anchor/` |
| `references/personality-evidence/*` | `references/personality-evidence/` |
| `SUPERSESSION-NOTE.md` | Gate root |
| `FOUNDER-SCORING-SHEET.md` | Gate root |
| `FOUNDER-DECISION-REGISTER.md` | Gate root |
| `CANDIDATE-RECORD-TEMPLATE.json` | `qa/` |

Copy bytes exactly and calculate SHA-256 after the copy.

## Binary asset policy

Before mounting PNGs:

1. inspect `.gitattributes`;
2. inspect existing design-asset paths and file sizes;
3. check whether Git LFS is already configured and used;
4. follow the repository's existing policy.

If Git LFS is already configured for the relevant image types, use the existing
pattern.

If the repository already tracks comparable binary design prototypes directly,
follow that established convention and record the total added bytes.

If neither policy exists, stop with:

> `BLOCKED_BINARY_ASSET_POLICY_REQUIRED`

Do not initialize Git LFS, rewrite `.gitattributes`, transcode the original
anchors, base64-embed images, or commit a large binary set without approval.

## Product boundary

Reference and candidate images belong only in the design/governance gate. They
must not be copied into:

- product runtime assets;
- public web directories;
- app bundles;
- CDN manifests;
- seed data;
- databases;
- user-facing catalogues.

This gate has no deployment authority.

## Historical preservation

Do not edit older reports to make their old status appear current. Mount
`SUPERSESSION-NOTE.md` in `1E`, link to both the older finding and the newer
Analyze lock, and preserve the audit trail.

