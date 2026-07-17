/** Crow Ecosystem — brand line shown in hero and public surfaces */
export const PLATFORM_BRAND_NAME = "Crow Ecosystem Platform" as const;

export const PLATFORM_BRAND_TAGLINE = "Where Organizations Become Intelligent." as const;

/** Short definition for cards, headers, and SEO helpers */
export const PLATFORM_CORE_DEFINITION =
  "An adaptive enterprise orchestration ecosystem spanning implementation requests, discovery, blueprint, pricing, provisioning, security, adaptive experience, and governed go-live." as const;

/** Primary hero narrative — single long-form sentence */
export const PLATFORM_HERO_STATEMENT =
  "Crow is an adaptive enterprise orchestration ecosystem that unifies implementation intake, structured discovery, blueprint intelligence, pricing transparency, tenant provisioning, CyberCrow security initialization, SAREA adaptive experience readiness, and governed go-live—so leadership, operations, and every role advance as one coherent digital organization." as const;

/**
 * Hero / narrative lifecycle strip (concise labels).
 * Distinct from `PLATFORM_LIFECYCLE` (operational checklist used across the app).
 */
export const FULL_PLATFORM_LIFECYCLE = [
  "Implementation Request",
  "Discovery",
  "Blueprint",
  "Pricing Intelligence",
  "Tenant Provisioning",
  "Security Init",
  "SAREA Init",
  "Go-Live",
] as const;

/** State ownership — who acts at each lifecycle phase (advisory copy; not authorization). */
export const PIPELINE_STATE_OWNERSHIP: readonly { phase: string; owner: string }[] = [
  {
    phase: "Implementation Request",
    owner: "Requester supplies authorized organization information.",
  },
  {
    phase: "Discovery",
    owner: "Requester completes discovery; ProCrow reviews and validates submissions.",
  },
  {
    phase: "Blueprint",
    owner: "Crow generates advisory blueprint outputs; customer approves formal scope.",
  },
  {
    phase: "Pricing Intelligence",
    owner: "Crow issues advisory pricing; customer approves proposal — no automatic billing.",
  },
  {
    phase: "Tenant Provisioning",
    owner: "Authorized internal staff provisions tenant runtime after approvals.",
  },
  {
    phase: "Security Init",
    owner: "CyberCrow initializes trust and security controls for the tenant.",
  },
  {
    phase: "SAREA Init",
    owner: "SAREA configures experience profiles — composition only; no access grants.",
  },
  {
    phase: "Go-Live",
    owner: "Explicit readiness approval required; no auto-activation of production or billing.",
  },
] as const;

/** Crow Ecosystem platform identities */
export const PLATFORM_IDENTITIES = {
  cem: {
    id: "cem",
    name: "CEM",
    fullName: "Crow Enterprise Manager",
    tagline: "CEM runs the organization.",
    description:
      "Operational runtime for tenants — workflows, HR, CRM, finance, logistics, and day-to-day enterprise execution.",
  },
  cybercrow: {
    id: "cybercrow",
    name: "CyberCrow",
    fullName: "Enterprise Security Orchestration Engine",
    tagline: "CyberCrow protects the organization.",
    description:
      "Trust, resilience, RBAC enforcement, audit, risk, compliance, and tenant isolation across the ecosystem.",
  },
  sarea: {
    id: "sarea",
    name: "SAREA",
    fullName: "Smart Adaptive Role Experience Architecture",
    tagline: "SAREA adapts the organization experience.",
    description:
      "Adaptive role experience — dashboards, navigation, widgets, and role-appropriate complexity without fragmenting the platform.",
  },
  discovery: {
    id: "discovery",
    name: "Discovery Engine",
    fullName: "Discovery Engine",
    tagline: "Discovery understands the organization.",
    description:
      "Structured organizational intelligence: predictive templates and client-validated inputs that feed blueprint and provisioning.",
  },
  blueprint: {
    id: "blueprint",
    name: "Enterprise Blueprint Engine",
    fullName: "Enterprise Blueprint Engine",
    tagline: "Blueprint defines the organization.",
    description:
      "Digital DNA and governed source of truth that drives tenant generation, integrations, and go-live readiness.",
  },
} as const;

/**
 * Full implementation lifecycle (operational wording for admin, home sections, docs).
 * Intentionally overlaps conceptually with `FULL_PLATFORM_LIFECYCLE` but includes admin and identity phases.
 */
export const PLATFORM_LIFECYCLE = [
  "Implementation Request & Intake",
  "Expert Review & Orchestration",
  "Discovery Engine",
  "Enterprise Blueprint",
  "Pricing Intelligence & Client Approval",
  "CEM Tenant Provisioning",
  "CyberCrow Security Initialization",
  "SAREA Experience Initialization",
  "Identity & Access Setup",
  "Client Go-Live",
] as const;

/** Ten orchestration engines (01–10) — names for UI and documentation */
export const PLATFORM_ENGINES = [
  {
    id: "01",
    key: "implementation-intake",
    name: "Implementation Intake",
    summary: "Enterprise implementation requests, qualification, and the path into discovery.",
  },
  {
    id: "02",
    key: "discovery",
    name: "Discovery Engine",
    summary: "Adaptive organizational intelligence and validated discovery profiles.",
  },
  {
    id: "03",
    key: "blueprint",
    name: "Enterprise Blueprint",
    summary: "Digital DNA, integrations, and governed tenant configuration.",
  },
  {
    id: "04",
    key: "pricing-intelligence",
    name: "Pricing Intelligence",
    summary: "Plans, modules, security packages, and transparent commercial alignment.",
  },
  {
    id: "05",
    key: "provisioning",
    name: "Tenant Provisioning",
    summary: "CEM tenant generation and operational readiness.",
  },
  {
    id: "06",
    key: "cybercrow",
    name: "CyberCrow Security",
    summary: "Security baselines, events, compliance, and trust orchestration.",
  },
  {
    id: "07",
    key: "sarea",
    name: "SAREA Experience",
    summary: "Adaptive role UX — navigation, layouts, widgets, and device rules.",
  },
  {
    id: "08",
    key: "identity",
    name: "Identity & Access",
    summary: "Sessions, roles, and cross-engine identity coherence.",
  },
  {
    id: "09",
    key: "cem-operations",
    name: "CEM Operations",
    summary: "Core enterprise execution — CRM, HR, finance, inventory, logistics, and more.",
  },
  {
    id: "10",
    key: "enterprise-operations",
    name: "Enterprise Operations",
    summary: "Platform admin, audit, subscriptions, and cross-tenant governance.",
  },
] as const;
