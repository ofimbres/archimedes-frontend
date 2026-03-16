import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getTeacherCourses, getCourseDisplayName, type TeacherCourse } from '../../libs/apiEndpoints';

export default function TeacherNavbar() {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [activeItem, setActiveItem] = useState('home');
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

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
  }, [teacherId, accessToken, location.pathname]);

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

  const coursesDropdownRef = React.useRef<HTMLDivElement>(null);
  const closeCoursesDropdown = () => {
    setCoursesDropdownOpen(false);
    const trigger = coursesDropdownRef.current?.querySelector('label[tabindex="0"]') as HTMLElement | null;
    trigger?.blur();
    (document.activeElement as HTMLElement)?.blur();
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
            <li><Link to="/" onClick={() => setActiveItem('home')} className={activeItem === 'home' ? 'active' : ''}>Home</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost gap-2 text-base-content font-display font-semibold">
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
        <div ref={coursesDropdownRef} className={`dropdown dropdown-end ${coursesDropdownOpen ? 'dropdown-open' : ''}`}>
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm text-base-content font-medium"
            onClick={() => setCoursesDropdownOpen((o) => !o)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setCoursesDropdownOpen(false);
            }}
          >
            {selectedCourse ? getCourseDisplayName(selectedCourse) : 'Courses'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg max-h-64 overflow-y-auto"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setCoursesDropdownOpen(false);
            }}
          >
            {courses.length === 0 ? (
              <li className="text-base-content/60 text-sm">No courses yet</li>
            ) : (
              courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/teacher/courses/${course.id}/roster`}
                    state={{ courseName: getCourseDisplayName(course) }}
                    className={selectedCourseId === course.id ? 'active font-medium' : ''}
                    onClick={closeCoursesDropdown}
                  >
                    {getCourseDisplayName(course)}
                  </Link>
                </li>
              ))
            )}
            <li className="p-0 cursor-default pointer-events-none select-none [&>hr]:my-1 hover:!bg-transparent active:!bg-transparent focus:!bg-transparent" aria-hidden>
              <hr className="border-base-300" />
            </li>
            <li>
              <Link to="/teacher/courses" onClick={closeCoursesDropdown}>Manage courses</Link>
            </li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-base-content">
            {fullName}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-2 shadow-lg">
            <li className="menu-title"><span className="text-base-content/70">Signed in as teacher</span></li>
            <li><button type="button" onClick={signOut}>Sign out</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
