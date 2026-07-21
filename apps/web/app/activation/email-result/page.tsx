"use client";

import { useState } from "react";
import {
  LockList,
  SessionBootstrap,
  useActivation,
} from "../_components/ActivationClient";

export default function EmailResultPage() {
  const { resource, error, loading, ensureSession, command, setError } =
    useActivation();
  const [token, setToken] = useState("");

  return (
    <main id="main">
      <h1>نتيجة التحقق من البريد</h1>
      <p data-screen-id="ACT-011">ACT-011 · Email Verification Result</p>
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
            الحالة: <span dir="ltr">{resource.state}</span>
          </p>
          <LockList resource={resource} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void command("confirm-email", { token }).catch((err) =>
                setError(err instanceof Error ? err.message : "error"),
              );
            }}
          >
            <label htmlFor="token">رمز التحقق</label>
            <input
              id="token"
              name="token"
              dir="ltr"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              aria-describedby={error ? "err" : undefined}
              required
            />
            <button type="submit">تأكيد التحقق</button>
          </form>
          <nav>
            <a href="/activation/email-pending">العودة للانتظار</a>
            {" · "}
            <a href="/activation/terms">الشروط</a>
          </nav>
        </>
      )}
    </main>
  );
}
