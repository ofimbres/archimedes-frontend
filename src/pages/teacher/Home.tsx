import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getCourseDisplayName, getTeacherCourses, type TeacherCourse } from '../../libs/apiEndpoints';

const Home: React.FC = () => {
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

  useEffect(() => {
    if (!teacherId || !accessToken) return;
    getTeacherCourses(teacherId, accessToken, idToken)
      .then((res) => setCourses(res.items ?? []))
      .catch(() => setCourses([]));
  }, [teacherId, accessToken, idToken]);

  const selectedCourseId = useMemo(() => {
    return new URLSearchParams(location.search).get('courseId');
  }, [location.search]);
  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-water-deep mb-6">Home</h1>
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wide text-base-content/60">Selected course</span>
        <div className="mt-1">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-primary/10 text-primary border-primary/30">
            {selectedCourse ? getCourseDisplayName(selectedCourse) : 'All courses'}
          </span>
        </div>
      </div>

      <section>
        <h2 className="font-display font-bold text-xl text-water-deep mb-2">Recent activity</h2>
        <p className="text-water-mid text-sm mb-4">
          Assignments, submissions, and activity across your courses will appear here.
        </p>
        <div className="rounded-blob border-2 border-water-foam/30 border-dashed bg-base-200/30 p-8 text-center">
          <p className="text-base-content/60">Coming soon</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
