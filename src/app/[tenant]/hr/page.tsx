import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { HrEmployeeEditRow } from "@/components/tenant/hr/hr-employee-edit-row";
import { HrEmployeeForm } from "@/components/tenant/hr/hr-employee-form";
import { HrWorkforceReadinessPanel } from "@/components/tenant/hr/hr-workforce-readiness-panel";
import { MeemHrHub } from "@/components/tenant/meem-hr-hub";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { getHrWorkforceReadinessSnapshot } from "@/lib/services/hr-readiness.service";
import { listHrEmployees } from "@/lib/services/hr.service";
import { listTenantDepartments } from "@/lib/services/tenant-identity.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

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

  const [employees, departments, readiness, operatingModel, moduleDepth] = await Promise.all([
    listHrEmployees(tenant.id),
    listTenantDepartments(tenant.id),
    getHrWorkforceReadinessSnapshot(tenant.id, tenant.organization.industry),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "hr"),
  ]);
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "hr")
    : { relatedFlows: [], moduleAssignment: undefined };

  const deptOptions = departments.map((d) => ({ id: d.id, name: d.name }));
  const cybercrowLive = readiness.cybercrowInitialized;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · HR"
        entity="cem"
        title="Human Resources"
        description={`Workforce operational readiness for ${tenant.organization.displayName}. Operator-managed employee records, org linkage, and advisory onboarding/offboarding — not payroll or enterprise HRMS scope.`}
      />

      <TenantRuntimeStatStrip
        items={[
          { label: "Readiness", value: readiness.readinessLabel, accent: "teal" },
          { label: "Profiles", value: readiness.profileCount },
          { label: "HR employees", value: readiness.employeeCount },
          { label: "Roles", value: readiness.roleCount, accent: "violet" },
          { label: "Departments", value: readiness.departmentCount },
          {
            label: "SAREA mappings",
            value: readiness.sareaProfileCount,
            accent: "rose",
            hint: "Experience profiles",
          },
        ]}
      />

      <HrWorkforceReadinessPanel
        slug={slug}
        snapshot={readiness}
        cybercrowLive={cybercrowLive}
      />

      {operatingModel && (
        <TenantModuleOperatingContext
          slug={slug}
          moduleKey="hr"
          moduleAssignment={moduleCtx.moduleAssignment}
          relatedFlows={moduleCtx.relatedFlows}
          cybercrowInitialized={cybercrowLive}
        />
      )}

      {moduleDepth && (
        <TenantCemModuleDepthSection
          slug={slug}
          snapshot={moduleDepth}
          cybercrowInitialized={cybercrowLive}
        />
      )}

      {showMeemHub && (
        <MeemHrHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          aiExtraKeys={aiExtraKeys}
        />
      )}

      <section className="cc-glass-card border-cyan-500/10 p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Employee records</h3>
        <p className="mt-1 text-xs text-slate-500">
          Tenant-scoped HR records. Link emails to workspace profiles for onboarding/offboarding
          traceability.
        </p>
        <div className="mt-4">
          <HrEmployeeForm tenantSlug={slug} departments={deptOptions} />
        </div>
        {employees.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No employee records yet"
              description="Add records when you need workforce documentation beyond login profiles. Profiles and RBAC live under Users."
              action={
                <Link href={routes.tenant(slug).users} className="cc-btn-secondary text-sm">
                  Go to users
                </Link>
              }
            />
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

      <TenantRuntimeCrossLinks slug={slug} current="hr" cybercrowLive={cybercrowLive} />
    </div>
  );
}
