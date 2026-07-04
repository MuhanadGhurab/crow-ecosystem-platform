import type { ReactNode } from "react";

type PublicContentPageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function PublicContentPage({ eyebrow, title, description, children }: PublicContentPageProps) {
  return (
    <article className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-10 max-w-3xl">
          {eyebrow ? <p className="pv2-eyebrow mb-3">{eyebrow}</p> : null}
          <h1 className="pv2-h1">{title}</h1>
          {description ? <p className="pv2-lead mt-4">{description}</p> : null}
        </header>
        <div className="space-y-8">{children}</div>
      </div>
    </article>
  );
}

type PublicContentSectionProps = {
  title: string;
  children: ReactNode;
};

export function PublicContentSection({ title, children }: PublicContentSectionProps) {
  return (
    <section className="pv2-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[var(--pv2-text-primary)]">{title}</h2>
      <div className="pv2-body mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function PublicContentList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2" role="list">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-[var(--pv2-text-secondary)]">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv2-cyan)]" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
