import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {
  getTeacherCourses,
  getTeacherCourseAssignments,
  getAssignmentProgress,
  getCourseDisplayName,
  type Assignment,
  type AssignmentProgressRow,
  type TeacherCourse,
} from '../../libs/apiEndpoints';
import { SCORE_THRESHOLDS } from '../../constants';
import { formatStatusLabel, getStatusBadgeClasses } from '../../utils/assignmentStatus';

const STATUS_OPTIONS = ['pending', 'completed', 'past_due', 'late_completed'] as const;

type StudentReportRow = AssignmentProgressRow & {
  assignment_id: string;
  assignment_title: string;
};

function assignmentTitle(assignment: Assignment): string {
  const activity = assignment.activity as { description?: string } | undefined;
  return (assignment.title_override as string | undefined) || activity?.description || `Assignment ${assignment.id.slice(0, 8)}`;
}

function getPassLabel(score?: number | null): 'Pass' | 'Not pass' | 'No score' {
  if (score == null) return 'No score';
  return score >= SCORE_THRESHOLDS.FAIR ? 'Pass' : 'Not pass';
}

function passBadgeClass(score?: number | null): string {
  if (score == null) return 'bg-base-200 text-base-content/70 border-base-300';
  return score >= SCORE_THRESHOLDS.FAIR
    ? 'bg-[hsl(var(--su)/0.18)] text-[hsl(var(--su))] border-[hsl(var(--su)/0.45)]'
    : 'bg-[hsl(var(--er)/0.18)] text-[hsl(var(--er))] border-[hsl(var(--er)/0.45)]';
}

function passBadgeClassFromRow(row: AssignmentProgressRow): string {
  if (typeof row.passed === 'boolean') {
    return row.passed
      ? 'bg-[hsl(var(--su)/0.18)] text-[hsl(var(--su))] border-[hsl(var(--su)/0.45)]'
      : 'bg-[hsl(var(--er)/0.18)] text-[hsl(var(--er))] border-[hsl(var(--er)/0.45)]';
  }
  return passBadgeClass(row.score);
}

function getPassLabelFromRow(row: AssignmentProgressRow): 'Pass' | 'Not pass' | 'No score' {
  if (typeof row.passed === 'boolean') {
    return row.passed ? 'Pass' : 'Not pass';
  }
  return getPassLabel(row.score);
}

const ReportsByStudent: React.FC = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const accessToken = authContext.sessionInfo?.accessToken;
  const idToken = authContext.sessionInfo?.idToken;
  const teacherId =
    authContext.sessionInfo?.user_type === 'teachers' &&
    authContext.sessionInfo?.profile &&
    'id' in authContext.sessionInfo.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : null;

  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [rows, setRows] = useState<StudentReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId || !accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getTeacherCourses(teacherId, accessToken, idToken)
      .then((res) => {
        const items = res.items ?? [];
        setCourses(items);
        const queryCourseId = new URLSearchParams(location.search).get('courseId');
        const preferredCourseId = items.some((course) => course.id === queryCourseId)
          ? queryCourseId
          : items[0]?.id ?? '';
        setSelectedCourseId(preferredCourseId ?? '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load courses'))
      .finally(() => setLoading(false));
  }, [teacherId, accessToken, idToken, location.search]);

  useEffect(() => {
    if (!teacherId || !selectedCourseId || !accessToken) {
      setAssignments([]);
      setSelectedAssignmentId('');
      return;
    }
    setError(null);
    getTeacherCourseAssignments(teacherId, selectedCourseId, accessToken, idToken)
      .then((list) => {
        setAssignments(list ?? []);
        setSelectedAssignmentId('');
      })
      .catch((err) => {
        setAssignments([]);
        setError(err instanceof Error ? err.message : 'Failed to load assignments');
      });
  }, [teacherId, selectedCourseId, accessToken, idToken]);

  useEffect(() => {
    if (!accessToken || !selectedCourseId) {
      setRows([]);
      return;
    }
    setLoadingRows(true);
    setError(null);
    const statusFilter = selectedStatus || undefined;
    const targetAssignments = selectedAssignmentId
      ? assignments.filter((assignment) => assignment.id === selectedAssignmentId)
      : assignments;

    if (targetAssignments.length === 0) {
      setRows([]);
      setLoadingRows(false);
      return;
    }

    Promise.all(
      targetAssignments.map(async (assignment) => {
        const progressRows = await getAssignmentProgress(
          assignment.id,
          accessToken,
          idToken,
          statusFilter ? { status: statusFilter } : undefined
        );
        const title = assignmentTitle(assignment);
        return progressRows.map((row) => ({
          ...row,
          assignment_id: assignment.id,
          assignment_title: title,
        }));
      })
    )
      .then((chunks) => setRows(chunks.flat()))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load report'))
      .finally(() => setLoadingRows(false));
  }, [assignments, selectedAssignmentId, selectedStatus, selectedCourseId, accessToken, idToken]);

  const selectedCourseName = useMemo(() => {
    const course = courses.find((item) => item.id === selectedCourseId);
    return course ? getCourseDisplayName(course) : 'Group';
  }, [courses, selectedCourseId]);

  const studentTotals = useMemo(() => {
    const totals = new Map<string, { name: string; pass: number; notPass: number; noScore: number }>();
    rows.forEach((row) => {
      const id = row.student_id;
      const existing = totals.get(id) ?? {
        name: row.student_name ?? id,
        pass: 0,
        notPass: 0,
        noScore: 0,
      };
      if (row.score == null) {
        existing.noScore += 1;
      } else if (row.score >= SCORE_THRESHOLDS.FAIR) {
        existing.pass += 1;
      } else {
        existing.notPass += 1;
      }
      totals.set(id, existing);
    });
    return Array.from(totals.entries()).map(([id, value]) => ({ studentId: id, ...value }));
  }, [rows]);

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-water-mid">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          to={selectedCourseId ? `/?courseId=${encodeURIComponent(selectedCourseId)}` : '/'}
          className="text-water-mid hover:text-water-deep text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      <h1 className="font-display font-bold text-2xl text-water-deep mb-1">Reports · Report By Student</h1>
      <p className="text-water-mid text-sm mb-6">
        Student-centered view for {selectedCourseName}. Use the Courses menu in the navbar to switch groups.
      </p>

      {error && <div className="alert alert-warning rounded-bubble mb-4">{error}</div>}

      <div className="rounded-blob border-2 border-water-foam/50 bg-base-100 p-4 shadow-sm mb-6 grid gap-3 md:grid-cols-2">
        <label className="form-control">
          <span className="label-text text-sm mb-1">Assignment</span>
          <select
            className="select select-bordered"
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            disabled={assignments.length === 0}
          >
            <option value="">All assignments</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignmentTitle(assignment)}
              </option>
            ))}
          </select>
        </label>
        <label className="form-control">
          <span className="label-text text-sm mb-1">Status</span>
          <select
            className="select select-bordered"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!selectedCourseId ? (
        <div className="rounded-blob border-2 border-warning/40 bg-warning/10 p-4 shadow-sm mb-6">
          <p className="text-sm text-warning-content">
            No course selected. Choose one from the Courses dropdown in the navbar.
          </p>
        </div>
      ) : null}

      {studentTotals.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 mb-6">
          {studentTotals.map((item) => (
            <div key={item.studentId} className="rounded-blob border-2 border-water-foam/50 bg-base-100 p-4 shadow-sm">
              <h3 className="font-semibold text-water-deep">{item.name}</h3>
              <p className="text-sm text-base-content/70">
                Pass: {item.pass} · Not pass: {item.notPass} · No score: {item.noScore}
              </p>
            </div>
          ))}
        </div>
      )}

      {loadingRows ? (
        <p className="text-water-mid text-sm">Loading rows...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-blob border-2 border-water-foam/50 bg-base-100 p-6 shadow-sm">
          <p className="text-base-content/70 text-sm">No matching report rows.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-blob border-2 border-water-foam/50 bg-base-100 shadow-bubble">
          <table className="table">
            <thead>
              <tr className="text-water-deep border-b border-water-foam/50">
                <th className="font-display font-semibold">Student</th>
                <th className="font-display font-semibold">Assignment</th>
                <th className="font-display font-semibold">Status</th>
                <th className="font-display font-semibold">Score</th>
                <th className="font-display font-semibold">Pass</th>
                <th className="font-display font-semibold">Completed at</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.assignment_id}-${row.student_id}`} className="border-b border-base-300/50">
                  <td>{row.student_name ?? row.student_id}</td>
                  <td>{row.assignment_title}</td>
                  <td>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusBadgeClasses(row.status ?? '')}`}>
                      {formatStatusLabel(row.status ?? '')}
                    </span>
                  </td>
                  <td>{row.score != null ? row.score : '—'}</td>
                  <td>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${passBadgeClassFromRow(row)}`}>
                      {getPassLabelFromRow(row)}
                    </span>
                  </td>
                  <td>{row.completed_at ? new Date(row.completed_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsByStudent;
