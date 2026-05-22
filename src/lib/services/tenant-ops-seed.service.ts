import { prisma } from "@/lib/db";

import {

  LOGISTICS_CRM_SAMPLES,

  LOGISTICS_DISCOVERY_BRANCHES,

  LOGISTICS_DISCOVERY_WORKFLOWS,

  LOGISTICS_FINANCE_SAMPLES,

  LOGISTICS_PROCUREMENT_SAMPLES,

  LOGISTICS_HR_SAMPLES,

  LOGISTICS_INVENTORY_SAMPLES,

  LOGISTICS_SALES_SAMPLES,

  LOGISTICS_TASK_SAMPLES,

  LOGISTICS_TENANT_WORKFLOWS,

  LOGISTICS_WAREHOUSE_SAMPLES,

} from "@/lib/erp/industry-packs/logistics";
import { seedLogisticsAuditSamples } from "@/lib/services/cybercrow-logistics-audit.service";



export type TenantOpsSeedOptions = {

  industryKey: string;

  moduleKeys: string[];

};



export type TenantOpsSeedResult = {

  tenantSlug: string;

  industryKey: string;

  moduleKeys: string[];

  salesOpportunities: number;

  inventoryItems: number;

  warehouseLocations: number;

  financeEntries: number;

  purchaseRequests: number;

  tasks: number;

  hrEmployees: number;

  crmAccounts: number;

  logisticsAuditEvents: number;

};



function hasModule(moduleKeys: string[], key: string): boolean {

  return moduleKeys.includes(key);

}



async function ensureTenantWorkflowWithSteps(

  tenantId: string,

  def: (typeof LOGISTICS_TENANT_WORKFLOWS)[number]

) {

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



async function ensureSalesSamples(tenantId: string) {

  let created = 0;

  const account = await prisma.crmAccount.findFirst({

    where: { tenantId, name: LOGISTICS_CRM_SAMPLES.account.name },

    select: { id: true },

  });



  for (const sample of LOGISTICS_SALES_SAMPLES) {

    const existing = await prisma.tenantSalesOpportunity.findFirst({

      where: { tenantId, referenceCode: sample.referenceCode },

    });

    if (existing) continue;



    await prisma.tenantSalesOpportunity.create({

      data: {

        tenantId,

        referenceCode: sample.referenceCode,

        title: sample.title,

        kind: sample.kind,

        status: sample.status,

        customerName: sample.customerName,

        amountSar: sample.amountSar,

        workflowName: sample.workflowName,

        crmAccountId:

          sample.customerName === LOGISTICS_CRM_SAMPLES.account.name

            ? account?.id

            : undefined,

      },

    });

    created += 1;

  }



  if (created === 0) {

    return prisma.tenantSalesOpportunity.count({ where: { tenantId } });

  }

  return created;

}



async function ensureInventorySamples(tenantId: string) {

  let created = 0;



  for (const sample of LOGISTICS_INVENTORY_SAMPLES) {

    const existing = await prisma.tenantInventoryItem.findFirst({

      where: { tenantId, referenceCode: sample.referenceCode },

    });

    if (existing) continue;



    await prisma.tenantInventoryItem.create({

      data: {

        tenantId,

        referenceCode: sample.referenceCode,

        sku: sample.sku,

        name: sample.name,

        category: sample.category,

        qtyOnHand: sample.qtyOnHand,

        reorderLevel: sample.reorderLevel,

        location: sample.location,

        status: sample.status,

      },

    });

    created += 1;

  }



  if (created === 0) {

    return prisma.tenantInventoryItem.count({ where: { tenantId } });

  }

  return created;

}



async function ensureWarehouseSamples(tenantId: string) {

  let created = 0;



  for (const sample of LOGISTICS_WAREHOUSE_SAMPLES) {

    const existing = await prisma.tenantWarehouseLocation.findFirst({

      where: { tenantId, referenceCode: sample.referenceCode },

    });

    if (existing) continue;



    await prisma.tenantWarehouseLocation.create({

      data: {

        tenantId,

        referenceCode: sample.referenceCode,

        name: sample.name,

        site: sample.site,

        zone: sample.zone,

        bin: sample.bin,

        movementKind: sample.movementKind,

        status: sample.status,

      },

    });

    created += 1;

  }



  if (created === 0) {

    return prisma.tenantWarehouseLocation.count({ where: { tenantId } });

  }

  return created;

}



async function ensureFinanceSamples(tenantId: string) {

  let created = 0;



  for (const sample of LOGISTICS_FINANCE_SAMPLES) {

    const existing = await prisma.tenantFinanceEntry.findFirst({

      where: { tenantId, referenceCode: sample.referenceCode },

    });

    if (existing) continue;



    await prisma.tenantFinanceEntry.create({

      data: {

        tenantId,

        referenceCode: sample.referenceCode,

        title: sample.title,

        entryType: sample.entryType,

        direction: sample.direction,

        status: sample.status,

        amountSar: sample.amountSar,

        customerName: sample.customerName,

        linkedReference: sample.linkedReference,

      },

    });

    created += 1;

  }



  if (created === 0) {

    return prisma.tenantFinanceEntry.count({ where: { tenantId } });

  }

  return created;

}



async function ensureProcurementSamples(tenantId: string) {

  let created = 0;



  for (const sample of LOGISTICS_PROCUREMENT_SAMPLES) {

    const existing = await prisma.tenantPurchaseRequest.findFirst({

      where: { tenantId, referenceCode: sample.referenceCode },

    });

    if (existing) continue;



    await prisma.tenantPurchaseRequest.create({

      data: {

        tenantId,

        referenceCode: sample.referenceCode,

        title: sample.title,

        status: sample.status,

        priority: sample.priority,

        amountSar: sample.amountSar,

        vendorName: sample.vendorName,

        linkedInventoryRef: sample.linkedInventoryRef,

        linkedFinanceRef: sample.linkedFinanceRef,

      },

    });

    created += 1;

  }



  if (created === 0) {

    return prisma.tenantPurchaseRequest.count({ where: { tenantId } });

  }

  return created;

}



async function ensureTasksSamples(tenantId: string) {

  const count = await prisma.task.count({ where: { tenantId } });

  if (count > 0) return count;



  const workflows = await prisma.workflow.findMany({

    where: { tenantId },

    select: { id: true, name: true },

  });

  const byName = new Map(workflows.map((w) => [w.name, w.id]));



  for (const sample of LOGISTICS_TASK_SAMPLES) {

    await prisma.task.create({

      data: {

        tenantId,

        title: sample.title,

        status: sample.status,

        workflowId: byName.get(sample.workflowName) ?? undefined,

      },

    });

  }

  return LOGISTICS_TASK_SAMPLES.length;

}



async function ensureHrSamples(tenantId: string) {

  const count = await prisma.hrEmployee.count({ where: { tenantId } });

  if (count > 0) return count;



  const dept = await prisma.department.findFirst({

    where: { tenantId },

    orderBy: { name: "asc" },

  });



  for (const sample of LOGISTICS_HR_SAMPLES) {

    await prisma.hrEmployee.create({

      data: {

        tenantId,

        fullName: sample.fullName,

        email: sample.email,

        jobTitle: sample.jobTitle,

        employeeNumber: sample.employeeNumber,

        departmentId: dept?.id,

        employmentStatus: "active",

        hireDate: new Date("2024-06-01"),

      },

    });

  }

  return LOGISTICS_HR_SAMPLES.length;

}



async function ensureCrmSamples(tenantId: string) {

  const count = await prisma.crmAccount.count({ where: { tenantId } });

  if (count > 0) return count;



  const account = await prisma.crmAccount.create({

    data: {

      tenantId,

      name: LOGISTICS_CRM_SAMPLES.account.name,

      industry: LOGISTICS_CRM_SAMPLES.account.industry,

      website: LOGISTICS_CRM_SAMPLES.account.website,

      status: "active",

    },

  });



  await prisma.crmContact.create({

    data: {

      tenantId,

      accountId: account.id,

      fullName: LOGISTICS_CRM_SAMPLES.contact.fullName,

      email: LOGISTICS_CRM_SAMPLES.contact.email,

      title: LOGISTICS_CRM_SAMPLES.contact.title,

      phone: LOGISTICS_CRM_SAMPLES.contact.phone,

    },

  });



  return 1;

}



async function ensureLogisticsWorkflows(tenantId: string) {

  for (const def of LOGISTICS_TENANT_WORKFLOWS) {

    await ensureTenantWorkflowWithSteps(tenantId, def);

  }

}



function resolveIndustryPack(industryKey: string) {

  if (industryKey === "logistics" || industryKey === "logistics_fulfillment") {

    return "logistics";

  }

  return industryKey;

}



/**

 * Seed ERP sample data for a tenant based on enabled module keys (not slug).

 */

export async function enrichTenantOps(

  tenantId: string,

  options: TenantOpsSeedOptions

): Promise<TenantOpsSeedResult> {

  const tenant = await prisma.tenant.findUniqueOrThrow({

    where: { id: tenantId },

    select: { slug: true },

  });



  const pack = resolveIndustryPack(options.industryKey);

  const keys = options.moduleKeys;



  let salesOpportunities = 0;

  let inventoryItems = 0;

  let warehouseLocations = 0;

  let financeEntries = 0;

  let purchaseRequests = 0;

  let tasks = 0;

  let hrEmployees = 0;

  let crmAccounts = 0;

  let logisticsAuditEvents = 0;



  if (pack === "logistics") {

    if (

      hasModule(keys, "logistics") ||

      hasModule(keys, "warehouse") ||

      hasModule(keys, "inventory")

    ) {

      await ensureLogisticsWorkflows(tenantId);

    }



    if (hasModule(keys, "crm")) {

      crmAccounts = await ensureCrmSamples(tenantId);

    }

    if (hasModule(keys, "hr")) {

      hrEmployees = await ensureHrSamples(tenantId);

    }

    if (hasModule(keys, "sales")) {

      salesOpportunities = await ensureSalesSamples(tenantId);

    }

    if (hasModule(keys, "inventory")) {

      inventoryItems = await ensureInventorySamples(tenantId);

    }

    if (hasModule(keys, "warehouse")) {

      warehouseLocations = await ensureWarehouseSamples(tenantId);

    }

    if (hasModule(keys, "finance")) {

      financeEntries = await ensureFinanceSamples(tenantId);

    }

    if (hasModule(keys, "procurement")) {

      purchaseRequests = await ensureProcurementSamples(tenantId);

    }

    if (hasModule(keys, "approvals") || hasModule(keys, "logistics")) {

      tasks = await ensureTasksSamples(tenantId);

    }

    if (hasModule(keys, "logistics")) {

      const auditSeed = await seedLogisticsAuditSamples(tenantId, keys);

      logisticsAuditEvents = auditSeed.created;

    }

  }



  return {

    tenantSlug: tenant.slug,

    industryKey: pack,

    moduleKeys: keys,

    salesOpportunities,

    inventoryItems,

    warehouseLocations,

    financeEntries,

    purchaseRequests,

    tasks,

    hrEmployees,

    crmAccounts,

    logisticsAuditEvents,

  };

}



export type EnrichTenantBlueprintOptions = {
  industryPack?: string;
};

/**

 * Enrich tenant from blueprint-enabled modules and organization industry.

 */

export async function enrichTenantFromBlueprint(
  tenantId: string,
  options?: EnrichTenantBlueprintOptions
): Promise<TenantOpsSeedResult> {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: tenantId },
    include: {
      organization: { select: { industry: true } },
      modules: { where: { enabled: true }, select: { moduleKey: true } },
    },
  });

  const industryKey =
    options?.industryPack ?? tenant.organization.industry ?? "logistics";
  const moduleKeys = tenant.modules.map((m) => m.moduleKey);

  return enrichTenantOps(tenantId, { industryKey, moduleKeys });
}



/** Discovery/branch helpers for MEEM-style lighthouse enrichment. */

export const logisticsDiscoveryPack = {

  workflows: LOGISTICS_DISCOVERY_WORKFLOWS,

  branches: LOGISTICS_DISCOVERY_BRANCHES,

};


