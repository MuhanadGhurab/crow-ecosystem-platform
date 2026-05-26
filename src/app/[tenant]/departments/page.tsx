import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { routes } from "@/lib/routes";
import {
  listTenantBranches,
  listTenantDepartments,
} from "@/lib/services/tenant-identity.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantDepartmentsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [departments, branches, summary] = await Promise.all([
    listTenantDepartments(tenant.id),
    listTenantBranches(tenant.id),
    safeWorkspaceSummary(tenant.id),
  ]);

  const r = routes.tenant(slug);
  const peopleOnDepts = departments.reduce((n, d) => n + d._count.profiles, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Structure"
        entity="cem"
        title="Organization structure"
        description={`Departments and branches seeded from discovery for ${tenant.organization.displayName}. SAREA navigation density can reflect department groupings — RBAC remains on roles.`}
      />

      <TenantRuntimeStatStrip
        items={[
          { label: "Departments", value: departments.length, accent: "teal" },
          { label: "Branches", value: branches.length },
          { label: "Profiles", value: summary.profileCount ?? 0, hint: "Workspace users" },
          { label: "Roles", value: summary.roleCount ?? 0, accent: "violet" },
        ]}
      />

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Departments</h3>
        {departments.length === 0 ? (
          <EmptyState
            title="No departments"
            description="Structure appears after discovery seeding or blueprint go-live."
            action={
              <Link href={r.users} className="cc-btn-secondary text-sm">
                View users
              </Link>
            }
          />
        ) : (
          <ul className="mt-3 space-y-2">
            {departments.map((d) => (
              <li
                key={d.id}
                className="cc-glass-card flex justify-between border-cyan-500/10 px-4 py-3 text-sm"
              >
                <span className="text-white">
                  {d.name}
                  {d.nameAr && (
                    <span className="ml-2 text-slate-500" dir="rtl">
                      {d.nameAr}
                    </span>
                  )}
                </span>
                <span className="text-slate-500">
                  {d._count.profiles} profile{d._count.profiles === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
        {peopleOnDepts > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            {peopleOnDepts} profile{peopleOnDepts === 1 ? "" : "s"} mapped across departments.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Branches</h3>
        {branches.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No branches defined.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {branches.map((b) => (
              <li
                key={b.id}
                className="cc-glass-card border-cyan-500/10 px-4 py-3 text-sm text-white"
              >
                {b.name}
                {(b.city || b.region) && (
                  <span className="ml-2 text-slate-500">
                    {[b.city, b.region].filter(Boolean).join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="cc-glass-card border-rose-500/15">
        <h3 className="text-sm font-medium text-rose-300">SAREA relevance</h3>
        <p className="mt-2 text-sm text-slate-400">
          Department labels inform SAREA widget grouping and persona previews. They do not grant
          permissions — assign roles on the users page.
        </p>
        <Link href={routes.sarea.roleMapping} className="mt-3 inline-block text-sm text-rose-400">
          SAREA role mapping →
        </Link>
      </section>

      <TenantRuntimeCrossLinks
        slug={slug}
        current="departments"
        cybercrowLive={summary.cybercrowInitialized}
      />
    </div>
  );
}
