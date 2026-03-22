import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getAssignmentProgress, type AssignmentProgressRow } from '../../libs/apiEndpoints';

const AssignmentProgress: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const accessToken = authContext.sessionInfo?.accessToken;
  const idToken = authContext.sessionInfo?.idToken;
  const courseName = (location.state as { courseName?: string } | null)?.courseName ?? 'Course';
  const assignmentTitle = (location.state as { assignmentTitle?: string } | null)?.assignmentTitle ?? 'Assignment';

  const [rows, setRows] = useState<AssignmentProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId || !accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getAssignmentProgress(assignmentId, accessToken, idToken)
      .then((list) => setRows(list ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load assignment progress'))
      .finally(() => setLoading(false));
  }, [assignmentId, accessToken, idToken]);

  if (!courseId || !assignmentId) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <p className="text-error">Missing course or assignment.</p>
        <Link to="/teacher/courses" className="btn btn-primary mt-4 rounded-bubble">Back to courses</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-water-mid">Loading completions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-bubble" role="alert">{error}</div>
        <Link to={`/teacher/courses/${courseId}/roster`} state={{ courseName }} className="btn btn-primary mt-4 rounded-bubble">
          Back to roster
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/teacher/courses/${courseId}/roster`}
          state={{ courseName }}
          className="text-water-mid hover:text-water-deep text-sm font-medium"
        >
          ← Back to {courseName}
        </Link>
      </div>
      <h1 className="font-display font-bold text-2xl text-water-deep mb-1">Progress · {assignmentTitle}</h1>
      <p className="text-water-mid text-sm mb-6">
        Students and their assignment status.
      </p>

      {rows.length === 0 ? (
        <div className="rounded-blob border-2 border-water-foam/50 bg-base-100 p-6 shadow-sm">
          <p className="text-base-content/70 text-sm">No students found for this assignment yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-blob border-2 border-water-foam/50 bg-base-100 shadow-bubble">
          <table className="table">
            <thead>
              <tr className="text-water-deep border-b border-water-foam/50">
                <th className="font-display font-semibold">Student</th>
                <th className="font-display font-semibold">Status</th>
                <th className="font-display font-semibold">Score</th>
                <th className="font-display font-semibold">Completed at</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const rawStatus = row.status ?? '';
                const status = rawStatus.toLowerCase();
                const statusClass =
                  status === 'completed'
                    ? 'bg-success/10 text-success border-success/40'
                    : status === 'pending'
                      ? 'bg-warning/10 text-warning border-warning/40'
                      : status === 'past_due'
                        ? 'bg-neutral/10 text-neutral border-neutral/40'
                        : 'bg-base-200 text-base-content border-base-300';
                return (
                  <tr key={row.student_id} className="border-b border-base-300/50">
                    <td>{row.student_name ?? row.student_id ?? '—'}</td>
                    <td>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClass}`}>
                        {(rawStatus || 'unknown').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {row.score != null ? (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-sm font-semibold">
                          {row.score}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {row.completed_at
                        ? new Date(row.completed_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentProgress;
