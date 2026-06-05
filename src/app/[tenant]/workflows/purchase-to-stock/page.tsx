import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CemTransactionEvidencePanel,
  CemTransactionReportPanel,
  CemTransactionSareaPanel,
  CemTransactionStageTimeline,
  CemTransactionTasksPanel,
} from "@/components/tenant/cem-transaction-workflow-panels";
import { CemTransactionWorkflowActions } from "@/components/tenant/cem-transaction-workflow-actions";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { routes } from "@/lib/routes";
import { CemWorkflowPersistencePanel } from "@/components/tenant/cem-workflow-persistence-panel";
import { buildPurchaseToStockWorkflowSnapshotForTenantSlug } from "@/lib/services/cem-transaction-workflow.service";
import { auditCemWorkflowPersistenceForTenantSlug } from "@/lib/services/cem-workflow-persistence.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export const dynamic = "force-dynamic";

export default async function PurchaseToStockWorkflowPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ requestId?: string }>;
}) {
  const { tenant: slug } = await params;
  const { requestId } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [snapshot, persistenceSnapshot] = await Promise.all([
    buildPurchaseToStockWorkflowSnapshotForTenantSlug(slug, requestId),
    auditCemWorkflowPersistenceForTenantSlug(slug, requestId),
  ]);
  if (!snapshot) notFound();

  const r = routes.tenant(slug);

  return (
    <TenantModulePage
      engine="CEM"
      title="purchase-to-stock workflow"
      description={`Cross-module transaction workflow prototype for ${tenant.organization.displayName} — department request through inventory visibility and report output. Staging demo; not production ERP.`}
      route="/[tenant]/workflows/purchase-to-stock"
      backHref={r.workflows}
      backLabel="Workflows"
    >
      <section className="cc-glass-card border-amber-500/20 bg-amber-500/5 p-4">
        <ul className="list-disc space-y-1 pl-5 text-sm text-amber-100/90">
          {snapshot.disclaimers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="cc-glass-card border-cyan-500/10 p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 font-display text-lg font-semibold capitalize text-white">
            {snapshot.status.replace(/_/g, " ")}
          </p>
        </div>
        <div className="cc-glass-card border-cyan-500/10 p-4">
          <p className="text-xs text-slate-500">Current stage</p>
          <p className="mt-1 font-display text-lg font-semibold capitalize text-white">
            {snapshot.request.currentStage.replace(/_/g, " ")}
          </p>
        </div>
        <div className="cc-glass-card border-cyan-500/10 p-4">
          <p className="text-xs text-slate-500">Persistence</p>
          <p className="mt-1 font-display text-lg font-semibold text-white">
            {snapshot.persistenceMode === "tenant_backed" ? "Tenant-backed" : "Advisory only"}
          </p>
        </div>
        <div className="cc-glass-card border-cyan-500/10 p-4">
          <p className="text-xs text-slate-500">Request source</p>
          <p className="mt-1 font-display text-lg font-semibold capitalize text-white">
            {snapshot.request.source.replace(/_/g, " ")}
          </p>
        </div>
      </section>

      <section className="cc-glass-card border-cyan-500/10 p-4 sm:p-6">
        <h2 className="font-display text-base font-semibold text-white">Request</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Title</dt>
            <dd className="text-white">{snapshot.request.title}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Item</dt>
            <dd className="text-white">{snapshot.request.itemName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Quantity</dt>
            <dd className="text-white">{snapshot.request.quantity}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Department</dt>
            <dd className="text-white">{snapshot.request.department}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Business reason</dt>
            <dd className="text-slate-300">{snapshot.request.businessReason}</dd>
          </div>
        </dl>
      </section>

      {persistenceSnapshot && (
        <CemWorkflowPersistencePanel
          snapshot={persistenceSnapshot}
          requestId={snapshot.request.id}
        />
      )}

      <section className="cc-glass-card border-cyan-500/10 p-4 sm:p-6">
        <h2 className="font-display text-base font-semibold text-white">Stage timeline</h2>
        <div className="mt-4">
          <CemTransactionStageTimeline snapshot={snapshot} />
        </div>
      </section>

      <section className="cc-glass-card border-cyan-500/10 p-4 sm:p-6">
        <h2 className="font-display text-base font-semibold text-white">Next actions</h2>
        <div className="mt-4">
          <CemTransactionWorkflowActions snapshot={snapshot} />
        </div>
      </section>

      {(snapshot.blockers.length > 0 || snapshot.warnings.length > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {snapshot.warnings.length > 0 && (
            <div className="cc-glass-card border-amber-500/20 p-4">
              <h3 className="text-sm font-semibold text-amber-200">Warnings</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-100/80">
                {snapshot.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          {snapshot.blockers.length > 0 && (
            <div className="cc-glass-card border-rose-500/20 p-4">
              <h3 className="text-sm font-semibold text-rose-200">Blockers</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-rose-100/80">
                {snapshot.blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="cc-glass-card border-cyan-500/10 p-4 sm:p-6">
          <h2 className="font-display text-base font-semibold text-white">Related tasks</h2>
          <div className="mt-4">
            <CemTransactionTasksPanel snapshot={snapshot} />
          </div>
        </div>
        <div className="cc-glass-card border-cyan-500/10 p-4 sm:p-6">
          <h2 className="font-display text-base font-semibold text-white">Report output</h2>
          <div className="mt-4">
            <CemTransactionReportPanel
              snapshot={snapshot}
              persistenceLinks={persistenceSnapshot?.links}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="cc-glass-card border-violet-500/15 p-4 sm:p-6">
          <h2 className="font-display text-base font-semibold text-white">CyberCrow evidence readiness</h2>
          <div className="mt-4">
            <CemTransactionEvidencePanel
              snapshot={snapshot}
              persistenceLinks={persistenceSnapshot?.links}
            />
          </div>
        </div>
        <div className="cc-glass-card border-rose-500/15 p-4 sm:p-6">
          <h2 className="font-display text-base font-semibold text-white">SAREA role experience</h2>
          <p className="mt-1 text-xs text-slate-500">
            Experience shaping copy only — does not grant permissions or replace RBAC.
          </p>
          <div className="mt-4">
            <CemTransactionSareaPanel snapshot={snapshot} />
          </div>
        </div>
      </section>

      <section className="cc-glass-card border-cyan-500/10 p-4">
        <h2 className="text-sm font-semibold text-white">Module impacts</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {snapshot.moduleImpacts.map((m) => (
            <li key={m.moduleKey}>
              <Link
                href={m.route}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-500/20"
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={r.workflows} className="cc-btn-secondary text-sm">
          All workflows
        </Link>
        <Link href={r.procurement} className="cc-btn-secondary text-sm">
          Procurement
        </Link>
        <Link href={routes.sarea.preview} className="cc-btn-secondary text-sm">
          SAREA preview
        </Link>
      </div>
    </TenantModulePage>
  );
}
