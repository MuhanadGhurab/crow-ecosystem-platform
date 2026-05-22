import Link from "next/link";
import { notFound } from "next/navigation";
import { ENTITY_THEME } from "@/lib/entity-theme";
import { moduleLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { getTenantIdentityCounts } from "@/lib/services/tenant-identity.service";

export default async function BlueprintCemPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId);
  if (!blueprint) notFound();

  const tenant = blueprint.tenant;
  const identity = tenant ? await getTenantIdentityCounts(tenant.id) : null;

  return (
    <div className="space-y-6">
      <header className="cc-entity-block cc-entity-block--cem !p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          {ENTITY_THEME.cem.shortLabel}
        </p>
        <h2 className="cc-section-title mt-2 text-lg">CEM configuration</h2>
        <p className="mt-2 text-sm text-slate-400">
          Corporate entity management from discovery — modules, org structure, workflows at provision.
        </p>
        {blueprint.modules.length > 0 && (
          <p className="mt-3 text-sm text-cyan-200/90">
            Blueprint modules: {blueprint.modules.map((m) => moduleLabel(m.moduleKey)).join(" · ")}
          </p>
        )}
      </header>

      {tenant && identity ? (
        <section className="cc-glass-card grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Profiles</p>
            <p className="text-lg text-cyan-300">{identity.profiles}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Departments</p>
            <p className="text-lg text-cyan-300">{identity.departments}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Roles</p>
            <p className="text-lg text-cyan-300">{identity.roles}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Workflows</p>
            <p className="text-lg text-cyan-300">{identity.workflows}</p>
          </div>
          <Link
            href={routes.tenant(tenant.slug).departments}
            className="cc-btn-primary text-sm sm:col-span-2"
          >
            Open CEM structure →
          </Link>
        </section>
      ) : (
        <p className="text-sm text-slate-500">
          Tenant not provisioned yet. Complete go-live from the overview tab.
        </p>
      )}

      <Link
        href={routes.blueprint(blueprintId).overview}
        className="text-sm text-cyan-400 hover:text-cyan-300"
      >
        ← Blueprint overview
      </Link>
    </div>
  );
}
