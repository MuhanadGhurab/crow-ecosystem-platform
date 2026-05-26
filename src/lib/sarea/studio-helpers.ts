import { SAREA_PERSONA_DEFINITIONS } from "@/lib/constants/sarea-personas";
import { SAREA_DASHBOARD_WIDGETS, SAREA_NAV_KEYS } from "@/lib/constants/sarea-runtime";
import { PERSONA_ROLE_ALIASES } from "@/lib/services/sarea-seed.service";

const LOGISTICS_WIDGET_KEYS = new Set(["fleet_kpis", "ops_board", "pod_mobile"]);
const CYBERCROW_WIDGET_KEYS = new Set(["alerts", "cybercrow_posture"]);

export type WidgetSourceArea = "CEM" | "CyberCrow" | "SAREA" | "Operations" | "Billing";

export function widgetSourceArea(widgetKey: string): WidgetSourceArea {
  if (LOGISTICS_WIDGET_KEYS.has(widgetKey)) return "Operations";
  if (CYBERCROW_WIDGET_KEYS.has(widgetKey)) return "CyberCrow";
  if (widgetKey === "structure" || widgetKey === "modules") return "SAREA";
  return "CEM";
}

export function widgetLabel(widgetKey: string): string {
  const def = SAREA_DASHBOARD_WIDGETS.find((w) => w.key === widgetKey);
  return def?.label ?? widgetKey;
}

/** First persona key whose alias list includes this RBAC slug. */
export function recommendedPersonaKeyForRole(roleSlug: string): string | null {
  const normalized = roleSlug.trim().toLowerCase();
  for (const [personaKey, aliases] of Object.entries(PERSONA_ROLE_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === normalized)) {
      return personaKey;
    }
  }
  return null;
}

export function personaDefinitionForKey(personaKey: string) {
  return SAREA_PERSONA_DEFINITIONS.find((d) => d.key === personaKey);
}

export function rbacSummaryForPersona(personaKey: string): string {
  return personaDefinitionForKey(personaKey)?.rbacNote ?? "RBAC unchanged — preview and widgets follow signed-in permissions.";
}

export function experienceImpactForPersona(personaKey: string): string {
  const def = personaDefinitionForKey(personaKey);
  if (!def) return "Adjusts dashboard density and navigation emphasis for this persona.";
  return `${def.dashboardPurpose} Nav: ${def.navFocus}`;
}

export function filterValidNavKeys(keys: string[]): { valid: string[]; rejected: string[] } {
  const allowed = new Set<string>(SAREA_NAV_KEYS);
  const valid: string[] = [];
  const rejected: string[] = [];
  const seen = new Set<string>();
  for (const raw of keys) {
    const k = raw.trim().toLowerCase();
    if (!k) continue;
    if (!allowed.has(k)) {
      rejected.push(raw.trim());
      continue;
    }
    if (seen.has(k)) continue;
    seen.add(k);
    valid.push(k);
  }
  return { valid, rejected };
}

export function mappingAlignment(
  roleSlug: string,
  currentPersonaKey: string
): "aligned" | "review" | "unknown" {
  const recommended = recommendedPersonaKeyForRole(roleSlug);
  if (!recommended) return "unknown";
  return recommended === currentPersonaKey ? "aligned" : "review";
}
