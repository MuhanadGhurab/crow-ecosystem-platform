import Link from "next/link";
import { routes } from "@/lib/routes";

const LINKS = [
  { href: routes.sarea.overview, label: "Overview" },
  { href: routes.sarea.profiles, label: "Profiles" },
  { href: routes.sarea.roleMapping, label: "Role mapping" },
  { href: routes.sarea.preview, label: "Preview" },
  { href: routes.sarea.navigation, label: "Navigation" },
  { href: routes.sarea.widgets, label: "Widgets" },
] as const;

export function SareaStudioStrip() {
  return (
    <nav
      className="flex flex-wrap gap-2 rounded-lg border border-rose-500/20 bg-rose-950/25 px-3 py-2"
      aria-label="SAREA studio areas"
    >
      <span className="self-center pr-2 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
        Experience studio
      </span>
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-md border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-200 hover:border-rose-400/40 hover:text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
