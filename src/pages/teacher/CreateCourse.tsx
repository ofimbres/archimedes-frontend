import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { createCourse, CourseLimitError, type CreateCourseBody } from '../../libs/apiEndpoints';

const inputClass =
  'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none';

/** Extract max class count from backend message e.g. "Course limit reached (maximum 6 classes for your plan)" */
function parseMaxClassesFromMessage(message: string): number {
  const match = message.match(/maximum\s+(\d+)\s+classes?/i);
  return match ? parseInt(match[1], 10) : 6;
}

const CreateCourse: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const accessToken = authContext.sessionInfo?.accessToken;
  const teacherId =
    authContext.sessionInfo?.user_type === 'teachers' &&
    authContext.sessionInfo?.profile &&
    'id' in authContext.sessionInfo.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : null;

  const [class_name, setClassName] = useState('');
  const [error, setError] = useState('');
  const [courseLimitReached, setCourseLimitReached] = useState(false);
  const [maxClasses, setMaxClasses] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    !!teacherId &&
    !!accessToken &&
    class_name.trim().length >= 1 &&
    class_name.trim().length <= 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !accessToken || !teacherId) return;
    setIsSubmitting(true);
    setError('');
    setCourseLimitReached(false);
    const body: CreateCourseBody = {
      class_name: class_name.trim(),
      teacher_id: teacherId,
      subject: 'General',
    };
    try {
      await createCourse(body, accessToken);
      navigate('/');
    } catch (err) {
      if (err instanceof CourseLimitError) {
        setCourseLimitReached(true);
        setMaxClasses(parseMaxClassesFromMessage(err.message));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create course. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teacherId || !accessToken) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-bubble">You must be signed in as a teacher to create a course.</div>
        <Link to="/" className="btn btn-primary mt-4 rounded-bubble">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div style={{ paddingBottom: '1rem' }}>
        <Link to="/" className="text-water-mid hover:text-water-deep text-sm font-medium">
          ← Back to Home
        </Link>
      </div>
      <div className="bg-base-100 rounded-blob shadow-bubble border-2 border-water-foam/50 p-6">
        <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-1">Create a course</h1>
        <p className="text-water-mid text-center text-sm mb-6">
          Add a new course. Students can join using the join code after you create it.
        </p>

        {error && (
          <div className="alert alert-error rounded-bubble text-sm mb-4">
            <span>{error}</span>
          </div>
        )}

        {courseLimitReached && (
          <div className="alert alert-warning rounded-bubble text-sm mb-4" role="alert">
            <p className="font-medium">
              You&apos;ve reached the maximum number of classes for your plan ({maxClasses}). Upgrade to add more.
            </p>
            <Link to="/upgrade" className="link link-hover mt-2 inline-block font-medium">
              Upgrade plan →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="class_name" className="label">
              <span className="label-text font-medium">Course name</span>
            </label>
            <input
              id="class_name"
              type="text"
              className={inputClass}
              placeholder="e.g. Algebra I"
              value={class_name}
              onChange={(e) => setClassName(e.target.value)}
              maxLength={100}
              required
            />
            <span className="label-text-alt text-base-content/60">{class_name.length}/100</span>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="btn btn-primary rounded-bubble flex-1"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Creating…' : 'Create course'}
            </button>
            <Link to="/" className="btn btn-outline rounded-bubble">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
