import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {
  getTeacherCourses,
  type TeacherCourse,
  type TeacherCoursesResponse,
} from '../../libs/apiEndpoints';

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
    return () => { cancelled = true; };
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
      <div className="container max-w-5xl mx-auto px-4 py-12 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-water-mid">Loading your courses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-bubble" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-2">My classes</h1>
      <p className="text-center text-water-mid mb-6">
        Share the join code with students so they can join your class.
      </p>
      <div className="flex justify-center mb-8">
        <Link
          to="/teacher/courses/new"
          className="btn btn-primary rounded-bubble"
        >
          Create course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="alert alert-info rounded-bubble">
          <span>You don&apos;t have any courses yet. Create a course above or contact your admin.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow h-full">
              <div className="card-body">
                <h2 className="card-title font-display font-semibold text-water-deep">{course.class_name}</h2>
                {(course.subject || course.academic_year || course.semester) && (
                  <p className="text-base-content/70 text-sm mb-2">
                    {[course.subject, course.academic_year, course.semester].filter(Boolean).join(' · ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
                  <div>
                    <span className="text-base-content/60 text-xs block">Join code</span>
                    <span className="font-mono font-bold text-lg text-water-deep">{course.join_code}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-primary btn-sm rounded-bubble"
                    onClick={() => copyJoinCode(course)}
                    aria-label={`Copy join code ${course.join_code}`}
                  >
                    {copiedId === course.id ? 'Copied!' : 'Copy'}
                  </button>
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
