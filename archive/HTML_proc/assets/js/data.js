/**
 * Load static JSON (replace with API calls later).
 */

/**
 * @param {string} path
 * @returns {Promise<unknown>}
 */
export async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load data: ${path}`);
  return res.json();
}
