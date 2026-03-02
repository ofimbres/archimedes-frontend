import React from 'react';
import './Home.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarTimes, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="fs-3 text-center mb-4">Welcome back, Alex!</h1>
      <h2 className="fs-5 text-center mb-5">
        Here's your activity overview for Monday, March 10, 2025
      </h2>

      <div className="row g-4">
        {/* Today's Activities Card */}
        <div className="col-md-4">
          <div className="today-activities activity-card card p-4">
            <div className="d-flex align-items-center mb-3">
              {/* <i className="activity-icon fas fa-calendar-day fs-3"></i> */}
              <FontAwesomeIcon icon={faCalendarDay} />
              <h3 className="ms-3 fs-5">Today's Activities</h3>
            </div>
            <ul className="activity-list mb-3">
              <li>Exercise Description on a card</li>
            </ul>
            <button className="btn btn-primary w-100">Start Now</button>
          </div>
        </div>

        {/* Past Due Activities Card */}
        <div className="col-md-4">
          <div className="past-due-activities activity-card card p-4">
            <div className="d-flex align-items-center mb-3">
              {/* <i className="activity-icon fas fa-calendar-times fs-3"></i> */}
              <FontAwesomeIcon icon={faCalendarTimes} />
              <h3 className="ms-3 fs-5">Past Due Activities</h3>
            </div>
            <ul className="activity-list mb-3">
              <li>Due "March 8, 2025"</li>
            </ul>
          </div>
        </div>

        {/* Completed Activities Card */}
        <div className="col-md-4">
          <div className="completed-activities activity-card card p-4">
            <div className="d-flex align-items-center mb-3">
              {/* <i className="activity-icon fas fa-calendar-check fs-3"></i> */}
              <FontAwesomeIcon icon={faCalendarCheck} />
              <h3 className="ms-3 fs-5">Completed Activities</h3>
            </div>
            <ul className="activity-list mb-3">
              <li>Completed "March 9, 2025"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
