import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { StudentContext } from '../../contexts/StudentContext'
import { getStudentPeriods } from '../../libs/apiEndpoints';

export default function NavigationBar() {
  
    const [activeItem, setActiveItem] = useState('home');
    const [selectedPeriod, setSelectedPeriod] = useState({ name: "Select Period", periodId: '-1' });
    const [periods, setPeriods] = useState([]);
    const handleItemClick = (name: string) => { setActiveItem(name); };
    const handlePeriodChange = (period: any) => { setSelectedPeriod(period); };

    const location = useLocation();

    const authContext = useContext(AuthContext);
    const studentContext = useContext(StudentContext);

    useEffect(() => {

      let availablePeriods = studentContext.availablePeriods;
      setPeriods(availablePeriods);

      // if (availablePeriods.length === 0) {
      //   // HERE WE REDIRECT THE PAGE
        
      // }
      
      if (availablePeriods.length > 0) {
        setSelectedPeriod(availablePeriods[0]);
      }

    }, [authContext.attrInfo, authContext.sessionInfo, studentContext.availablePeriods]);
    
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

    const username = authContext.attrInfo['email'];
    const fullName = authContext.attrInfo['given_name'] + ' ' + authContext.attrInfo['family_name'];
    const studentId = authContext.attrInfo["custom:userId"]

    const signOut = () => {
      authContext.signOut()
    };

    if (location.pathname === '/exercise/start') {
      return null;
    }
    
    return (
<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
  <div className="container-fluid">
    {/* Brand and Logo */}
    <a className="navbar-brand d-flex align-items-center mb-0 h1" href="/#">
      <img src="archimedes-logo.jpg" alt="Logo" width="30" height="30" className="d-inline-block align-text-top me-2" />
      <span>Archimedes</span>
    </a>

    {/* Navbar Toggler for Mobile */}
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Navbar Links and Dropdowns */}
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      {/* Left-side Links */}
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link className={`nav-link ${activeItem === 'home' ? 'active' : ''}`} aria-current="page" to="/" onClick={() => handleItemClick('home')}>Home</Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${activeItem === 'activities' ? 'active' : ''}`} to="/exercise/select" onClick={() => handleItemClick('activities')}>Activities</Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${activeItem === 'reports' ? 'active' : ''}`} to="/exercise/select" onClick={() => handleItemClick('reports')}>Reports</Link>
        </li>
      </ul>

      {/* Right-side Dropdowns */}
      <ul className="navbar-nav">
        {/* Period Dropdown */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {selectedPeriod.name}
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            {periods.map((period: any) => (
              <li key={period.name}>
                <a
                  className={`dropdown-item ${selectedPeriod.periodId === period.periodId ? 'active' : ''}`}
                  href="/#"
                  onClick={() => handlePeriodChange(period)}
                >
                  {period.name}
                </a>
              </li>
            ))}
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/enroll-period">Manage Periods</Link></li>
          </ul>
        </li>

        {/* User Profile Dropdown */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {/* Optionally, include user image */}
            {/* <img src="user-avatar.jpg" alt="User" className="rounded-circle me-2" width="30" height="30" /> */}
            {fullName}
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><h6 className="dropdown-header">Signed in as {roleName}. {fullName}. ID {studentId}</h6></li>
            <li><a className="dropdown-item" href="/#" onClick={signOut}>Sign out</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
    );
}