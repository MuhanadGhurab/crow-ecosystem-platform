import { MOCK_WORKSPACE_SUMMARY } from "@/lib/mock/workspace-summary";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

/** Returns workspace summary or static mock when DB is unavailable */
export async function safeWorkspaceSummary(tenantId: string) {
  try {
    return await getTenantWorkspaceSummary(tenantId);
  } catch {
    return { ...MOCK_WORKSPACE_SUMMARY };
  }
}
