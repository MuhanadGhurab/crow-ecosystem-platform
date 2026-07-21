"use client";

import {
  LockList,
  SessionBootstrap,
  useActivation,
} from "../_components/ActivationClient";

const RISK_VERSION = "local-test-risk-v0";

export default function AccountRiskPage() {
  const { resource, error, loading, ensureSession, command, setError } =
    useActivation();

  return (
    <main id="main">
      <h1>قبول مخاطر الحساب</h1>
      <p data-screen-id="ACT-013">ACT-013 · Accept Account Risk</p>
      <aside role="note">
        <p>
          إفصاح اختباري محلي · الإصدار <span dir="ltr">{RISK_VERSION}</span>
        </p>
        <p>ليس موافقة قانونية نهائية وليست شهادة امتثال.</p>
      </aside>
      {loading ? <p aria-live="polite">جارٍ التحميل…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!resource ? (
        <SessionBootstrap
          onReady={() =>
            void ensureSession().catch((e) =>
              setError(e instanceof Error ? e.message : "error"),
            )
          }
        />
      ) : (
        <>
          <LockList resource={resource} />
          <button
            type="button"
            onClick={() =>
              void command("accept-risk", {
                riskDisclosureVersion: RISK_VERSION,
              })
                .then(() => command("activate"))
                .catch((e) =>
                  setError(e instanceof Error ? e.message : "error"),
                )
            }
          >
            أقبل إقرار المخاطر وأكمل التفعيل
          </button>
          <nav>
            <a href="/activation/complete">شاشة اكتمال التفعيل</a>
          </nav>
        </>
      )}
    </main>
  );
}
