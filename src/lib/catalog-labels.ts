import { CEM_MODULES } from "@/lib/constants/modules";
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
