
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import  { Routes, Route, useLocation } from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';

import { Amplify } from 'aws-amplify';
import { awsExports } from './aws-exports';

import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import NavBar from './components/NavBar';
import StartExercise from './components/StartExercise';
import SelectExercise from './components/SelectExercise';
import ViewExerciseResults from './components/ViewExerciseResults';

import { useAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

export default function App() {
  const { authStatus } = useAuthenticator((context) => [context.user]);
  const isLoggedIn = authStatus === 'authenticated';

  const location = useLocation();

  if (!isLoggedIn) {
    return <Login></Login>
  }

  return (
      <div className="App">
        { location.pathname !== '/exercise/start' ? (
        <header className="App-header">
          <NavBar></NavBar>
        </header>
        ) : (<div></div>)}

        <div className="content">
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/about" element={<About></About>} />
            <Route path="/exercise/select" element={<SelectExercise />} />
            <Route path="/exercise/start" element={<StartExercise />} />
            <Route path="/exercise/completed" element={<ViewExerciseResults />} />
          </Routes>
        </div>
      </div>
  );
}