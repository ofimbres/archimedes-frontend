import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

export default function NavigationBar() {
    const location = useLocation();

    const authContext = useContext(AuthContext)
    
    const groups = authContext.sessionInfo?.groups
    const isStudent = groups?.includes('students');
    const isTeacher = groups?.includes('teachers');
    const isAdmin = groups?.includes('admins');
    
    var roleName = undefined;

    if (isAdmin) {
      roleName = 'admin';
    } else if (isTeacher) {
      roleName = 'teacher';
    } else if (isStudent) {
      roleName = 'student';
    } else {
      throw new Error('Invalid role'); 
    }

    const username = authContext.attrInfo?.find((attr: any) => attr.Name === 'email').Value

    const signOut = () => {
      authContext.signOut()
    };

    if (location.pathname === '/exercise/start') {
      return null;
    }

    return (
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/#">Archimedes</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/exercise/select">Mini-Quizzes</Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  My user
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="/#">Signed in as {username} - {roleName} </a></li>
                  <li><a className="dropdown-item" href="/#" onClick={signOut}>Sign out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}