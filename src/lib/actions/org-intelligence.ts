"use server";

import { revalidatePath } from "next/cache";
import { requireActionDiscoveryWrite } from "@/lib/auth/action-guard";
import type { OrgIntelligenceCustomizations } from "@/lib/org-intelligence/types";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { SECTOR_TEMPLATE_KEYS } from "@/lib/org-intelligence/sector-template-data";
import {
  acceptOrgIntelligenceIntoDiscovery,
  generateOrgIntelligenceRecommendations,
} from "@/lib/services/org-intelligence.service";

function revalidateOrgPaths(requestId: string) {
  revalidatePath(`/discovery/${requestId}/organization-model`);
  revalidatePath(`/discovery/${requestId}/departments`);
  revalidatePath(`/discovery/${requestId}/roles`);
  revalidatePath(`/discovery/${requestId}/workflows`);
  revalidatePath(`/discovery/${requestId}/summary`);
  revalidatePath(`/admin/requests/${requestId}`);
}

export async function regenerateOrgIntelligenceFormAction(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const sectorKey = String(formData.get("sectorKey") ?? "").trim() as SectorTemplateKey | "";
  await requireActionDiscoveryWrite();
  await generateOrgIntelligenceRecommendations(requestId, {
    sectorTemplateKey:
      sectorKey && SECTOR_TEMPLATE_KEYS.includes(sectorKey as SectorTemplateKey)
        ? (sectorKey as SectorTemplateKey)
        : undefined,
    force: true,
  });
  revalidateOrgPaths(requestId);
}

export async function acceptOrgIntelligenceFormAction(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  await requireActionDiscoveryWrite();
  const customizationsRaw = String(formData.get("customizationsJson") ?? "").trim();
  let customizations: OrgIntelligenceCustomizations | undefined;
  if (customizationsRaw) {
    customizations = JSON.parse(customizationsRaw) as OrgIntelligenceCustomizations;
  }
  await acceptOrgIntelligenceIntoDiscovery(requestId, customizations);
  revalidateOrgPaths(requestId);
}
