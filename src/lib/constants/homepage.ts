/** Public homepage copy — plain language, no overclaims */

export const HOMEPAGE_HERO_HEADLINE =
  "Map your company, prepare a secure tenant runtime, and run daily operations through a role-aware Business Portal." as const;

export const HOMEPAGE_HERO_SUBHEADLINE =
  "Request and configure Crow in the Client Portal. ProCrow prepares your workspace. Employees operate in the Business Portal." as const;

export const HOMEPAGE_HERO_EXPLAINER =
  "Crow helps you submit a governed request, complete discovery, review blueprint and proposal, and track onboarding — before day-to-day work moves to the Business Portal. CyberCrow supports trust readiness; SAREA shapes role-based experience — RBAC controls access." as const;

export const HOMEPAGE_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Learn & request",
    summary:
      "Browse Crow, create an account, and submit a governed implementation request from the Client Portal.",
  },
  {
    step: "02",
    title: "Discovery & blueprint",
    summary:
      "Structured discovery and blueprint define departments, workflows, modules, and commercial alignment.",
  },
  {
    step: "03",
    title: "ProCrow prepares runtime",
    summary:
      "Operators review, price, and prepare tenant runtime — including trust and experience readiness.",
  },
  {
    step: "04",
    title: "Business Portal operations",
    summary:
      "After workforce activation, employees run modules, workflows, tasks, and reports in the Business Portal.",
  },
  {
    step: "05",
    title: "CyberCrow trust readiness",
    summary:
      "Review identity, evidence, GRC, and risk posture — advisory visibility, not a compliance certification.",
  },
  {
    step: "06",
    title: "SAREA experience",
    summary:
      "Shape role-based navigation and dashboards. RBAC controls access; SAREA shapes experience.",
  },
] as const;

export const HOMEPAGE_RUNTIME_ENGINES = [
  {
    id: "cem" as const,
    name: "CEM",
    fullName: "Crow Enterprise Manager",
    summary:
      "Runs operations, workflows, departments, approvals, and your tenant runtime — the day-to-day enterprise shell.",
    href: "/modules",
    cta: "Explore CEM modules",
  },
  {
    id: "cybercrow" as const,
    name: "CyberCrow",
    fullName: "Enterprise Security Orchestration",
    summary:
      "Protects trust through audit logs, risk posture, incidents, security events, and identity/session signals you can review.",
    href: "/security",
    cta: "View security layer",
  },
  {
    id: "sarea" as const,
    name: "SAREA",
    fullName: "Smart Adaptive Role Experience",
    summary:
      "Adapts dashboards, navigation, widgets, and complexity based on role and context — experience, not permissions.",
    href: "/architecture",
    cta: "Learn about SAREA",
  },
] as const;

export const HOMEPAGE_RBAC_SAREA_LINE =
  "RBAC controls who can access what. SAREA controls how the experience feels for each role." as const;

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
