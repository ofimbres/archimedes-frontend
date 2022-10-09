
import './styles/index.css';
import  { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { awsExports } from './aws-exports';

import Home from './components/Home';
import About from './components/About';
import DoExercise from './components/DoExercise';
import ExerciseResults from './components/ExerciseResults';

import { useAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

export default function App() {
  const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);
  const isLoggedIn = authStatus == 'authenticated';

  /*<Authenticator signUpAttributes={['email', 'given_name', 'family_name']}>
  {({ signOut, user }) => (
  <main>
      <h3>Hello {user.username}</h3>
      <button onClick={signOut}>Sign out</button>
      <Link to="/exercise/start">
      <button>Start Exam</button>
      </Link>
  </main>
  )}
</Authenticator>*/

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h3>ARCHIMEDES</h3>
        </header>
        { isLoggedIn ? (
        <div className="content">
          <div>
            <h3>Hello {user.username}</h3>
            <button onClick={signOut}>Sign out</button>
          </div>
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/about" element={<About></About>} />
            <Route path="/exercise/start" element={<DoExercise />} />
            <Route path="/exercise/completed" element={<ExerciseResults />} />
          </Routes>
        </div>
      ) : (
        <Authenticator signUpAttributes={['email', 'given_name', 'family_name']} />
      )}
      </div>
    </BrowserRouter>
  );
}