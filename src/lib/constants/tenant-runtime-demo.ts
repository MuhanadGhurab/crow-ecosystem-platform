/**
 * K1 — Tenant Runtime / CEM demo rehearsal copy (no production/payment/overclaims).
 */

import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { RIMAL_TENANT_SLUG } from "@/lib/constants/rimal";

export const K1_RECOMMENDED_TENANT_SLUG = MEEM_TENANT_SLUG;

export const K1_ALT_TENANT_SLUG = RIMAL_TENANT_SLUG;

export const TENANT_RUNTIME_DEFINITION =
  "Tenant Runtime / CEM is where the company operates day to day — after ProCrow prepares and governs the tenant." as const;

export const TENANT_RUNTIME_PROCROW_NOTE =
  "ProCrow prepared this workspace. CEM runs operations here — production go-live stays operator-disciplined (F23)." as const;

export const TENANT_RUNTIME_COHESION_LINE =
  "Modules connect through tasks, workflows, reports, CyberCrow trust signals, and SAREA experience — not as isolated silos." as const;

export const TENANT_RUNTIME_DEMO_BEATS = {
  dashboard:
    "Company command center — enabled modules, cohesion summary, CyberCrow and SAREA links.",
  modules: "Operational areas from blueprint — enabled/readiness per module, cross-links to depth hubs.",
  structure: "Departments, roles, and users — foundation for workflows, RBAC, and SAREA profiles.",
  coordination: "Tasks and workflows — coordination layer across modules and approvals.",
  visibility: "Reports / BI — roll-up visibility from module signals; advisory, not predictive analytics.",
  trust: "CyberCrow — trust posture, evidence, GRC advisory on this tenant.",
  experience: "SAREA — role-based experience; RBAC controls access, SAREA shapes the UI.",
} as const;

export type TenantRuntimeDemoBeat = keyof typeof TENANT_RUNTIME_DEMO_BEATS;

/** K1 10-minute demo route order (slug placeholder `{tenant}`). */
export const K1_DEMO_ROUTE_ORDER = [
  "/{tenant}/dashboard",
  "/{tenant}/modules",
  "/{tenant}/departments",
  "/{tenant}/roles",
  "/{tenant}/users",
  "/{tenant}/tasks",
  "/{tenant}/workflows",
  "/{tenant}/reports",
  "/{tenant}/hr",
  "/{tenant}/finance",
  "/{tenant}/procurement",
  "/{tenant}/logistics",
  "/{tenant}/cybercrow/dashboard",
  "/sarea/overview",
  "/{tenant}/dashboard",
] as const;
