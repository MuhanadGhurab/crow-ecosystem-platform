import Link from "next/link";
import { HomepageCardArrow } from "@/components/public/homepage-card-arrow";

const EXPLORE_LINKS = [
  {
    title: "Plans & modules",
    summary:
      "Plans, modules, and security packages align during blueprint and pricing — not hidden after go-live.",
    href: "/pricing",
    cta: "See plans",
  },
  {
    title: "Architecture map",
    summary:
      "Full lifecycle map, surfaces, and engine relationships — for architects and delivery teams.",
    href: "/architecture",
    cta: "Explore architecture",
  },
] as const;

export function HomepageExploreRow() {
  return (
    <section className="cc-home-section !py-12 sm:!py-16">
      <div className="grid gap-4 md:grid-cols-2">
        {EXPLORE_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="cc-home-card">
            <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{item.summary}</p>
            <div className="mt-6 flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-slate-300">{item.cta}</span>
              <HomepageCardArrow />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
