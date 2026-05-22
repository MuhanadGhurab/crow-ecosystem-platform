import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { listTenantBranches } from "@/lib/services/tenant-identity.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantBranchesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const branches = await listTenantBranches(tenant.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Branches</h2>
        <p className="mt-1 text-sm text-slate-400">
          Locations for {tenant.organization.displayName}, seeded from discovery.
        </p>
      </div>
      {branches.length === 0 ? (
        <p className="text-sm text-slate-500">No branches. Add during discovery or provision.</p>
      ) : (
        <ul className="space-y-2">
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
      <Link href={routes.tenant(slug).departments} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Departments
      </Link>
    </div>
  );
}
