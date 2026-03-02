import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthProvider, {
  AuthIsSignedIn,
  AuthIsNotSignedIn,
  AuthNeedsProfile,
} from './contexts/AuthContext';
import StudentProvider from './contexts/StudentContext';

// Page imports using barrel exports
import { Home as StudentHome } from './pages/student';
import Landing from './pages/Landing';
import { Home as TeacherHome } from './pages/teacher';

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
import {
  StudentNavbar,
  ClassEnrollment,
  ExercisePlayer,
  ExerciseBrowser,
  ExerciseResults,
} from './components/student';

// Common components
import { ErrorBoundary } from './components/common';

/**
 * Main App component with role-based routing and authentication
 * Uses a single BrowserRouter instance to prevent routing conflicts
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <AuthProvider>
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
              <StudentProvider>
                <StudentNavbar />
                <Routes>
                  <Route path="/" element={<StudentHome />} />
                  <Route path="/enroll-period" element={<ClassEnrollment />} />
                  <Route path="/exercise/select" element={<ExerciseBrowser />} />
                  <Route path="/exercise/start" element={<ExercisePlayer />} />
                  <Route path="/exercise/completed" element={<ExerciseResults />} />
                </Routes>
              </StudentProvider>
            </AuthIsSignedIn>

            {/* Routes for authenticated teachers */}
            <AuthIsSignedIn role="teachers">
              <StudentNavbar />
              <Routes>
                <Route path="/" element={<TeacherHome />} />
              </Routes>
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
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
};

export default App;
