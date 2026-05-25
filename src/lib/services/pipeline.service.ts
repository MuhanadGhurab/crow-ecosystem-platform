/**
 * Discovery → Blueprint → Tenant provisioning pipeline.
 * Golden rule: Discovery understands. Blueprint defines. CEM runs. CyberCrow protects. SAREA adapts.
 */

import type { Prisma } from "@prisma/client";
import { prisma, prismaTransaction } from "@/lib/db";
import { getConfirmedModuleKeys } from "@/lib/discovery-answers";
import {
  seedCybercrowBaseline,
  seedCybercrowEvidenceIfMissing,
} from "@/lib/services/cybercrow-seed.service";
import { notifyPipelineEvent } from "@/lib/services/notification.service";
import { seedSareaProfileDefaults, PERSONA_DISPLAY_NAMES } from "@/lib/services/sarea-seed.service";
import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";
import { seedTenantCemFromDiscovery } from "@/lib/services/tenant-cem-seed.service";
import { seedLogisticsAuditSamples } from "@/lib/services/cybercrow-logistics-audit.service";
import { syncBlueprintOrgModelFromDiscovery } from "@/lib/services/org-intelligence.service";
import { enrichTenantFromBlueprint } from "@/lib/services/tenant-ops-seed.service";
import { ensureTenantSubscriptionForPlan } from "@/lib/services/billing-subscription.service";
import { normalizePlanKey } from "@/lib/subscription/plan-capabilities";

const LOGISTICS_OPS_MODULE_KEYS = new Set([
  "logistics",
  "warehouse",
  "inventory",
  "sales",
  "finance",
]);

/** Start discovery for an approved request — creates discovery_profile */
export async function startDiscovery(requestId: string) {
  return prismaTransaction(async (tx: Prisma.TransactionClient) => {
    const request = await tx.implementationRequest.update({
      where: { id: requestId },
      data: { status: "UNDER_DISCOVERY" },
    });

    const profile = await tx.discoveryProfile.upsert({
      where: { requestId },
      create: { requestId, status: "IN_PROGRESS" },
      update: { status: "IN_PROGRESS" },
    });

    const contact = await tx.requestContact.findFirst({
      where: { requestId, isPrimary: true },
    });
    if (contact?.email) {
      void notifyPipelineEvent("discovery_started", contact.email, {
        requestId: request.id,
        referenceCode: request.referenceCode,
        organizationName: request.organizationName,
        contactName: contact.fullName,
      });
    }

    return { request, profile };
  });
}

/** Complete discovery and create draft enterprise blueprint */
export async function completeDiscoveryAndCreateBlueprint(requestId: string) {
  const blueprint = await prismaTransaction(async (tx: Prisma.TransactionClient) => {
    const request = await tx.implementationRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: {
        requestedModules: true,
        discoveryProfile: { include: { answers: true } },
      },
    });

    if (!request.discoveryProfile) {
      throw new Error("Discovery profile not found");
    }

    const profile = await tx.discoveryProfile.update({
      where: { requestId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    await tx.implementationRequest.update({
      where: { id: requestId },
      data: { status: "BLUEPRINT_BUILD" },
    });

    const blueprint = await tx.enterpriseBlueprint.upsert({
      where: { requestId },
      create: {
        requestId,
        discoveryProfileId: profile.id,
        status: "DRAFT",
      },
      update: { status: "DRAFT" },
    });

    const moduleKeys = getConfirmedModuleKeys(
      request.requestedModules.map((m: { moduleKey: string }) => m.moduleKey),
      request.discoveryProfile.answers
    );

    await tx.blueprintModule.deleteMany({ where: { blueprintId: blueprint.id } });
    if (moduleKeys.length > 0) {
      await tx.blueprintModule.createMany({
        data: moduleKeys.map((moduleKey) => ({
          blueprintId: blueprint.id,
          moduleKey,
          enabled: true,
        })),
      });
    }

    const blueprintFull = await tx.enterpriseBlueprint.findUniqueOrThrow({
      where: { id: blueprint.id },
      include: { modules: true, request: { include: { contacts: { where: { isPrimary: true } } } } },
    });

    const contact = blueprintFull.request.contacts[0];
    if (contact?.email) {
      void notifyPipelineEvent("blueprint_ready", contact.email, {
        requestId: request.id,
        blueprintId: blueprint.id,
        organizationName: request.organizationName,
        referenceCode: request.referenceCode,
        contactName: contact.fullName,
      });
    }

    return blueprintFull;
  });

  await syncBlueprintOrgModelFromDiscovery(blueprint.id, blueprint.discoveryProfileId);
  await refreshRequestPricingEstimate(requestId);
  return blueprint;
}

/** Approve blueprint and provision CEM tenant */
export async function provisionTenantFromBlueprint(
  blueprintId: string,
  tenantSlug: string,
  organizationName: string,
  planKey: string
) {
  const resolvedPlanKey = normalizePlanKey(planKey);

  return prismaTransaction(async (tx: Prisma.TransactionClient) => {
    const blueprint = await tx.enterpriseBlueprint.update({
      where: { id: blueprintId },
      data: { status: "APPROVED", approvedAt: new Date() },
      include: { modules: true },
    });

    const org = await tx.organization.create({
      data: { legalName: organizationName, displayName: organizationName },
    });

    const tenant = await tx.tenant.create({
      data: {
        slug: tenantSlug,
        organizationId: org.id,
        blueprintId: blueprint.id,
        planKey: resolvedPlanKey,
        modules: {
          create: blueprint.modules.map((m: { moduleKey: string; enabled: boolean }) => ({
            moduleKey: m.moduleKey,
            enabled: m.enabled,
          })),
        },
      },
    });

    await tx.implementationRequest.update({
      where: { id: blueprint.requestId },
      data: { status: "TENANT_PROVISIONING" },
    });

    return tenant;
  });
}

/** Full go-live: provision tenant, CyberCrow baseline, and SAREA personas */
export async function provisionAndInitializeTenant(
  blueprintId: string,
  tenantSlug: string,
  organizationName: string,
  planKey: string,
  personaKeys: string[] = ["executive", "manager", "frontline"]
) {
  const resolvedPlanKey = normalizePlanKey(planKey);

  const tenant = await provisionTenantFromBlueprint(
    blueprintId,
    tenantSlug,
    organizationName,
    resolvedPlanKey
  );

  await ensureTenantSubscriptionForPlan({
    tenantId: tenant.id,
    planKey: resolvedPlanKey,
    status: "active",
  });

  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    select: { discoveryProfileId: true },
  });
  if (blueprint?.discoveryProfileId) {
    await seedTenantCemFromDiscovery(tenant.id, blueprint.discoveryProfileId);
  }

  await initializeCyberCrow(tenant.id);
  await initializeSarea(tenant.id, personaKeys);

  const blueprintModules = await prisma.blueprintModule.findMany({
    where: { blueprintId, enabled: true },
    select: { moduleKey: true },
  });
  const moduleKeys = blueprintModules.map((m) => m.moduleKey);
  const hasLogisticsStack = moduleKeys.some((k) => LOGISTICS_OPS_MODULE_KEYS.has(k));
  const opsSeedEnabled = process.env.TENANT_OPS_SEED === "true";

  if (opsSeedEnabled || hasLogisticsStack) {
    const org = await prisma.organization.findFirst({
      where: { tenants: { some: { id: tenant.id } } },
      select: { industry: true },
    });
    await enrichTenantFromBlueprint(tenant.id, {
      industryPack: hasLogisticsStack
        ? "logistics"
        : (org?.industry ?? undefined),
    });
    if (moduleKeys.includes("logistics")) {
      await seedLogisticsAuditSamples(tenant.id, moduleKeys);
    }
  }

  await prisma.implementationRequest.updateMany({
    where: { enterpriseBlueprint: { id: blueprintId } },
    data: { status: "GO_LIVE" },
  });

  const contact = await prisma.requestContact.findFirst({
    where: {
      request: { enterpriseBlueprint: { id: blueprintId } },
      isPrimary: true,
    },
  });
  if (contact?.email) {
    void notifyPipelineEvent("tenant_provisioned", contact.email, {
      tenantId: tenant.id,
      tenantSlug,
      displayName: organizationName,
      organizationName,
      blueprintId,
      contactName: contact.fullName,
    });
  }

  return tenant;
}

/** Initialize CyberCrow security baseline for tenant */
export async function initializeCyberCrow(tenantId: string) {
  await prisma.implementationRequest.updateMany({
    where: { enterpriseBlueprint: { tenant: { id: tenantId } } },
    data: { status: "SECURITY_INIT" },
  });

  await seedCybercrowBaseline(tenantId);
  await seedCybercrowEvidenceIfMissing(tenantId);

  return prisma.cybercrowAuditLog.create({
    data: {
      tenantId,
      action: "CYBERCROW_INITIALIZED",
      entityType: "tenant",
      entityId: tenantId,
      metadata: { source: "pipeline", ncaAligned: true },
    },
  });
}

/** Initialize SAREA experience profiles for tenant */
export async function initializeSarea(tenantId: string, personaKeys: string[]) {
  await prisma.implementationRequest.updateMany({
    where: { enterpriseBlueprint: { tenant: { id: tenantId } } },
    data: { status: "SAREA_INIT" },
  });

  for (const personaKey of personaKeys) {
    const profile = await prisma.sareaExperienceProfile.create({
      data: {
        tenantId,
        name: PERSONA_DISPLAY_NAMES[personaKey] ?? `${personaKey} experience`,
        personaKey,
        configJson: { complexity: "adaptive", mobileFirst: personaKey === "frontline" },
      },
    });
    await seedSareaProfileDefaults(profile.id, personaKey);
  }
}
