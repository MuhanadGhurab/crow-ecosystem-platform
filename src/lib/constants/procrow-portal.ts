import { PLATFORM_ENGINE_HUB } from "@/lib/constants/platform-engine-hub";
import { routes } from "@/lib/routes";

/** ProCrow — internal control tower language (J1). */
export const PROCROW_PRODUCT_NAME = "ProCrow";

export const PROCROW_CONTROL_TOWER = {
  title: "ProCrow Control Tower",
  subtitle:
    "Platform administration, trust governance, runtime safety, and customer-to-tenant flow.",
  badge: "Control Tower",
  stagingNote:
    "Staging / portfolio mode — advisory signals and mock-backed counts where noted. No paid infra auto-provisioning; production remains F23-gated.",
} as const;

export const PROCROW_CAPABILITY_COPY = {
  procrow: {
    label: "ProCrow",
    tagline: "Internal control tower",
    description:
      "Trust and operations governance, customer-to-tenant flow, platform administration, runtime safety, and deployment discipline.",
  },
  cybercrow: {
    label: "CyberCrow",
    tagline: "ProCrow trust & security",
    description:
      "Trust and security posture, evidence readiness, audit trail, GRC mapping, risk posture, and incident review — advisory, not a SIEM replacement.",
  },
  sarea: {
    label: "SAREA",
    tagline: "ProCrow experience studio",
    description:
      "Experience orchestration, role-based navigation and widgets, profile adaptation. RBAC controls access; SAREA controls experience.",
  },
  runtimeCohesion: {
    label: "Runtime cohesion",
    tagline: "Cross-module readiness",
    description:
      "Module dependency health, handoff gaps, and operator-guided next actions across tenant runtime surfaces.",
  },
  customerFlow: {
    label: "Customer flow",
    tagline: "Request → tenant",
    description:
      "Public request, client account, proposal/blueprint review, ProCrow admin review, onboarding readiness, controlled tenant provisioning.",
  },
  deployment: {
    label: "Deployment discipline",
    tagline: "Go / no-go & validation",
    description:
      "Validation playbook, release gates, and F23 production deferred gate — operator-owned, never autonomous go-live.",
  },
} as const;

export type ProCrowTowerLink = {
  title: string;
  description: string;
  href: string;
  entity: "cem" | "cybercrow" | "sarea";
  cta?: string;
};

/** Control Tower entry cards — safe in-app links only. */
export const PROCROW_CONTROL_TOWER_LINKS: ProCrowTowerLink[] = [
  {
    title: "Requests & customer flow",
    description: PROCROW_CAPABILITY_COPY.customerFlow.description,
    href: routes.admin.requests,
    entity: "cem",
    cta: "Intake queue",
  },
  {
    title: "Client portal status",
    description:
      "Authenticated client review, scope approval, onboarding tracker, and review notes — ProCrow owns pipeline after client actions.",
    href: routes.admin.requests,
    entity: "cem",
    cta: "Review queue",
  },
  {
    title: "Tenants & runtime readiness",
    description:
      "Tenant control room, provisioning posture, runtime cohesion, and module health — manual provisioning only.",
    href: routes.admin.tenants,
    entity: "cem",
    cta: "Tenant grid",
  },
  {
    title: "CyberCrow trust posture",
    description: PROCROW_CAPABILITY_COPY.cybercrow.description,
    href: PLATFORM_ENGINE_HUB.cybercrow(),
    entity: "cybercrow",
    cta: "Security console",
  },
  {
    title: "SAREA experience readiness",
    description: PROCROW_CAPABILITY_COPY.sarea.description,
    href: PLATFORM_ENGINE_HUB.sarea,
    entity: "sarea",
    cta: "Experience studio",
  },
  {
    title: "Runtime cohesion",
    description: PROCROW_CAPABILITY_COPY.runtimeCohesion.description,
    href: PLATFORM_ENGINE_HUB.cem(),
    entity: "cem",
    cta: "Tenant runtime",
  },
  {
    title: "Subscriptions & advisories",
    description: "Advisory billing alignment and capability signals — not live payment enforcement.",
    href: routes.admin.subscriptions,
    entity: "cem",
    cta: "Subscriptions",
  },
  {
    title: "Notifications",
    description: "Platform operator inbox — client scope approvals, review notes, and request changes.",
    href: routes.admin.notifications,
    entity: "cem",
    cta: "Inbox",
  },
];

/** Official ProCrow information architecture (documentation-first; J1 surfaces lightly). */
export const PROCROW_INFORMATION_ARCHITECTURE = [
  {
    id: "control-tower",
    title: "Control Tower",
    summary: "Admin overview, requests, tenants, notifications, subscriptions.",
    routes: [
      routes.admin.overview,
      routes.admin.requests,
      routes.admin.tenants,
      routes.admin.notifications,
      routes.admin.subscriptions,
    ],
  },
  {
    id: "customer-flow",
    title: "Customer Flow",
    summary: "Request review through client approval, onboarding, and provisioning readiness.",
    routes: [routes.admin.requests, routes.admin.blueprints, routes.client.home],
  },
  {
    id: "trust-security",
    title: "Trust & Security",
    summary: "CyberCrow dashboard, events, evidence, GRC, risk, audit logs.",
    routes: [
      routes.tenant("meem-global").cybercrow.dashboard,
      routes.tenant("meem-global").cybercrow.securityEvents,
      routes.tenant("meem-global").cybercrow.evidence,
      routes.tenant("meem-global").cybercrow.grc,
      routes.tenant("meem-global").cybercrow.risk,
      routes.tenant("meem-global").cybercrow.auditLogs,
    ],
  },
  {
    id: "experience-studio",
    title: "Experience Studio",
    summary: "SAREA profiles, role mapping, preview, navigation, widgets.",
    routes: [
      routes.sarea.overview,
      routes.sarea.profiles,
      routes.sarea.roleMapping,
      routes.sarea.preview,
      routes.sarea.navigation,
      routes.sarea.widgets,
    ],
  },
  {
    id: "runtime-cohesion",
    title: "Runtime Cohesion",
    summary: "Tenant health, modules, reports/BI, tasks/workflows, readiness signals.",
    routes: [
      routes.tenant("meem-global").dashboard,
      routes.tenant("meem-global").modules,
      routes.tenant("meem-global").reports,
    ],
  },
  {
    id: "deployment-discipline",
    title: "Deployment Discipline",
    summary: "Go/no-go, validation, release gates, F23 deferred production gate.",
    routes: [routes.admin.tenants, routes.admin.blueprints],
  },
  {
    id: "operator-docs",
    title: "Operator Docs",
    summary: "Runbooks, validation playbook, git safety, demo playbooks, phase docs.",
    routes: [],
  },
] as const;

/** Future J-track phases — documented only in J1. */
export const PROCROW_UX_ROADMAP = [
  { phase: "J2", title: "ProCrow Control Tower Dashboard Depth" },
  { phase: "J3", title: "ProCrow Request-to-Tenant Operator Queue" },
  { phase: "J4", title: "CyberCrow Evidence/GRC UX Depth" },
  { phase: "J5", title: "SAREA Studio UX Depth" },
  { phase: "J6", title: "Deployment Go/No-Go Center" },
  { phase: "J7", title: "Operator Docs & Validation Console" },
  { phase: "J8", title: "ProCrow Demo Rehearsal" },
] as const;

/** Verifier guardrails — phrases that must not appear in ProCrow-facing copy. */
export const PROCROW_FORBIDDEN_CLAIM_PHRASES = [
  "production go-live approved",
  "activate production",
  "automatic tenant provisioning",
  "self-healing security",
  "autonomous detection",
  "certified compliant",
  "fully compliant",
  "guaranteed compliance",
  "siem replacement",
  "live payments enabled",
  "payment authorized",
  "ai-powered governance",
] as const;
