import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import {
  MEEM_OCR_AI_WORKFLOW_NAMES,
  MEEM_TENANT_WORKFLOWS,
  MEEM_WORKFLOW_META,
} from "@/lib/meem/meem-ops-catalog";
import { moduleLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { listTenantWorkflows } from "@/lib/services/tenant-identity.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantWorkflowsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [workflows, summary] = await Promise.all([
    isUseMockData() && slug === MEEM_TENANT_SLUG
      ? MEEM_TENANT_WORKFLOWS.map((w, i) => ({
          id: `mock-workflow-${i}`,
          tenantId: tenant.id,
          name: w.name,
          status: w.status,
          steps: w.steps.map((name, orderIndex) => ({
            id: `mock-step-${i}-${orderIndex}`,
            workflowId: `mock-workflow-${i}`,
            name,
            orderIndex,
          })),
          _count: { steps: w.steps.length, tasks: 1 },
        }))
      : listTenantWorkflows(tenant.id),
    safeWorkspaceSummary(tenant.id),
  ]);

  const r = routes.tenant(slug);
  const isMeem = slug === MEEM_TENANT_SLUG;
  const activeCount = workflows.filter((w) => w.status === "active").length;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Workflows"
        entity="cem"
        title="Workflows"
        description={
          isMeem
            ? "Discovery-derived workflow definitions for MEEM — OCR/AI flows link to the logistics hub. No visual workflow builder in this phase."
            : `Workflow definitions seeded from discovery for ${tenant.organization.displayName}. Read-only operational view — no automation engine.`
        }
      />

      <TenantRuntimeStatStrip
        items={[
          { label: "Definitions", value: workflows.length },
          { label: "Active", value: activeCount, accent: "teal" },
          {
            label: "Open tasks",
            value: summary.openTaskCount ?? 0,
            accent: "amber",
            hint: "Linked work items",
          },
          {
            label: "Audit context",
            value: summary.auditLogCount,
            accent: "violet",
            hint: "CyberCrow events",
          },
        ]}
      />

      {workflows.length === 0 ? (
        <EmptyState
          title="No workflows yet"
          description={
            isMeem
              ? "Run npm run db:seed:meem:ops or complete discovery seeding for sample workflows."
              : "Workflows appear after blueprint go-live and tenant ops seeding."
          }
          action={
            <Link href={r.tasks} className="cc-btn-secondary text-sm">
              View tasks
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {workflows.map((w) => {
            const meta = isMeem ? MEEM_WORKFLOW_META[w.name] : undefined;
            const showLogistics =
              isMeem && (meta?.logisticsOcrAi || MEEM_OCR_AI_WORKFLOW_NAMES.has(w.name));

            return (
              <li
                key={w.id}
                className="cc-glass-card border-cyan-500/10 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-semibold text-white">{w.name}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          w.status === "active"
                            ? "bg-teal-500/15 text-teal-300"
                            : "bg-slate-700/40 text-slate-400"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    {meta?.moduleTags && meta.moduleTags.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {meta.moduleTags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-xs text-teal-300"
                          >
                            {moduleLabel(tag)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {w.steps.length > 0 && (
                      <p className="mt-3 text-xs text-slate-500">
                        Steps: {w.steps.map((s) => s.name).join(" → ")}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-600">
                      Next action: open tasks filtered by workflow name on the tasks board.
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p className="font-mono text-cyan-400/90">
                      {w._count.steps} step{w._count.steps === 1 ? "" : "s"}
                    </p>
                    <p className="mt-0.5">
                      {w._count.tasks} linked task{w._count.tasks === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 border-t border-white/5 pt-3">
                  <Link href={r.tasks} className="text-xs text-cyan-400 hover:text-cyan-300">
                    View tasks →
                  </Link>
                  {showLogistics && (
                    <Link href={r.logistics} className="text-xs text-teal-400 hover:text-teal-300">
                      Logistics hub (OCR/AI) →
                    </Link>
                  )}
                  {summary.cybercrowInitialized && (
                    <Link
                      href={r.cybercrow.auditLogs}
                      className="text-xs text-violet-400 hover:text-violet-300"
                    >
                      CyberCrow audit →
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        {isMeem && (
          <Link href={r.logistics} className="cc-btn-secondary text-sm">
            Logistics hub
          </Link>
        )}
        <Link href={r.tasks} className="cc-btn-secondary text-sm">
          Tasks board
        </Link>
      </div>

      <TenantRuntimeCrossLinks
        slug={slug}
        current="workflows"
        cybercrowLive={summary.cybercrowInitialized}
      />
    </div>
  );
}
