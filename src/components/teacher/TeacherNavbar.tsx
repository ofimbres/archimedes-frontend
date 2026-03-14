import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getTeacherCourses, type TeacherCourse } from '../../libs/apiEndpoints';

export default function TeacherNavbar() {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [activeItem, setActiveItem] = useState('home');

  // Selected course from current route (e.g. /teacher/courses/:courseId/roster)
  const courseIdMatch = location.pathname.match(/^\/teacher\/courses\/([^/]+)\/roster/);
  const selectedCourseId = courseIdMatch?.[1] ?? null;
  const selectedCourse = selectedCourseId
    ? courses.find((c) => c.id === selectedCourseId)
    : null;

  const teacherId =
    authContext.sessionInfo?.user_type === 'teachers' &&
    authContext.sessionInfo?.profile &&
    'id' in authContext.sessionInfo.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : null;
  const accessToken = authContext.sessionInfo?.accessToken;

  useEffect(() => {
    if (!teacherId || !accessToken) return;
    getTeacherCourses(teacherId, accessToken)
      .then((res) => setCourses(res.items ?? []))
      .catch(() => setCourses([]));
  }, [teacherId, accessToken]);

  const profile = authContext.sessionInfo?.profile as
    | { full_name?: string; first_name?: string; last_name?: string }
    | undefined;
  const fullName =
    profile?.full_name ||
    (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '') ||
    'Account';

  const signOut = () => {
    void authContext.signOut?.();
  };

  return (
    <div className="navbar bg-water-surface border-b-2 border-water-foam shadow-bubble">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52">
            <li><Link to="/" onClick={() => setActiveItem('home')} className={activeItem === 'home' ? 'active' : ''}>Home</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost gap-2 text-water-deep font-display font-semibold">
          <img src="/archimedes-logo.jpg" alt="Logo" width={30} height={30} className="rounded-full object-cover" />
          Archimedes
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          <li><Link to="/" className={activeItem === 'home' ? 'active font-medium' : ''} onClick={() => setActiveItem('home')}>Home</Link></li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-water-deep font-medium">
            {selectedCourse ? selectedCourse.class_name : 'Courses'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 z-[1] max-h-64 overflow-y-auto">
            {courses.length === 0 ? (
              <li className="text-base-content/60 text-sm">No courses yet</li>
            ) : (
              courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/teacher/courses/${course.id}/roster`}
                    state={{ courseName: course.class_name }}
                    className={selectedCourseId === course.id ? 'active font-medium' : ''}
                  >
                    {course.class_name}
                  </Link>
                </li>
              ))
            )}
            <li><hr /></li>
            <li><Link to="/teacher/courses">Manage courses</Link></li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-water-deep">
            {fullName}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-64 z-[1]">
            <li className="menu-title"><span className="text-base-content/70">Signed in as teacher</span></li>
            <li><button type="button" onClick={signOut}>Sign out</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
