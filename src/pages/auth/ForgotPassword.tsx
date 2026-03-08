import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidCode, useValidPassword, useValidUsername } from '../../hooks/UseAuthHooks';
import { Code, Password, Username } from '../../components/auth/AuthComponents';
import { AuthContext } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const { code, setCode, codeIsValid } = useValidCode('');
  const { password, setPassword, passwordIsValid } = useValidPassword('');
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const { password: passwordConfirm, setPassword: setPasswordConfirm, passwordIsValid: passwordConfirmIsValid } = useValidPassword('');
  const [error, setError] = useState('');
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const isValid =
    !codeIsValid || !usernameIsValid || !passwordIsValid || !passwordConfirmIsValid ||
    !code.length || !username.length || !password.length || !passwordConfirm.length;

  const resetPassword = async () => {
    try {
      await authContext.forgotPassword?.(username, code, password);
      setReset(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-surface via-water-foam/30 to-sand-light/40 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-blob shadow-bubble border-2 border-water-foam/50 p-8">
        <h2 className="font-display font-bold text-xl text-water-deep text-center mb-6">Forgot password</h2>
        {reset ? (
          <div className="text-center space-y-4">
            <p className="text-water-mid">Password has been reset.</p>
            <button type="button" onClick={() => navigate('/signin')} className="btn btn-primary rounded-bubble">
              Sign in
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Code codeIsValid={codeIsValid} setCode={setCode} />
            <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
            <Password label="Password" passwordIsValid={passwordIsValid} setPassword={setPassword} />
            <Password label="Confirm password" passwordIsValid={passwordConfirmIsValid} setPassword={setPasswordConfirm} />
            {error && <div className="alert alert-error rounded-bubble text-sm">{error}</div>}
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-bubble">Cancel</button>
              <button type="button" className="btn btn-primary rounded-bubble" disabled={isValid} onClick={resetPassword}>
                Change password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
