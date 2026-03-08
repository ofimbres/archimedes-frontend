import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidUsername } from '../../hooks/UseAuthHooks';
import { Username } from '../../components/auth/AuthComponents';
import { AuthContext } from '../../contexts/AuthContext';

export default function SendCode() {
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const isValid = !usernameIsValid || username.length === 0;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const sendCodeClicked = async () => {
    try {
      await authContext.sendCode?.(username);
      setResetSent(true);
    } catch {
      setError('Unknown user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-surface via-water-foam/30 to-sand-light/40 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-blob shadow-bubble border-2 border-water-foam/50 p-8">
        <h2 className="font-display font-bold text-xl text-water-deep text-center mb-6">Send reset code</h2>
        {resetSent ? (
          <div className="space-y-4 text-center">
            <p className="text-water-mid">Reset code sent to <strong>{username}</strong></p>
            <button type="button" onClick={() => navigate('/forgotpassword')} className="btn btn-primary rounded-bubble">
              Reset password
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
            {error && <div className="alert alert-error rounded-bubble text-sm">{error}</div>}
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-bubble">Cancel</button>
              <button type="button" disabled={isValid} onClick={sendCodeClicked} className="btn btn-primary rounded-bubble">
                Send code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
