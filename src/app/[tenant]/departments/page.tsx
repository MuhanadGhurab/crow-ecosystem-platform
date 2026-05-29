import Link from "next/link";
import { notFound } from "next/navigation";
import { TenantRuntimePageHeader } from "@/components/tenant/tenant-runtime-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { HrOrgLinkageBanner } from "@/components/tenant/hr/hr-org-linkage-banner";
import { TenantCemLinkageNote } from "@/components/tenant/tenant-cem-linkage-note";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
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

  const [departments, branches, summary, ops] = await Promise.all([
    listTenantDepartments(tenant.id),
    listTenantBranches(tenant.id),
    safeWorkspaceSummary(tenant.id),
    getCemOperationsSnapshot(tenant.id),
  ]);

  const r = routes.tenant(slug);
  const peopleOnDepts = departments.reduce((n, d) => n + d._count.profiles, 0);
  const emptyDepts = departments.filter((d) => d._count.profiles === 0).length;
  const hrWarnings: string[] = [];
  if (departments.length > 0 && emptyDepts > 0) {
    hrWarnings.push(`${emptyDepts} department(s) have no assigned profiles yet.`);
  }

  return (
    <div className="space-y-8">
      <TenantRuntimePageHeader
        beat="structure"
        badge="CEM · Structure"
        entity="cem"
        title="Organization structure"
        description={`Departments and branches for ${tenant.organization.displayName}. Foundation for workflows, RBAC, and SAREA profiles — not ProCrow admin screens.`}
      />

      <HrOrgLinkageBanner slug={slug} warnings={hrWarnings} />

      <TenantRuntimeStatStrip
        items={[
          { label: "Departments", value: departments.length, accent: "teal" },
          { label: "Branches", value: branches.length },
          { label: "Workflows", value: ops.workflowCount, hint: "Operational coverage" },
          { label: "Open tasks", value: ops.openTaskCount, accent: "amber" },
          { label: "Roles", value: summary.roleCount ?? 0, accent: "violet" },
        ]}
      />

      {departments.length > 0 && ops.workflowCount === 0 && (
        <p className="rounded-cc border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          Structure exists but no workflows are defined yet — add workflows via discovery go-live or
          ops seeding, then link tasks on the{" "}
          <Link href={r.workflows} className="text-cyan-300 underline">
            workflows
          </Link>{" "}
          page.
        </p>
      )}

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

      <section className="cc-glass-card border-cyan-500/10">
        <h3 className="text-sm font-medium text-cyan-400">Operational coverage</h3>
        <p className="mt-2 text-sm text-slate-400">
          {ops.departmentsWithProfiles} of {ops.departmentCount} departments have profiles ·{" "}
          {ops.workflowsWithTasks} workflows have tasks · readiness: {ops.readinessLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
            Workflows →
          </Link>
          <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
            Tasks →
          </Link>
          <Link href={r.roles} className="text-violet-400 hover:text-violet-300">
            Roles →
          </Link>
        </div>
      </section>

      <TenantCemLinkageNote
        slug={slug}
        cybercrowInitialized={summary.cybercrowInitialized}
        compact
      />

      <TenantRuntimeCrossLinks
        slug={slug}
        current="departments"
        cybercrowLive={summary.cybercrowInitialized}
      />
    </div>
  );
}
