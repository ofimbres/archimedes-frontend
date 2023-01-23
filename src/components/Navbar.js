
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import  { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { awsExports } from '../aws-exports';
import Home from './Home';
import About from './About';
import StartExercise from './StartExercise';
import SelectExercise from './SelectExercise';
import ViewExerciseResults from './ViewExerciseResults';
import { useAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

const NavbarC = () => {
    const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);
    const isLoggedIn = authStatus == 'authenticated';
  
    // how to hide header area
    const location = useLocation();
  
    console.log('hash', location.state);
    console.log('pathname', location.pathname);
    console.log('search', location.search);
    //debugger;
    const hide = true;
    return (
        <div className="navbarc">
          { location.pathname !== '/exercise/start' ? (
          <header className="App-header">
            <nav className="navbar navbar-expand-lg bg-light">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">Archimedes</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul className="navbar-nav me-auto">
                    <ul className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </ul>
                    <li className="nav-item">
                      <Link className="nav-link" to="/exercise/select">My Assignments</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" aria-current="page" to="/about">About</Link>
                    </li>
                  </ul>
                  { isLoggedIn ? (
                  <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        My user
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="#">Signed in as {user.username}</a></li>
                        <li><a className="dropdown-item" href="#" onClick={signOut}>Sign out</a></li>
                      </ul>
                    </li>
                  </ul>
                  ) : (
                    <button className="btn btn-outline-primary" type="submit">Sign in</button>
                  )
                  }
                  
                </div>
      
              </div>
                   
            </nav>
            
          </header>
          
          
          ) : (<div></div>)}
          { isLoggedIn ? (
          <div className="content">
            <Routes>
              <Route path="/" exact={true} component ={Home}/>
              <Route path="/about" element={<About></About>} />
              <Route path="/exercise/select" element={<SelectExercise />} location={ hide } />
              <Route path="/exercise/start" element={<StartExercise />} location={ hide } />
              <Route path="/exercise/completed" element={<ViewExerciseResults />} />
            </Routes>
          </div>
        ) : (
          <Authenticator signUpAttributes={['email', 'given_name', 'family_name']} />
        )}
        </div>
    );
  }
  export default NavbarC