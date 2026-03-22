import React from 'react';
import './index.css';
import './styles/index.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthProvider, {
  AuthContext,
  AuthIsSignedIn,
  AuthIsNotSignedIn,
  AuthNeedsProfile,
  AuthStatus,
} from './contexts/AuthContext';
import StudentProvider from './contexts/StudentContext';

// Page imports using barrel exports
import { Assignments as StudentAssignments } from './pages/student';
import Landing from './pages/Landing';
import { Home as TeacherHome, CreateCourse, CourseRoster, ManageCourses, CreateAssignment } from './pages/teacher';
import AssignmentProgress from './pages/teacher/AssignmentProgress';

// Auth page imports using barrel exports
import {
  AuthCallback,
  SignIn,
  SendCode,
  ForgotPassword,
  SignUp,
  VerifyCode,
  CompleteProfile,
} from './pages/auth';

// Component imports using barrel exports
import { StudentNavbar, ClassEnrollment } from './components/student';
import TeacherNavbar from './components/teacher/TeacherNavbar';

// Common components
import { ErrorBoundary } from './components/common';

/** Syncs daisyUI theme to document root so styles apply before/after auth and on login */
function ThemeSync({ children }: { children: React.ReactNode }) {
  const { authStatus, sessionInfo } = React.useContext(AuthContext);
  React.useEffect(() => {
    const theme =
      authStatus === AuthStatus.SignedIn && sessionInfo?.user_type === 'teachers'
        ? 'archimedes-teacher'
        : authStatus === AuthStatus.SignedIn && sessionInfo?.user_type === 'students'
          ? 'archimedes-student'
          : 'archimedes';
    document.documentElement.setAttribute('data-theme', theme);
  }, [authStatus, sessionInfo?.user_type]);
  return <>{children}</>;
}

/**
 * Main App component with role-based routing and authentication
 * Uses a single BrowserRouter instance to prevent routing conflicts
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <AuthProvider>
          <ThemeSync>
          <BrowserRouter>
            {/* Routes for authenticated users who need to complete profile */}
            <AuthNeedsProfile>
              <Routes>
                <Route path="/" element={<CompleteProfile />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
              </Routes>
            </AuthNeedsProfile>

            {/* Routes for authenticated students */}
            <AuthIsSignedIn role="students">
              <div data-theme="archimedes-student" className="min-h-screen">
                <StudentProvider>
                  <StudentNavbar />
                  <Routes>
                    <Route path="/" element={<StudentAssignments />} />
                    <Route path="/assignments" element={<Navigate to="/" replace />} />
                    <Route path="/enroll-period" element={<ClassEnrollment />} />
                  </Routes>
                </StudentProvider>
              </div>
            </AuthIsSignedIn>

            {/* Routes for authenticated teachers */}
            <AuthIsSignedIn role="teachers">
              <div data-theme="archimedes-teacher" className="min-h-screen">
                <TeacherNavbar />
                <Routes>
                <Route path="/" element={<TeacherHome />} />
                <Route path="/teacher/courses/new" element={<CreateCourse />} />
                <Route path="/teacher/courses/:courseId/assignments/new" element={<CreateAssignment />} />
                <Route path="/teacher/courses/:courseId/assignments/:assignmentId" element={<AssignmentProgress />} />
                <Route path="/teacher/courses/:courseId/roster" element={<CourseRoster />} />
                <Route path="/teacher/courses" element={<ManageCourses />} />
                </Routes>
              </div>
            </AuthIsSignedIn>

            {/* Routes for authenticated admins */}
            <AuthIsSignedIn role="admin">
              <Routes>{/* Admin routes will be added here */}</Routes>
            </AuthIsSignedIn>

            {/* Routes for unauthenticated users */}
            <AuthIsNotSignedIn>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/requestcode" element={<SendCode />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify" element={<VerifyCode />} />
              </Routes>
            </AuthIsNotSignedIn>
          </BrowserRouter>
          </ThemeSync>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
};

export default App;
