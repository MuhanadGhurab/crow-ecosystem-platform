import Link from "next/link";
import { notFound } from "next/navigation";
import { ENTITY_THEME } from "@/lib/entity-theme";
import { securityPackageLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

export default async function BlueprintCybercrowPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId);
  if (!blueprint) notFound();

  const tenant = blueprint.tenant;
  const summary = tenant ? await getTenantWorkspaceSummary(tenant.id) : null;

  const securityKeys = blueprint.request.requestedSecurityPkgs.map((p) => p.packageKey);

  return (
    <div className="space-y-6">
      <header className="cc-entity-block cc-entity-block--cybercrow !p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
          {ENTITY_THEME.cybercrow.shortLabel}
        </p>
        <h2 className="cc-section-title mt-2 text-lg">CyberCrow security</h2>
        <p className="mt-2 text-sm text-slate-400">
          NCA-aligned baselines, audit seed, and compliance posture initialized at tenant provision.
        </p>
        {securityKeys.length > 0 && (
          <p className="mt-3 text-sm text-violet-200/90">
            Packages: {securityKeys.map(securityPackageLabel).join(" · ")}
          </p>
        )}
      </header>

      {tenant && summary ? (
        <section className="cc-glass-card space-y-4">
          <div>
            <p className="text-xs text-slate-500">Audit log entries</p>
            <p className="text-2xl font-bold text-cyan-300">{summary.auditLogCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Security events</p>
            <p className="text-2xl font-bold text-cyan-300">{summary.securityEventCount}</p>
          </div>
          <Link href={routes.tenant(tenant.slug).cybercrow.dashboard} className="cc-btn-primary text-sm">
            Open CyberCrow console →
          </Link>
        </section>
      ) : (
        <p className="text-sm text-slate-500">Provision tenant from overview to initialize CyberCrow.</p>
      )}

      <Link href={routes.blueprint(blueprintId).overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Blueprint overview
      </Link>
    </div>
  );
}
