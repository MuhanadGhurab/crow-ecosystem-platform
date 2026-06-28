import {
  FTGP_CERTIFICATION_SOURCE_COMMIT_ENV,
  isFtgpCertificationHostGateEnabled,
} from "@/lib/ftgp/ftgp-certification-host-gate";

export function CertificationEnvironmentLabel() {
  if (!isFtgpCertificationHostGateEnabled()) return null;

  const commit = process.env[FTGP_CERTIFICATION_SOURCE_COMMIT_ENV]?.trim().slice(0, 7) ?? "unknown";

  return (
    <details className="fixed bottom-3 end-3 z-40 max-w-xs rounded-lg border border-amber-500/30 bg-slate-950/95 p-2 text-xs text-amber-200/90 shadow-lg backdrop-blur sm:bottom-4 sm:end-4">
      <summary className="cursor-pointer font-medium">Certification test build</summary>
      <dl className="mt-2 space-y-1 text-slate-400">
        <div>
          <dt className="inline text-slate-500">Environment: </dt>
          <dd className="inline">crow-ftgp-certification</dd>
        </div>
        <div>
          <dt className="inline text-slate-500">Commit: </dt>
          <dd className="inline font-mono">{commit}</dd>
        </div>
        <div>
          <dt className="inline text-slate-500">Status: </dt>
          <dd className="inline">OWNER_DEVICE_TEST_REQUIRED</dd>
        </div>
      </dl>
      <p className="mt-2 text-[10px] text-slate-500">Not visible on live Production. No personal data stored here.</p>
    </details>
  );
}
