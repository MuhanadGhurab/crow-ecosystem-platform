import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  listSareaExperienceProfiles,
  type SareaExperienceProfileListItem,
} from "@/lib/services/sarea.service";

export default async function SareaProfilesPage() {
  const profiles = await listSareaExperienceProfiles();

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Experience profiles</h2>
      <p className="mt-1 text-sm text-slate-400">
        Persona-based UI profiles per tenant, created at provisioning.
      </p>

      {profiles.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">
          No profiles yet. Provision a tenant from an approved blueprint to seed SAREA.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {profiles.map((p: SareaExperienceProfileListItem) => (
            <li
              key={p.id}
              className="cc-list-item flex-wrap items-center justify-between gap-4 !border-rose-500/15 !bg-rose-500/[0.04]"
            >
              <div>
                <p className="font-medium text-white">{p.name}</p>
                <p className="font-mono text-xs text-slate-500">{p.personaKey}</p>
                {p.tenant ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {p.tenant.organization.displayName} ·{" "}
                    <Link
                      href={routes.tenant(p.tenant.slug).dashboard}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      /{p.tenant.slug}
                    </Link>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">Platform template (no tenant)</p>
                )}
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{p._count.roleExperienceMaps} role maps</p>
                <p>{p._count.dashboardLayouts} layouts</p>
                <p>{p._count.widgetRules} widget rules</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6">
        <Link href={routes.sarea.overview} className="text-sm text-rose-400 hover:text-rose-300">
          ← Studio overview
        </Link>
      </p>
    </div>
  );
}
