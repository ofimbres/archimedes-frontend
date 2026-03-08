// Auth API per docs/AUTH_AND_PROFILE_CONTRACT.md

import type {
  MeResponse,
  LoginResponse,
  CompleteProfileBody,
} from '../types/auth';

const API_BASE = process.env.REACT_APP_BACKEND_API_ENDPOINT;

function jsonHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function authHeaders(accessToken: string): HeadersInit {
  return {
    ...jsonHeaders(),
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * GET /auth/me. Prefer idToken when available so the backend receives a token with
 * the "aud" claim (Cognito access tokens often omit it, causing MissingRequiredClaimError).
 */
export async function getMe(accessToken: string, idToken?: string | null): Promise<MeResponse> {
  const token = idToken ?? accessToken;
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.detail ?? data.message ?? 'Failed to load profile';
    throw new Error(typeof message === 'string' ? message : 'Failed to load profile');
  }
  return res.json();
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

/**
 * Complete profile. Use the ID token only (not the access token).
 * Send: Authorization: Bearer <id_token>
 */
export async function completeProfile(
  idToken: string,
  body: CompleteProfileBody
): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/complete-profile`, {
    method: 'POST',
    headers: authHeaders(idToken),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data.detail ?? data.message ?? 'Failed to complete profile';
    if (res.status === 400) {
      throw new Error(typeof message === 'string' ? message : 'Invalid profile data');
    }
    if (res.status === 404) {
      throw new Error(typeof message === 'string' ? message : 'Invalid join code or course not found');
    }
    throw new Error(typeof message === 'string' ? message : 'Failed to complete profile');
  }
  return data;
}

export async function logout(accessToken: string): Promise<void> {
  await fetch(`${API_BASE}/api/v1/auth/logout`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ access_token: accessToken }),
  });
}

export async function refreshToken(
  refreshToken: string
): Promise<{ access_token: string; id_token?: string }> {
  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Token refresh failed');
  }
  return data;
}

export function getOAuthRedirectUrl(): string {
  return `${API_BASE}/api/v1/auth/oauth/redirect`;
}

/** GET /api/v1/schools/?page=1&size=100 for Complete Profile school dropdown */
export interface School {
  id: string;
  name: string;
  code?: string;
}

export interface SchoolsResponse {
  schools: School[];
}

export async function getSchools(accessToken: string): Promise<SchoolsResponse> {
  const res = await fetch(
    `${API_BASE}/api/v1/schools/?page=1&size=100`,
    {
      method: 'GET',
      headers: authHeaders(accessToken),
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load schools');
  }
  const data = await res.json();
  return { schools: data.schools ?? [] };
}
