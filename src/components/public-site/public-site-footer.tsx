import Link from "next/link";

import { PublicV2BrandMark } from "@/components/public-v2/public-v2-brand-mark";
import { PUBLIC_SITE_FOOTER_LINKS } from "@/lib/public/navigation";
import { publicRoutes } from "@/lib/public/routes";

export function PublicSiteFooter() {
  return (
    <footer className="pv2-footer relative z-10 mt-16 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <PublicV2BrandMark href={publicRoutes.home} />
            <p className="pv2-body mt-4">
              Crow is a governed design-to-runtime service for organizations that need an
              operating model, Enterprise Blueprint, and operational tenant — not a module catalog.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3"
            aria-label="Footer"
          >
            {PUBLIC_SITE_FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="pv2-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-[var(--pv2-text-muted)]">
          © {new Date().getFullYear()} Crow Ecosystem · CEM · CyberCrow · SAREA · ProCrow governance
        </p>
      </div>
    </footer>
  );
}
