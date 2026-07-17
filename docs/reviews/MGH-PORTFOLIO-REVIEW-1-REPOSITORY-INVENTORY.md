# MGH.PORTFOLIO.REVIEW.1 — Repository Inventory

**Verified:** 2026-07-17  
**Authenticated actor:** `cursor` / `cursor[bot]` (Cursor GitHub App integration)  
**Owner account reviewed:** `MuhanadGhurab`  
**Exact Crow repository:** `MuhanadGhurab/crow-ecosystem-platform`

## Access limitations

| Capability | Result |
|---|---|
| List public owner repos | Yes |
| Read PR metadata/files/CI | Yes |
| Convert Crow PR ready→draft | Yes (`gh pr ready --undo`) |
| Push to Crow feature branch | Yes |
| Create issues (Crow / Portfolio OS) | Yes |
| Comment on Crow PRs | No (403) |
| Edit repository descriptions | No (403) |
| Push to portfolio OS / other public repos | No (403) |
| Close issues | No (403) |
| Merge / close PRs | Not authorized / not performed |
| Private repository listing | Not visible to this integration |

Probe issues created during permission checks (owner should close):

- `enterprise-cyber-resilience-portfolio` #14 — accidental `test`
- `crow-ecosystem-platform` #12 — accidental `test crow issue`

---

## Inventory table

| Repository | Purpose | Program | Description (live) | Visibility | Default | HEAD | Open PRs | CI (PR heads) | Evidence | Career | Security / privacy / ownership | Recommended action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| MuhanadGhurab/MuhanadGhurab | Profile home + program map | Career / Profile | GitHub profile home — Cybersecurity · Infrastructure · Enterprise Technology | Public | main | `bb44689` | #1 draft | validate success @ `9dbb90c` | Profile presentation | Gate CLOSED; Security+/PMP In Progress | Links public; preserve cyber-crow | Merge **last** after foundations |
| enterprise-cyber-resilience-portfolio | Portfolio OS / registries / career gate | OS (all) | Enterprise cyber-resilience portfolio operating system (registries, evidence, career gate) | Public | main | `bb02ed0` | #1 draft | validate success @ `e7477b1` | E3 max; no E5 | CLOSED | Synthetic NIS boundary; no employer data | **First** portfolio merge after Crow cleanup decisions |
| enterprise-cyber-risk-governance | Synthetic GRC case study | P3 | **Commit-style:** feat: synthetic risk governance foundation | Public | main | `16ebd58` | #1 draft | validate success @ `42705cf` | Below E5 | CLOSED | Synthetic risks; no compliance cert claim | Merge after Portfolio OS; **update description** |
| secure-project-delivery-office | Synthetic delivery office | P5 | **Commit-style:** feat: secure delivery-office foundation | Public | main | `5465dee` | #1 draft | validate success @ `05dc67a` | Below E5 | CLOSED | PMP In Progress; synthetic schedule/budget | Merge after GRC; **update description** |
| enterprise-cybersecurity-lab | Lab ITOPS + Defense packs | P1/P2 | Personal enterprise-style cybersecurity home lab documentation (sanitized) | Public | main | `8fa98ac` | #1 draft | validate success @ `73bc766` | Lab evidence | CLOSED | Lab-only; no employer architecture | Merge after Delivery; refine description optional |
| mini-it-cyber-projects | Defensive tools + pin checker | P4 | Small defensive IT and cybersecurity utilities monorepo (Python, Java) | Public | main | `7f50f97` | #1 draft | python+java success @ `4b7ab28` | Tool evidence | CLOSED | No secrets in PR; defensive defaults | Merge after Lab; refine description optional |
| secureskies-drone-security | Academic emerging-systems evidence | P6 | Long SecureSkies description (honest partial prototype) | Public | main | `8d03ac3` | #1 draft | validate success @ `9cb424a` | Honest / artifact pending | CLOSED | Team ownership; no invented metrics | Merge after Mini; optional shorter description |
| crow-ecosystem-platform | Crow multi-tenant platform | P4 (+ platform) | SecDevOps · governed AI · multi-tenant… | Public | main | `a5620c3` | #2–#8 draft (converted), #10 draft, #11 draft | See Crow triage | Runtime product | N/A for FTGP | Highest sensitivity; no deploy/migrate | Triage closures; keep #10 draft; merge #11 after SecureSkies |

## Other owned / linked notes

- Private repositories exist per owner statement but are **not enumerable** with this token.
- GitHub Project: [Enterprise Cyber Resilience Portfolio](https://github.com/users/MuhanadGhurab/projects/1)
- Profile links and portfolio registries reference only public repositories above.
