
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/index.css';

import  { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn } from './contexts/AuthContext'
import StudentProvider from './contexts/StudentContext'

import StudentHome from './pages/student/Home';
import Landing from './pages/Landing';

import SignIn from './pages/auth/SignIn';
import SendCode from './pages/auth/SendCode';
import ForgotPassword from './pages/auth/ForgotPassword';
import SignUp from './pages/auth/SignUp';
import VerifyCode from './pages/auth/VerifyCode';

import StudentNavigationBar from './components/student/NavigationBar';

import EnrollPeriod from './components/student/EnrollPeriod';
import StartExercise from './components/student/StartExercise';
import SelectExercise from './components/student/SelectExercise';
import ViewExerciseResults from './components/student/ViewExerciseResults';
// import STAARRedesign from './components/student/STAARRedesign';

import TeachertHome from './pages/teacher/Home';

  const SignInRoute = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/requestcode" element={<SendCode />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyCode />} />
      </Routes>
    </BrowserRouter>
  )

  const StudentRoute = () => (
    <BrowserRouter>
      <StudentNavigationBar />
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/enroll-period" element={<EnrollPeriod />} />
        <Route path="/exercise/select" element={<SelectExercise />} />
        <Route path="/exercise/start" element={<StartExercise />} />
        <Route path="/exercise/completed" element={<ViewExerciseResults />} />
      </Routes>
    </BrowserRouter>
  )

  const TeacherRoute = () => (
    <BrowserRouter>
      <StudentNavigationBar />
      <Routes>
        <Route path="/" element={<TeachertHome />} />
      </Routes>
    </BrowserRouter>
  )

  const AdminRoute = () => (
    <BrowserRouter>
      <Routes>
      </Routes>
    </BrowserRouter>
  )

  const App = () => (
    <div className="App" >
      <AuthProvider>
        <AuthIsSignedIn role="students">
          <StudentProvider>
            <StudentRoute />
          </StudentProvider>
        </AuthIsSignedIn>
        <AuthIsSignedIn role="teachers">
          <TeacherRoute />
        </AuthIsSignedIn>
        <AuthIsSignedIn role="admins">
          <AdminRoute />
        </AuthIsSignedIn>
        <AuthIsNotSignedIn>
          <SignInRoute />
        </AuthIsNotSignedIn>
      </AuthProvider>
    </div>
  );

  export default App;