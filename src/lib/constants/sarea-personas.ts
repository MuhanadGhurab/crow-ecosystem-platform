/** SAREA persona catalog — RBAC unchanged; preview cookie affects presentation only. */
export const SAREA_PREVIEW_PERSONA_KEYS = [
  "executive",
  "manager",
  "frontline",
  "analyst",
  "tenant_admin",
] as const;

export type SareaPreviewPersonaKey = (typeof SAREA_PREVIEW_PERSONA_KEYS)[number];

export type SareaPersonaDefinition = {
  key: SareaPreviewPersonaKey;
  label: string;
  roleContext: string;
  dashboardPurpose: string;
  navFocus: string;
  widgetFocus: string;
  complexity: "low" | "medium" | "high";
  previewMode: "live_cookie" | "recommended_mapping";
  rbacNote: string;
};

export const SAREA_PERSONA_DEFINITIONS: SareaPersonaDefinition[] = [
  {
    key: "executive",
    label: "Executive",
    roleContext: "C-suite and regional leadership — trust summaries over operational detail.",
    dashboardPurpose: "Fleet trust, compliance posture, and high-level risk at a glance.",
    navFocus: "Dashboard, reports, CyberCrow summary — minimal module depth.",
    widgetFocus: "CyberCrow posture, fleet KPIs, alerts rollup.",
    complexity: "low",
    previewMode: "live_cookie",
    rbacNote: "Preview cookie only; permissions still follow the signed-in role.",
  },
  {
    key: "manager",
    label: "Manager / Operations Manager",
    roleContext: "Hub and regional ops leads — workflows, SLA, and team throughput.",
    dashboardPurpose: "Operational load, dispatch warnings, and module shortcuts.",
    navFocus: "Tasks, workflows, logistics, warehouse, reports.",
    widgetFocus: "Ops board, operational load, tasks, fleet KPIs.",
    complexity: "medium",
    previewMode: "live_cookie",
    rbacNote: "Preview cookie only; managers without CyberCrow manage perm see CEM modules only.",
  },
  {
    key: "frontline",
    label: "Frontline",
    roleContext: "Drivers, warehouse staff, and hub operators — task-first mobile density.",
    dashboardPurpose: "Today's work, POD scans, and compact navigation.",
    navFocus: "Dashboard, tasks, logistics — fewest admin links.",
    widgetFocus: "POD mobile, tasks, compact ops widgets.",
    complexity: "low",
    previewMode: "live_cookie",
    rbacNote: "Preview cookie only; frontline RBAC stays employee/dispatcher scoped.",
  },
  {
    key: "analyst",
    label: "CyberCrow Analyst",
    roleContext: "Security and GRC analysts — incidents, events, audit, and identity signals.",
    dashboardPurpose: "Security posture, open incidents, and triage queues — not executive trust cards.",
    navFocus: "CyberCrow console, audit logs, incidents, security events, identity.",
    widgetFocus: "CyberCrow posture, security alerts, compliance hints.",
    complexity: "high",
    previewMode: "recommended_mapping",
    rbacNote:
      "Map role slug `analyst` to a profile with personaKey `analyst` in studio. Live cookie preview when profile exists.",
  },
  {
    key: "tenant_admin",
    label: "Tenant Admin",
    roleContext: "Tenant administrators — users, roles, settings, plan, and workspace modules.",
    dashboardPurpose: "Full CEM control surface plus CyberCrow visibility for governance.",
    navFocus: "Users, roles, settings, modules, CyberCrow, reports.",
    widgetFocus: "Structure, modules, operational load, CyberCrow posture.",
    complexity: "high",
    previewMode: "recommended_mapping",
    rbacNote:
      "Aligns with `tenant-admin` RBAC slug. Map in role mapping; cookie preview when tenant profile exists.",
  },
];

export function isSareaPreviewPersonaKey(value: string): value is SareaPreviewPersonaKey {
  return (SAREA_PREVIEW_PERSONA_KEYS as readonly string[]).includes(value);
}

/** Fallback runtime when studio profile missing but platform staff previews analyst/admin. */
export const SAREA_PREVIEW_FALLBACK: Record<
  Extract<SareaPreviewPersonaKey, "analyst" | "tenant_admin">,
  { navKeys: string[]; visibleWidgets: string[]; density: "comfortable" | "compact" }
> = {
  analyst: {
    navKeys: ["dashboard", "cybercrow", "reports", "tasks"],
    visibleWidgets: ["cybercrow_posture", "alerts", "reports"],
    density: "comfortable",
  },
  tenant_admin: {
    navKeys: ["dashboard", "users", "modules", "cybercrow", "settings", "reports"],
    visibleWidgets: ["structure", "modules", "operational_load", "cybercrow_posture", "tasks"],
    density: "comfortable",
  },
};
