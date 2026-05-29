import Link from "next/link";

export type ProCrowContextLink = {
  label: string;
  href: string;
  description?: string;
};

export function ProCrowContextLinkGrid({ links }: { links: ProCrowContextLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-lg border border-slate-700/50 bg-white/[0.02] px-3 py-2.5 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
        >
          <p className="text-sm font-medium text-cyan-300">{link.label} →</p>
          {link.description && <p className="mt-0.5 text-xs text-slate-500">{link.description}</p>}
        </Link>
      ))}
    </div>
  );
}
