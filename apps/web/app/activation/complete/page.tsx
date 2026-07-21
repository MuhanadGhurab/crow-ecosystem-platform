"use client";

import {
  LockList,
  SessionBootstrap,
  useActivation,
} from "../_components/ActivationClient";

export default function CompletePage() {
  const { resource, error, loading, ensureSession, setError } = useActivation();

  return (
    <main id="main">
      <h1>تم تفعيل الحساب الأساسي</h1>
      <p data-screen-id="ACT-006">ACT-006 · Basic Account Activated</p>
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
          <p aria-live="polite">
            الحالة: <span dir="ltr">{resource.state}</span>
          </p>
          {resource.state === "ACTIVATED" ? (
            <p role="status">اكتملت معادلة التفعيل على الخادم.</p>
          ) : (
            <p role="status">التفعيل غير مكتمل بعد.</p>
          )}
          <LockList resource={resource} />
          <nav>
            <a href="/activation/recovery">الاستعادة</a>
          </nav>
        </>
      )}
    </main>
  );
}
