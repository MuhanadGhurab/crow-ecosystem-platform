"use client";

import { useId, useState } from "react";

type MissionResource = {
  run: {
    runId: string;
    status: string;
    kind: string;
    version: number;
    currentNodeId: string | null;
    outcomeId: string | null;
    worldHash: string;
    choiceHistory: { nodeId: string; choiceId: string }[];
  };
  node: {
    nodeId: string;
    sceneId: string;
    titleAr: string;
    titleEn: string;
    bodyAr: string;
    bodyEn: string;
    choices: {
      choiceId: string;
      labelAr: string;
      labelEn: string;
    }[];
  } | null;
  worldBands: Record<string, string>;
  crowprint: {
    confidence: string;
    emergingPattern: string;
    explanationAr: string;
    explanationEn: string;
    observedStrengths: string[];
    developmentArea: string;
  } | null;
  suggestion: {
    lineageId: string;
    status: string;
    explanationAr: string;
    explanationEn: string;
  } | null;
  flightLog: {
    outcomeId: string | null;
    majorConsequences: string[];
    echoAvailable: boolean;
  } | null;
  routeRecommendation: {
    recommendedRouteId: string;
    alternativeRouteId: string;
    explanationAr: string;
    explanationEn: string;
  } | null;
  echoNoticeAr: string;
  echoNoticeEn: string;
};

async function postCommand(
  command: string,
  body: Record<string, unknown>,
  idempotencyKey: string,
) {
  const res = await fetch(`/api/missions/black-signal/commands/${command}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? data.category ?? "error");
  }
  return data as { resource: MissionResource };
}

function initialPhase(
  resource: MissionResource | null,
): "brief" | "play" | "debrief" {
  if (!resource) return "brief";
  return resource.run.status === "COMPLETED" ? "debrief" : "play";
}

export function BlackSignalClient({
  initialResource,
}: {
  initialResource: MissionResource | null | unknown;
}) {
  const titleId = useId();
  const [resource, setResource] = useState<MissionResource | null>(
    (initialResource as MissionResource | null) ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"brief" | "play" | "debrief">(() =>
    initialPhase((initialResource as MissionResource | null) ?? null),
  );

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const out = await postCommand("start", {}, crypto.randomUUID());
      setResource(out.resource);
      setPhase("play");
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function choose(choiceId: string) {
    if (!resource?.node) return;
    setBusy(true);
    setError(null);
    try {
      const out = await postCommand(
        "select-choice",
        {
          runId: resource.run.runId,
          nodeId: resource.node.nodeId,
          choiceId,
          expectedVersion: resource.run.version,
        },
        crypto.randomUUID(),
      );
      setResource(out.resource);
      if (out.resource.run.status === "COMPLETED") {
        setPhase("debrief");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function debrief(interestHint: "OPERATE" | "BUILD" | "UNSURE") {
    if (!resource) return;
    setBusy(true);
    setError(null);
    try {
      const out = await postCommand(
        "complete-debrief",
        {
          runId: resource.run.runId,
          expectedVersion: resource.run.version,
          interestHint,
          reflection: interestHint,
        },
        crypto.randomUUID(),
      );
      setResource(out.resource);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function echo() {
    if (!resource) return;
    setBusy(true);
    setError(null);
    try {
      const out = await postCommand(
        "start-echo",
        {
          runId: resource.run.runId,
          forkNodeId: "N04_triage_priority",
        },
        crypto.randomUUID(),
      );
      setResource(out.resource);
      setPhase("play");
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function dismiss() {
    if (!resource) return;
    setBusy(true);
    try {
      const out = await postCommand(
        "dismiss-suggestion",
        {
          runId: resource.run.runId,
          expectedVersion: resource.run.version,
        },
        crypto.randomUUID(),
      );
      setResource(out.resource);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  async function overrideRoute() {
    if (!resource?.routeRecommendation) return;
    setBusy(true);
    try {
      const out = await postCommand(
        "override-route",
        {
          runId: resource.run.runId,
          routeId: resource.routeRecommendation.alternativeRouteId,
        },
        crypto.randomUUID(),
      );
      setResource(out.resource);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      className="mission-shell"
      dir="rtl"
      lang="ar"
      aria-labelledby={titleId}
      data-mission="black-signal"
      data-run-id={resource?.run.runId ?? ""}
      data-run-kind={resource?.run.kind ?? ""}
      data-run-version={resource?.run.version ?? ""}
      data-world-hash={resource?.run.worldHash ?? ""}
      data-run-status={resource?.run.status ?? ""}
      data-choice-count={resource?.run.choiceHistory.length ?? 0}
      data-current-node={resource?.run.currentNodeId ?? ""}
    >
      <header className="mission-header">
        <p className="mission-kicker">غُرافيا · رحلة حية</p>
        <h1 id={titleId}>الرحلة الأولى — الإشارة السوداء</h1>
        <p className="mission-sub">
          First Flight — Black Signal · أداة ألفا تركيبية · ليست شهادة
        </p>
      </header>

      {error ? (
        <p role="alert" className="mission-error">
          {error}
        </p>
      ) : null}

      {phase === "brief" ? (
        <section aria-label="إحاطة المهمة">
          <p>
            حيّ تعليمي رقمي يقترب من إطلاق مهم. المستخدمون يفقدون الوصول،
            والتنبيهات متعارضة. قراراتك تغيّر حالة العالم بشكل حتمي على الخادم.
          </p>
          <ul>
            <li>لا إجابات وحيدة صحيحة</li>
            <li>إشارات الأدلة ≠ إتقان</li>
            <li>بصمة الغراب خاصة ومؤقتة</li>
          </ul>
          <button type="button" disabled={busy} onClick={() => void start()}>
            ابدأ الرحلة
          </button>
        </section>
      ) : null}

      {resource?.run.kind === "ECHO" ? (
        <aside role="note" className="echo-banner" data-echo="true">
          {resource.echoNoticeAr}
          <span className="sr-only">{resource.echoNoticeEn}</span>
        </aside>
      ) : null}

      {phase === "play" && resource?.node ? (
        <section aria-label="مساحة القرار" data-node={resource.node.nodeId}>
          <p className="scene-tag" data-scene={resource.node.sceneId}>
            مشهد {resource.node.sceneId}
          </p>
          <h2>{resource.node.titleAr}</h2>
          <p>{resource.node.bodyAr}</p>
          <div
            className="state-summary"
            aria-label="ملخص حالة العالم"
            data-noncolor-state="true"
          >
            {Object.entries(resource.worldBands).map(([k, v]) => (
              <span
                key={k}
                data-band={v}
                className={`band band-${v.toLowerCase()}`}
              >
                {k}: {v === "LOW" ? "منخفض" : v === "HIGH" ? "مرتفع" : "متوسط"}
              </span>
            ))}
          </div>
          <div className="choice-stack" role="group" aria-label="خيارات">
            {resource.node.choices.map((c) => (
              <button
                key={c.choiceId}
                type="button"
                disabled={busy}
                onClick={() => void choose(c.choiceId)}
              >
                {c.labelAr}
              </button>
            ))}
          </div>
          <p className="autosave-hint" aria-live="polite">
            يُحفظ التقدم تلقائياً · استئناف آمن بعد التحديث
          </p>
        </section>
      ) : null}

      {phase === "debrief" && resource ? (
        <section aria-label="مراجعة الرحلة" data-debrief="true">
          <h2>اكتمال الرحلة الكنسية</h2>
          <p>النتيجة: {resource.run.outcomeId ?? "—"}</p>
          {!resource.crowprint ? (
            <div className="cta-stack">
              <p>اختر تأملًا ذاتياً (ليس إتقاناً):</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void debrief("OPERATE")}
              >
                قرارات التشغيل
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void debrief("BUILD")}
              >
                قرارات البناء
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void debrief("UNSURE")}
              >
                غير متأكد
              </button>
            </div>
          ) : (
            <>
              <article aria-label="بصمة الغراب">
                <h3>بصمة الغراب (خاصة)</h3>
                <p>{resource.crowprint.explanationAr}</p>
                <p>
                  الثقة: {resource.crowprint.confidence} · النمط:{" "}
                  {resource.crowprint.emergingPattern}
                </p>
                <p>مجال تطوير: {resource.crowprint.developmentArea}</p>
              </article>
              {resource.suggestion ? (
                <article aria-label="اقتراح سلالة خاص">
                  <h3>اقتراح سلالة (خاص)</h3>
                  <p>{resource.suggestion.lineageId}</p>
                  <p>{resource.suggestion.explanationAr}</p>
                  <p>الحالة: {resource.suggestion.status}</p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void dismiss()}
                  >
                    تجاهل الاقتراح
                  </button>
                </article>
              ) : null}
              {resource.flightLog ? (
                <article aria-label="سجل الرحلة">
                  <h3>سجل الرحلة</h3>
                  <ul>
                    {resource.flightLog.majorConsequences.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </article>
              ) : null}
              {resource.routeRecommendation ? (
                <article aria-label="توصية المسار">
                  <h3>توصية مسار (إرشادية)</h3>
                  <p>{resource.routeRecommendation.explanationAr}</p>
                  <p>
                    المقترح: {resource.routeRecommendation.recommendedRouteId}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void overrideRoute()}
                  >
                    اختر البديل:{" "}
                    {resource.routeRecommendation.alternativeRouteId}
                  </button>
                </article>
              ) : null}
              {resource.flightLog?.echoAvailable &&
              resource.run.kind === "CANONICAL" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void echo()}
                >
                  ابدأ Echo Flight من قرار الفرز
                </button>
              ) : null}
            </>
          )}
        </section>
      ) : null}

      <style jsx>{`
        .mission-shell {
          max-width: 42rem;
          margin: 0 auto;
          padding: 1.5rem;
          min-height: 100vh;
          background:
            radial-gradient(ellipse at top, #1a2332 0%, #0d1117 55%), #0d1117;
          color: #e8eef6;
          font-family: "IBM Plex Sans Arabic", "Segoe UI", sans-serif;
        }
        .mission-kicker {
          letter-spacing: 0.08em;
          opacity: 0.7;
          font-size: 0.85rem;
        }
        .mission-header h1 {
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          margin: 0.25rem 0;
        }
        .mission-sub {
          opacity: 0.65;
          font-size: 0.9rem;
        }
        .mission-error {
          background: #3a1515;
          padding: 0.75rem;
          border-inline-start: 4px solid #c45;
        }
        .echo-banner {
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          border: 1px dashed #8ab;
          background: #132033;
        }
        .state-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .band {
          padding: 0.25rem 0.5rem;
          border: 1px solid #456;
          font-size: 0.75rem;
        }
        .band-low {
          border-style: dotted;
        }
        .band-moderate {
          border-style: solid;
        }
        .band-high {
          border-style: double;
          border-width: 3px;
        }
        .choice-stack,
        .cta-stack {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        button {
          font: inherit;
          padding: 0.75rem 1rem;
          background: #243447;
          color: inherit;
          border: 1px solid #5a7;
          cursor: pointer;
          text-align: start;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .autosave-hint {
          opacity: 0.55;
          font-size: 0.8rem;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
