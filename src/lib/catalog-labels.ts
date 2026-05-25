import { CEM_MODULES } from "@/lib/constants/modules";
import { DISCOVERY_INDUSTRY_OPTIONS } from "@/lib/constants/industry-templates";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions";

export function moduleLabel(key: string): string {
  return CEM_MODULES.find((m) => m.key === key)?.nameEn ?? key;
}

export function securityPackageLabel(key: string): string {
  return SECURITY_PACKAGES.find((p) => p.key === key)?.nameEn ?? key;
}

export function planLabel(key: string): string {
  return SUBSCRIPTION_TIERS.find((t) => t.key === key)?.nameEn ?? key;
}

/** Public intake / discovery industry key → display label. */
export function industryLabel(key?: string | null): string {
  if (!key?.trim()) return "General / other";
  const hit = DISCOVERY_INDUSTRY_OPTIONS.find((o) => o.value === key);
  return hit?.label ?? key;
}
