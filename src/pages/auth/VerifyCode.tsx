import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useValidCode, useValidUsername } from '../../hooks/UseAuthHooks';
import { AuthContext } from '../../contexts/AuthContext';

const inputClass = 'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none';
const inputInvalidClass = 'input input-bordered input-error rounded-bubble border-2 w-full';

const VerifyCode: React.FC = () => {
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const { code, setCode, codeIsValid } = useValidCode('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isValid = !usernameIsValid || username.length === 0 || !codeIsValid || code.length === 0;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError('');
    try {
      await authContext.verifyCode?.(username, code);
      navigate('/signin');
    } catch {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    try {
      navigate('/forgotpassword');
    } catch {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-surface via-water-foam/30 to-sand-light/40 px-4">
      <div className="w-full max-w-md">
        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <Link to="/signin" className="text-water-mid hover:text-water-deep text-sm font-medium inline-block">
            ← Back to Sign In
          </Link>
        </div>
        <div className="bg-base-100 rounded-blob shadow-bubble border-2 border-water-foam/50 p-8">
          <img src="archimedes-logo.jpg" alt="Archimedes Logo" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-md" />
          <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-1">Verify your email</h1>
          <p className="text-water-mid text-center text-sm mb-6">
            We sent a verification code to your email. Enter the code below to continue.
          </p>
          {error && (
            <div className="alert alert-error rounded-bubble text-sm mb-4">
              <span><strong>Oops!</strong> {error}</span>
            </div>
          )}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-water-deep">Username / Email</span></label>
              <input
                type="text"
                placeholder="Username or email"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                disabled={isLoading}
                className={!usernameIsValid && username ? inputInvalidClass : inputClass}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-water-deep">Verification code</span></label>
              <input
                type="text"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                disabled={isLoading}
                maxLength={6}
                className={!codeIsValid && code ? inputInvalidClass : inputClass}
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isValid || isLoading}
              className="btn btn-primary w-full rounded-bubble btn-bouncy font-display font-semibold"
            >
              {isLoading ? 'Verifying…' : 'Verify code'}
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="btn btn-ghost w-full rounded-bubble"
            >
              {isResending ? 'Resending…' : 'Resend code'}
            </button>
          </div>
          <p className="text-center mt-4 text-sm text-water-mid">
            Didn&apos;t receive a code? Check spam or{' '}
            <button type="button" onClick={handleResendCode} className="link font-medium" disabled={isResending}>
              try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
