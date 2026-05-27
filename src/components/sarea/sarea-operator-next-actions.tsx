import Link from "next/link";
import type { SareaOperatorAction } from "@/lib/constants/sarea-ux-depth";
import { SAREA_OPERATOR_ACTION_LABELS } from "@/lib/constants/sarea-ux-depth";

export type SareaNextActionItem = {
  action: SareaOperatorAction;
  label?: string;
  href: string;
  detail?: string;
};

type SareaOperatorNextActionsProps = {
  title?: string;
  items: SareaNextActionItem[];
};

export function SareaOperatorNextActions({
  title = "Operator next actions",
  items,
}: SareaOperatorNextActionsProps) {
  if (items.length === 0) return null;

  return (
    <section className="cc-glass-card cc-entity-block--sarea !p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-rose-300">
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={`${item.action}-${item.href}`}
            className="flex flex-wrap items-start justify-between gap-2 rounded-cc-sm border border-rose-500/15 bg-rose-500/5 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-200">
                {item.label ?? SAREA_OPERATOR_ACTION_LABELS[item.action]}
              </p>
              {item.detail ? <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p> : null}
            </div>
            <Link href={item.href} className="cc-btn-secondary shrink-0 text-xs">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
