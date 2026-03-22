import { getBackendApiOriginForMiniquizLaunch } from './backendApiBaseUrl';

/**
 * API origin only (scheme + host + port), no path — used as archimedes_api_base on miniquiz launch URLs.
 * Uses env backend URL even when dev API proxy is on (iframes need a real reachable origin).
 */
export function getArchimedesApiOriginFromEnv(): string {
  return getBackendApiOriginForMiniquizLaunch();
}

export interface BuildAssignmentLaunchUrlParams {
  studentId: string;
  assignmentId: string;
  /** Activity id (e.g. EX01); omitted from URL if empty */
  activityId: string;
  /**
   * Same token the miniquiz will send as Bearer on POST .../completions.
   * Prefer Cognito ID token when available (backend validates aud).
   */
  sessionBearerToken: string;
  /** If true, URL hash uses `id_token=`; otherwise `access_token=` (must match token type). */
  hashUsesIdToken: boolean;
  /** Defaults to {@link getArchimedesApiOriginFromEnv} */
  archimedesApiBase?: string;
}

/**
 * Build miniquiz URL: query params for API + ids; session token in the **hash** only (not sent to CloudFront).
 *
 * Hash: `#id_token=...` or `#access_token=...` (encodeURIComponent).
 */
export function buildAssignmentLaunchUrl(
  contentUrl: string,
  params: BuildAssignmentLaunchUrlParams
): string {
  const base =
    typeof window !== 'undefined' ? window.location.href : 'https://localhost/';
  const url = new URL(contentUrl, base);

  const apiBase = (params.archimedesApiBase ?? getArchimedesApiOriginFromEnv()).replace(/\/+$/, '');
  if (apiBase) {
    url.searchParams.set('archimedes_api_base', apiBase);
  }
  url.searchParams.set('assignment_id', params.assignmentId);
  url.searchParams.set('student_id', params.studentId);
  if (params.activityId != null && String(params.activityId).trim() !== '') {
    url.searchParams.set('activity_id', String(params.activityId).trim());
  }

  const token = params.sessionBearerToken.trim();
  if (!token) {
    return url.toString();
  }

  const hashKey = params.hashUsesIdToken ? 'id_token' : 'access_token';
  const hash = `${hashKey}=${encodeURIComponent(token)}`;

  return `${url.toString()}#${hash}`;
}

/** Alias for backend/docs references */
export const withAccessTokenHash = buildAssignmentLaunchUrl;
