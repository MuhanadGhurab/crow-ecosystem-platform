/* Hybrid H1.1 interaction runtime — static prototype only. NOT Product Code. */
(function () {
  "use strict";

  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* Reduced motion */
  var rmBtn = qs("[data-toggle-rm]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("rm");
  }
  if (rmBtn) {
    rmBtn.setAttribute("aria-pressed", document.body.classList.contains("rm") ? "true" : "false");
    rmBtn.addEventListener("click", function () {
      document.body.classList.toggle("rm");
      rmBtn.setAttribute("aria-pressed", document.body.classList.contains("rm") ? "true" : "false");
      pauseAmbientsIfNeeded();
    });
  }

  function pauseAmbientsIfNeeded() {
    var hidden = document.hidden || document.body.classList.contains("rm");
    qsa(".crow-layer, .sky-mid").forEach(function (el) {
      el.style.animationPlayState = hidden ? "paused" : "";
    });
  }
  document.addEventListener("visibilitychange", pauseAmbientsIfNeeded);

  /* Scroll reveals + horizon nearness */
  var reveals = qsa(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("is-in");
      });
    }, { threshold: 0.2 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  var horizons = qsa(".horizon");
  if ("IntersectionObserver" in window && horizons.length) {
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("is-near", e.isIntersecting && e.intersectionRatio > 0.55);
      });
    }, { threshold: [0.35, 0.55, 0.75] });
    horizons.forEach(function (el) { hio.observe(el); });
  }

  horizons.forEach(function (h) {
    h.addEventListener("click", function () {
      horizons.forEach(function (x) { x.classList.remove("is-active"); });
      h.classList.add("is-active");
      h.focus();
    });
    h.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        h.click();
      }
    });
  });

  /* Threshold CTA */
  qsa("[data-threshold]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (document.body.classList.contains("rm")) return;
      btn.classList.add("is-entering");
      window.setTimeout(function () { btn.classList.remove("is-entering"); }, 900);
    });
  });

  /* Notification stack — max 2 transient */
  var stack = qs("[data-signal-stack]");
  var logEl = qs("[data-signal-log]");
  var live = qs("[data-live-signals]");
  var queue = [];

  function pushLog(text) {
    if (!logEl) return;
    var li = document.createElement("div");
    li.textContent = text;
    logEl.insertBefore(li, logEl.firstChild);
  }

  function renderStack() {
    if (!stack) return;
    stack.innerHTML = "";
    queue.slice(0, 2).forEach(function (item, idx) {
      var div = document.createElement("div");
      div.className = "signal";
      div.setAttribute("data-kind", item.kind || "world");
      div.innerHTML =
        '<span class="tag">' + item.tag + " · بيانات نموذجية</span>" +
        "<div>" + item.text + "</div>" +
        '<button type="button" data-dismiss="' + idx + '">إخفاء</button>';
      stack.appendChild(div);
    });
    qsa("[data-dismiss]", stack).forEach(function (b) {
      b.addEventListener("click", function () {
        var i = Number(b.getAttribute("data-dismiss"));
        queue.splice(i, 1);
        renderStack();
      });
    });
  }

  function notify(opts) {
    var item = {
      kind: opts.kind || "world",
      tag: opts.tag || "إشارة عالم",
      text: opts.text || "",
    };
    queue.unshift(item);
    if (queue.length > 2) queue.length = 2;
    renderStack();
    pushLog(item.tag + ": " + item.text);
    if (live) live.textContent = item.text;
    if (!document.body.classList.contains("rm")) {
      window.setTimeout(function () {
        var ix = queue.indexOf(item);
        if (ix >= 0) {
          queue.splice(ix, 1);
          renderStack();
        }
      }, opts.duration || 6000);
    }
  }

  window.GHVNotify = notify;

  qsa("[data-demo-signal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      notify({
        kind: btn.getAttribute("data-demo-signal"),
        tag: btn.getAttribute("data-tag") || "إشارة",
        text: btn.getAttribute("data-text") || "حدث نموذجي",
      });
    });
  });

  /* Auto portal prototype signal once */
  if (qs("[data-portal-boot]")) {
    window.setTimeout(function () {
      notify({
        kind: "world",
        tag: "إشارة عالم",
        text: "نبضة بعيدة عبر السماء الحيّة — نموذج ثابت، بلا تشغيل فعلي.",
      });
    }, document.body.classList.contains("rm") ? 0 : 1200);
  }

  /* Drawer */
  var backdrop = qs("[data-drawer-backdrop]");
  var drawer = qs("[data-drawer]");
  var lastFocus = null;
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    backdrop && backdrop.classList.add("open");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    var f = qs("button, [href]", drawer);
    if (f) f.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    backdrop && backdrop.classList.remove("open");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  qsa("[data-open-drawer]").forEach(function (b) { b.addEventListener("click", openDrawer); });
  var closer = qs("[data-close-drawer]");
  if (closer) closer.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) closeDrawer();
  });

  /* Topology outcomes A evidence / B service / C shortcut */
  var outcomes = {
    A: {
      label: "أدلة أولاً",
      summary: "جمعت الأدلة قبل التوسيع. المركز يستقر. الاستمرارية تتحسن. المخاطر تنخفض. الدين ينخفض. الثقة ترتفع.",
      world: [
        { k: "الاستمرارية", v: "تتحسن", t: "ok" },
        { k: "الأدلة", v: "أقوى", t: "ok" },
        { k: "المخاطر", v: "أقل", t: "ok" },
        { k: "الدين", v: "ينخفض", t: "ok" },
        { k: "الثقة", v: "ترتفع", t: "ok" },
      ],
      nodes: { core: "ok", edge: "ok", svc: "ok" },
      edges: { e1: "stable", e2: "stable" },
      raven: "قرار حذر يحمي الحيّ. العاقبة واضحة في الطوبولوجيا والنص.",
      signal: { kind: "mission", tag: "إشارة مهمة", text: "مسار الأدلة فعّال — استمرارية أعلى." },
    },
    B: {
      label: "استعادة الخدمة أولاً",
      summary: "أعدت الخدمة بسرعة مع مراقبة لاحقة. الاستمرارية تعود جزئياً. الأدلة متوسطة. المخاطر متوسطة. الدين يرتفع قليلاً.",
      world: [
        { k: "الاستمرارية", v: "جزئية", t: "warn" },
        { k: "الأدلة", v: "متوسطة", t: "info" },
        { k: "المخاطر", v: "متوسطة", t: "warn" },
        { k: "الدين", v: "يرتفع قليلاً", t: "warn" },
        { k: "الثقة", v: "مختلطة", t: "warn" },
      ],
      nodes: { core: "ok", edge: "", svc: "ok" },
      edges: { e1: "stable", e2: "" },
      raven: "الخدمة عادت، لكن المراقبة مطلوبة. ليس فشلاً وليس إغلاقاً كاملاً للمخاطر.",
      signal: { kind: "mission", tag: "إشارة مهمة", text: "استعادة خدمة — راقب الحافة." },
    },
    C: {
      label: "اختصار عالي المخاطر",
      summary: "اختصار سريع أعاد الاستجابة جزئياً ووسّع السطح. الاستمرارية متقطعة. الأدلة مشوشة. المخاطر أعلى. الدين يتراكم. الثقة تتراجع.",
      world: [
        { k: "الاستمرارية", v: "متقطعة", t: "risk" },
        { k: "الأدلة", v: "مشوشة", t: "warn" },
        { k: "المخاطر", v: "أعلى", t: "risk" },
        { k: "الدين", v: "يتراكم", t: "risk" },
        { k: "الثقة", v: "تتراجع", t: "risk" },
      ],
      nodes: { core: "hot", edge: "hot", svc: "" },
      edges: { e1: "stressed", e2: "stressed" },
      raven: "الحيّ تأثر. الاختصار له ثمن ظاهر — لا أخفي العاقبة.",
      signal: { kind: "risk", tag: "تصعيد مخاطر", text: "سطح هجومي أوسع بعد الاختصار." },
    },
  };

  function applyOutcome(key) {
    var o = outcomes[key];
    if (!o) return;
    var label = qs("[data-state-label]");
    var summary = qs("[data-topo-summary]");
    var liveC = qs("[data-live-consequence]");
    var band = qs("[data-world-state]");
    var raven = qs("[data-raven-msg]");
    var save = qs("[data-save-chip]");
    if (label) label.textContent = o.label;
    if (summary) summary.textContent = o.summary;
    if (liveC) liveC.textContent = o.summary;
    if (raven) raven.textContent = o.raven;
    if (band) {
      band.innerHTML = o.world
        .map(function (w) {
          return '<div class="ws-item" data-tone="' + w.t + '"><span>' + w.k + '</span><span class="val">' + w.v + "</span></div>";
        })
        .join("");
    }
    ["core", "edge", "svc"].forEach(function (id) {
      var el = qs('[data-node="' + id + '"]');
      if (!el) return;
      el.classList.remove("hot", "ok");
      if (o.nodes[id]) el.classList.add(o.nodes[id]);
    });
    ["e1", "e2"].forEach(function (id) {
      var el = qs('[data-edge="' + id + '"]');
      if (!el) return;
      el.classList.remove("stressed", "stable");
      if (o.edges[id]) el.classList.add(o.edges[id]);
    });
    qsa("[data-outcome]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-outcome") === key ? "true" : "false");
    });
    if (save) {
      save.setAttribute("data-state", "saving");
      save.textContent = "يحفظ…";
      window.setTimeout(function () {
        save.setAttribute("data-state", "synced");
        save.textContent = "متزامن";
        notify({ kind: "save", tag: "حفظ / مزامنة", text: "حالة المهمة متزامنة (نموذج)." });
      }, document.body.classList.contains("rm") ? 0 : 280);
    }
    notify(o.signal);
  }

  qsa("[data-outcome]").forEach(function (b) {
    b.addEventListener("click", function () { applyOutcome(b.getAttribute("data-outcome")); });
  });
  if (qs("[data-topo-summary]")) applyOutcome("A");

  /* Crowprint staged reveal */
  var chamber = qs("[data-chamber]");
  var stages = qsa("[data-stage]");
  var skip = qs("[data-skip-ceremony]");
  function revealCrowprint(instant) {
    if (!chamber) return;
    chamber.classList.add("is-revealing");
    var delay = instant || document.body.classList.contains("rm") ? 0 : 280;
    stages.forEach(function (el, i) {
      window.setTimeout(function () { el.classList.add("is-on"); }, delay * (i + 1));
    });
    window.setTimeout(function () {
      chamber.classList.add("is-revealed");
    }, instant || document.body.classList.contains("rm") ? 0 : 900);
  }
  if (chamber) {
    window.setTimeout(function () { revealCrowprint(false); }, 200);
  }
  if (skip) skip.addEventListener("click", function () { revealCrowprint(true); });

  /* Flight log + Echo */
  var log = qs("[data-flight-log]");
  if (log) {
    window.setTimeout(function () { log.classList.add("is-play"); }, 100);
  }
  var echo = qs("[data-echo]");
  var echoBtn = qs("[data-split-echo]");
  if (echoBtn && echo) {
    echoBtn.addEventListener("click", function () {
      echo.classList.add("is-split");
      notify({ kind: "raven", tag: "توجيه RAVEN", text: "انشعاب صدى — المسار الكنسي محفوظ." });
      var liveE = qs("[data-live-echo]");
      if (liveE) liveE.textContent = "رحلة الصدى منفصلة؛ المسار الكنسي يبقى مرئياً.";
    });
  }
})();
