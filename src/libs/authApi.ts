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

export async function getMe(accessToken: string): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    method: 'GET',
    headers: authHeaders(accessToken),
  });
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load profile');
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

export async function completeProfile(
  accessToken: string,
  body: CompleteProfileBody
): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/complete-profile`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 400) {
      throw new Error(data.message || 'Invalid profile data');
    }
    if (res.status === 404) {
      throw new Error(data.message || 'Invalid join code or course not found');
    }
    throw new Error(data.message || 'Failed to complete profile');
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
