import Link from "next/link";

import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { CrowMark } from "@/components/public/brand/crow-mark";

export function PublicFooter() {
  return (
    <footer className="relative z-10 mt-24 overflow-hidden border-t border-cyan-500/10 bg-cc-elevated/50 backdrop-blur-sm">
      <CrowMarkSvg
        variant="watermark"
        className="pointer-events-none absolute -right-8 top-8 h-32 w-32 opacity-[0.06]"
        aria-hidden
      />
      <div className="cc-safe-x mx-auto max-w-6xl py-10 sm:py-14">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-sm">
            <CrowMark href="/" size="sm" showTagline={false} />
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Adaptive enterprise operating platform for Saudi & GCC organizations. NCA-aligned
              security posture by design — guided by your north-star operating model.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
            {[
              { href: "/about", label: "About" },
              { href: "/services", label: "Services" },
              { href: "/modules", label: "Modules" },
              { href: "/architecture", label: "Architecture" },
              { href: "/security", label: "Security" },
              { href: "/pricing", label: "Pricing" },
              { href: "/clients", label: "Clients" },
              { href: "/industries", label: "Industries" },
              { href: "/case-studies", label: "Case studies" },
              { href: "/request", label: "Request" },
              { href: "/login", label: "Sign in" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 transition hover:text-cyan-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-cyan-500/10 pt-8">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Crow Ecosystem · CEM · CyberCrow · SAREA
          </p>
          <span className="cc-star-badge !text-[10px]">North-star enterprise</span>
        </div>
      </div>
    </footer>
  );
}
