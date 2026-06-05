import Link from "next/link";
import { notFound } from "next/navigation";
import { TenantRuntimePageHeader } from "@/components/tenant/tenant-runtime-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { MEEM_TASK_SAMPLES } from "@/lib/meem/meem-ops-catalog";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { getTaskApprovalEngineReadinessSnapshot } from "@/lib/services/task-approval-readiness.service";
import { listTenantTasks } from "@/lib/services/tenant-identity.service";
import { TaskApprovalOperationsReadinessPanel } from "@/components/tenant/tasks/task-approval-operations-readiness-panel";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { TenantCemLinkageNote } from "@/components/tenant/tenant-cem-linkage-note";
import { TenantCemOperationalReadinessNote } from "@/components/tenant/tenant-cem-operational-readiness-note";
import { TenantOperatingModelCrossLink } from "@/components/tenant/tenant-operating-model-cross-link";
import { TenantTaskStatusGroups } from "@/components/tenant/tenant-task-status-groups";
import { buildCemOperatingModelSnapshotForTenantSlug } from "@/lib/services/cem-operating-model.service";
import { TenantCemPurchaseToStockLink } from "@/components/tenant/tenant-cem-purchase-to-stock-link";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);

  const [tasks, summary, ops, taskApprovalSnapshot, operatingModel] = await Promise.all([
    isUseMockData() && slug === MEEM_TENANT_SLUG
      ? MEEM_TASK_SAMPLES.map((s, i) => ({
          id: `mock-task-${i}`,
          tenantId: tenant.id,
          workflowId: null,
          title: s.title,
          status: s.status,
          assigneeId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          workflow: { id: `mock-wf-${i}`, name: s.workflowName },
        }))
      : listTenantTasks(tenant.id),
    safeWorkspaceSummary(tenant.id),
    getCemOperationsSnapshot(tenant.id),
    getTaskApprovalEngineReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
  ]);
  const r = routes.tenant(slug);
  const openCount = tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <div className="space-y-8">
      <TenantRuntimePageHeader
        beat="coordination"
        badge="CEM · Tasks"
        entity="cem"
        title="Tasks"
        description="Coordination layer across modules — linked to workflows, approvals, and reports. Operator-guided; not BPMN, RPA, or autonomous automation."
      />

      <TaskApprovalOperationsReadinessPanel
        slug={slug}
        snapshot={taskApprovalSnapshot}
        cybercrowLive={summary.cybercrowInitialized}
        focus="tasks"
      />
      <TenantCemOperationalReadinessNote slug={slug} variant="tasks" />

      <TenantRuntimeStatStrip
        items={[
          { label: "Open / in progress", value: openCount, accent: "amber" },
          { label: "Total tasks", value: tasks.length },
          {
            label: "Unassigned",
            value: ops.unassignedTaskCount,
            hint: ops.unassignedTaskCount > 0 ? "Assign on users page" : "All assigned",
          },
          {
            label: "No workflow link",
            value: ops.tasksWithoutWorkflow,
            accent: ops.tasksWithoutWorkflow > 0 ? "amber" : undefined,
          },
          {
            label: "Workflows",
            value: ops.workflowCount,
            accent: "teal",
          },
          {
            label: "Readiness",
            value: ops.readinessLabel,
            accent: ops.readinessLevel === "strong" ? "teal" : "amber",
          },
        ]}
      />

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description={
            slug === MEEM_TENANT_SLUG
              ? "Run npm run db:seed:meem:ops for sample tasks, or complete discovery seeding."
              : "Tasks appear after blueprint go-live and tenant ops seeding."
          }
          action={
            <Link href={r.workflows} className="cc-btn-secondary text-sm">
              View workflows
            </Link>
          }
        />
      ) : (
        <TenantTaskStatusGroups
          slug={slug}
          tasks={tasks}
          cybercrowInitialized={summary.cybercrowInitialized}
        />
      )}

      {operatingModel && (
        <TenantOperatingModelCrossLink variant="tasks" snapshot={operatingModel} />
      )}

      <TenantCemPurchaseToStockLink slug={slug} moduleKey="tasks" />

      <TenantCemLinkageNote
        slug={slug}
        cybercrowInitialized={summary.cybercrowInitialized}
        compact
      />

      <TenantRuntimeCrossLinks
        slug={slug}
        current="tasks"
        cybercrowLive={summary.cybercrowInitialized}
      />
    </div>
  );
}
