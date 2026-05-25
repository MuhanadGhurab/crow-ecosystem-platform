import Link from "next/link";

/** Operator checklist cross-links for F8 organic E2E (admin-only, no secrets). */
export function OperatorE2eChecklistPanel({ referenceCode }: { referenceCode: string }) {
  const verifyCmd = `npm run onboarding:verify -- --reference=${referenceCode}`;

  return (
    <section className="cc-glass-card space-y-3 !p-5">
      <h3 className="text-sm font-medium text-teal-400">Organic E2E checklist</h3>
      <p className="text-xs text-slate-500">
        Manual browser steps live in{" "}
        <code className="rounded bg-black/30 px-1 text-slate-400">docs/internal/F8_ORGANIC_REQUEST_E2E.md</code>
        . F10 operator console cross-links:{" "}
        <code className="rounded bg-black/30 px-1 text-slate-400">
          docs/internal/F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md
        </code>
        .
      </p>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Reference (copy for verify)</dt>
          <dd className="mt-0.5 font-mono text-cyan-300">{referenceCode}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Read-only verify</dt>
          <dd className="mt-0.5 font-mono text-xs text-slate-400">{verifyCmd}</dd>
        </div>
      </dl>
      <ol className="list-decimal space-y-1 pl-5 text-xs text-slate-400">
        <li>Public `/request` → capture reference</li>
        <li>
          <Link href="/admin/requests" className="text-cyan-400 hover:text-cyan-300">
            Admin requests
          </Link>{" "}
          → start discovery
        </li>
        <li>Discovery summary → complete → blueprint</li>
        <li>Readiness → go-live (explicit provision)</li>
        <li>Run verify script; confirm MEEM/Rimal unchanged</li>
      </ol>
      <p className="text-[10px] text-slate-600">
        Also: <code className="rounded bg-black/30 px-1">npm run request:e2e:dry</code> ·{" "}
        <code className="rounded bg-black/30 px-1">npm run request:pipeline:verify</code>
      </p>
    </section>
  );
}
