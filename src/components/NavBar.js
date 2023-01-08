import { Link } from "react-router-dom";
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function NavBar() {
    const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);
    const isLoggedIn = authStatus === 'authenticated';

    return (
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Archimedes</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
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
    );
}