import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { HrEmployeeEditRow } from "@/components/tenant/hr/hr-employee-edit-row";
import { HrEmployeeForm } from "@/components/tenant/hr/hr-employee-form";
import { MeemHrHub } from "@/components/tenant/meem-hr-hub";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { listHrEmployees } from "@/lib/services/hr.service";
import { listTenantDepartments } from "@/lib/services/tenant-identity.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantHrPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const showMeemHub = showMeemErpHub(slug, tenant.organization.industry, tenantModules);
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "hr") : [];

  const [employees, departments] = await Promise.all([
    listHrEmployees(tenant.id),
    listTenantDepartments(tenant.id),
  ]);

  const deptOptions = departments.map((d) => ({ id: d.id, name: d.name }));

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · HR"
        title="Human Resources"
        description={`Employee records for ${tenant.organization.displayName}. Scoped to this tenant only.`}
      />

      {showMeemHub && (
        <MeemHrHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          aiExtraKeys={aiExtraKeys}
        />
      )}

      <HrEmployeeForm tenantSlug={slug} departments={deptOptions} />

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Employees ({employees.length})
        </h3>
        {employees.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No employees yet" description="Add your first employee using the form above." />
          </div>
        ) : (
          <ul className="mt-4 space-y-6">
            {employees.map((e) => (
              <li key={e.id} className="cc-list-item flex-col !items-stretch gap-3 !py-4">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-medium text-white">{e.fullName}</span>
                  <span
                    className={
                      e.employmentStatus === "active" ? "text-teal-300" : "text-slate-500"
                    }
                  >
                    {e.employmentStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {e.email}
                  {e.jobTitle ? ` · ${e.jobTitle}` : ""}
                  {e.department ? ` · ${e.department.name}` : ""}
                </p>
                <HrEmployeeEditRow tenantSlug={slug} employee={e} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href={routes.tenant(slug).dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Dashboard
      </Link>
    </div>
  );
}
