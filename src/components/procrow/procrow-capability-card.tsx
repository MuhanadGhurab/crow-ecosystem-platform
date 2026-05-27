import Link from "next/link";
import type { EntityId } from "@/lib/entity-theme";

type ProCrowCapabilityCardProps = {
  title: string;
  description: string;
  href: string;
  entity?: EntityId;
  cta?: string;
};

const ENTITY_BORDER: Record<EntityId, string> = {
  cem: "border-l-cyan-500/60 hover:border-cyan-500/40",
  cybercrow: "border-l-violet-500/60 hover:border-violet-500/40",
  sarea: "border-l-rose-500/60 hover:border-rose-500/40",
};

export function ProCrowCapabilityCard({
  title,
  description,
  href,
  entity = "cem",
  cta = "Open",
}: ProCrowCapabilityCardProps) {
  return (
    <Link
      href={href}
      className={`cc-glass-card cc-pipeline-card block border-l-2 !p-4 transition ${ENTITY_BORDER[entity]}`}
      data-procrow="capability-card"
    >
      <p className="font-medium text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <span className="mt-3 inline-block text-sm text-cyan-400">{cta} →</span>
    </Link>
  );
}
