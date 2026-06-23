"use client";

export type ForgeMode =
  | "compose"
  | "graph"
  | "personas"
  | "workflows"
  | "entities"
  | "scenario"
  | "validation"
  | "export";

const MODES: { key: ForgeMode; label: string }[] = [
  { key: "compose", label: "Compose" },
  { key: "graph", label: "Graph" },
  { key: "personas", label: "Personas" },
  { key: "workflows", label: "Workflows" },
  { key: "entities", label: "Entities" },
  { key: "scenario", label: "Scenario Compare" },
  { key: "validation", label: "Validation" },
  { key: "export", label: "Export" },
];

type StudioModeSwitcherProps = {
  mode: ForgeMode;
  onChange: (mode: ForgeMode) => void;
};

export function StudioModeSwitcher({ mode, onChange }: StudioModeSwitcherProps) {
  return (
    <nav className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/30 p-1" aria-label="Model Forge workspace mode">
      {MODES.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
            mode === m.key ? "bg-cyan-500/20 text-cyan-200" : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
          aria-current={mode === m.key ? "page" : undefined}
        >
          {m.label}
        </button>
      ))}
    </nav>
  );
}
