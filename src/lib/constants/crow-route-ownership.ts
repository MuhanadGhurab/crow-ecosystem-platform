/**
 * A1 — Route ownership map (who owns, who can access, purpose boundaries).
 */

export type CrowRouteOwner =
  | "public"
  | "auth"
  | "client"
  | "procrow"
  | "business"
  | "invite"
  | "sarea"
  | "cybercrow";

export type CrowRouteOwnershipEntry = {
  prefix: string;
  owner: CrowRouteOwner;
  purpose: string;
  notFor: string;
  accessRule: string;
};

export const CROW_ROUTE_OWNERSHIP: readonly CrowRouteOwnershipEntry[] = [
  {
    prefix: "/",
    owner: "public",
    purpose: "Marketing, explanation, pricing, and request CTA.",
    notFor: "Operational ERP work or operator consoles.",
    accessRule: "Public browse; account required to submit request.",
  },
  {
    prefix: "/pricing, /modules, /industries, /security, /architecture, /services, /about, /request",
    owner: "public",
    purpose: "Public education and intake surfaces.",
    notFor: "Tenant runtime or ProCrow.",
    accessRule: "Public; /request requires sign-in.",
  },
  {
    prefix: "/login, /signup, /access",
    owner: "auth",
    purpose: "Authentication and workspace selection.",
    notFor: "Module operations.",
    accessRule: "Authenticated users see portals allowed for their role.",
  },
  {
    prefix: "/client",
    owner: "client",
    purpose: "Request, discovery, proposals, approval, onboarding tracking.",
    notFor: "Company day-to-day operations (Business Portal).",
    accessRule: "Client role; platform staff may preview.",
  },
  {
    prefix: "/admin",
    owner: "procrow",
    purpose: "Prepare, govern, validate tenants; workforce activation; Go/No-Go.",
    notFor: "Client self-service or employee operations.",
    accessRule: "Platform staff / operator roles only.",
  },
  {
    prefix: "/[tenant]",
    owner: "business",
    purpose: "Business Portal / CEM — modules, workflows, tasks, reports.",
    notFor: "Client proposal review or ProCrow operator queue.",
    accessRule: "Verified tenant membership or platform staff preview.",
  },
  {
    prefix: "/tenant-invite/[token]",
    owner: "invite",
    purpose: "Business Portal invite acceptance (tenant workforce activation).",
    notFor: "Client Portal onboarding or ProCrow access.",
    accessRule: "Valid token + matching email + accept action.",
  },
  {
    prefix: "/sarea",
    owner: "sarea",
    purpose: "Experience studio — personas, navigation, widgets.",
    notFor: "Permission grants (RBAC remains authoritative).",
    accessRule: "Operator / studio roles.",
  },
  {
    prefix: "/[tenant]/cybercrow",
    owner: "cybercrow",
    purpose: "Trust, identity, evidence, GRC, risk readiness.",
    notFor: "Legal audit certification claims.",
    accessRule: "Tenant members with CyberCrow module access.",
  },
] as const;

export const CROW_PORTAL_BOUNDARY_NOTE =
  "Client Portal configures Crow. Business Portal runs operations. ProCrow prepares and governs — internal only." as const;
