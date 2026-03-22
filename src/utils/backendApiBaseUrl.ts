/**
 * Normalize backend base URL for browser `fetch`.
 * `0.0.0.0` is a bind address, not a reliable client target — Chrome often fails with net::ERR_FAILED
 * and misleading CORS/preflight errors. Use 127.0.0.1 (or localhost) instead.
 */
export function normalizeBackendApiBaseUrl(raw: string | undefined): string {
  const s = raw == null ? '' : String(raw).trim();
  if (!s) return '';
  try {
    const u = new URL(s);
    if (u.hostname === '0.0.0.0') {
      u.hostname = '127.0.0.1';
    }
    const path = u.pathname.replace(/\/+$/, '');
    const base = `${u.protocol}//${u.host}${path === '/' ? '' : path}`;
    return base.replace(/\/+$/, '');
  } catch {
    return s.replace(/0\.0\.0\.0/g, '127.0.0.1').replace(/\/+$/, '');
  }
}

/** Single source for API base (env at build time, normalized for the browser). */
export const BACKEND_API_BASE_URL = normalizeBackendApiBaseUrl(
  process.env.REACT_APP_BACKEND_API_ENDPOINT
);
