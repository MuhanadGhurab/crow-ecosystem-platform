import { PROCROW_CONTROL_TOWER_LINKS } from "@/lib/constants/procrow-portal";
import { ProCrowCapabilityCard } from "@/components/procrow/procrow-capability-card";

export function ProCrowControlTowerMap() {
  return (
    <section className="cc-glass-card !p-6" data-procrow="control-tower-map">
      <div>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Control tower map
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          ProCrow-owned surfaces — platform admin, customer flow, trust, experience, and runtime
          discipline. CyberCrow and SAREA remain distinct capabilities under this umbrella.
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PROCROW_CONTROL_TOWER_LINKS.map((link) => (
          <ProCrowCapabilityCard
            key={link.title}
            title={link.title}
            description={link.description}
            href={link.href}
            entity={link.entity}
            cta={link.cta}
          />
        ))}
      </div>
    </section>
  );
}
