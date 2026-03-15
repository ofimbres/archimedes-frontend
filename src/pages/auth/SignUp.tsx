import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  useValidEmail,
  useValidPassword,
  useValidUsername,
  useValidGivenName,
  useValidFamilyName,
} from '../../hooks/UseAuthHooks';
import { AuthContext } from '../../contexts/AuthContext';

const inputClass = 'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-primary focus:outline-none';
const inputInvalidClass = 'input input-bordered input-error rounded-bubble border-2 w-full';

const SignUp: React.FC = () => {
  const { email, setEmail, emailIsValid } = useValidEmail('');
  const { password, setPassword, passwordIsValid } = useValidPassword('');
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const { givenName, setGivenName, givenNameIsValid } = useValidGivenName('');
  const { familyName, setFamilyName, familyNameIsValid } = useValidFamilyName('');
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    password: passwordConfirm,
    setPassword: setPasswordConfirm,
    passwordIsValid: passwordConfirmIsValid,
  } = useValidPassword('');

  const isValid =
    !emailIsValid || !usernameIsValid || !passwordIsValid || !passwordConfirmIsValid ||
    !givenNameIsValid || !familyNameIsValid || email.length === 0 || username.length === 0 ||
    password.length === 0 || passwordConfirm.length === 0 || givenName.length === 0 ||
    familyName.length === 0 || password !== passwordConfirm;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const clearError = () => setError('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authContext.signUpWithEmail!(givenName, familyName, username, email, password);
      setCreated(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message || 'Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-surface via-water-foam/30 to-sand-light/40 px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="text-water-mid hover:text-water-deep text-sm font-medium mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-base-100 rounded-blob shadow-bubble border-2 border-water-foam/50 p-8">
          <img src="archimedes-logo.jpg" alt="Archimedes Logo" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-md" />
          <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-1">Join Archimedes!</h1>
          <p className="text-water-mid text-center text-sm mb-6">
            Create your account. You&apos;ll set up your role and school after verifying your email.
          </p>

          {!created ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <div className="alert alert-error rounded-bubble text-sm">
                  <span><strong>Oops!</strong> {error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-water-deep">First name</span></label>
                  <input type="text" placeholder="First name" value={givenName} onChange={(e) => { setGivenName(e.target.value); clearError(); }} disabled={isLoading}
                    className={!givenNameIsValid && givenName ? inputInvalidClass : inputClass} />
                  {!givenNameIsValid && givenName && <p className="text-error text-xs mt-1">Enter a valid first name</p>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-water-deep">Last name</span></label>
                  <input type="text" placeholder="Last name" value={familyName} onChange={(e) => { setFamilyName(e.target.value); clearError(); }} disabled={isLoading}
                    className={!familyNameIsValid && familyName ? inputInvalidClass : inputClass} />
                  {!familyNameIsValid && familyName && <p className="text-error text-xs mt-1">Enter a valid last name</p>}
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-water-deep">Email</span></label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} disabled={isLoading}
                  className={!emailIsValid && email ? inputInvalidClass : inputClass} />
                {!emailIsValid && email && <p className="text-error text-xs mt-1">Enter a valid email</p>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-water-deep">Username</span></label>
                <input type="text" placeholder="Choose a username" value={username} onChange={(e) => { setUsername(e.target.value); clearError(); }} disabled={isLoading}
                  className={!usernameIsValid && username ? inputInvalidClass : inputClass} />
                {!usernameIsValid && username && <p className="text-error text-xs mt-1">At least 3 characters</p>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-water-deep">Password</span></label>
                <input type="password" placeholder="Create a password" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} disabled={isLoading}
                  className={!passwordIsValid && password ? inputInvalidClass : inputClass} />
                {!passwordIsValid && password && <p className="text-error text-xs mt-1">8+ chars, upper, lower, number</p>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-water-deep">Confirm password</span></label>
                <input type="password" placeholder="Confirm password" value={passwordConfirm} onChange={(e) => { setPasswordConfirm(e.target.value); clearError(); }} disabled={isLoading}
                  className={password !== passwordConfirm && passwordConfirm ? inputInvalidClass : inputClass} />
                {password !== passwordConfirm && passwordConfirm && <p className="text-error text-xs mt-1">Passwords don&apos;t match</p>}
              </div>

              <button type="submit" disabled={isValid || isLoading}
                className="btn btn-primary w-full rounded-bubble shadow-bubble btn-bouncy hover:shadow-bubble-hover font-display font-semibold">
                {isLoading ? 'Creating account…' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-4xl">🎉</p>
              <h2 className="font-display font-bold text-xl text-water-deep">Welcome aboard, {givenName}!</h2>
              <p className="text-water-mid text-sm">
                Your account has been created. We&apos;ve sent a verification code to <strong>{email}</strong>
              </p>
              <p className="text-water-mid text-xs">After verifying, you&apos;ll sign in and complete your profile (role and school).</p>
              <button type="button" onClick={() => navigate('/verify')} className="btn btn-primary rounded-bubble btn-bouncy font-display font-semibold">
                Verify Email
              </button>
            </div>
          )}

          <p className="text-center mt-4 text-sm text-water-mid">
            Already have an account? <Link to="/signin" className="link link-primary font-medium hover:text-water-deep">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
