import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidPassword } from '../../hooks/UseAuthHooks';
import { AuthContext } from '../../contexts/AuthContext';

const inputClass = 'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none';

export default function ChangePassword() {
  const [error, setError] = useState('');
  const [reset, setReset] = useState(false);
  const { password: oldPassword, setPassword: setOldPassword, passwordIsValid: oldPasswordIsValid } = useValidPassword('');
  const { password: newPassword, setPassword: setNewPassword, passwordIsValid: newPasswordIsValid } = useValidPassword('');
  const isValid = !oldPasswordIsValid || !oldPassword.length || !newPasswordIsValid || !newPassword.length;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const changePassword = async () => {
    try {
      await authContext.changePassword?.(oldPassword, newPassword);
      setReset(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  const signOut = async () => {
    try {
      await authContext.signOut?.();
      navigate('/');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-surface via-water-foam/30 to-sand-light/40 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-blob shadow-bubble border-2 border-water-foam/50 p-8">
        <h2 className="font-display font-bold text-xl text-water-deep text-center mb-6">Change password</h2>
        {!reset ? (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Old password</span></label>
              <input type="password" className={inputClass} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">New password</span></label>
              <input type="password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            {error && <div className="alert alert-error rounded-bubble text-sm">{error}</div>}
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-bubble">Cancel</button>
              <button type="button" className="btn btn-primary rounded-bubble" disabled={isValid} onClick={changePassword}>
                Change password
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-water-mid">Password changed.</p>
            <button type="button" onClick={signOut} className="btn btn-primary rounded-bubble">Sign in</button>
          </div>
        )}
      </div>
    </div>
  );
}
