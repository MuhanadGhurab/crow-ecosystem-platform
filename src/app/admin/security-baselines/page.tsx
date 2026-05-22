import { listSecurityBaselines } from "@/lib/services/platform-admin.service";

export default function AdminSecurityBaselinesPage() {
  const baselines = listSecurityBaselines();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Security baselines</h2>
      <p className="text-sm text-slate-400">
        CyberCrow security packages offered at request intake (NCA-aware tiers).
      </p>
      <ul className="space-y-4">
        {baselines.map((b) => (
          <li key={b.key} className="cc-glass-card">
            <p className="font-medium text-white">{b.name}</p>
            <p className="font-mono text-xs text-cyan-400">{b.key}</p>
            <p className="mt-2 text-sm text-cyan-300">+{b.monthlyAddonSar} SAR/mo</p>
            <p className="mt-2 text-sm text-slate-400">{b.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
