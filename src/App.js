
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './styles/index.css';

import  { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn } from './contexts/AuthContext'

import Home from './routes/student/Home';
import Landing from './routes/Landing';

import SignIn from './routes/auth/SignIn';

import NavigationBar from './components/student/NavigationBar';
import StartExercise from './components/student/StartExercise';
import SelectExercise from './components/student/SelectExercise';
import ViewExerciseResults from './components/student/ViewExerciseResults';
// import STAARRedesign from './components/student/STAARRedesign';

  const SignInRoute = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )

  const StudentRoute = () => (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/select" element={<SelectExercise />} />
        <Route path="/exercise/start" element={<StartExercise />} />
        <Route path="/exercise/completed" element={<ViewExerciseResults />} />
      </Routes>
    </BrowserRouter>
  )

  const TeacherRoute = () => (
    <BrowserRouter>
      <Routes>
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

  //return (

      // <div className="App">
      //   { location.pathname !== '/exercise/start' ? (
      //   <header className="App-header">
      //     <NavBar></NavBar>
      //   </header>
      //   ) : (<div></div>)}

      //   <div className="content">
      //     { isStudent ? (
      //     <Routes>

      //     </Routes>
      //   </div>
      // </div>
//  );
//}