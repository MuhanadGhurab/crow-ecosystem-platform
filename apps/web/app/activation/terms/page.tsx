"use client";

import {
  LockList,
  SessionBootstrap,
  useActivation,
} from "../_components/ActivationClient";

const TERMS_VERSION = "local-test-terms-v0";

export default function TermsPage() {
  const { resource, error, loading, ensureSession, command, setError } =
    useActivation();

  return (
    <main id="main">
      <h1>قبول الشروط الإلزامية</h1>
      <p data-screen-id="ACT-005">ACT-005 · Accept Mandatory Terms</p>
      <aside role="note">
        <p>
          نسخة محلية للاختبار فقط · الإصدار{" "}
          <span dir="ltr">{TERMS_VERSION}</span>
        </p>
        <p>هذه ليست نصوصاً قانونية معتمدة وليست موافقة قانونية نهائية.</p>
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
              void command("accept-terms", {
                termsVersion: TERMS_VERSION,
              }).catch((e) =>
                setError(e instanceof Error ? e.message : "error"),
              )
            }
          >
            أقبل الشروط الحالية (نسخة اختبار)
          </button>
          <nav>
            <a href="/activation/account-risk">إقرار المخاطر</a>
          </nav>
        </>
      )}
    </main>
  );
}
