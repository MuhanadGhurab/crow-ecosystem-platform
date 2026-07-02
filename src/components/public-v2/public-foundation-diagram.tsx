import {
  PUBLIC_FOUNDATION_LAYERS,
  PUBLIC_TRUST_EVIDENCE,
  REPRESENTATIVE_ORG_NAME,
} from "@/lib/public-v2/representative-data";

const LAYER_POSITION: Record<string, string> = {
  cem: "left-0 top-1/2 -translate-y-1/2",
  cybercrow: "right-0 top-1/2 -translate-y-1/2",
  sarea: "bottom-0 left-1/2 -translate-x-1/2",
  procrow: "top-0 left-1/2 -translate-x-1/2",
};

const LAYER_ACCENT: Record<string, string> = {
  cem: "border-cyan-500/35 bg-cyan-500/10 text-cyan-100",
  cybercrow: "border-amber-500/35 bg-amber-500/10 text-amber-100",
  sarea: "border-violet-500/35 bg-violet-500/10 text-violet-100",
  procrow: "border-slate-400/30 bg-white/[0.04] text-slate-200",
};

export function PublicFoundationDiagram() {
  return (
    <figure aria-labelledby="foundation-diagram-title" aria-describedby="foundation-diagram-desc">
      <figcaption className="sr-only">
        <span id="foundation-diagram-title">One governed foundation</span>
        <span id="foundation-diagram-desc">
          Organization at center supported by CEM, CyberCrow, SAREA, and ProCrow coordinated
          responsibilities.
        </span>
      </figcaption>

      <div className="relative mx-auto aspect-square max-w-md sm:max-w-lg">
        {/* Connector lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 400"
          aria-hidden
        >
          <line x1="200" y1="200" x2="70" y2="200" className="stroke-cyan-500/30" strokeWidth="1.5" />
          <line x1="200" y1="200" x2="330" y2="200" className="stroke-amber-500/30" strokeWidth="1.5" />
          <line x1="200" y1="200" x2="200" y2="70" className="stroke-slate-400/25" strokeWidth="1.5" />
          <line x1="200" y1="200" x2="200" y2="330" className="stroke-violet-500/30" strokeWidth="1.5" />
        </svg>

        {/* Center organization */}
        <div className="absolute left-1/2 top-1/2 z-10 w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-[#0a0f1a] p-4 text-center shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Organization</p>
          <p className="mt-1 text-sm font-semibold text-white">{REPRESENTATIVE_ORG_NAME}</p>
          <p className="mt-1 text-xs text-slate-400">One tenant · governed operations</p>
        </div>

        {/* Layers */}
        {PUBLIC_FOUNDATION_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={`absolute z-20 w-[38%] max-w-[160px] rounded-xl border p-3 text-center sm:max-w-[180px] sm:p-3.5 ${LAYER_POSITION[layer.id]} ${LAYER_ACCENT[layer.id]}`}
          >
            <p className="text-xs font-bold">{layer.label}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wide opacity-70">{layer.role}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {PUBLIC_FOUNDATION_LAYERS.map((layer) => (
          <div key={layer.id} className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
            <p className="text-xs font-semibold text-slate-300">
              {layer.label} · {layer.role}
            </p>
            <p className="mt-1 text-sm text-slate-400">{layer.description}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
