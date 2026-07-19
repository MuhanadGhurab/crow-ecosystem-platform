"use client";

/**
 * CROW.DEVFLOW.5 — Alpha demo feedback form (client).
 */

import { useState, useTransition } from "react";
import { submitDemoFeedbackAction } from "@/lib/actions/demo-feedback";
import {
  DEMO_FEEDBACK_SENSITIVE_WARNING,
  DEMO_FEEDBACK_TYPES,
  DEMO_FEEDBACK_REVIEWER_TYPES,
  DEMO_FEEDBACK_SEVERITIES,
  DEMO_FEEDBACK_MESSAGE_MAX,
} from "@/lib/demo-feedback/demo-feedback-contract";

export function DemoFeedbackForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ tone: "ok" | "err"; text: string } | null>(
    null,
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const host =
      typeof window !== "undefined" ? window.location.hostname : "unknown";
    const sourceEnvironment = host.includes("vercel.app")
      ? "preview"
      : host === "localhost" || host === "127.0.0.1"
        ? "local"
        : "unknown";
    const previewUrl =
      typeof window !== "undefined" ? window.location.href.slice(0, 500) : undefined;

    const raw: Record<string, unknown> = {
      reviewerName: fd.get("reviewerName"),
      reviewerType: fd.get("reviewerType"),
      pageOrArea: fd.get("pageOrArea"),
      feedbackType: fd.get("feedbackType"),
      message: fd.get("message"),
      severity: fd.get("severity") || undefined,
      contact: fd.get("contact"),
      sourceEnvironment,
      previewUrl,
    };

    startTransition(async () => {
      setResult(null);
      const res = await submitDemoFeedbackAction(raw);
      setResult({
        tone: res.ok ? "ok" : "err",
        text: res.message,
      });
      if (res.ok) {
        form.reset();
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 text-left"
      data-crow-demo-feedback-form="true"
    >
      <p
        className="rounded border border-amber-500/40 bg-amber-950/40 px-3 py-2 text-sm text-amber-100"
        data-crow-demo-feedback-warning="true"
      >
        {DEMO_FEEDBACK_SENSITIVE_WARNING}
      </p>
      <p className="text-xs text-slate-400">
        Demo feedback only · Not production · Hosted write requires Controlled Alpha Demo Backend
        Mode flags on this environment.
      </p>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Reviewer type
        <select
          name="reviewerType"
          required
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          defaultValue="tester"
        >
          {DEMO_FEEDBACK_REVIEWER_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Name (optional)
        <input
          name="reviewerName"
          maxLength={120}
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          placeholder="Demo name only"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Page or area
        <input
          name="pageOrArea"
          required
          maxLength={200}
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          placeholder="e.g. /client/requests or Discovery Stage 3"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Feedback type
        <select
          name="feedbackType"
          required
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          defaultValue="bug"
        >
          {DEMO_FEEDBACK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Severity (optional)
        <select
          name="severity"
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          defaultValue=""
        >
          <option value="">—</option>
          {DEMO_FEEDBACK_SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Message
        <textarea
          name="message"
          required
          minLength={8}
          maxLength={DEMO_FEEDBACK_MESSAGE_MAX}
          rows={6}
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          placeholder="Describe the issue or idea (demo/test only)"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-200">
        Contact (optional, demo only)
        <input
          name="contact"
          maxLength={200}
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2"
          placeholder="Optional — do not use real customer contacts"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-amber-600/90 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send demo feedback"}
      </button>

      {result ? (
        <p
          className={`text-sm ${result.tone === "ok" ? "text-teal-300" : "text-rose-300"}`}
          data-crow-demo-feedback-result={result.tone}
        >
          {result.text}
        </p>
      ) : null}
    </form>
  );
}
