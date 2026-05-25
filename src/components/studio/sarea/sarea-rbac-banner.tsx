export function SareaRbacBanner({ compact }: { compact?: boolean }) {
  return (
    <section
      className={
        compact
          ? "rounded-lg border border-rose-500/15 bg-rose-950/15 px-3 py-2 text-xs text-slate-400"
          : "rounded-lg border border-rose-500/20 bg-rose-950/20 px-4 py-3 text-sm"
      }
    >
      <p className={compact ? "font-medium text-rose-200" : "font-medium text-rose-100"}>
        RBAC controls access. SAREA controls experience.
      </p>
      <p className={`mt-1 ${compact ? "text-[11px]" : "text-xs"} text-slate-400`}>
        Role permissions decide which modules and actions a user may use. SAREA only adapts
        presentation — navigation density, widgets, and layout. SAREA never grants permissions and
        never bypasses RBAC.
      </p>
    </section>
  );
}

export function SareaExperienceFlowBanner() {
  return (
    <section className="rounded-lg border border-cyan-500/10 bg-cyan-950/10 px-4 py-3 text-xs text-slate-400">
      <p className="font-medium text-cyan-200">Studio flow</p>
      <p className="mt-1">
        Tenant → Persona → Roles mapped → Dashboard layout → Navigation profile → Widget set →
        Device behavior → Preview
      </p>
    </section>
  );
}
