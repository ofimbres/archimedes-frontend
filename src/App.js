
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/index.css';

import  { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn } from './contexts/AuthContext'

import StudentHome from './routes/student/Home';
import Landing from './routes/Landing';

import SignIn from './routes/auth/SignIn';
import SendCode from './routes/auth/SendCode';
import ForgotPassword from './routes/auth/ForgotPassword';
import SignUp from './routes/auth/SignUp';
import VerifyCode from './routes/auth/VerifyCode';

import StudentNavigationBar from './components/student/NavigationBar';
import StartExercise from './components/student/StartExercise';
import SelectExercise from './components/student/SelectExercise';
import ViewExerciseResults from './components/student/ViewExerciseResults';
// import STAARRedesign from './components/student/STAARRedesign';

import TeachertHome from './routes/teacher/Home';

  const SignInRoute = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/requestcode" element={<SendCode />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/health" element={
          <h3>The App is Healthy</h3>
        }>
        </Route>
      </Routes>
    </BrowserRouter>
  )

  const StudentRoute = () => (
    <BrowserRouter>
      <StudentNavigationBar />
      <Routes>
        <Route path="/" element={<StudentHome />} />
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
          <StudentRoute />
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