/**
 * Base URL for backend API calls from the browser.
 *
 * Uses `REACT_APP_BACKEND_API_ENDPOINT`, or same-origin when unset (paths in code are `/api/v1/...`).
 *
 * For miniquiz / iframe launch URLs, use `getBackendApiOriginForMiniquizLaunch()` so
 * `archimedes_api_base` is always a full URL the iframe can reach.
 */

const raw = (process.env.REACT_APP_BACKEND_API_ENDPOINT || "").trim();

function normalizeHostInUrl(urlString: string): string {
  try {
    const u = new URL(urlString);
    if (u.hostname === "0.0.0.0") {
      u.hostname = "127.0.0.1";
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    return urlString.replace(/\/$/, "");
  }
}

/** Origin only (scheme + host + port), no path — for miniquiz `archimedes_api_base`. */
export function getBackendApiOriginForMiniquizLaunch(): string {
  if (!raw) {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return "";
  }
  try {
    const u = new URL(normalizeHostInUrl(raw));
    if (u.hostname === "0.0.0.0") u.hostname = "127.0.0.1";
    return u.origin;
  } catch {
    return "";
  }
}

/**
 * Base for fetch/axios. Paths in `apiEndpoints` are `${BASE}/api/v1/...`.
 */
export const BACKEND_API_BASE_URL = raw
  ? normalizeHostInUrl(raw)
  : typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";
