import type { ReactNode } from "react";
import { CrowMotif } from "@/components/public/crow-motif";

interface PublicPageHeaderProps {
  badge?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}
export function PublicPageHeader({ badge, title, description, children }: PublicPageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-cyan-500/10 bg-cc-radial-star pb-10 pt-4">
      <CrowMotif
        variant="constellation"
        className="pointer-events-none absolute end-6 top-8 hidden h-12 w-16 opacity-20 sm:block"
      />
      <div className="cc-public-section !pb-0 !pt-8">
        {badge && <span className="cc-nca-badge">{badge}</span>}
        <h1 className="cc-section-title mt-4">{title}</h1>
        {description && <p className="cc-page-lead">{description}</p>}
        {children}
      </div>
    </header>
  );
}
