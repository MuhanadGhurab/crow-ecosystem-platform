import type { DiscoveryAnswerRow } from "@/lib/discovery-answers";
import { getAiExtraKeys } from "@/lib/discovery-answers";
import { isLogisticsIndustry } from "@/lib/constants/cybercrow-audit-events";
import {
  getErpModuleDef,
  hasErpModule,
  type ErpModuleKey,
} from "@/lib/constants/erp-module-registry";
import { LOGISTICS_AI_EXTRA_KEYS } from "@/lib/erp/industry-packs/logistics";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import type { MeemHubModuleKey } from "@/lib/meem/meem-hub-config";
import { getMeemHubConfig } from "@/lib/meem/meem-hub-config";

/** Resolve subscribed AI extras from discovery, with module-specific demo defaults. */
export function resolveMeemAiExtraKeys(
  answers: DiscoveryAnswerRow[],
  fallbackKeys: readonly string[] = LOGISTICS_AI_EXTRA_KEYS
): string[] {
  const fromDiscovery = getAiExtraKeys(answers);
  return fromDiscovery.length > 0 ? fromDiscovery : [...fallbackKeys];
}

/** Module-scoped AI extras for MEEM ERP hub cards. */
export function resolveMeemHubAiKeys(
  answers: DiscoveryAnswerRow[],
  moduleKey: MeemHubModuleKey
): string[] {
  return resolveMeemAiExtraKeys(answers, getMeemHubConfig(moduleKey).defaultAiKeys);
}

type TenantModuleRow = { moduleKey: string; enabled?: boolean | null };

/** Whether MEEM-style ERP hub (AI cards + pipeline) should render for this tenant/module. */
export function showMeemErpHub(
  slug: string,
  industry: string | null | undefined,
  tenantModules: TenantModuleRow[],
  moduleKey?: ErpModuleKey
): boolean {
  if (slug === MEEM_TENANT_SLUG || isLogisticsIndustry(industry)) return true;
  if (moduleKey) {
    const normalizedModules = tenantModules.map((m) => ({
      moduleKey: m.moduleKey,
      enabled: m.enabled ?? undefined,
    }));
    const cemKey = getErpModuleDef(moduleKey)?.cemModuleKey ?? moduleKey;
    if (hasErpModule(normalizedModules, cemKey)) return true;
  }
  return false;
}
