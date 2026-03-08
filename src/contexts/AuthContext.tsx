import React, { useState, useEffect, useContext, useCallback } from 'react';
import type { UserType, Profile, MeResponse } from '../types/auth';
import * as authApi from '../libs/authApi';

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
  NeedsProfile,
  InProcess,
}

export interface SessionInfo {
  username?: string;
  email?: string;
  sub?: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  user_type?: UserType;
  profile?: Profile | null;
}

export interface IAuth {
  sessionInfo?: SessionInfo;
  attrInfo?: unknown[];
  authStatus?: AuthStatus;
  signInWithEmail?: (
    username: string,
    password: string
  ) => Promise<{ needsProfile: boolean }>;
  signUpWithEmail?: (
    givenName: string,
    familyName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  signOut?: () => Promise<void>;
  verifyCode?: (username: string, code: string) => Promise<string>;
  getSession?: () => Promise<{ accessToken: { jwtToken: string }; refreshToken: { token: string } } | null>;
  sendCode?: (username: string) => Promise<void>;
  forgotPassword?: (username: string, code?: string, newPassword?: string) => Promise<string>;
  changePassword?: (oldPassword: string, newPassword: string) => Promise<void>;
  getAttributes?: () => Promise<unknown>;
  completeProfile?: (
    body: import('../types/auth').CompleteProfileBody
  ) => Promise<void>;
  setSessionFromTokens?: (accessToken: string, refreshToken?: string | null, idToken?: string | null) => Promise<void>;
}

const defaultState: IAuth = {
  sessionInfo: {},
  authStatus: AuthStatus.Loading,
};

type Props = {
  children?: React.ReactNode;
  role?: string;
};

export const AuthContext = React.createContext(defaultState);

function sessionHasRole(sessionInfo: SessionInfo | undefined, role: string): boolean {
  const ut = sessionInfo?.user_type;
  if (role === 'admin') return ut === 'admin';
  if (role === 'students') return ut === 'students';
  if (role === 'teachers') return ut === 'teachers';
  return false;
}

export const AuthIsSignedIn = ({ children, role }: Props) => {
  const { authStatus, sessionInfo } = useContext(AuthContext);

  if (authStatus !== AuthStatus.SignedIn) return null;
  if (role && !sessionHasRole(sessionInfo, role)) return null;
  return <>{children}</>;
};

export const AuthIsNotSignedIn = ({ children }: Props) => {
  const { authStatus } = useContext(AuthContext);
  return <>{authStatus === AuthStatus.SignedOut ? children : null}</>;
};

export const AuthNeedsProfile = ({ children }: Props) => {
  const { authStatus } = useContext(AuthContext);
  return <>{authStatus === AuthStatus.NeedsProfile ? children : null}</>;
};

const STORAGE_ACCESS = 'accessToken';
const STORAGE_REFRESH = 'refreshToken';
const STORAGE_ID_TOKEN = 'idToken';
const STORAGE_USERNAME = 'lastUsername';

const AuthProvider = ({ children }: Props) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({});
  const [attrInfo] = useState<unknown[]>([]);

  const applyMe = useCallback((me: MeResponse, token: string, refresh?: string | null, username?: string, idToken?: string | null) => {
    const hasProfile = me.profile != null;
    const isAdmin = me.user_type === 'admin';
    if (hasProfile || isAdmin) {
      setAuthStatus(AuthStatus.SignedIn);
    } else {
      setAuthStatus(AuthStatus.NeedsProfile);
    }
    setSessionInfo((prev) => ({
      ...prev,
      accessToken: token,
      refreshToken: refresh ?? prev.refreshToken,
      idToken: idToken ?? prev.idToken,
      username: username ?? prev.username,
      user_type: me.user_type,
      profile: me.profile ?? null,
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem(STORAGE_ACCESS);
    if (!token) {
      setAuthStatus(AuthStatus.SignedOut);
      return;
    }
    authApi
      .getMe(token)
      .then((me) => {
        if (cancelled) return;
        const refresh = localStorage.getItem(STORAGE_REFRESH);
        const idToken = localStorage.getItem(STORAGE_ID_TOKEN);
        const username = localStorage.getItem(STORAGE_USERNAME);
        applyMe(me, token, refresh, username ?? undefined, idToken);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.message === 'UNAUTHORIZED') {
          localStorage.removeItem(STORAGE_ACCESS);
          localStorage.removeItem(STORAGE_REFRESH);
          localStorage.removeItem(STORAGE_USERNAME);
        }
        setAuthStatus(AuthStatus.SignedOut);
      });
    return () => {
      cancelled = true;
    };
  }, [applyMe]);

  async function setSessionFromTokens(accessToken: string, refreshToken?: string | null, idToken?: string | null) {
    localStorage.setItem(STORAGE_ACCESS, accessToken);
    if (refreshToken != null) localStorage.setItem(STORAGE_REFRESH, refreshToken);
    if (idToken != null) localStorage.setItem(STORAGE_ID_TOKEN, idToken);
    const me = await authApi.getMe(accessToken);
    applyMe(me, accessToken, refreshToken, undefined, idToken);
  }

  async function signInWithEmail(
    username: string,
    password: string
  ): Promise<{ needsProfile: boolean }> {
    const data = await authApi.login(username, password);
    if (!data.access_token) {
      throw new Error('Invalid response from server. Please try again.');
    }
    localStorage.setItem(STORAGE_ACCESS, data.access_token);
    if (data.refresh_token) localStorage.setItem(STORAGE_REFRESH, data.refresh_token);
    if (data.id_token) localStorage.setItem(STORAGE_ID_TOKEN, data.id_token);
    if (data.user?.username) localStorage.setItem(STORAGE_USERNAME, data.user.username);
    const me = await authApi.getMe(data.access_token);
    applyMe(me, data.access_token, data.refresh_token ?? null, data.user?.username, data.id_token ?? null);
    const needsProfile =
      me.profile == null && me.user_type !== 'admin';
    return { needsProfile };
  }

  async function signUpWithEmail(
    givenName: string,
    familyName: string,
    username: string,
    email: string,
    password: string
  ) {
    const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
    const res = await fetch(`${endpoint}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        username,
        password,
        email,
        givenName,
        familyName,
      }),
    });
    const errorData = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(errorData.message || 'Registration failed. Please try again.');
    }
  }

  async function signOut() {
    const token = sessionInfo.accessToken ?? localStorage.getItem(STORAGE_ACCESS);
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(STORAGE_USERNAME);
    localStorage.removeItem(STORAGE_ACCESS);
    localStorage.removeItem(STORAGE_REFRESH);
    localStorage.removeItem(STORAGE_ID_TOKEN);
    setSessionInfo({});
    setAuthStatus(AuthStatus.SignedOut);
  }

  async function completeProfile(body: import('../types/auth').CompleteProfileBody) {
    const idToken = sessionInfo.idToken ?? localStorage.getItem(STORAGE_ID_TOKEN);
    if (!idToken) {
      throw new Error('Session missing ID token. Please sign in again.');
    }
    const me = await authApi.completeProfile(idToken, body);
    const token = sessionInfo.accessToken ?? localStorage.getItem(STORAGE_ACCESS);
    const refresh = sessionInfo.refreshToken ?? localStorage.getItem(STORAGE_REFRESH);
    applyMe(me, token ?? '', refresh, sessionInfo.username, idToken);
  }

  async function verifyCode(username: string, code: string) {
    const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
    const res = await fetch(`${endpoint}/api/v1/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username, confirmationCode: code }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Verification failed. Please check your code.');
    }
    return res.text();
  }

  async function getSession() {
    const accessToken = localStorage.getItem(STORAGE_ACCESS);
    if (!accessToken) return null;
    try {
      const { jwtDecode } = await import('jwt-decode');
      const payload = jwtDecode(accessToken) as Record<string, unknown>;
      return {
        accessToken: { jwtToken: accessToken, payload },
        refreshToken: { token: localStorage.getItem(STORAGE_REFRESH) ?? '' },
      };
    } catch {
      return null;
    }
  }

  async function getAttributes() {
    const username = localStorage.getItem(STORAGE_USERNAME);
    const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
    if (!username || !endpoint) return [];
    const res = await fetch(`${endpoint}/api/v1/auth/${username}/attributes`, {
      headers: { Accept: 'application/json' },
    });
    const data = await res.json().catch(() => []);
    return data;
  }

  async function sendCode(_username: string) {
    // TODO if backend supports
  }

  async function forgotPassword(
    username: string,
    _code?: string,
    _newPassword?: string
  ): Promise<string> {
    const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
    const res = await fetch(`${endpoint}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Request failed');
    }
    return res.text();
  }

  async function changePassword(_oldPassword: string, _newPassword: string) {
    // TODO when backend supports
    throw new Error('Not implemented');
  }

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  const state: IAuth = {
    authStatus,
    sessionInfo,
    attrInfo,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    verifyCode,
    getSession,
    sendCode,
    forgotPassword,
    changePassword,
    getAttributes,
    completeProfile,
    setSessionFromTokens,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
