import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";

export type CrowWordmarkProps = {
  className?: string;
  subtitle?: string;
};

export function CrowWordmark({ className = "", subtitle }: CrowWordmarkProps) {
  return (
    <div className={className}>
      <p className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
        Crow Ecosystem
      </p>
      {subtitle ? (
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function CrowWordmarkWithMark({
  className = "",
  subtitle,
}: CrowWordmarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CrowMarkSvg variant="primary" className="h-10 w-10" labeled />
      <CrowWordmark subtitle={subtitle} />
    </div>
  );
}
