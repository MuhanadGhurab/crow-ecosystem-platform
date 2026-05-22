import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  listTenantBranches,
  listTenantDepartments,
} from "@/lib/services/tenant-identity.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantDepartmentsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [departments, branches] = await Promise.all([
    listTenantDepartments(tenant.id),
    listTenantBranches(tenant.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-white">Organization structure</h2>
        <p className="mt-1 text-sm text-slate-400">
          Departments and branches seeded from discovery for {tenant.organization.displayName}.
        </p>
      </div>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Departments</h3>
        {departments.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No departments.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {departments.map((d) => (
              <li
                key={d.id}
                className="flex justify-between rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
              >
                <span className="text-white">
                  {d.name}
                  {d.nameAr && (
                    <span className="ml-2 text-slate-500" dir="rtl">
                      {d.nameAr}
                    </span>
                  )}
                </span>
                <span className="text-slate-500">{d._count.profiles} people</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-cyan-400">Branches</h3>
        {branches.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No branches.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {branches.map((b) => (
              <li
                key={b.id}
                className="rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm text-white"
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

      <Link href={routes.tenant(slug).dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Dashboard
      </Link>
    </div>
  );
}
