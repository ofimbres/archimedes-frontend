import { Amplify, Auth } from 'aws-amplify';
import './App.css';
import  { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import DoExercise from './DoExercise';
import ExerciseResults from './ExerciseResults';
import { awsExports } from './aws-exports';
Amplify.configure(awsExports);


export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h3>ARCHIMEDES</h3>
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Authenticator signUpAttributes={['email']}>
            {({ signOut, user }) => (
              <main>
                <h3>Hello {user.username}</h3>
                <button onClick={signOut}>Sign out</button>
                <Link to="/exercise/W16">
                  <button>Start Exam</button>
                </Link>
              </main>
            )}
            </Authenticator>}/>
            <Route path="/exercise/W16" element={<DoExercise></DoExercise>} />
            <Route path="/exercise/W16-completed" element={<ExerciseResults></ExerciseResults>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}


/*
                       //<NavLink to="/potro">Stuff</NavLink>-->

          <Route path="/stuff" component={Stuff}/>
          <Route path="/contact" component={Contact}/>

function potro() {
    Auth.currentSession().then(auth => {
        console.log(auth.accessToken.jwtToken);
    });
    const token = localStorage.getItem('CognitoIdentityServiceProvider.3n6mitm1fj8q4kjco00fnp45kf.ofimbres.accessToken');

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    headers.append('Access-Control-Allow-Origin', 'http://localhost:3003');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    headers.append('Authorization', 'Bearer ' + token);

    console.log("potro");
    fetch('http://localhost:8080/test/hello', { headers: headers })
      .then(response => response.json())
      .then(data => console.log(data));
}


export default function App() {
  return (
    <Authenticator
      hideSignUp={true}
    >
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onMouseOver={potro} onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}*/