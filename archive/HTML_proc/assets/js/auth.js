/**
 * DEMO ONLY: This is not real authentication. Replace with backend auth later.
 *
 * Demo session helpers, role gates, and navbar wiring for the static HTML shell.
 */

import { appendAuditEntry } from "./storage.js";

/** localStorage key for the signed-in demo persona (not a security boundary). */
export const SESSION_KEY = "cybercrow.demoUser.v1";

/** Demo password shown on the login page (demo only; not verified server-side). */
export const DEMO_PASSWORD = "Demo123!";

/**
 * @typedef {"visitor"|"client_user"|"client_manager"|"cybercrow_admin"|"security_analyst"|"executive"} DemoRole
 */

/**
 * Demo directory accounts (password is shared: {@link DEMO_PASSWORD}).
 * @type {ReadonlyArray<{ email: string, displayName: string, role: Exclude<DemoRole, "visitor"> }>}
 */
export const DEMO_USERS = Object.freeze([
  {
    email: "client.user@demo.com",
    displayName: "Client User",
    role: "client_user",
  },
  {
    email: "client.manager@demo.com",
    displayName: "Client Manager",
    role: "client_manager",
  },
  {
    email: "admin@cybercrow.local",
    displayName: "CyberCrow Admin",
    role: "cybercrow_admin",
  },
  {
    email: "analyst@cybercrow.local",
    displayName: "Security Analyst",
    role: "security_analyst",
  },
  {
    email: "executive@cybercrow.local",
    displayName: "Executive",
    role: "executive",
  },
]);

/**
 * @returns {boolean}
 */
export function isInPagesDirectory() {
  return /\/pages\//i.test(window.location.pathname) || /[/\\]pages[/\\]/i.test(window.location.pathname);
}

/**
 * @returns {string}
 */
export function hrefToLogin() {
  return isInPagesDirectory() ? "login.html" : "pages/login.html";
}

/**
 * @returns {string}
 */
export function hrefToHome() {
  return isInPagesDirectory() ? "../index.html" : "index.html";
}

/**
 * @param {DemoRole | string | undefined} role
 * @returns {string} Relative path after successful demo login (caller is under `/pages/`).
 */
export function getPostLoginPathForPagesDir(role) {
  switch (role) {
    case "visitor":
      return "../index.html";
    case "client_user":
      return "request.html";
    case "client_manager":
      return "dashboard.html";
    case "cybercrow_admin":
      return "admin.html";
    case "security_analyst":
      return "audit.html";
    case "executive":
      return "executive.html";
    default:
      return "../index.html";
  }
}

/**
 * Landing when the current role is not allowed on `pageId` (minimal client-side gate).
 * @param {DemoRole | "visitor"} role
 * @returns {string} Path relative to `/pages/`.
 */
export function getRoleLandingPathInPages(role) {
  return getPostLoginPathForPagesDir(
    /** @type {DemoRole} */ (role === "visitor" ? "visitor" : role)
  );
}

/**
 * @returns {{ email: string, role: DemoRole, displayName: string, loggedInAt: string } | null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const email = String(data.email || "").trim();
    const role = String(data.role || "").trim();
    const displayName = String(data.displayName || "").trim();
    const loggedInAt = String(data.loggedInAt || "").trim();
    if (!email || !role || !displayName || !loggedInAt) return null;
    return { email, role: /** @type {DemoRole} */ (role), displayName, loggedInAt };
  } catch {
    return null;
  }
}

/**
 * @param {{ email: string, role: DemoRole, displayName: string }} user
 */
export function setSession(user) {
  const payload = {
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * @returns {boolean}
 */
export function isLoggedIn() {
  return getSession() !== null;
}

/**
 * @param {...DemoRole} roles
 * @returns {boolean}
 */
export function hasRole(...roles) {
  const s = getSession();
  if (!s) return false;
  return roles.includes(/** @type {DemoRole} */ (s.role));
}

/**
 * @returns {{ displayName: string, role: DemoRole, email: string } | null}
 */
export function getSessionSnapshotForAudit() {
  const s = getSession();
  if (!s) return null;
  return {
    displayName: s.displayName,
    role: /** @type {DemoRole} */ (s.role),
    email: s.email,
  };
}

/**
 * Returns a relative redirect URL if the active session may not view `pageId`, otherwise null.
 * DEMO ONLY: This is not real authentication. Replace with backend auth later.
 *
 * @param {string} pageId `document.body.dataset.page`
 * @returns {string | null}
 */
export function requireRoleForPage(pageId) {
  const session = getSession();
  /** @type {DemoRole | "visitor"} */
  const role = session ? /** @type {DemoRole} */ (session.role) : "visitor";
  const inPages = isInPagesDirectory();

  /**
   * @param {string} p Path expressed relative to the `/pages/` directory.
   */
  const resolve = (p) => {
    if (inPages) return p;
    if (p.startsWith("../")) return p.replace(/^\.\.\//, "");
    return `pages/${p}`;
  };

  if (!pageId || pageId === "login" || pageId === "about" || pageId === "home") return null;

  if (pageId === "request") {
    if (role === "client_user" || role === "cybercrow_admin") return null;
    if (role === "visitor") return resolve("login.html");
    return resolve(getRoleLandingPathInPages(/** @type {DemoRole} */ (role)));
  }

  if (pageId === "dashboard") {
    if (role === "client_manager" || role === "executive" || role === "cybercrow_admin") return null;
    if (role === "security_analyst") return resolve("audit.html");
    if (role === "client_user") return resolve("request.html");
    if (role === "visitor") return resolve("login.html");
    return resolve(getRoleLandingPathInPages(/** @type {DemoRole} */ (role)));
  }

  if (pageId === "admin") {
    if (role === "cybercrow_admin") return null;
    if (role === "visitor") return resolve("login.html");
    return resolve(getRoleLandingPathInPages(/** @type {DemoRole} */ (role)));
  }

  if (pageId === "audit") {
    if (role === "security_analyst" || role === "cybercrow_admin") return null;
    if (role === "visitor") return resolve("login.html");
    return resolve(getRoleLandingPathInPages(/** @type {DemoRole} */ (role)));
  }

  if (pageId === "executive") {
    if (role === "executive" || role === "cybercrow_admin") return null;
    if (role === "visitor") return resolve("login.html");
    return resolve(getRoleLandingPathInPages(/** @type {DemoRole} */ (role)));
  }

  return null;
}

/**
 * @param {string} pageId
 * @returns {string | null}
 */
export function guardPage(pageId) {
  return requireRoleForPage(pageId);
}

/**
 * Wire `[data-nav-auth]` with Login / user + Logout.
 * DEMO ONLY: This is not real authentication. Replace with backend auth later.
 */
export function initNavAuth() {
  const slot = document.querySelector("[data-nav-auth]");
  if (!slot) return;

  const session = getSession();
  if (!session) {
    slot.innerHTML = `<a class="cc-nav-auth__login cc-btn cc-btn--ghost" href="${hrefToLogin()}">Login</a>`;
    return;
  }

  const roleLabel = String(session.role).replace(/_/g, " ");
  slot.innerHTML = `
    <span class="cc-nav-auth__user" title="${escapeAttr(session.email)}">
      <span class="cc-nav-auth__name">${escapeHtml(session.displayName)}</span>
      <span class="cc-nav-auth__role">${escapeHtml(roleLabel)}</span>
    </span>
    <button type="button" class="cc-btn cc-btn--ghost cc-nav-auth__logout" data-demo-logout>
      Logout
    </button>
  `;

  const btn = slot.querySelector("[data-demo-logout]");
  btn?.addEventListener("click", () => {
    appendAuditEntry({
      action: "demo_logout",
      actorName: session.displayName,
      actorRole: session.role,
      target: session.email,
      severity: "info",
    });
    clearSession();
    window.location.replace(hrefToHome());
  });
}

/**
 * Login page controller (dropdown + shared demo password).
 * DEMO ONLY: This is not real authentication. Replace with backend auth later.
 */
export function initLoginPage() {
  const form = document.getElementById("demo-login-form");
  const account = document.getElementById("demo-login-account");
  const password = /** @type {HTMLInputElement | null} */ (document.getElementById("demo-login-password"));
  const err = document.getElementById("demo-login-error");

  if (!form || !account || !password) return;

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (err) {
      err.textContent = "";
      err.hidden = true;
    }

    const selected = String(account.value || "").trim();
    const pw = String(password.value || "");

    if (pw !== DEMO_PASSWORD) {
      if (err) {
        err.textContent = `Use the demo password ${DEMO_PASSWORD} (demo only).`;
        err.hidden = false;
      }
      return;
    }

    if (!selected) {
      clearSession();
      window.location.replace(hrefToHome());
      return;
    }

    const user = DEMO_USERS.find((u) => u.email === selected);
    if (!user) {
      if (err) {
        err.textContent = "Pick a demo account from the list.";
        err.hidden = false;
      }
      return;
    }

    setSession({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    });

    const snap = getSessionSnapshotForAudit();
    appendAuditEntry({
      action: "demo_login",
      actorName: snap?.displayName ?? user.displayName,
      actorRole: snap?.role ?? user.role,
      target: user.email,
      severity: "info",
    });

    const rel = getPostLoginPathForPagesDir(user.role);
    const inPages = isInPagesDirectory();
    const dest = inPages
      ? rel
      : rel.startsWith("../")
        ? rel.replace(/^\.\.\//, "")
        : `pages/${rel}`;
    window.location.replace(dest);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/`/g, "&#96;");
}
