"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActionDiscoveryWrite } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import type { CemModuleKey } from "@/lib/constants/modules";
import {
  addDiscoveryBranch,
  addDiscoveryDepartment,
  addDiscoveryExperienceRequirement,
  addDiscoveryIntegration,
  addDiscoveryRole,
  addDiscoverySecurityRequirement,
  addDiscoveryWorkflow,
  deleteDiscoveryBranch,
  deleteDiscoveryDepartment,
  deleteDiscoveryExperienceRequirement,
  deleteDiscoveryIntegration,
  deleteDiscoveryRole,
  deleteDiscoverySecurityRequirement,
  deleteDiscoveryWorkflow,
  getDiscoveryContext,
  upsertDiscoveryAnswer,
} from "@/lib/services/discovery.service";
import { applyDiscoveryTemplate } from "@/lib/services/discovery-template.service";
import { canEditDiscovery } from "@/lib/discovery-editability";
import { assertDiscoveryBlueprintCompleteAllowed } from "@/lib/discovery/discovery-mvp-boundaries";
import { assertHostedBusinessWriteAllowed } from "@/lib/runtime/preview-db-safety";
import { shouldUseMockDiscovery } from "@/lib/mock/discovery";
import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";
import { completeDiscoveryAndCreateBlueprint } from "@/lib/services/pipeline.service";
import type { SareaPackageKey } from "@/lib/constants/sarea-packages";

/** UI-only mock discovery — skip DB writes; banner explains persistence. */
function isMockDiscoveryWriteSkipped(requestId: string): boolean {
  return shouldUseMockDiscovery(requestId);
}

function revalidateDiscovery(requestId: string) {
  const d = routes.discovery(requestId);
  revalidatePath(d.organization);
  revalidatePath(d.modules);
  revalidatePath(d.security);
  revalidatePath(d.departments);
  revalidatePath(d.branches);
  revalidatePath(d.roles);
  revalidatePath(d.workflows);
  revalidatePath(d.summary);
  revalidatePath(d.identity);
  revalidatePath(d.integrations);
  revalidatePath(d.experience);
  revalidatePath(`/discovery/${requestId}`);
}

export type IdentityDiscoveryInput = {
  idpPreference: string;
  mfaRequired: string;
  ssoNotes: string;
};

export async function saveIdentityDiscovery(requestId: string, input: IdentityDiscoveryInput) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await upsertDiscoveryAnswer(requestId, "identity", "idpPreference", input.idpPreference);
  await upsertDiscoveryAnswer(requestId, "identity", "mfaRequired", input.mfaRequired);
  await upsertDiscoveryAnswer(requestId, "identity", "ssoNotes", input.ssoNotes);
  revalidateDiscovery(requestId);
}

export type OrganizationDiscoveryInput = {
  operatingModel: string;
  employeeBand: string;
  goLiveTarget: string;
  discoveryNotes: string;
};

export async function applyDiscoveryTemplateAction(requestId: string, industryKey: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await applyDiscoveryTemplate(requestId, industryKey);
  revalidateDiscovery(requestId);
}

export async function saveOrganizationDiscovery(
  requestId: string,
  input: OrganizationDiscoveryInput
) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);

  await upsertDiscoveryAnswer(requestId, "organization", "operatingModel", input.operatingModel);
  await upsertDiscoveryAnswer(requestId, "organization", "employeeBand", input.employeeBand);
  await upsertDiscoveryAnswer(requestId, "organization", "goLiveTarget", input.goLiveTarget);
  await upsertDiscoveryAnswer(requestId, "organization", "discoveryNotes", input.discoveryNotes);

  revalidateDiscovery(requestId);
}

export async function saveModulesDiscovery(requestId: string, moduleKeys: CemModuleKey[]) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);

  await upsertDiscoveryAnswer(requestId, "modules", "confirmedKeys", moduleKeys);

  revalidateDiscovery(requestId);
}

export async function saveSareaPackageDiscovery(requestId: string, packageKey: SareaPackageKey) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await upsertDiscoveryAnswer(requestId, "experience", "sareaPackageKey", packageKey);
  await refreshRequestPricingEstimate(requestId);
  revalidateDiscovery(requestId);
  revalidatePath(routes.admin.request(requestId));
}

export async function saveSecurityDiscovery(
  requestId: string,
  input: { complianceNotes: string; ncaAlignment: string }
) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);

  await upsertDiscoveryAnswer(requestId, "security", "complianceNotes", input.complianceNotes);
  await upsertDiscoveryAnswer(requestId, "security", "ncaAlignment", input.ncaAlignment);
  await upsertDiscoveryAnswer(requestId, "security", "reviewed", true);

  revalidateDiscovery(requestId);
}

export async function addDepartment(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await addDiscoveryDepartment(requestId, {
    name: String(formData.get("name")),
    nameAr: String(formData.get("nameAr") || "") || undefined,
    headcount: formData.get("headcount") ? Number(formData.get("headcount")) : undefined,
  });
  revalidateDiscovery(requestId);
}

export async function removeDepartment(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await deleteDiscoveryDepartment(requestId, id);
  revalidateDiscovery(requestId);
}

export async function addBranch(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await addDiscoveryBranch(requestId, {
    name: String(formData.get("name")),
    city: String(formData.get("city") || "") || undefined,
    region: String(formData.get("region") || "") || undefined,
  });
  revalidateDiscovery(requestId);
}

export async function removeBranch(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await deleteDiscoveryBranch(requestId, id);
  revalidateDiscovery(requestId);
}

export async function addRole(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryStructureChange(requestId);
  await addDiscoveryRole(requestId, {
    name: String(formData.get("name")),
    level: String(formData.get("level") || "") || undefined,
  });
  revalidateDiscovery(requestId);
}

export async function removeRole(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryStructureChange(requestId);
  await deleteDiscoveryRole(requestId, id);
  revalidateDiscovery(requestId);
}

export async function addWorkflow(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryStructureChange(requestId);
  await addDiscoveryWorkflow(requestId, {
    name: String(formData.get("name")),
    description: String(formData.get("description") || "") || undefined,
  });
  revalidateDiscovery(requestId);
}

export async function removeWorkflow(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryStructureChange(requestId);
  await deleteDiscoveryWorkflow(requestId, id);
  revalidateDiscovery(requestId);
}

export async function addSecurityRequirement(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await addDiscoverySecurityRequirement(requestId, {
    requirement: String(formData.get("requirement")),
    priority: String(formData.get("priority") || "") || undefined,
  });
  revalidateDiscovery(requestId);
}

export async function removeSecurityRequirement(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await deleteDiscoverySecurityRequirement(requestId, id);
  revalidateDiscovery(requestId);
}

export async function addIntegration(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await addDiscoveryIntegration(requestId, {
    providerKey: String(formData.get("providerKey")),
    notes: String(formData.get("notes") || "") || undefined,
  });
  revalidateDiscovery(requestId);
}

export async function removeIntegration(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await deleteDiscoveryIntegration(requestId, id);
  revalidateDiscovery(requestId);
}

export async function addExperienceRequirement(requestId: string, formData: FormData) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await addDiscoveryExperienceRequirement(requestId, {
    personaKey: String(formData.get("personaKey")),
    requirement: String(formData.get("requirement")),
  });
  revalidateDiscovery(requestId);
}

export async function removeExperienceRequirement(requestId: string, id: string) {
  if (isMockDiscoveryWriteSkipped(requestId)) return;
  await assertDiscoveryActive(requestId);
  await deleteDiscoveryExperienceRequirement(requestId, id);
  revalidateDiscovery(requestId);
}

async function assertDiscoveryActive(requestId: string) {
  await requireActionDiscoveryWrite();
  const ctx = await getDiscoveryContext(requestId);
  if (!ctx?.discoveryProfile) {
    throw new Error("Discovery profile not found");
  }
  if (!canEditDiscovery(ctx.status)) {
    throw new Error(
      `Discovery is read-only for this request (status: ${ctx.status}). Edits are allowed during discovery or blueprint build.`
    );
  }
}

/** Roles/workflows structure edits — platform staff only (maps to cem.roles / cem.workflows manage). */
async function assertDiscoveryStructureChange(requestId: string) {
  await assertDiscoveryActive(requestId);
}

export async function completeDiscovery(requestId: string) {
  // CROW.DISCOVERY.2 — D0–D2 quarantines Blueprint create behind explicit override.
  assertDiscoveryBlueprintCompleteAllowed();
  assertHostedBusinessWriteAllowed("completeDiscovery");

  if (isMockDiscoveryWriteSkipped(requestId)) {
    const ctx = await getDiscoveryContext(requestId);
    const blueprintId = ctx?.enterpriseBlueprint?.id;
    if (blueprintId) {
      redirect(routes.blueprint(blueprintId).overview);
    }
    return;
  }

  await assertDiscoveryActive(requestId);

  const blueprint = await completeDiscoveryAndCreateBlueprint(requestId);

  revalidatePath(routes.admin.request(requestId));
  revalidatePath(routes.discovery(requestId).summary);
  redirect(routes.blueprint(blueprint.id).overview);
}
