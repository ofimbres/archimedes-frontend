import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import {
  getTeacherCourses,
  type TeacherCourse,
  type TeacherCoursesResponse,
} from '../../libs/apiEndpoints';
import './Home.css';

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const teacherId =
    authContext.sessionInfo?.user_type === 'teachers' &&
    authContext.sessionInfo?.profile &&
    'id' in authContext.sessionInfo.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : null;
  const accessToken = authContext.sessionInfo?.accessToken;
  useEffect(() => {
    if (!teacherId || !accessToken) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTeacherCourses(teacherId, accessToken)
      .then((res: TeacherCoursesResponse) => {
        if (cancelled) return;
        setCourses(res.items ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [teacherId, accessToken]);

  const copyJoinCode = (course: TeacherCourse) => {
    if (!course.join_code) return;
    navigator.clipboard.writeText(course.join_code).then(() => {
      setCopiedId(course.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">Loading your courses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="fs-3 text-center mb-2">My classes</h1>
      <p className="text-center text-muted mb-4">
        Share the join code with students so they can join your class.
      </p>

      {courses.length === 0 ? (
        <div className="alert alert-info">
          You don&apos;t have any courses yet. Create a course in your school
          portal or contact your admin.
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card h-100 teacher-course-card">
                <div className="card-body">
                  <h5 className="card-title">{course.class_name}</h5>
                  {course.subject && (
                    <p className="card-text text-muted small mb-2">
                      {course.subject}
                      {course.academic_year && ` · ${course.academic_year}`}
                      {course.semester && ` · ${course.semester}`}
                    </p>
                  )}
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div>
                      <span className="text-muted small">Join code</span>
                      <div className="join-code-display fw-bold fs-5 font-monospace">
                        {course.join_code}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => copyJoinCode(course)}
                      aria-label={`Copy join code ${course.join_code}`}
                    >
                      {copiedId === course.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
