import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getSchools, type School } from '../../libs/authApi';
import type { CompleteProfileBody } from '../../types/auth';

const inputClass = 'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none';
const selectClass = 'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none bg-white';

const CompleteProfile: React.FC = () => {
  const [role, setRole] = useState<'students' | 'teachers' | ''>('');
  const [joinCode, setJoinCode] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const accessToken = authContext.sessionInfo?.accessToken;

  useEffect(() => {
    if (!role || !accessToken) return;
    setSchoolsLoading(true);
    setSchoolsError('');
    getSchools(accessToken)
      .then((res) => setSchools(res.schools ?? []))
      .catch((err) => setSchoolsError(err instanceof Error ? err.message : 'Failed to load schools'))
      .finally(() => setSchoolsLoading(false));
  }, [role, accessToken]);

  const canSubmit =
    role === 'students'
      ? (joinCode.trim() !== '' && schoolId.trim() === '') || (joinCode.trim() === '' && schoolId.trim() !== '')
      : role === 'teachers' && schoolId.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !authContext.completeProfile) return;
    setIsLoading(true);
    setError('');
    try {
      let body: CompleteProfileBody;
      if (role === 'students') {
        body = joinCode.trim()
          ? { userType: 'students', joinCode: joinCode.trim() }
          : { userType: 'students', schoolId: schoolId.trim() };
      } else {
        body = { userType: 'teachers', schoolId: schoolId.trim() };
      }
      await authContext.completeProfile(body);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
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
          <img src="archimedes-logo.jpg" alt="Archimedes Logo" className="block w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-md" />
          <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-1">Complete your profile</h1>
          <p className="text-water-mid text-center text-sm mb-6">Tell us who you are so we can set up your experience</p>

          {error && (
            <div className="alert alert-error rounded-bubble text-sm mb-4">
              <span>{error}</span>
            </div>
          )}

          {!role ? (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-lg text-water-deep text-center">I am a…</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setRole('students')}
                  className="btn rounded-bubble border-2 border-teal-mid text-teal-deep bg-teal-light/20 hover:bg-teal-light/40 btn-bouncy font-display font-semibold px-8"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teachers')}
                  className="btn btn-primary rounded-bubble border-2 border-water-mid btn-bouncy font-display font-semibold px-8"
                >
                  Teacher
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'students' && (
                <>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium text-water-deep">Class join code (from your teacher)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. AB12X"
                      value={joinCode}
                      onChange={(e) => { setJoinCode(e.target.value); if (e.target.value.trim()) setSchoolId(''); setError(''); }}
                      disabled={isLoading}
                      className={inputClass}
                    />
                  </div>
                  <p className="text-center text-water-mid text-sm">— or —</p>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-medium text-water-deep">School</span></label>
                    <select
                      value={schoolId}
                      onChange={(e) => { setSchoolId(e.target.value); if (e.target.value) setJoinCode(''); setError(''); }}
                      disabled={isLoading || schoolsLoading}
                      className={selectClass}
                    >
                      <option value="">Select a school</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}{s.code ? ` (${s.code})` : ''}
                        </option>
                      ))}
                    </select>
                    {schoolsLoading && <p className="text-water-mid text-sm mt-1">Loading schools…</p>}
                    {schoolsError && <p className="text-error text-sm mt-1">{schoolsError}</p>}
                  </div>
                </>
              )}
              {role === 'teachers' && (
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium text-water-deep">School</span></label>
                  <select
                    value={schoolId}
                    onChange={(e) => { setSchoolId(e.target.value); setError(''); }}
                    disabled={isLoading || schoolsLoading}
                    className={selectClass}
                  >
                    <option value="">Select a school</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}{s.code ? ` (${s.code})` : ''}
                      </option>
                    ))}
                  </select>
                  {schoolsLoading && <p className="text-water-mid text-sm mt-1">Loading schools…</p>}
                  {schoolsError && <p className="text-error text-sm mt-1">{schoolsError}</p>}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setRole(''); setJoinCode(''); setSchoolId(''); setError(''); }}
                  disabled={isLoading}
                  className="btn btn-ghost rounded-bubble flex-1"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="btn btn-primary rounded-bubble btn-bouncy font-display font-semibold flex-1"
                >
                  {isLoading ? 'Saving…' : 'Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
