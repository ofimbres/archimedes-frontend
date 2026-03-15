import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthContext } from '../../contexts/AuthContext';
import {
  getCourseEnrollments,
  deleteStudentEnrollment,
  postStudentEnrollment,
  type CourseEnrollment,
} from '../../libs/apiEndpoints';

const CourseRoster: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const accessToken = authContext.sessionInfo?.accessToken;
  const courseName = (location.state as { courseName?: string } | null)?.courseName ?? 'Course';

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addStudentId, setAddStudentId] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchRoster = useCallback(() => {
    if (!courseId || !accessToken) return;
    setLoading(true);
    setError(null);
    getCourseEnrollments(courseId, accessToken)
      .then((res) => setEnrollments(res.items ?? res.enrollments ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load roster'))
      .finally(() => setLoading(false));
  }, [courseId, accessToken]);

  useEffect(() => {
    if (!courseId || !accessToken) {
      setLoading(false);
      return;
    }
    fetchRoster();
  }, [courseId, accessToken, fetchRoster]);

  const handleRemove = async (studentId: string) => {
    if (!courseId || !accessToken || !window.confirm('Remove this student from the course?')) return;
    setRemovingId(studentId);
    try {
      await deleteStudentEnrollment(studentId, courseId, accessToken);
      setEnrollments((prev) => prev.filter((e) => e.student_id !== studentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove student');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddStudent = async () => {
    const id = addStudentId.trim();
    if (!id || !courseId || !accessToken) return;
    setAddError(null);
    setAddLoading(true);
    try {
      await postStudentEnrollment(id, courseId, accessToken);
      setAddStudentId('');
      fetchRoster();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add student');
    } finally {
      setAddLoading(false);
    }
  };

  if (!courseId) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <p className="text-error">Missing course.</p>
        <Link to="/" className="btn btn-primary mt-4 rounded-bubble">Back to Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-water-mid">Loading roster…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-bubble" role="alert">{error}</div>
        <Link to="/" className="btn btn-primary mt-4 rounded-bubble">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div style={{ paddingBottom: '1rem' }}>
        <Link to="/" className="text-water-mid hover:text-water-deep text-sm font-medium">
          ← Back to Home
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-water-deep mb-1">
            Students · {courseName}
          </h1>
          <p className="text-water-mid text-sm">
            Enrolled students in this course (roster).
          </p>
        </div>
        <Link
          to={`/teacher/courses/${courseId}/assignments/new`}
          state={{ courseName }}
          className="btn btn-primary rounded-bubble"
        >
          Create assignment
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-6">
        <span className="font-display font-semibold text-water-deep">Add student</span>
        <input
          type="text"
          className="input input-bordered rounded-bubble border-2 border-water-foam flex-1 min-w-[160px]"
          placeholder="Student ID"
          value={addStudentId}
          onChange={(e) => setAddStudentId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
        />
        <button
          type="button"
          className="btn btn-primary rounded-bubble gap-2"
          onClick={handleAddStudent}
          disabled={!addStudentId.trim() || addLoading}
        >
          <FontAwesomeIcon icon={faUserPlus} />
          {addLoading ? 'Adding…' : 'Add'}
        </button>
      </div>
      {addError && (
        <div className="alert alert-warning rounded-bubble mb-6" role="alert">
          {addError}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="alert alert-info rounded-bubble">
          No students enrolled yet. Share the join code so students can join.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-blob border-2 border-water-foam/50 bg-base-100 shadow-bubble">
          <table className="table">
            <thead>
              <tr className="text-water-deep border-b border-water-foam/50">
                <th className="font-display font-semibold">Name</th>
                <th className="font-display font-semibold">Email</th>
                <th className="font-display font-semibold">Status</th>
                <th className="font-display font-semibold">Enrolled at</th>
                <th className="font-display font-semibold w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((row) => (
                <tr key={row.id} className="border-b border-base-300/50">
                  <td>{row.student_name ?? '—'}</td>
                  <td>{row.student_email ?? '—'}</td>
                  <td>{row.enrollment_status ?? '—'}</td>
                  <td>{row.enrolled_at ? new Date(row.enrolled_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                      onClick={() => handleRemove(row.student_id)}
                      disabled={removingId === row.student_id}
                      title="Remove from course"
                      aria-label={`Remove ${row.student_name ?? row.student_id} from course`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseRoster;
