import {
  formatStatusLabel,
  getStatusBadgeClasses,
  parseAssignmentStatus,
  resolveStudentAssignmentStatus,
} from './assignmentStatus';

describe('assignmentStatus helpers', () => {
  it('parses late_completed status', () => {
    expect(parseAssignmentStatus('late_completed')).toBe('late_completed');
  });

  it('resolves late_completed from API status directly', () => {
    const status = resolveStudentAssignmentStatus({
      id: 'a1',
      course_id: 'c1',
      activity_id: 'act1',
      teacher_id: 't1',
      my_status: 'late_completed',
    });

    expect(status).toBe('late_completed');
  });

  it('maps late_completed to error badge style', () => {
    expect(getStatusBadgeClasses('late_completed')).toContain('text-error');
  });

  it('formats late_completed label for UI', () => {
    expect(formatStatusLabel('late_completed')).toBe('Late Completed');
  });
});
