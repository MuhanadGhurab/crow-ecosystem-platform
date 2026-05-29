/** Public homepage copy — plain language, no overclaims */

export const HOMEPAGE_HERO_HEADLINE = "Where Organizations Become Intelligent." as const;

export const HOMEPAGE_HERO_SUBHEADLINE =
  "Adaptive enterprise orchestration, secured by design." as const;

export const HOMEPAGE_HERO_EXPLAINER =
  "Crow helps organizations discover their structure, generate an enterprise blueprint, run day-to-day operations through CEM, protect trust through CyberCrow, and adapt role-based experiences through SAREA." as const;

export const HOMEPAGE_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit a request",
    summary:
      "Sign in, then share your organization and goals through a governed implementation request — tracked in your Client Portal.",
  },
  {
    step: "02",
    title: "Discovery understands you",
    summary:
      "Structured discovery captures departments, workflows, security needs, and operating model signals.",
  },
  {
    step: "03",
    title: "Blueprint defines the model",
    summary:
      "Your digital DNA — modules, integrations, pricing alignment, and go-live readiness — becomes the source of truth.",
  },
  {
    step: "04",
    title: "CEM runs operations",
    summary:
      "Tenant runtime for workflows, departments, CRM, finance, HR, and the modules you approved in blueprint.",
  },
  {
    step: "05",
    title: "CyberCrow protects trust",
    summary:
      "Audit logs, risk posture, security events, incidents, and identity signals — advisory visibility, not a SIEM replacement.",
  },
  {
    step: "06",
    title: "SAREA adapts the experience",
    summary:
      "Dashboards, navigation, and widgets adjust to role and context so each person sees what they need.",
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
  "Supports public request, discovery, blueprint, tenant runtime, CyberCrow, and SAREA flows end to end.",
  "Built with multi-tenant isolation, advisory security posture, and role-aware experience design.",
  "Honest scope: advisory visibility and workflow trust — not guaranteed compliance or autonomous AI detection.",
] as const;
