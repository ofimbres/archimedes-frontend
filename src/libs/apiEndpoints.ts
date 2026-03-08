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
 * Gets periods for a student
 */
export async function getStudentPeriods(studentId: string, accessToken: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_STUDENT_PERIODS(studentId), {
      headers: getHeaders(accessToken),
    });
    return await response.json();
  } catch (err) {
    console.error('Error getting student periods:', err);
    throw err;
  }
}

/** Teacher course shape from GET /api/v1/courses/teacher/{teacher_id} */
export interface TeacherCourse {
  id: string;
  class_name: string;
  subject?: string;
  join_code: string;
  academic_year?: string;
  semester?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

/** Paginated response for teacher courses */
export interface TeacherCoursesResponse {
  items: TeacherCourse[];
  total?: number;
  page?: number;
  per_page?: number;
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
  return Array.isArray(data) ? { items: data } : data;
}
