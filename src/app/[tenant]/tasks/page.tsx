import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { MEEM_TASK_SAMPLES } from "@/lib/meem/meem-ops-catalog";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { listTenantTasks } from "@/lib/services/tenant-identity.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { TenantCemLinkageNote } from "@/components/tenant/tenant-cem-linkage-note";
import { TenantTaskStatusGroups } from "@/components/tenant/tenant-task-status-groups";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [tasks, summary, ops] = await Promise.all([
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
  ]);
  const r = routes.tenant(slug);
  const openCount = tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Tasks"
        entity="cem"
        title="Tasks"
        description="Work items linked to tenant workflows — task coordination and status visibility. No workflow automation engine in this phase."
      />

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
