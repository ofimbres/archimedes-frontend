const API_BASE_URL = process.env.REACT_APP_BACKEND_API_ENDPOINT;

// API endpoint generators
const API_ENDPOINTS = {
  POST_STUDENT_ENROLLMENT: (studentId: string, periodId: string) =>
    `${API_BASE_URL}/api/v1/periods/${periodId}/students/${studentId}/enrollments`,
  DELETE_STUDENT_ENROLLMENT: (studentId: string, periodId: string) =>
    `${API_BASE_URL}/api/v1/periods/${periodId}/students/${studentId}/enrollments`,
  GET_STUDENT_PERIODS: (studentId: string) =>
    `${API_BASE_URL}/api/v1/students/${studentId}/periods`,
  GET_ACTIVITY_RESULTS: () => `${API_BASE_URL}/api/v1/exerciseresults/`,
  GET_TEACHER_COURSES: (teacherId: string) =>
    `${API_BASE_URL}/api/v1/courses/teacher/${teacherId}`,
  POST_COURSE: () => `${API_BASE_URL}/api/v1/courses/`,
  GET_COURSE_ENROLLMENTS: (courseId: string) =>
    `${API_BASE_URL}/api/v1/enrollments/course/${courseId}`,
  GET_ACTIVITIES_TOPICS: () => `${API_BASE_URL}/api/v1/activities/topics`,
  GET_ACTIVITIES: (params?: { topic?: string; subtopic?: string }) => {
    const url = new URL(`${API_BASE_URL}/api/v1/activities`);
    if (params?.topic) url.searchParams.set('topic', params.topic);
    if (params?.subtopic) url.searchParams.set('subtopic', params.subtopic);
    return url.toString();
  },
  GET_ACTIVITY: (activityId: string) => `${API_BASE_URL}/api/v1/activities/${activityId}`,
  POST_ASSIGNMENT: () => `${API_BASE_URL}/api/v1/assignments`,
  GET_ASSIGNMENTS_BY_COURSE: (courseId: string) =>
    `${API_BASE_URL}/api/v1/assignments/courses/${courseId}`,
} as const;

/**
 * Creates headers for API requests with authentication
 */
function getHeaders(accessToken: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * Posts student enrollment to a period
 */
export async function postStudentEnrollment(
  studentId: string,
  periodId: string,
  accessToken: string
): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINTS.POST_STUDENT_ENROLLMENT(studentId, periodId), {
      method: 'POST',
      headers: getHeaders(accessToken),
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
  accessToken: string
): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINTS.DELETE_STUDENT_ENROLLMENT(studentId, periodId), {
      method: 'DELETE',
      headers: getHeaders(accessToken),
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
  accessToken: string
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
      headers: getHeaders(accessToken),
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
export async function getStudentPeriods(studentId: string, accessToken: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_STUDENT_PERIODS(studentId), {
      headers: getHeaders(accessToken),
    });
    if (response.status === 404 || !response.ok) {
      return [];
    }
    return await response.json();
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
  accessToken: string
): Promise<TeacherCoursesResponse> {
  const response = await fetch(API_ENDPOINTS.GET_TEACHER_COURSES(teacherId), {
    headers: getHeaders(accessToken),
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
  accessToken: string
): Promise<CourseEnrollmentsResponse> {
  const response = await fetch(API_ENDPOINTS.GET_COURSE_ENROLLMENTS(courseId), {
    headers: getHeaders(accessToken),
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
  accessToken: string
): Promise<TeacherCourse> {
  const response = await fetch(API_ENDPOINTS.POST_COURSE(), {
    method: 'POST',
    headers: getHeaders(accessToken),
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

export async function getActivitiesTopics(accessToken: string): Promise<ActivityTopicOption[]> {
  const response = await fetch(API_ENDPOINTS.GET_ACTIVITIES_TOPICS(), {
    headers: getHeaders(accessToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load topics');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.topics ?? [];
}

export async function getActivities(
  params: { topic?: string; subtopic?: string } | undefined,
  accessToken: string
): Promise<Activity[]> {
  const response = await fetch(API_ENDPOINTS.GET_ACTIVITIES(params), {
    headers: getHeaders(accessToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load activities');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.activities ?? [];
}

export async function getActivity(activityId: string, accessToken: string): Promise<Activity> {
  const response = await fetch(API_ENDPOINTS.GET_ACTIVITY(activityId), {
    headers: getHeaders(accessToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load activity');
  }
  return response.json();
}

export async function createAssignment(
  body: CreateAssignmentBody,
  accessToken: string
): Promise<Assignment> {
  const response = await fetch(API_ENDPOINTS.POST_ASSIGNMENT(), {
    method: 'POST',
    headers: getHeaders(accessToken),
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
  accessToken: string
): Promise<Assignment[]> {
  const response = await fetch(API_ENDPOINTS.GET_ASSIGNMENTS_BY_COURSE(courseId), {
    headers: getHeaders(accessToken),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string; detail?: string }).message ?? (err as { detail?: string }).detail ?? 'Failed to load assignments');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data?.items ?? data?.assignments ?? [];
}
