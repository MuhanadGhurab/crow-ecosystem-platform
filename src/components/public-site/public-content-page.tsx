import type { ReactNode } from "react";

type PublicContentPageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  introExtra?: ReactNode;
};

export function PublicContentPage({
  eyebrow,
  title,
  description,
  children,
  introExtra,
}: PublicContentPageProps) {
  return (
    <article className="pv2-section-band">
      <div className="pv2-section-inner py-12 sm:py-16 lg:py-20">
        <header className="mb-10 max-w-3xl">
          {eyebrow ? <p className="pv2-eyebrow mb-3">{eyebrow}</p> : null}
          <h1 className="pv2-h1">{title}</h1>
          {description ? <p className="pv2-lead mt-4 max-w-2xl">{description}</p> : null}
          {introExtra ? <div className="mt-6">{introExtra}</div> : null}
        </header>
        <div className="space-y-8">{children}</div>
      </div>
    </article>
  );
}

type PublicContentSectionProps = {
  title: string;
  children: ReactNode;
  variant?: "default" | "frame";
};

export function PublicContentSection({ title, children, variant = "default" }: PublicContentSectionProps) {
  const shell =
    variant === "frame" ? "pv2-blueprint-frame" : "pv2-card pv2-card-interactive";

  return (
    <section className={`${shell} p-6 sm:p-8`}>
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

export function PublicAccessCallout({ children }: { children: ReactNode }) {
  return <div className="pv2-access-callout">{children}</div>;
}

export function PublicLifecycleRail({ gates }: { gates: readonly { title: string; summary: string }[] }) {
  return (
    <div className="pv2-lifecycle-rail-row" role="list">
      {gates.map((gate, index) => (
        <div key={gate.title} className="flex flex-1 items-stretch gap-2" role="listitem">
          <div className="pv2-lifecycle-gate flex-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--pv2-cyan)]">
                Gate {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--pv2-text-primary)]">{gate.title}</p>
              <p className="mt-1 text-xs text-[var(--pv2-text-muted)]">{gate.summary}</p>
            </div>
          </div>
          {index < gates.length - 1 ? (
            <span className="pv2-lifecycle-connector" aria-hidden>
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
