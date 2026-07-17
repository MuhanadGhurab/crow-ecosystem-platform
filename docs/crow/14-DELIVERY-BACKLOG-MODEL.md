# Crow Delivery Backlog Model

| Field | Value |
|-------|-------|
| **Title** | Delivery Backlog Model |
| **Status** | CANONICAL |
| **Authority** | Owner direction — CROW.PM.1 |
| **Last reviewed** | 2026-07-17 (CROW.PM.1) |
| **Related** | [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](12-PROJECT-MANAGEMENT-OPERATING-MODEL.md), [`15-GITHUB-PROJECTS-SETUP-PLAN.md`](15-GITHUB-PROJECTS-SETUP-PLAN.md) |
| **Implementation state** | Labels, Project #2, and seed Issues #15–#24 created in CROW.PM.2 |

## Purpose

Define how Crow work is classified, scored, and tracked so adaptive product work and predictive control work stay separable — and so portfolio repositories support Crow instead of fragmenting attention.

## GitHub ecosystem audit (read-only, 2026-07-17)

**Account:** `MuhanadGhurab` · `gh auth` verified.

### Repository classification

| Repository | Visibility | Classification | Crow relationship |
|------------|------------|----------------|-------------------|
| [crow-ecosystem-platform](https://github.com/MuhanadGhurab/crow-ecosystem-platform) | Public | **Core Product** | Primary Crow / ProCrow / CEM platform |
| [MuhanadGhurab](https://github.com/MuhanadGhurab/MuhanadGhurab) | Public | **Supporting Portfolio Proof** | Profile README / portfolio index |
| [enterprise-cybersecurity-lab](https://github.com/MuhanadGhurab/enterprise-cybersecurity-lab) | Public | **Supporting Portfolio Proof** + **Learning Asset** | CyberCrow / ops / IR narrative proof |
| [mini-it-cyber-projects](https://github.com/MuhanadGhurab/mini-it-cyber-projects) | Public | **Learning Asset** + **Tooling Asset** | Defensive scripting / safe-use evidence |
| [secureskies-drone-security](https://github.com/MuhanadGhurab/secureskies-drone-security) | Public | **Supporting Portfolio Proof** | Academic secure-systems evidence (demo-safe) |
| [secure-project-delivery-office](https://github.com/MuhanadGhurab/secure-project-delivery-office) | Public | **Supporting Portfolio Proof** | PMP/delivery controls narrative — maps to Crow PM model |
| [enterprise-cyber-risk-governance](https://github.com/MuhanadGhurab/enterprise-cyber-risk-governance) | Public | **Supporting Portfolio Proof** | GRC / NCA alignment narrative — maps to CyberCrow |
| [enterprise-cyber-resilience-portfolio](https://github.com/MuhanadGhurab/enterprise-cyber-resilience-portfolio) | Public | **Supporting Portfolio Proof** | Portfolio governance umbrella — maps to program view |
| [nextjs-with-supabase](https://github.com/MuhanadGhurab/nextjs-with-supabase) | **Private** | **Private / Do Not Publish** · **Tooling Asset** | Template only — do not make public |
| [secureskies-private-source](https://github.com/MuhanadGhurab/secureskies-private-source) | **Private** | **Private / Do Not Publish** | Academic source intake — do not make public |

### Deferred / future candidates (ideas, not active Crow scope)

| Idea | Suggested classification | Rule |
|------|--------------------------|------|
| SecSky productization | Future Service Candidate / Deferred | Needs ownership review; must not divert Phase 0–6 Crow MVP |
| Robotics | Deferred / Needs Ownership Review | Portfolio only unless tied to Crow proof theme |
| Desktop / automation utilities | Tooling Asset or Deferred | Prefer Kanban; no Production Crow coupling |
| Additional portfolio case studies | Supporting Portfolio Proof | Iterative packaging under Phase 12 |

### Crow platform GitHub state (verified)

| Item | State |
|------|-------|
| PR #10 | OPEN, DRAFT, MERGEABLE — `feat/first-tenant-golden-path` → `main` |
| PR #2 | OPEN, DRAFT — invite email delivery (separate; not this milestone) |
| Issues | One closed test issue (`#12`); no active product backlog Issues |
| Projects / labels | Not audited as authoritative backlog — **do not create** until CROW.PM.2 |

---

## Recommended label system (document only)

### Type

- `type:feature`
- `type:bug`
- `type:docs`
- `type:security`
- `type:infra`
- `type:ux`
- `type:research`
- `type:governance`

### Stream

- `stream:public`
- `stream:client`
- `stream:discovery`
- `stream:blueprint`
- `stream:procrow`
- `stream:cem`
- `stream:cybercrow`
- `stream:sarea`
- `stream:croai`
- `stream:commercial`
- `stream:portfolio`

### Delivery

- `delivery:adaptive`
- `delivery:predictive`
- `delivery:iterative`
- `delivery:kanban`
- `delivery:spike`

### Priority

- `priority:p0`
- `priority:p1`
- `priority:p2`
- `priority:p3`

### Status

- `status:ready`
- `status:blocked`
- `status:needs-owner`
- `status:certification`
- `status:accepted`

### Risk

- `risk:security`
- `risk:data`
- `risk:auth`
- `risk:migration`
- `risk:production`
- `risk:privacy`

**Do not create these labels yet.**

---

## Backlog item template (for future Issues)

```markdown
## Summary
[One paragraph]

## Stream / Delivery
Stream: [A–O or label]
Delivery model: [adaptive|predictive|iterative|kanban|spike]

## Priority score
Business+User+RiskReduction+Learning+Unlock − Effort−Complexity−SecurityRisk = [n]
MoSCoW: [Must|Should|Could|Later|Blocked]

## Protected boundaries
- [ ] Payment ≠ authority
- [ ] SAREA ≠ authority
- [ ] CroAI ≠ authority
- [ ] No unauthorized migration / hosted write / Production

## Acceptance criteria
- [ ]

## Test plan
- [ ]

## Evidence / links
Canonical docs · CURRENT-STATE · GAP IDs · certification URL
```

## WIP guidance

| Lane | Suggested WIP |
|------|----------------|
| Adaptive iteration | ≤ 3 active feature Issues |
| Predictive gates | ≤ 2 active gate packages |
| Kanban | Soft WIP 5; prefer finishing |
| Spikes | Time-box ≤ 3–5 days; end with decision memo |

## Portfolio anti-fragmentation rules

1. **Core Product first** — Crow platform milestones beat new repo creation.
2. **Every public repo needs a Crow theme** — CyberCrow, ProCrow governance, delivery office, resilience, learning tooling, or academic secure systems.
3. **Private stays private** — no publish of templates or SecureSkies private source.
4. **No client/company secrets** in public repos (including Tekfen/Aramco or similar).
5. **Kanban portfolio work** must not delay Phase 0 safety or P0/P1 Crow MVPs.

## Related documents

- [`13-PRODUCT-ROADMAP.md`](13-PRODUCT-ROADMAP.md)
- [`15-GITHUB-PROJECTS-SETUP-PLAN.md`](15-GITHUB-PROJECTS-SETUP-PLAN.md)
