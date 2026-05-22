"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActionBlueprintProvision } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { ensureUniqueTenantSlug } from "@/lib/services/tenant.service";
import { assertBlueprintReadyForProvision } from "@/lib/services/readiness.service";
import { provisionAndInitializeTenant } from "@/lib/services/pipeline.service";
import { slugifyOrganization } from "@/lib/slugify";

export async function provisionBlueprintTenant(blueprintId: string, tenantSlugInput?: string) {
  await requireActionBlueprintProvision();
  const blueprint = await getEnterpriseBlueprint(blueprintId);
  if (!blueprint) {
    throw new Error("Blueprint not found");
  }
  if (blueprint.status === "APPROVED" && blueprint.tenant) {
    redirect(routes.tenant(blueprint.tenant.slug).dashboard);
  }
  if (blueprint.request.status !== "BLUEPRINT_BUILD") {
    throw new Error(`Cannot provision from request status ${blueprint.request.status}`);
  }

  await assertBlueprintReadyForProvision(blueprintId);

  const planKey = blueprint.request.requestedPlans[0]?.planKey ?? "startup";
  const slugBase = tenantSlugInput?.trim() || slugifyOrganization(blueprint.request.organizationName);
  const slug = await ensureUniqueTenantSlug(slugBase);

  const tenant = await provisionAndInitializeTenant(
    blueprintId,
    slug,
    blueprint.request.organizationName,
    planKey
  );

  revalidatePath(routes.blueprint(blueprintId).overview);
  revalidatePath(routes.admin.request(blueprint.requestId));
  redirect(routes.tenant(tenant.slug).dashboard);
}
