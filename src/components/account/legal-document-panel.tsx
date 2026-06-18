"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { markdownToSafeHtml } from "@/lib/legal/legal-content-sanitize";

export type LegalDocumentPanelProps = {
  title: string;
  versionNumber: number;
  locale: string;
  effectiveAt: Date | string;
  contentBody: string;
  fullPageHref?: string;
  onReviewedChange?: (reviewed: boolean) => void;
};

function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function LegalDocumentPanel({
  title,
  versionNumber,
  locale,
  effectiveAt,
  contentBody,
  fullPageHref,
  onReviewedChange,
}: LegalDocumentPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [accessibilityReviewed, setAccessibilityReviewed] = useState(false);
  const fallbackId = useId();

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 24;
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    if (atEnd) setScrolledToEnd(true);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => checkScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkScroll, contentBody]);

  useEffect(() => {
    onReviewedChange?.(scrolledToEnd || accessibilityReviewed);
  }, [scrolledToEnd, accessibilityReviewed, onReviewedChange]);

  const reviewed = scrolledToEnd || accessibilityReviewed;
  const html = markdownToSafeHtml(contentBody);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <p className="text-xs text-slate-500">
          v{versionNumber} · {locale} · effective {formatDate(effectiveAt)}
        </p>
      </div>

      {fullPageHref && (
        <p className="text-xs">
          <a
            href={fullPageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Open full document for print or download
          </a>
        </p>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        tabIndex={0}
        role="region"
        aria-label={`${title} document text`}
        className="max-h-64 overflow-y-auto rounded-lg border border-slate-700/60 bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      >
        <div
          className="legal-doc-content space-y-2 [&_a]:text-cyan-400 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {!reviewed && (
        <p className="text-xs text-amber-200/90" aria-live="polite">
          Read to the end to continue, or use the accessibility option below.
        </p>
      )}

      <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-400">
        <input
          id={fallbackId}
          type="checkbox"
          checked={accessibilityReviewed}
          onChange={(e) => setAccessibilityReviewed(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I have reviewed the full document (accessibility alternative to scrolling)
        </span>
      </label>
    </div>
  );
}
