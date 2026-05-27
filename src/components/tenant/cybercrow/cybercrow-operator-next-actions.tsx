import Link from "next/link";
import type { CyberCrowOperatorAction } from "@/lib/constants/cybercrow-ux-depth";
import { CYBERCROW_OPERATOR_ACTION_LABELS } from "@/lib/constants/cybercrow-ux-depth";

export type CybercrowNextActionItem = {
  action: CyberCrowOperatorAction;
  label?: string;
  href: string;
  detail?: string;
};

type CybercrowOperatorNextActionsProps = {
  title?: string;
  items: CybercrowNextActionItem[];
};

export function CybercrowOperatorNextActions({
  title = "Operator next actions",
  items,
}: CybercrowOperatorNextActionsProps) {
  if (items.length === 0) return null;

  return (
    <section className="cc-glass-card cc-entity-block--cybercrow !p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={`${item.action}-${item.href}`}
            className="flex flex-wrap items-start justify-between gap-2 rounded-cc-sm border border-violet-500/15 bg-violet-500/5 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-200">
                {item.label ?? CYBERCROW_OPERATOR_ACTION_LABELS[item.action]}
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
