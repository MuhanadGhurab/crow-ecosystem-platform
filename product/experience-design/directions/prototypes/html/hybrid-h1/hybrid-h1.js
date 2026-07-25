/* GHURAVIA Hybrid H1 — lightweight static prototype JS. NOT Product Code. */
(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* Reduced motion toggle */
  var rmBtn = qs("[data-toggle-rm]");
  if (rmBtn) {
    var prefer = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefer) document.body.classList.add("rm");
    rmBtn.setAttribute("aria-pressed", document.body.classList.contains("rm") ? "true" : "false");
    rmBtn.addEventListener("click", function () {
      document.body.classList.toggle("rm");
      rmBtn.setAttribute("aria-pressed", document.body.classList.contains("rm") ? "true" : "false");
    });
  }

  /* Accessible drawer */
  var openers = qsa("[data-open-drawer]");
  var backdrop = qs("[data-drawer-backdrop]");
  var drawer = qs("[data-drawer]");
  var closer = qs("[data-close-drawer]");
  var lastFocus = null;

  function openDrawer() {
    if (!drawer || !backdrop) return;
    lastFocus = document.activeElement;
    backdrop.classList.add("open");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    var focusable = qs("button, [href], input, select, textarea", drawer);
    if (focusable) focusable.focus();
  }
  function closeDrawer() {
    if (!drawer || !backdrop) return;
    backdrop.classList.remove("open");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  openers.forEach(function (btn) {
    btn.addEventListener("click", openDrawer);
  });
  if (closer) closer.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  /* Topology states A / B / C */
  var states = {
    A: {
      label: "الحالة أ — بداية الحادث",
      summary:
        "إشارة مجهولة تصل إلى حي الخدمات. العقدة المركزية مضغوطة. الاستمرارية مستقرة ظاهرياً. الأدلة غير كافية. المخاطر مرتفعة. الدين التقني متوسط. ثقة الأطراف حذرة.",
      world: [
        { k: "الاستمرارية", v: "مستقرة ظاهرياً", tone: "warn" },
        { k: "الأدلة", v: "ناقصة", tone: "info" },
        { k: "المخاطر", v: "مرتفعة", tone: "risk" },
        { k: "الدين التقني", v: "متوسط", tone: "warn" },
        { k: "ثقة الأطراف", v: "حذر", tone: "warn" },
      ],
      nodes: { core: "hot", edge: "", svc: "" },
      edges: { e1: "stressed", e2: "" },
    },
    B: {
      label: "الحالة ب — قرار يعتمد الأدلة أولاً",
      summary:
        "جمعت الأدلة قبل التدخل الواسع. العقدة المركزية تبرد. مسار الخدمة يستقر. الاستمرارية تتحسن. المخاطر تنخفض. الدين ينخفض. ثقة الأطراف ترتفع.",
      world: [
        { k: "الاستمرارية", v: "تتحسن", tone: "ok" },
        { k: "الأدلة", v: "أقوى", tone: "ok" },
        { k: "المخاطر", v: "منخفضة نسبياً", tone: "ok" },
        { k: "الدين التقني", v: "ينخفض", tone: "ok" },
        { k: "ثقة الأطراف", v: "ترتفع", tone: "ok" },
      ],
      nodes: { core: "ok", edge: "ok", svc: "ok" },
      edges: { e1: "stable", e2: "stable" },
    },
    C: {
      label: "الحالة ج — اختصار عالي المخاطر",
      summary:
        "اختصار سريع أعاد الخدمة جزئياً لكنه وسّع السطح الهجومي. الاستمرارية متقطعة. الأدلة مشوشة. المخاطر أعلى. الدين يتراكم. ثقة الأطراف تتراجع.",
      world: [
        { k: "الاستمرارية", v: "متقطعة", tone: "risk" },
        { k: "الأدلة", v: "مشوشة", tone: "warn" },
        { k: "المخاطر", v: "أعلى", tone: "risk" },
        { k: "الدين التقني", v: "يتراكم", tone: "risk" },
        { k: "ثقة الأطراف", v: "تتراجع", tone: "risk" },
      ],
      nodes: { core: "hot", edge: "hot", svc: "" },
      edges: { e1: "stressed", e2: "stressed" },
    },
  };

  function applyState(key) {
    var s = states[key];
    if (!s) return;
    var live = qs("[data-live-consequence]");
    var summary = qs("[data-topo-summary]");
    var label = qs("[data-state-label]");
    var band = qs("[data-world-state]");
    if (label) label.textContent = s.label;
    if (summary) summary.textContent = s.summary;
    if (live) live.textContent = s.summary;
    if (band) {
      band.innerHTML = s.world
        .map(function (w) {
          return (
            '<div class="ws-item" data-tone="' +
            w.tone +
            '"><span>' +
            w.k +
            '</span><span class="val">' +
            w.v +
            "</span></div>"
          );
        })
        .join("");
    }
    ["core", "edge", "svc"].forEach(function (id) {
      var el = qs('[data-node="' + id + '"]');
      if (!el) return;
      el.classList.remove("hot", "ok");
      if (s.nodes[id]) el.classList.add(s.nodes[id]);
    });
    ["e1", "e2"].forEach(function (id) {
      var el = qs('[data-edge="' + id + '"]');
      if (!el) return;
      el.classList.remove("stressed", "stable");
      if (s.edges[id]) el.classList.add(s.edges[id]);
    });
    qsa("[data-set-state]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-state") === key ? "true" : "false");
    });
    var save = qs("[data-save-chip]");
    if (save) {
      save.setAttribute("data-state", "saving");
      save.textContent = "يحفظ…";
      window.setTimeout(function () {
        save.setAttribute("data-state", "synced");
        save.textContent = "متزامن";
      }, document.body.classList.contains("rm") ? 0 : 280);
    }
  }

  qsa("[data-set-state]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyState(btn.getAttribute("data-set-state"));
    });
  });
  if (qs("[data-topo-summary]")) applyState("A");

  /* Ceremony skip */
  var skip = qs("[data-skip-ceremony]");
  var chamber = qs("[data-chamber]");
  if (skip && chamber) {
    skip.addEventListener("click", function () {
      chamber.classList.add("rm");
      chamber.scrollIntoView({ behavior: document.body.classList.contains("rm") ? "auto" : "smooth" });
    });
  }
})();
