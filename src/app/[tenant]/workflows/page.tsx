import Link from "next/link";
import { notFound } from "next/navigation";
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
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantWorkflowsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const workflows =
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
      : await listTenantWorkflows(tenant.id);
  const r = routes.tenant(slug);
  const isMeem = slug === MEEM_TENANT_SLUG;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Workflows</h2>
        <p className="mt-1 text-sm text-slate-400">
          {workflows.length} workflow definition{workflows.length === 1 ? "" : "s"} from discovery
          {isMeem ? " — OCR/AI flows link to the logistics hub." : "."}
        </p>
      </div>

      {workflows.length === 0 ? (
        <p className="text-sm text-slate-500">No workflows defined yet.</p>
      ) : (
        <ul className="space-y-3">
          {workflows.map((w) => {
            const meta = isMeem ? MEEM_WORKFLOW_META[w.name] : undefined;
            const showLogistics =
              isMeem && (meta?.logisticsOcrAi || MEEM_OCR_AI_WORKFLOW_NAMES.has(w.name));

            return (
              <li
                key={w.id}
                className="rounded-cc border border-cyan-500/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{w.name}</p>
                    <p className="text-xs capitalize text-slate-500">{w.status}</p>
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
                      <p className="mt-2 text-xs text-slate-500">
                        {w.steps.map((s) => s.name).join(" → ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p className="font-mono text-cyan-400/90">
                      {w._count.steps} step{w._count.steps === 1 ? "" : "s"}
                    </p>
                    <p className="mt-0.5">{w._count.tasks} task{w._count.tasks === 1 ? "" : "s"}</p>
                  </div>
                </div>
                {showLogistics && (
                  <Link
                    href={r.logistics}
                    className="mt-3 inline-block text-xs text-teal-400 hover:text-teal-300"
                  >
                    Open logistics hub (OCR/AI) →
                  </Link>
                )}
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
        <Link href={r.tasks} className="text-sm text-slate-400 hover:text-white">
          Tasks →
        </Link>
      </div>
    </div>
  );
}
