/**
 * Small DOM helpers.
 */

/**
 * @param {Element | null} el
 * @param {string} text
 */
export function setText(el, text) {
  if (el) el.textContent = text;
}

/**
 * @param {Element | null} el
 * @param {boolean} on
 * @param {string} [cls]
 */
export function toggleClass(el, on, cls = "is-selected") {
  if (!el) return;
  el.classList.toggle(cls, on);
}
