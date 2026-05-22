import { prisma } from "@/lib/db";

import { getAiExtraKeys } from "@/lib/discovery-answers";

import {

  MEEM_AI_EXTRA_KEYS,

  MEEM_DISCOVERY_BRANCHES,

  MEEM_DISCOVERY_WORKFLOWS,

  MEEM_TENANT_WORKFLOWS,

} from "@/lib/meem/meem-ops-catalog";

import {
  MEEM_MODULE_KEYS,
  MEEM_REFERENCE_CODE,
  MEEM_TENANT_SLUG,
} from "@/lib/mock/meem-global";

import { upsertDiscoveryAnswer } from "@/lib/services/discovery.service";

import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";

import { syncMeemTenantRolePermissions } from "@/lib/auth/tenant-cem-permissions";
import { enrichTenantOps } from "@/lib/services/tenant-ops-seed.service";



export type MeemOpsResult = {

  tenantSlug: string;

  requestId: string;

  workflowNames: string[];

  aiExtraKeys: string[];

  departments: number;

  branches: number;

  roles: number;

  rolePermissionsSynced: number;

  hrEmployees: number;

  crmAccounts: number;

  salesOpportunities: number;

  inventoryItems: number;

  warehouseLocations: number;

  financeEntries: number;

  tasks: number;

};



async function resolveMeemContext() {

  const request = await prisma.implementationRequest.findFirst({

    where: { referenceCode: MEEM_REFERENCE_CODE },

    include: {

      discoveryProfile: {

        include: {

          workflows: true,

          branches: true,

          answers: true,

        },

      },

      enterpriseBlueprint: { include: { tenant: { include: { modules: true } } } },

    },

  });



  if (!request?.discoveryProfile) {

    throw new Error(`MEEM request not found (${MEEM_REFERENCE_CODE}). Run npm run db:seed:meem first.`);

  }



  const tenant =

    request.enterpriseBlueprint?.tenant ??

    (await prisma.tenant.findFirst({

      where: { slug: MEEM_TENANT_SLUG },

      include: { modules: { where: { enabled: true } } },

    }));



  if (!tenant) {

    throw new Error(`MEEM tenant ${MEEM_TENANT_SLUG} not provisioned. Run npm run db:seed:meem first.`);

  }



  return { request, profile: request.discoveryProfile, blueprintId: request.enterpriseBlueprint?.id, tenant };

}



async function ensureDiscoveryWorkflows(profileId: string) {

  const existing = await prisma.discoveryWorkflow.findMany({ where: { profileId } });

  const names = new Set(existing.map((w) => w.name.toLowerCase()));



  for (const def of MEEM_DISCOVERY_WORKFLOWS) {

    if (!names.has(def.name.toLowerCase())) {

      await prisma.discoveryWorkflow.create({

        data: { profileId, name: def.name, description: def.description },

      });

    }

  }

}



async function ensureBlueprintWorkflows(blueprintId: string) {

  const existing = await prisma.blueprintWorkflow.findMany({ where: { blueprintId } });

  const names = new Set(existing.map((w) => w.name.toLowerCase()));



  for (const def of MEEM_DISCOVERY_WORKFLOWS) {

    if (!names.has(def.name.toLowerCase())) {

      await prisma.blueprintWorkflow.create({

        data: {

          blueprintId,

          name: def.name,

          configJson: { source: "meem-ops", description: def.description },

        },

      });

    }

  }

}



async function ensureAiExtras(requestId: string, answers: { sectionKey: string; questionKey: string; valueJson: unknown }[]) {

  const current = new Set(getAiExtraKeys(answers));

  for (const key of MEEM_AI_EXTRA_KEYS) {

    current.add(key);

  }

  const merged = [...current];

  await upsertDiscoveryAnswer(requestId, "experience", "aiExtras", merged);

  await refreshRequestPricingEstimate(requestId);

  return merged;

}



async function ensureDiscoveryBranches(profileId: string) {

  const existing = await prisma.discoveryBranch.findMany({ where: { profileId } });

  const names = new Set(existing.map((b) => b.name.toLowerCase()));



  for (const def of MEEM_DISCOVERY_BRANCHES) {

    if (!names.has(def.name.toLowerCase())) {

      await prisma.discoveryBranch.create({

        data: { profileId, name: def.name, city: def.city, region: def.region },

      });

    }

  }

}



async function ensureTenantBranches(tenantId: string, profileId: string) {

  const tenantBranches = await prisma.branch.count({ where: { tenantId } });

  if (tenantBranches > 0) return;



  const discoveryBranches = await prisma.discoveryBranch.findMany({ where: { profileId } });

  for (const b of discoveryBranches) {

    await prisma.branch.create({

      data: {

        tenantId,

        name: b.name,

        city: b.city ?? undefined,

        region: b.region ?? undefined,

      },

    });

  }

}



async function ensureTenantWorkflowWithSteps(tenantId: string, def: (typeof MEEM_TENANT_WORKFLOWS)[number]) {

  let workflow = await prisma.workflow.findFirst({

    where: { tenantId, name: def.name },

    include: { steps: { orderBy: { orderIndex: "asc" } } },

  });



  if (!workflow) {

    workflow = await prisma.workflow.create({

      data: { tenantId, name: def.name, status: def.status },

      include: { steps: { orderBy: { orderIndex: "asc" } } },

    });

  } else if (workflow.status !== def.status) {

    workflow = await prisma.workflow.update({

      where: { id: workflow.id },

      data: { status: def.status },

      include: { steps: { orderBy: { orderIndex: "asc" } } },

    });

  }



  if (workflow.steps.length === def.steps.length) {

    const match = workflow.steps.every((s, i) => s.name === def.steps[i]);

    if (match) return workflow;

  }



  await prisma.workflowStep.deleteMany({ where: { workflowId: workflow.id } });

  await prisma.workflowStep.createMany({

    data: def.steps.map((name, orderIndex) => ({

      workflowId: workflow!.id,

      name,

      orderIndex,

    })),

  });



  return prisma.workflow.findFirstOrThrow({

    where: { id: workflow.id },

    include: { steps: { orderBy: { orderIndex: "asc" } } },

  });

}



/**

 * Idempotently enrich meem-global: discovery/blueprint AI + workflows, tenant WorkflowSteps, branches.

 * ERP samples delegated to tenant-ops-seed (logistics industry pack, module-driven).

 */

export async function enrichMeemGlobalOps(): Promise<MeemOpsResult> {

  const { request, profile, blueprintId, tenant } = await resolveMeemContext();



  await ensureDiscoveryWorkflows(profile.id);

  await ensureDiscoveryBranches(profile.id);

  const aiExtraKeys = await ensureAiExtras(request.id, profile.answers);



  if (blueprintId) {

    await ensureBlueprintWorkflows(blueprintId);

  }



  await ensureTenantBranches(tenant.id, profile.id);



  const workflows = [];

  for (const def of MEEM_TENANT_WORKFLOWS) {

    workflows.push(await ensureTenantWorkflowWithSteps(tenant.id, def));

  }



  const moduleKeys =

    tenant.modules?.length > 0

      ? tenant.modules.map((m) => m.moduleKey)

      : [...MEEM_MODULE_KEYS];



  const ops = await enrichTenantOps(tenant.id, {

    industryKey: "logistics",

    moduleKeys: [...new Set([...moduleKeys, ...MEEM_MODULE_KEYS])],

  });



  const [departments, branches, roles] = await Promise.all([

    prisma.department.count({ where: { tenantId: tenant.id } }),

    prisma.branch.count({ where: { tenantId: tenant.id } }),

    prisma.role.count({ where: { tenantId: tenant.id } }),

  ]);

  const rolePermSync = await syncMeemTenantRolePermissions(MEEM_TENANT_SLUG);



  return {

    tenantSlug: tenant.slug,

    requestId: request.id,

    workflowNames: workflows.map((w) => w.name),

    aiExtraKeys,

    departments,

    branches,

    roles,

    rolePermissionsSynced: rolePermSync.synced,

    hrEmployees: ops.hrEmployees,

    crmAccounts: ops.crmAccounts,

    salesOpportunities: ops.salesOpportunities,

    inventoryItems: ops.inventoryItems,

    warehouseLocations: ops.warehouseLocations,

    financeEntries: ops.financeEntries,

    tasks: ops.tasks,

  };

}


