"use client";

import {
  LockList,
  SessionBootstrap,
  useActivation,
} from "../_components/ActivationClient";

export default function RecoveryPage() {
  const { resource, error, loading, ensureSession, command, setError } =
    useActivation();

  return (
    <main id="main">
      <h1>استعادة التفعيل</h1>
      <p data-screen-id="ACT-012">ACT-012 · Activation Recovery</p>
      <p>
        الاستعادة لا تتجاوز التحقق أو الشروط أو إقرار المخاطر. تُعيد التوجيه إلى
        الخطوة الناقصة فقط.
      </p>
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
              void command("recover").catch((e) =>
                setError(e instanceof Error ? e.message : "error"),
              )
            }
          >
            بدء مسار الاستعادة
          </button>
          <nav aria-label="خطوات الاستعادة">
            <a href="/activation/email-pending">البريد</a>
            {" · "}
            <a href="/activation/terms">الشروط</a>
            {" · "}
            <a href="/activation/account-risk">المخاطر</a>
          </nav>
        </>
      )}
    </main>
  );
}
