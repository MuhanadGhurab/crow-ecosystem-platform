/**
 * A1 — Simplified Crow lifecycle (product language + ownership).
 */

export type CrowLifecycleOwner =
  | "public"
  | "client"
  | "procrow"
  | "cybercrow"
  | "sarea"
  | "cem";

export type CrowLifecycleStep = {
  id: string;
  order: number;
  label: string;
  shortDescription: string;
  owner: CrowLifecycleOwner;
  route?: string;
  safeWording: string;
};

export const CROW_SIMPLIFIED_LIFECYCLE: readonly CrowLifecycleStep[] = [
  {
    id: "learn",
    order: 1,
    label: "Learn Crow",
    shortDescription: "Understand what Crow is and who it is for.",
    owner: "public",
    route: "/",
    safeWording: "Browse the public site — no operational access.",
  },
  {
    id: "create_account",
    order: 2,
    label: "Create account",
    shortDescription: "Sign up or sign in to start a governed request.",
    owner: "client",
    route: "/signup",
    safeWording: "Account required to submit — not automatic tenant access.",
  },
  {
    id: "submit_request",
    order: 3,
    label: "Submit request",
    shortDescription: "Share organization context and goals.",
    owner: "client",
    route: "/request",
    safeWording: "Request intake — not production provisioning.",
  },
  {
    id: "complete_discovery",
    order: 4,
    label: "Complete discovery",
    shortDescription: "Structured discovery captures operating model signals.",
    owner: "client",
    route: "/client",
    safeWording: "Discovery informs blueprint — not day-to-day operations.",
  },
  {
    id: "procrow_review",
    order: 5,
    label: "ProCrow review",
    shortDescription: "Operators review intake and discovery quality.",
    owner: "procrow",
    route: "/admin/queue",
    safeWording: "Internal operator step — not visible as ProCrow to clients.",
  },
  {
    id: "blueprint_proposal",
    order: 6,
    label: "Blueprint and proposal",
    shortDescription: "Digital DNA, modules, pricing alignment, and proposal.",
    owner: "procrow",
    route: "/admin/blueprints",
    safeWording: "Commercial terms remain advisory until scope approval.",
  },
  {
    id: "scope_approval",
    order: 7,
    label: "Scope approval",
    shortDescription: "Client approves scope or requests changes.",
    owner: "client",
    route: "/client/proposals",
    safeWording: "Approval is not production launch or payment activation.",
  },
  {
    id: "runtime_preparation",
    order: 8,
    label: "Runtime preparation",
    shortDescription: "ProCrow prepares tenant workspace and modules.",
    owner: "procrow",
    route: "/admin/tenants",
    safeWording: "Staging/runtime preparation — not auto-provisioned production.",
  },
  {
    id: "cybercrow_readiness",
    order: 9,
    label: "CyberCrow trust readiness",
    shortDescription: "Review identity, evidence, GRC, and risk posture.",
    owner: "cybercrow",
    safeWording: "Advisory trust readiness — not certified compliance or SIEM replacement.",
  },
  {
    id: "sarea_mapping",
    order: 10,
    label: "SAREA experience mapping",
    shortDescription: "Shape role-based navigation and dashboards.",
    owner: "sarea",
    route: "/sarea/overview",
    safeWording: "RBAC controls access. SAREA shapes experience.",
  },
  {
    id: "workforce_activation",
    order: 11,
    label: "Tenant workforce activation",
    shortDescription: "Invite and activate employees into the Business Portal.",
    owner: "procrow",
    safeWording: "Manual copy-link invites — email delivery provider not active (M4D).",
  },
  {
    id: "business_operations",
    order: 12,
    label: "Business Portal operations",
    shortDescription: "Run modules, workflows, tasks, and reports.",
    owner: "cem",
    route: "/access",
    safeWording: "Requires verified tenant membership — not Client Portal access alone.",
  },
  {
    id: "go_no_go",
    order: 13,
    label: "Go/No-Go governance",
    shortDescription: "ProCrow-controlled release discipline.",
    owner: "procrow",
    route: "/admin/go-no-go",
    safeWording: "Go/No-Go is operator-controlled — not client self-service launch.",
  },
] as const;

/** Homepage / marketing strip — key client-visible milestones only. */
export const CROW_PUBLIC_LIFECYCLE_STRIP = CROW_SIMPLIFIED_LIFECYCLE.filter((s) =>
  ["learn", "create_account", "submit_request", "complete_discovery", "blueprint_proposal", "scope_approval", "business_operations"].includes(
    s.id
  )
);

export const CROW_LIFECYCLE_HERO_LINE =
  "Learn Crow → request → discovery → ProCrow review → blueprint → approval → runtime preparation → workforce activation → Business Portal operations." as const;
