# Crow Experience System

The Crow Experience System defines how users comprehend platform state in **under ten seconds**: hierarchy, density, and one primary action per workspace.

## Visual tokens

- **Typography hierarchy:** page title → section title → metadata → body
- **Density levels:** `comfortable` (executive), `standard` (operations), `compact` (queues)
- **Command headers:** `ProductPageHeader` with status chip and single primary CTA
- **Action tiers:** primary (one per view), secondary (outline), advanced (disclosure/menu)

## Reusable patterns (11)

| Pattern | Use when |
|---------|----------|
| Entity Workspace | Single record with tabs and timeline |
| Process Workspace | Workflow instance with stages and handoffs |
| Work Queue | Filterable list with bulk-safe actions |
| Decision Workspace | Approval with evidence and recommendation panel |
| Department Workspace | Scoped operational dashboard |
| Executive Workspace | KPI + exceptions only |
| Evidence Timeline | Audit and traceability visualization |
| Security Context Panel | CyberCrow signals beside work |
| Blueprint Workspace | Versioned intent and commercial slices |
| Configuration Console | ProCrow admin settings |
| Reference Lab | Architecture Lab mock demonstrations |

## Anti-patterns

- **Equal-weight card walls** — every card looks equally important
- **Buried primary actions** — approve/submit below the fold without hierarchy
- **Architecture jargon for end users** — internal layer names on tenant surfaces
- **Duplicate navigation** — same capability under Client, Admin, and Public routes without role context

## Product components

Reuse `src/components/product/*` (`ProductPageHeader`, `ProductSection`, status chips) for consistency between ProCrow and Architecture Lab.

## SAREA alignment

Experience composition follows: Identity → Membership → Role → Permissions → Context → Responsibility → Work → Experience. SAREA adjusts presentation; it does not grant access.
