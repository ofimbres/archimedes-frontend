import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Handles OAuth callback when the backend redirects to the frontend with tokens in the URL.
 * Expects access_token (and optionally refresh_token) in hash or query, e.g.:
 * /auth/callback#access_token=...&refresh_token=...
 * or /auth/callback?access_token=...&refresh_token=...
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSessionFromTokens } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(
      location.hash?.slice(1) || location.search || ''
    );
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !setSessionFromTokens) {
      navigate('/signin', { replace: true });
      return;
    }

    setSessionFromTokens(accessToken, refreshToken)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        navigate('/signin', { replace: true });
      });
  }, [location.hash, location.search, navigate, setSessionFromTokens]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <p className="text-muted">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
