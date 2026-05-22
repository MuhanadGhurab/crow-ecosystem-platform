interface PublicPageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PublicPageHeader({ badge, title, description, children }: PublicPageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-cyan-500/10 bg-cc-radial-star pb-10 pt-4">
      <div className="cc-public-section !pb-0 !pt-8">
        {badge && <span className="cc-nca-badge">{badge}</span>}
        <h1 className="cc-section-title mt-4">{title}</h1>
        {description && <p className="cc-page-lead">{description}</p>}
        {children}
      </div>
    </header>
  );
}
