/**
 * App entry: shell chrome plus page-specific modules.
 * DEMO ONLY: Demo auth wiring is not real authentication. Replace with backend auth later.
 */

import { initNavAuth, guardPage, initLoginPage } from "./auth.js";
import { initShell } from "./state.js";

document.addEventListener("DOMContentLoaded", async () => {
  initShell();
  initNavAuth();

  const page = document.body.dataset.page || "";
  const redirect = guardPage(page);
  if (redirect) {
    window.location.replace(redirect);
    return;
  }

  if (page === "login") {
    initLoginPage();
  }

  try {
    if (page === "request") {
      const { initRequestPage } = await import("./request-page.js");
      await initRequestPage();
    } else if (page === "dashboard") {
      const { initDashboard } = await import("./dashboard.js");
      initDashboard();
    } else if (page === "admin") {
      const { initAdmin } = await import("./admin.js");
      initAdmin();
    } else if (page === "audit") {
      const { initAuditPage } = await import("./audit-page.js");
      initAuditPage();
    } else if (page === "executive") {
      const { initExecutivePage } = await import("./executive-page.js");
      initExecutivePage();
    }
  } catch (err) {
    console.error(err);
  }
});
