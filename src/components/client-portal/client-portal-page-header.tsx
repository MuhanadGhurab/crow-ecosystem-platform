import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export function ClientPortalPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "← Back",
}: Props) {
  return (
    <div>
      {backHref && (
        <Link href={backHref} className="text-sm text-teal-400 hover:text-teal-300">
          {backLabel}
        </Link>
      )}
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-wider text-teal-400/90 ${
            backHref ? "mt-4" : ""
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h1 className={`cc-page-title ${eyebrow || backHref ? "mt-2" : ""}`}>{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>}
    </div>
  );
}
