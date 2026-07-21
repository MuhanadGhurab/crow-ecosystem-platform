"use client";

import {
  LockList,
  SessionBootstrap,
  useActivation,
} from "../_components/ActivationClient";

export default function EmailPendingPage() {
  const { resource, error, loading, ensureSession, command, setError } =
    useActivation();

  return (
    <main id="main">
      <h1>التحقق من البريد — قيد الانتظار</h1>
      <p data-screen-id="ACT-003">ACT-003 · Email Verification Pending</p>
      <p role="note">
        تسليم الرسالة لا يعني اكتمال التحقق. التحقق يحدث فقط بعد تأكيد الرمز على
        الخادم.
      </p>
      {loading ? <p aria-live="polite">جارٍ التحميل…</p> : null}
      {error ? (
        <p role="alert" id="err">
          {error}
        </p>
      ) : null}
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
          <p>
            الحالة: <span dir="ltr">{resource.state}</span> · الإصدار{" "}
            <span dir="ltr">{resource.version}</span>
          </p>
          <LockList resource={resource} />
          <p>
            <button
              type="button"
              onClick={() =>
                void command("request-email").catch((e) =>
                  setError(e instanceof Error ? e.message : "error"),
                )
              }
            >
              طلب / إعادة إرسال التحقق
            </button>
          </p>
          <p>
            <a href="/api/local/mock-mailbox">صندوق البريد المحلي (اختبار)</a>
          </p>
          <nav>
            <a href="/activation/email-result">نتيجة التحقق</a>
            {" · "}
            <a href="/activation/recovery">الاستعادة</a>
          </nav>
        </>
      )}
    </main>
  );
}
