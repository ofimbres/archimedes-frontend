import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faCalendarTimes,
  faCalendarCheck,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthContext } from '../../contexts/AuthContext';
import { getAssignmentsByCourse, type Assignment, type AssignmentProgressRow } from '../../libs/apiEndpoints';
import { StudentContext } from '../../contexts/StudentContext';
import { buildAssignmentLaunchUrl, getArchimedesApiOriginFromEnv } from '../../utils/assignmentLaunchUrl';
import type { StudentProfile } from '../../types/auth';

interface DecoratedAssignment extends Assignment {
  _progress?: AssignmentProgressRow | null;
}

/**
 * True if current time is after the end of the due calendar day (UTC date parts from ISO string).
 * Matches "due on Mar 21" as not past due until after Mar 21 23:59:59.999 UTC.
 */
function isPastDueByDueDate(dueDateIso: string | undefined): boolean {
  if (dueDateIso == null || String(dueDateIso).trim() === '') return false;
  const d = new Date(dueDateIso);
  if (Number.isNaN(d.getTime())) return false;
  const endOfDueDayUtc = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    23,
    59,
    59,
    999
  );
  return Date.now() > endOfDueDayUtc;
}

/** Backend: enrolled students get `completed` | `past_due` | `pending`; teachers/admins get null. */
function formatStudentDisplayName(profile: StudentProfile | null | undefined): string {
  if (!profile) return '';
  const fromParts = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim();
  if (fromParts !== '') return fromParts;
  return String(profile.full_name ?? '').trim();
}

function parseMyStatus(
  raw: string | null | undefined
): 'pending' | 'past_due' | 'completed' | null {
  if (raw == null || String(raw).trim() === '') return null;
  const s = String(raw).trim().toLowerCase();
  if (s === 'completed' || s === 'past_due' || s === 'pending') return s;
  return null;
}

/**
 * Prefer `my_status` from GET .../assignments/courses/{id} when set; otherwise infer from
 * `my_completed_at` / `_progress` and due date (other callers or older backends).
 */
function resolveStudentAssignmentStatus(a: DecoratedAssignment): 'pending' | 'past_due' | 'completed' {
  const fromApi = parseMyStatus((a as Assignment).my_status);
  if (fromApi != null) return fromApi;

  const row = a._progress;
  if (row?.status === 'completed') return 'completed';
  const mine = a as { my_completed_at?: string | null };
  if (mine.my_completed_at != null && String(mine.my_completed_at).trim() !== '') {
    return 'completed';
  }

  const due = a.due_date;
  const overdueByCalendar = isPastDueByDueDate(due);

  if (row?.status === 'past_due') {
    if (due != null && String(due).trim() !== '' && !overdueByCalendar) {
      return 'pending';
    }
    return 'past_due';
  }

  if (overdueByCalendar) return 'past_due';
  return 'pending';
}

const Assignments: React.FC = () => {
  const authContext = useContext(AuthContext);
  const studentContext = useContext(StudentContext);
  const accessToken = authContext.sessionInfo?.accessToken;
  const idToken = authContext.sessionInfo?.idToken;

  const studentProfile =
    authContext.sessionInfo?.user_type === 'students'
      ? (authContext.sessionInfo?.profile as StudentProfile | null | undefined)
      : undefined;
  const studentId = studentProfile?.id;
  const [assignments, setAssignments] = useState<DecoratedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

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

  const loadAssignments = useCallback(async () => {
    if (!currentCourseId || !accessToken || !studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const list = await getAssignmentsByCourse(currentCourseId, accessToken, idToken);

      // Do not call GET .../assignments/{id}/progress here — backend is teacher/admin-only.
      // Use `my_status`, `my_completed_at`, `my_score` from the list (student rows).
      const withProgress: DecoratedAssignment[] = (list ?? []).map((a) => {
        const mine = a as Assignment;
        const st = parseMyStatus(mine.my_status);
        let myRow: AssignmentProgressRow | null = null;
        const completedAtRaw =
          mine.my_completed_at != null && String(mine.my_completed_at).trim() !== ''
            ? String(mine.my_completed_at).trim()
            : null;
        if (completedAtRaw != null || st === 'completed') {
          myRow = {
            student_id: studentId,
            status: 'completed',
            score: mine.my_score ?? null,
            completed_at: completedAtRaw,
          };
        } else if (st === 'past_due' || st === 'pending') {
          myRow = {
            student_id: studentId,
            status: st,
            score: mine.my_score ?? null,
            completed_at: null,
          };
        }
        return { ...a, _progress: myRow };
      });

      setAssignments(withProgress);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [accessToken, idToken, currentCourseId, studentId]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments, refreshNonce]);

  const tabWasHiddenRef = useRef(document.visibilityState === 'hidden');
  useEffect(() => {
    const onVisibility = () => {
      const hidden = document.visibilityState === 'hidden';
      if (!hidden && tabWasHiddenRef.current) {
        setRefreshNonce((n) => n + 1);
      }
      tabWasHiddenRef.current = hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const todayAssignments = assignments.filter((a) => resolveStudentAssignmentStatus(a) === 'pending');
  const pastDueAssignments = assignments.filter((a) => resolveStudentAssignmentStatus(a) === 'past_due');
  const completedAssignments = assignments.filter((a) => resolveStudentAssignmentStatus(a) === 'completed');

  const renderAssignmentList = (items: DecoratedAssignment[]) => {
    if (items.length === 0) {
      return <p className="text-base-content/70 text-sm">Nothing here yet.</p>;
    }

    return (
      <ul className="space-y-2">
        {items.map((a) => {
          const act = a.activity as { description?: string; content_url?: string } | undefined;
          const title = (a.title_override as string | undefined) || act?.description || 'Assignment';
          const contentUrl = act?.content_url;
          const activityId = a.activity_id;
          const due = a.due_date
            ? new Date(a.due_date).toLocaleDateString(undefined, { dateStyle: 'medium' })
            : null;
          const status = resolveStudentAssignmentStatus(a);
          const mine = a as { my_score?: number | null };
          const score = a._progress?.score ?? mine.my_score ?? null;
          const completedAt = a._progress?.completed_at ?? null;

          const sessionBearer = (idToken ?? accessToken ?? '').trim();
          const apiOrigin = getArchimedesApiOriginFromEnv();
          const studentName = formatStudentDisplayName(studentProfile);
          const launchUrl =
            contentUrl && studentId && sessionBearer && apiOrigin
              ? buildAssignmentLaunchUrl(contentUrl, {
                  studentId,
                  studentName: studentName || undefined,
                  assignmentId: a.id,
                  activityId,
                  sessionBearerToken: sessionBearer,
                  hashUsesIdToken: Boolean(idToken?.trim()),
                })
              : null;

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
              <div className="flex flex-wrap items-center gap-2">
                {launchUrl && (
                  <a
                    href={launchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary gap-1 rounded-bubble"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                    Open
                  </a>
                )}
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
      <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-2">Welcome back!</h1>
      <p className="text-center text-water-mid mb-8">
        Here&apos;s your activity overview for today.
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

