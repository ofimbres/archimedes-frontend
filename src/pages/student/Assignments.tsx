import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarTimes, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthContext } from '../../contexts/AuthContext';
import { getAssignmentsByCourse, getAssignmentProgress, type Assignment, type AssignmentProgressRow } from '../../libs/apiEndpoints';
import { StudentContext } from '../../contexts/StudentContext';

interface DecoratedAssignment extends Assignment {
  _progress?: AssignmentProgressRow | null;
}

const Assignments: React.FC = () => {
  const authContext = useContext(AuthContext);
  const studentContext = useContext(StudentContext);
  const accessToken = authContext.sessionInfo?.accessToken;

  const studentProfile = authContext.sessionInfo?.profile as { id?: string } | undefined;
  const studentId = authContext.sessionInfo?.user_type === 'students' ? studentProfile?.id : undefined;

  const [assignments, setAssignments] = useState<DecoratedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the currently selected course from the navbar dropdown, if any
  const currentCourseId = useMemo(
    () =>
      Array.isArray(studentContext.availablePeriods) &&
      studentContext.availablePeriods.length > 0 &&
      studentContext.availablePeriods[0]?.periodId
        ? (studentContext.availablePeriods[0].periodId as string)
        : undefined,
    [studentContext.availablePeriods]
  );

  useEffect(() => {
    if (!currentCourseId || !accessToken || !studentId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const list = await getAssignmentsByCourse(currentCourseId, accessToken);

        // For each assignment, fetch progress and pick the row for this student
        const withProgress: DecoratedAssignment[] = await Promise.all(
          (list ?? []).map(async (a) => {
            try {
              const rows = await getAssignmentProgress(a.id, accessToken);
              const myRow = rows.find((r) => r.student_id === studentId) ?? null;
              return { ...a, _progress: myRow };
            } catch {
              return { ...a, _progress: null };
            }
          })
        );

        setAssignments(withProgress);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [accessToken, currentCourseId, studentId]);

  const todayAssignments = assignments.filter((a) => a._progress?.status === 'pending');
  const pastDueAssignments = assignments.filter((a) => a._progress?.status === 'past_due');
  const completedAssignments = assignments.filter((a) => a._progress?.status === 'completed');

  const renderAssignmentList = (items: DecoratedAssignment[]) => {
    if (items.length === 0) {
      return <p className="text-base-content/70 text-sm">Nothing here yet.</p>;
    }

    return (
      <ul className="space-y-2">
        {items.map((a) => {
          const act = a.activity as { description?: string } | undefined;
          const title = (a.title_override as string | undefined) || act?.description || 'Assignment';
          const due = a.due_date
            ? new Date(a.due_date).toLocaleDateString(undefined, { dateStyle: 'medium' })
            : null;
          const status = a._progress?.status ?? 'pending';
          const score = a._progress?.score ?? null;
          const completedAt = a._progress?.completed_at ?? null;

          return (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-blob border-2 border-water-foam/50 bg-base-100 p-3 shadow-sm"
            >
              <div>
                <div className="font-medium text-water-deep">{title}</div>
                {due && (
                  <div className="text-xs text-base-content/70">
                    Due {due}
                  </div>
                )}
                {status === 'completed' && completedAt && (
                  <div className="text-xs text-success mt-1">
                    Completed {new Date(completedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {status === 'completed' && score != null && (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success text-sm font-semibold">
                    {score}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-water-mid">Loading assignments…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-bubble" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-2">Assignments</h1>
      <p className="text-center text-water-mid mb-8">
        Here&apos;s your activity overview for this course.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-primary">
                <FontAwesomeIcon icon={faCalendarDay} className="text-2xl" />
              </span>
              <h2 className="font-display font-semibold text-water-deep text-lg">Today&apos;s activities</h2>
            </div>
            <div className="text-base-content/80 text-sm mb-4">
              {renderAssignmentList(todayAssignments)}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-warning">
                <FontAwesomeIcon icon={faCalendarTimes} className="text-2xl" />
              </span>
              <h2 className="font-display font-semibold text-water-deep text-lg">Past due activities</h2>
            </div>
            <div className="text-base-content/80 text-sm">
              {renderAssignmentList(pastDueAssignments)}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-success">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl" />
              </span>
              <h2 className="font-display font-semibold text-water-deep text-lg">Completed activities</h2>
            </div>
            <div className="text-base-content/80 text-sm">
              {renderAssignmentList(completedAssignments)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;

