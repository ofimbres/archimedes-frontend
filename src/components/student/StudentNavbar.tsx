import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { StudentContext } from '../../contexts/StudentContext';

export default function StudentNavbar() {
  const [activeItem, setActiveItem] = useState('home');
  const [selectedPeriod, setSelectedPeriod] = useState({ name: 'Select course', periodId: '-1' });
  const [courses, setCourses] = useState<{ name?: string; code?: string; periodId: string }[]>([]);
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    const availableCourses = studentContext.availablePeriods;
    setCourses(availableCourses);
    if (availableCourses.length > 0) {
      setSelectedPeriod(availableCourses[0]);
    }
  }, [authContext.sessionInfo, studentContext.availablePeriods]);

  const userType = authContext.sessionInfo?.user_type;
  const profile = authContext.sessionInfo?.profile as
    | { full_name?: string; first_name?: string; last_name?: string }
    | undefined;
  const roleName =
    userType === 'admin' ? 'admin' : userType === 'teachers' ? 'teacher' : userType === 'students' ? 'student' : undefined;
  const fullName =
    profile?.full_name ||
    (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '') ||
    '';
  const studentId =
    userType === 'students' && profile && 'id' in profile ? (profile as { id: string }).id : undefined;

  const signOut = () => {
    void authContext.signOut?.();
  };

  if (location.pathname === '/exercise/start') {
    return null;
  }

  if (studentContext.embeddedAssignmentOpen) {
    return null;
  }

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
            <li><Link to="/exercise/select" onClick={() => setActiveItem('activities')} className={activeItem === 'activities' ? 'active' : ''}>Activities</Link></li>
            <li><Link to="/exercise/select" onClick={() => setActiveItem('reports')} className={activeItem === 'reports' ? 'active' : ''}>Reports</Link></li>
            <li><Link to="/enroll-period">Manage classes</Link></li>
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
          <li><Link to="/exercise/select" className={activeItem === 'activities' ? 'active font-medium' : ''} onClick={() => setActiveItem('activities')}>Activities</Link></li>
          <li><Link to="/exercise/select" className={activeItem === 'reports' ? 'active font-medium' : ''} onClick={() => setActiveItem('reports')}>Reports</Link></li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-base-content font-medium">
            {selectedPeriod.name}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
            {courses.map((course: { name?: string; code?: string; periodId: string }) => (
              <li key={course.periodId}>
                <button
                  type="button"
                  className={selectedPeriod.periodId === course.periodId ? 'active font-medium' : ''}
                  onClick={() =>
                    setSelectedPeriod({
                      name: course.name || course.code || 'Course',
                      periodId: course.periodId,
                    })
                  }
                >
                  {course.name || course.code || 'Course'}
                </button>
              </li>
            ))}
            <li className="p-0 cursor-default pointer-events-none select-none [&>hr]:my-1 hover:!bg-transparent active:!bg-transparent focus:!bg-transparent" aria-hidden>
              <hr className="border-base-300" />
            </li>
            <li>
              <Link to="/enroll-period">Manage classes</Link>
            </li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm text-base-content">
            {fullName || 'Account'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-2 shadow-lg">
            <li className="menu-title">
              <span className="text-base-content/70">
                {[
                  roleName ? `Signed in as ${roleName}` : null,
                  fullName || null,
                  studentId ? `ID ${studentId}` : null,
                ]
                  .filter(Boolean)
                  .join(' • ')}
              </span>
            </li>
            <li><button type="button" onClick={signOut}>Sign out</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
