/** Public homepage copy — plain language, no overclaims (A1 / A1.1) */

export const HOMEPAGE_HERO_BADGE =
  "Crow Ecosystem · Enterprise operating platform" as const;

export const HOMEPAGE_HERO_HEADLINE =
  "Build the operating workspace your company actually runs on." as const;

export const HOMEPAGE_HERO_SUBHEADLINE =
  "Crow turns discovery into a governed Business Portal — with ProCrow for preparation, CyberCrow for trust readiness, SAREA for role-based experience, and CEM for daily operations." as const;

export const HOMEPAGE_HERO_ACCOUNT_NOTE =
  "Account required to submit — sign in to start your request. Public pages remain open to browse." as const;

export const HOMEPAGE_PRIMARY_CTA = {
  label: "Start Enterprise Request",
  href: "/request",
} as const;

export const HOMEPAGE_SECONDARY_CTA = {
  label: "Explore modules",
  href: "/modules",
} as const;

/** Hero feature pills (above headline) */
export const HOMEPAGE_HERO_FEATURE_PILLS = [
  { highlight: "3 workspaces", label: "Client · Business · ProCrow" },
  { highlight: "Governed flow", label: "Request → Blueprint → Runtime" },
  { highlight: "CEM · CyberCrow · SAREA", label: "Operating engines" },
] as const;

/** Five-step public flow (below hero) */
export const HOMEPAGE_CROW_WORKS_STEPS = [
  {
    step: "01",
    title: "Request",
    summary: "Create account and submit company request.",
  },
  {
    step: "02",
    title: "Discovery",
    summary: "Map departments, roles, workflows, and modules.",
  },
  {
    step: "03",
    title: "Blueprint",
    summary: "Review scope, proposal, and package.",
  },
  {
    step: "04",
    title: "Runtime Preparation",
    summary: "ProCrow prepares CEM, CyberCrow, and SAREA.",
  },
  {
    step: "05",
    title: "Business Portal Operations",
    summary: "Employees work inside the Business Portal.",
  },
] as const;

/** Three workspaces — public explanation */
export const HOMEPAGE_THREE_WORKSPACES = [
  {
    id: "client" as const,
    name: "Client Portal",
    summary: "Request, discovery, proposal, onboarding.",
    href: "/request",
  },
  {
    id: "business" as const,
    name: "Business Portal / CEM",
    summary: "Run daily company operations.",
    href: "/modules",
  },
  {
    id: "procrow" as const,
    name: "ProCrow",
    summary: "Prepare, govern, and validate tenant runtime.",
    href: "/architecture",
  },
] as const;

/** Product engines — trust / experience / operations */
export const HOMEPAGE_RUNTIME_ENGINES = [
  {
    id: "cem" as const,
    name: "CEM",
    fullName: "Crow Enterprise Manager",
    summary: "Runs operations — modules, workflows, tasks, and daily work inside the Business Portal.",
    href: "/modules",
    cta: "Explore modules",
  },
  {
    id: "cybercrow" as const,
    name: "CyberCrow",
    fullName: "Trust readiness layer",
    summary:
      "Reviews trust, identity, evidence, GRC, and risk readiness — advisory visibility, not a compliance certification.",
    href: "/security",
    cta: "View security layer",
  },
  {
    id: "sarea" as const,
    name: "SAREA",
    fullName: "Smart Adaptive Role Experience",
    summary:
      "Shapes role-based experience. RBAC controls access; SAREA shapes how each role sees the workspace.",
    href: "/architecture",
    cta: "Learn about SAREA",
  },
] as const;

export const HOMEPAGE_RBAC_SAREA_LINE =
  "RBAC controls who can access what. SAREA shapes how the experience feels for each role." as const;

/** Legacy export — kept for any downstream references */
export const HOMEPAGE_HOW_IT_WORKS = HOMEPAGE_CROW_WORKS_STEPS;

export const HOMEPAGE_BUILT_FOR = [
  {
    title: "Growing organizations",
    summary: "Teams that have outgrown spreadsheets and need one governed operating model.",
  },
  {
    title: "Multi-tenant enterprises",
    summary: "Groups that run branches, departments, and shared services with clear isolation.",
  },
  {
    title: "Operations-led sectors",
    summary:
      "Logistics, construction, aviation, healthcare, retail, and similar environments where structure and auditability matter.",
  },
  {
    title: "Security-conscious leadership",
    summary:
      "Leaders who want advisory risk posture, incident workflow, and role-aware experiences without rebuilding everything from scratch.",
  },
] as const;

export const HOMEPAGE_TRUST_PROOF = [
  "Validated across logistics, construction, and aviation-style onboarding scenarios on staging.",
  "Sign-in request flow, discovery, blueprint, tenant runtime, CyberCrow, and SAREA — end to end on staging.",
  "Built with multi-tenant isolation, advisory security posture, and role-aware experience design.",
  "Honest scope: advisory visibility and workflow trust — not guaranteed compliance or autonomous AI detection.",
] as const;
