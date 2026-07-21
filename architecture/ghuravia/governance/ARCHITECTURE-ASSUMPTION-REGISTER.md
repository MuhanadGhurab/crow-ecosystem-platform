# Architecture Assumption Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-ASM-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §48 |
| **Last updated** | 2026-07-21 |
| **Project mirror** | Also mirrored into `governance/assumptions/ASSUMPTION-REGISTER.md` as ASM-079+ |

```text
Assumptions remain Active / Pending Validation
Plan alone does NOT validate these assumptions
```

## Assumptions (Gate §48)

| ID | Statement | Status | Validation method | If invalidated | Related |
|----|-----------|--------|-------------------|----------------|---------|
| ASM-ARC-001 | Founder can operate the launch architecture | Active | Capacity reviews · SPK-ARC-001/021 | Shrink shape / hire | RISK-ARC-031 |
| ASM-ARC-002 | A relational datastore can support primary launch needs | Pending Validation | SPK-ARC-005 · 010 · 011 | Revisit shape; still no graph-by-name | DEC-159 |
| ASM-ARC-003 | Graph behavior can be represented without a dedicated graph database | Pending Validation | SPK-ARC-005 | Compare graph option with evidence | DEC-159 |
| ASM-ARC-004 | Managed storage can isolate Evidence safely | Pending Validation | SPK-ARC-007 · 008 | Limit Evidence types | DEC-162 |
| ASM-ARC-005 | Realtime can be introduced without service sprawl | Pending Validation | SPK-ARC-014 · 015 | Defer Live depth | RISK-ARC-014 |
| ASM-ARC-006 | Arabic search can meet launch needs | Pending Validation | SPK-ARC-016 | Narrow discovery surfaces | RISK-ARC-016 |
| ASM-ARC-007 | External providers offer appropriate Saudi support | Pending Validation | Provider evaluation spikes | Narrow methods / delay paid | DEC-163 |
| ASM-ARC-008 | Evidence review can scale initially | Pending Validation | Org staffing · pilot | Narrow review classes | RISK-ARC-024 |
| ASM-ARC-009 | Formula recalculation can remain local | Pending Validation | SPK-ARC-009 · 011 | Batch windows / targeted only | DEC-161 |
| ASM-ARC-010 | 92 screens can share governed shell components | Pending Validation | SPK-ARC-004 | Material CR for shells | RISK-ARC-032 |
| ASM-ARC-011 | No DMs reduces moderation complexity | Active | Community baseline · SPK-ARC-013 | Structured chat CR | CAP-SOC-009 |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §48 — architecture assumptions |
