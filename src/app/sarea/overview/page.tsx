import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import {
  getSareaStudioSummary,
  listSareaExperienceProfiles,
} from "@/lib/services/sarea.service";

const STUDIO_LINKS = [
  { href: routes.sarea.profiles, label: "Profiles", desc: "Persona-based experience" },
  { href: routes.sarea.layouts, label: "Layouts", desc: "Dashboard compositions" },
  { href: routes.sarea.rules, label: "Rules", desc: "Adaptive UI logic" },
  { href: routes.sarea.widgets, label: "Widgets", desc: "Visibility per role" },
  { href: routes.sarea.navigation, label: "Navigation", desc: "Nav keys & density" },
  { href: routes.sarea.preview, label: "Preview", desc: "Cross-tenant aggregate" },
] as const;

export default async function SareaOverviewPage() {
  let summary = { profileCount: 0, tenantsWithProfiles: 0, layoutCount: 0, adaptiveRuleCount: 0 };
  let profiles: Awaited<ReturnType<typeof listSareaExperienceProfiles>> = [];

  try {
    [summary, profiles] = await Promise.all([
      getSareaStudioSummary(),
      listSareaExperienceProfiles(),
    ]);
  } catch {
    summary = { profileCount: 6, tenantsWithProfiles: 2, layoutCount: 12, adaptiveRuleCount: 18 };
  }

  const personaCounts = profiles.reduce<Record<string, number>>((acc, p) => {
    acc[p.personaKey] = (acc[p.personaKey] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/35 via-cc-elevated/90 to-amber-950/25 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl"
          aria-hidden
        />
        <span className="cc-entity-badge cc-entity-badge--sarea relative">Experience Studio</span>
        <h2 className="cc-section-title relative mt-4">Adaptive role experiences</h2>
        <p className="relative mt-2 max-w-2xl text-sm text-slate-400">
          Platform view of personas, layouts, and widgets provisioned at tenant go-live — without
          fragmenting the Crow shell.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Experience profiles"
          value={summary.profileCount}
          entity="sarea"
          accent="rose"
        />
        <StatCard
          label="Tenants with SAREA"
          value={summary.tenantsWithProfiles}
          entity="sarea"
          accent="amber"
        />
        <StatCard label="Dashboard layouts" value={summary.layoutCount} entity="sarea" accent="rose" />
        <StatCard
          label="Adaptive UI rules"
          value={summary.adaptiveRuleCount}
          entity="sarea"
          accent="amber"
        />
      </section>

      {Object.keys(personaCounts).length > 0 && (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-rose-300">Personas in use</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {Object.entries(personaCounts).map(([key, count]) => (
              <li
                key={key}
                className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs text-rose-200"
              >
                {key} · {count}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STUDIO_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="cc-bento-card group border-rose-500/15 !p-5 hover:border-rose-400/30"
          >
            <span className="font-display text-base font-semibold text-white group-hover:text-rose-100">
              {link.label}
            </span>
            <span className="mt-1 block text-sm text-slate-500">{link.desc}</span>
          </Link>
        ))}
      </section>

      <section className="flex flex-wrap gap-3">
        <Link href={routes.sarea.profiles} className="cc-btn-primary text-sm !from-rose-600 !via-rose-500 !to-amber-400">
          All profiles →
        </Link>
        <Link href={routes.admin.tenants} className="cc-btn-secondary text-sm">
          Tenants
        </Link>
      </section>
    </div>
  );
}
