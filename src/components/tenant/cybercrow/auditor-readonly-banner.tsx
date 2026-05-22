import Link from "next/link";

type Props = {
  slug: string;
  platformAuditHref?: string;
};

/** Shown for `auditor_readonly` — cross-tenant audit + tenant CyberCrow read paths only. */
export function AuditorReadOnlyBanner({ slug, platformAuditHref = "/admin/audit" }: Props) {
  return (
    <section
      className="rounded-lg border border-slate-500/30 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
      role="status"
    >
      <p className="font-medium text-slate-100">Auditor view (read-only)</p>
      <p className="mt-1 text-xs text-slate-400">
        No writes to CEM, discovery, or incidents. Review tenant audit logs and platform feed for
        compliance evidence.
      </p>
      <p className="mt-2 flex flex-wrap gap-3 text-xs">
        <Link href={platformAuditHref} className="text-cyan-400 hover:text-cyan-300">
          Platform audit feed →
        </Link>
        <Link
          href={`/${slug}/cybercrow/audit-logs`}
          className="text-violet-400 hover:text-violet-300"
        >
          Tenant audit logs →
        </Link>
      </p>
    </section>
  );
}
