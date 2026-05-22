import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { moduleLabel } from "@/lib/catalog-labels";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantModulesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM"
        title="Organization modules"
        description={`Modules enabled for ${tenant.organization.displayName} from the enterprise blueprint.`}
      />

      {tenant.modules.length === 0 ? (
        <p className="text-sm text-slate-500">No modules enabled on this tenant.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {tenant.modules.map((m) => (
            <li
              key={m.id}
              className="cc-glass-card flex items-center justify-between gap-4"
            >
              <span className="font-medium text-white">{moduleLabel(m.moduleKey)}</span>
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-300">
                Enabled
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
