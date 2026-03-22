import { BACKEND_API_BASE_URL } from '../utils/backendApiBaseUrl';

const API_BASE_URL = BACKEND_API_BASE_URL;

// API endpoint generators
const API_ENDPOINTS = {
  // Student enrollment: join a class by join_code
  POST_STUDENT_ENROLLMENT: () => `${API_BASE_URL}/api/v1/enrollments/join`,
  DELETE_STUDENT_ENROLLMENT: (studentId: string, periodId: string) =>
    `${API_BASE_URL}/api/v1/periods/${periodId}/students/${studentId}/enrollments`,
  // Student enrollments (active only)
  GET_STUDENT_PERIODS: (studentId: string) =>
    `${API_BASE_URL}/api/v1/enrollments/student/${studentId}`,
  GET_ACTIVITY_RESULTS: () => `${API_BASE_URL}/api/v1/exerciseresults/`,
  GET_TEACHER_COURSES: (teacherId: string) =>
    `${API_BASE_URL}/api/v1/courses/teacher/${teacherId}`,
  POST_COURSE: () => `${API_BASE_URL}/api/v1/courses/`,
  GET_COURSE_ENROLLMENTS: (courseId: string) =>
    `${API_BASE_URL}/api/v1/enrollments/course/${courseId}`,
  GET_ACTIVITIES_TOPICS: () => `${API_BASE_URL}/api/v1/activities/topics`,
  GET_ACTIVITIES: (params?: { topic?: string; subtopic?: string; activity_type?: string }) => {
    const url = new URL(`${API_BASE_URL}/api/v1/activities`);
    if (params?.topic) url.searchParams.set('topic', params.topic);
    if (params?.subtopic) url.searchParams.set('subtopic', params.subtopic);
    if (params?.activity_type) url.searchParams.set('activity_type', params.activity_type);
    return url.toString();
  },
  GET_ACTIVITY: (activityId: string) => `${API_BASE_URL}/api/v1/activities/${activityId}`,
  POST_ASSIGNMENT: () => `${API_BASE_URL}/api/v1/assignments`,
  GET_ASSIGNMENTS_BY_COURSE: (courseId: string) =>
    `${API_BASE_URL}/api/v1/assignments/courses/${courseId}`,
  GET_TEACHER_COURSE_ASSIGNMENTS: (teacherId: string, courseId: string) =>
    `${API_BASE_URL}/api/v1/teachers/${teacherId}/courses/${courseId}/assignments`,
  GET_ASSIGNMENT_COMPLETIONS: (assignmentId: string) =>
    `${API_BASE_URL}/api/v1/assignments/${assignmentId}/completions`,
  GET_ASSIGNMENT_PROGRESS: (assignmentId: string) =>
    `${API_BASE_URL}/api/v1/assignments/${assignmentId}/progress`,
  POST_ASSIGNMENT_COMPLETION: (assignmentId: string) =>
    `${API_BASE_URL}/api/v1/assignments/${assignmentId}/completions`,
} as const;

/**
 * Bearer for `Authorization` on API v1. Prefer Cognito **ID token** when present — access tokens
 * often omit the `aud` claim; backends validating JWT may return MissingRequiredClaimError.
 */
function bearerForApi(accessToken: string, idToken?: string | null): string {
  if (idToken != null && String(idToken).trim() !== '') return String(idToken).trim();
  return accessToken;
}

/**
 * Creates headers for API requests with authentication
 */
function getHeaders(accessToken: string, idToken?: string | null): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${bearerForApi(accessToken, idToken)}`,
  };
}

/**
 * Posts student enrollment using join code
 * POST /api/v1/enrollments/join
 */
export async function postStudentEnrollment(
  studentId: string,
  joinCode: string,
  accessToken: string,
  idToken?: string | null
): Promise<string> {
  try {
    // Backend contract: student_id is a query parameter, body only includes join_code
    const url = new URL(API_ENDPOINTS.POST_STUDENT_ENROLLMENT());
    url.searchParams.set('student_id', studentId);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: getHeaders(accessToken, idToken),
      body: JSON.stringify({
        join_code: joinCode,
      }),
    });
    return await response.text();
  } catch (err) {
    console.error('Error posting student enrollment:', err);
    throw err;
  }
}

/**
 * Deletes student enrollment from a period
 */
export async function deleteStudentEnrollment(
  studentId: string,
  periodId: string,
  accessToken: string,
  idToken?: string | null
): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINTS.DELETE_STUDENT_ENROLLMENT(studentId, periodId), {
      method: 'DELETE',
      headers: getHeaders(accessToken, idToken),
    });
    return await response.text();
  } catch (err) {
    console.error('Error deleting student enrollment:', err);
    throw err;
  }
}

/**
 * Posts activity results for an exercise
 */
export async function getActivityResults(
  worksheetContentCopy: string,
  exerciseId: string,
  periodId: string,
  studentId: string,
  score: number,
  accessToken: string,
  idToken?: string | null
): Promise<string> {
  const body = JSON.stringify({
    worksheetContentCopy,
    exerciseId,
    studentId,
    periodId,
    score,
  });

  try {
    const response = await fetch(API_ENDPOINTS.GET_ACTIVITY_RESULTS(), {
      method: 'POST',
      headers: getHeaders(accessToken, idToken),
      body,
    });
    return await response.text();
  } catch (err) {
    console.error('Error posting activity results:', err);
    throw err;
  }
}

/**
 * Gets periods for a student. Returns empty array on 404 (e.g. endpoint not yet available or no periods).
 */
export async function getStudentPeriods(
  studentId: string,
  accessToken: string,
  idToken?: string | null
): Promise<any> {
  try {
    const baseUrl = API_ENDPOINTS.GET_STUDENT_PERIODS(studentId);
    const url = new URL(baseUrl);
    url.searchParams.set('is_active', 'true');
    url.searchParams.set('page', '1');
    url.searchParams.set('size', '50');

    const response = await fetch(url.toString(), {
      headers: getHeaders(accessToken, idToken),
    });
    if (response.status === 404 || !response.ok) {
      return [];
    }
    const data = await response.json();

    // Normalize into a simple array shape consumed by StudentContext/ClassEnrollment/StudentNavbar
    const items = Array.isArray(data)
      ? data
      : Array.isArray((data as { enrollments?: unknown[] }).enrollments)
        ? (data as { enrollments: unknown[] }).enrollments
        : Array.isArray((data as { items?: unknown[] }).items)
          ? (data as { items: unknown[] }).items
          : [];

    return items.map((enrollment: any) => {
      // Backend enrollments carry a course identifier; prefer that for course-scoped APIs
      const courseId =
        enrollment.course_id ??
        enrollment.class_id ??
        enrollment.period_id ??
        enrollment.id ??
        '';
      const name = enrollment.course_name ?? enrollment.class_name ?? enrollment.name ?? undefined;
      const code = enrollment.join_code ?? name ?? '';
      const enrollmentId = enrollment.id ?? courseId;

      return {
        code,
        name,
        periodId: courseId,
        courseId,
        enrollmentId,
      };
    });
  } catch (err) {
    console.error('Error getting student periods:', err);
    return [];
  }
}

/** Teacher course shape from GET /api/v1/courses/teacher/{teacher_id} */
export interface TeacherCourse {
  id: string;
  class_name?: string;
  course_name?: string;
  subject?: string;
  join_code: string;
  academic_year?: string;
  semester?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

/** Display name for a course (backend may return class_name or course_name) */
export function getCourseDisplayName(course: TeacherCourse): string {
  return course.course_name ?? course.class_name ?? 'Course';
}

/** Paginated response for teacher courses */
export interface TeacherCoursesResponse {
  items: TeacherCourse[];
  total?: number;
  page?: number;
  per_page?: number;
  [key: string]: unknown;
}

/** Body for POST /api/v1/courses/ – backend sets school from teacher */
export interface CreateCourseBody {
  course_name: string;
  teacher_id: string;
  subject?: string;
  academic_year?: string;
  semester?: string;
}

/** One enrollment from GET /api/v1/enrollments/course/{course_id} (roster) */
export interface CourseEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrollment_status: string;
  enrolled_at: string;
  is_active?: boolean;
  student_name?: string;
  student_email?: string;
  course_name?: string;
  [key: string]: unknown;
}

/** Paginated response for course enrollments (roster) */
export interface CourseEnrollmentsResponse {
  items: CourseEnrollment[];
  total?: number;
  page?: number;
  per_page?: number;
  enrollments?: CourseEnrollment[];
  [key: string]: unknown;
}

/**
 * Gets courses for a teacher (includes join_code per course)
 */
export async function getTeacherCourses(
  teacherId: string,
  accessToken: string,
  idToken?: string | null
): Promise<TeacherCoursesResponse> {
  const response = await fetch(API_ENDPOINTS.GET_TEACHER_COURSES(teacherId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || 'Failed to load courses');
  }
  const data = await response.json();
  if (Array.isArray(data)) return { items: data };
  // Backend returns { courses, total, page, size, total_pages }
  if (data && typeof data.courses === 'object' && Array.isArray(data.courses)) {
    return { items: data.courses, total: data.total, page: data.page, per_page: data.size, total_pages: data.total_pages };
  }
  return data;
}

/**
 * Gets enrolled students (roster) for a course. GET /api/v1/enrollments/course/{course_id}
 */
export async function getCourseEnrollments(
  courseId: string,
  accessToken: string,
  idToken?: string | null
): Promise<CourseEnrollmentsResponse> {
  const response = await fetch(API_ENDPOINTS.GET_COURSE_ENROLLMENTS(courseId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load roster');
  }
  const data = await response.json();
  if (Array.isArray(data)) return { items: data };
  if (data && Array.isArray(data.enrollments)) {
    return { items: data.enrollments, total: data.total, page: data.page, per_page: data.size };
  }
  return data;
}

/** Thrown when POST /courses returns 403 (e.g. course limit reached); detail is the backend message */
export class CourseLimitError extends Error {
  constructor(
    message: string,
    public readonly status: number = 403
  ) {
    super(message);
    this.name = 'CourseLimitError';
  }
}

/**
 * Create a course. POST /api/v1/courses/
 * Returns 201 with the created course (includes join_code).
 * Throws CourseLimitError on 403 with body.detail like "Course limit reached (maximum 6 classes for your plan)".
 */
export async function createCourse(
  body: CreateCourseBody,
  accessToken: string,
  idToken?: string | null
): Promise<TeacherCourse> {
  const response = await fetch(API_ENDPOINTS.POST_COURSE(), {
    method: 'POST',
    headers: getHeaders(accessToken, idToken),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const detail = (err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to create course';
    const message = typeof detail === 'string' ? detail : 'Failed to create course';
    if (response.status === 403 && /limit|maximum.*classes/i.test(message)) {
      throw new CourseLimitError(message, 403);
    }
    throw new Error(message);
  }
  return response.json();
}

// ---- Activities and assignments ----

/** Topic/subtopic option from GET /api/v1/activities/topics */
export interface ActivityTopicOption {
  topic?: string;
  subtopic?: string;
  [key: string]: unknown;
}

/** Activity from GET /api/v1/activities or GET /api/v1/activities/{id} */
export interface Activity {
  id?: string;
  activity_id?: string;
  topic?: string;
  subtopic?: string;
  description?: string;
  activity_type?: string;
  [key: string]: unknown;
}

/** Nested activity inside an assignment */
export interface AssignmentActivity {
  activity_id: string;
  /** Hosted worksheet / miniquiz URL (S3, CloudFront, etc.) */
  content_url?: string;
  topic?: string;
  subtopic?: string;
  description?: string;
  activity_type?: string;
  [key: string]: unknown;
}

/** Assignment from GET /api/v1/assignments/courses/{course_id} or POST response */
export interface Assignment {
  id: string;
  course_id: string;
  activity_id: string;
  teacher_id: string;
  due_date?: string;
  title_override?: string;
  activity?: AssignmentActivity;
  /**
   * When caller is an enrolled student, list payload includes these (avoid GET .../progress).
   * `my_status`: `completed` | `past_due` | `pending` (aligned with teacher progress).
   * Teachers/admins: `my_status` is null on every row.
   */
  my_completed_at?: string | null;
  my_score?: number | null;
  my_status?: 'pending' | 'past_due' | 'completed' | string | null;
  [key: string]: unknown;
}

/** Body for POST /api/v1/assignments */
export interface CreateAssignmentBody {
  course_id: string;
  activity_id: string;
  teacher_id: string;
  due_date?: string;
  title_override?: string;
}

/** Completion from GET /api/v1/assignments/{id}/completions */
export interface AssignmentCompletion {
  id: string;
  student_id: string;
  assignment_id: string;
  completed_at: string;
  score?: number;
  student_name?: string;
  [key: string]: unknown;
}

/** One row from GET /api/v1/assignments/{id}/progress */
export interface AssignmentProgressRow {
  student_id: string;
  student_name?: string;
  status: 'completed' | 'pending' | 'past_due' | string;
  score?: number | null;
  completed_at?: string | null;
  [key: string]: unknown;
}

/** Body for POST /api/v1/assignments/{id}/completions */
export interface PostCompletionBody {
  student_id: string;
  score?: number;
}

/** Progress summary: GET /api/v1/assignments/{id}/progress */
export async function getAssignmentProgress(
  assignmentId: string,
  accessToken: string,
  idToken?: string | null
): Promise<AssignmentProgressRow[]> {
  const response = await fetch(API_ENDPOINTS.GET_ASSIGNMENT_PROGRESS(assignmentId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string; detail?: string }).message ??
        (err as { detail?: string }).detail ??
        'Failed to load assignment progress'
    );
  }
  const data = await response.json();

  // Expected shape from backend:
  // {
  //   assignment_id: "...",
  //   course_id: "...",
  //   students: [ { student_id, student_name, status, score, completed_at }, ... ],
  //   total: number
  // }
  if (Array.isArray((data as { students?: unknown[] }).students)) {
    return (data as { students: AssignmentProgressRow[] }).students;
  }

  // Fallbacks if backend returns a bare array or other wrappers
  if (Array.isArray(data)) return data as AssignmentProgressRow[];
  if (Array.isArray((data as { items?: unknown[] }).items)) {
    return (data as { items: AssignmentProgressRow[] }).items;
  }
  if (Array.isArray((data as { rows?: unknown[] }).rows)) {
    return (data as { rows: AssignmentProgressRow[] }).rows;
  }
  return [];
}

export async function getActivitiesTopics(
  accessToken: string,
  idToken?: string | null
): Promise<ActivityTopicOption[]> {
  const response = await fetch(API_ENDPOINTS.GET_ACTIVITIES_TOPICS(), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load topics');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.topics ?? [];
}

export async function getActivities(
  params: { topic?: string; subtopic?: string; activity_type?: string } | undefined,
  accessToken: string,
  idToken?: string | null
): Promise<Activity[]> {
  const response = await fetch(API_ENDPOINTS.GET_ACTIVITIES(params), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load activities');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.activities ?? [];
}

export async function getActivity(
  activityId: string,
  accessToken: string,
  idToken?: string | null
): Promise<Activity> {
  const response = await fetch(API_ENDPOINTS.GET_ACTIVITY(activityId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load activity');
  }
  return response.json();
}

export async function createAssignment(
  body: CreateAssignmentBody,
  accessToken: string,
  idToken?: string | null
): Promise<Assignment> {
  const response = await fetch(API_ENDPOINTS.POST_ASSIGNMENT(), {
    method: 'POST',
    headers: getHeaders(accessToken, idToken),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to create assignment');
  }
  return response.json();
}

export async function getAssignmentsByCourse(
  courseId: string,
  accessToken: string,
  idToken?: string | null
): Promise<Assignment[]> {
  const response = await fetch(API_ENDPOINTS.GET_ASSIGNMENTS_BY_COURSE(courseId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load assignments');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.assignments ?? [];
}

/** Assignments for a course (teacher view with ownership check) */
export async function getTeacherCourseAssignments(
  teacherId: string,
  courseId: string,
  accessToken: string,
  idToken?: string | null
): Promise<Assignment[]> {
  const response = await fetch(API_ENDPOINTS.GET_TEACHER_COURSE_ASSIGNMENTS(teacherId, courseId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load assignments');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.assignments ?? [];
}

/** Completions for an assignment (who finished, when, score) */
export async function getAssignmentCompletions(
  assignmentId: string,
  accessToken: string,
  idToken?: string | null
): Promise<AssignmentCompletion[]> {
  const response = await fetch(API_ENDPOINTS.GET_ASSIGNMENT_COMPLETIONS(assignmentId), {
    headers: getHeaders(accessToken, idToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load completions');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.completions ?? [];
}

/** Record that a student completed an assignment (e.g. after worksheet/miniquiz) */
export async function postAssignmentCompletion(
  assignmentId: string,
  body: PostCompletionBody,
  accessToken: string,
  idToken?: string | null
): Promise<unknown> {
  const response = await fetch(API_ENDPOINTS.POST_ASSIGNMENT_COMPLETION(assignmentId), {
    method: 'POST',
    headers: getHeaders(accessToken, idToken),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to record completion');
  }
  return response.json();
}
