import type { Assignment, AssignmentProgressRow } from '../libs/apiEndpoints';

export type AssignmentStatus =
  | 'pending'
  | 'past_due'
  | 'completed'
  | 'late_completed';

interface DecoratedAssignment extends Assignment {
  _progress?: AssignmentProgressRow | null;
}

export function parseAssignmentStatus(
  raw: string | null | undefined
): AssignmentStatus | null {
  if (raw == null || String(raw).trim() === '') return null;
  const status = String(raw).trim().toLowerCase();
  if (
    status === 'pending' ||
    status === 'past_due' ||
    status === 'completed' ||
    status === 'late_completed'
  ) {
    return status;
  }
  return null;
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

/**
 * Prefer `my_status` from GET .../assignments/courses/{id} when set; otherwise infer from
 * `my_completed_at` / `_progress` and due date (other callers or older backends).
 */
export function resolveStudentAssignmentStatus(
  assignment: DecoratedAssignment
): AssignmentStatus {
  const fromApi = parseAssignmentStatus(assignment.my_status);
  if (fromApi != null) return fromApi;

  const row = assignment._progress;
  const progressStatus = parseAssignmentStatus(row?.status);
  if (progressStatus === 'completed' || progressStatus === 'late_completed') {
    return progressStatus;
  }

  if (
    assignment.my_completed_at != null &&
    String(assignment.my_completed_at).trim() !== ''
  ) {
    return 'completed';
  }

  const due = assignment.due_date;
  const overdueByCalendar = isPastDueByDueDate(due);

  if (progressStatus === 'past_due') {
    if (due != null && String(due).trim() !== '' && !overdueByCalendar) {
      return 'pending';
    }
    return 'past_due';
  }

  if (overdueByCalendar) return 'past_due';
  return 'pending';
}

export function getStatusBadgeClasses(status: string | null | undefined): string {
  const normalized = parseAssignmentStatus(status);
  // Use explicit HSL theme vars to guarantee visible colors in all themes/builds.
  if (normalized === 'completed') {
    return 'bg-[hsl(var(--su)/0.18)] text-[hsl(var(--su))] border-[hsl(var(--su)/0.45)]';
  }
  if (normalized === 'past_due') {
    return 'bg-[hsl(var(--wa)/0.2)] text-[hsl(var(--wa))] border-[hsl(var(--wa)/0.5)]';
  }
  if (normalized === 'pending') {
    return 'bg-[hsl(var(--s)/0.16)] text-[hsl(var(--s))] border-[hsl(var(--s)/0.45)]';
  }
  if (normalized === 'late_completed') {
    return 'bg-[#ffedd5] text-[#c2410c] border-[#fdba74]';
  }
  return 'bg-base-200 text-base-content border-base-300';
}

export function formatStatusLabel(status: string | null | undefined): string {
  const normalized = parseAssignmentStatus(status);
  if (normalized === 'late_completed') return 'Late Completed';
  if (normalized === 'past_due') return 'Past Due';
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'completed') return 'Completed';
  return 'Unknown';
}
