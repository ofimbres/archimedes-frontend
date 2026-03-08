import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCalendarTimes, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const Home = () => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-2">Welcome back!</h1>
      <p className="text-center text-water-mid mb-8">
        Here&apos;s your activity overview for today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-primary">
                <FontAwesomeIcon icon={faCalendarDay} className="text-2xl" />
              </span>
              <h2 className="font-display font-semibold text-water-deep text-lg">Today&apos;s activities</h2>
            </div>
            <ul className="list-disc list-inside text-base-content/80 text-sm mb-4">
              <li>Exercise description on a card</li>
            </ul>
            <button type="button" className="btn btn-primary rounded-bubble w-full">Start now</button>
          </div>
        </div>

        <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-warning">
                <FontAwesomeIcon icon={faCalendarTimes} className="text-2xl" />
              </span>
              <h2 className="font-display font-semibold text-water-deep text-lg">Past due activities</h2>
            </div>
            <ul className="list-disc list-inside text-base-content/80 text-sm">
              <li>Due March 8, 2025</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-success">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl" />
              </span>
              <h2 className="font-display font-semibold text-water-deep text-lg">Completed activities</h2>
            </div>
            <ul className="list-disc list-inside text-base-content/80 text-sm">
              <li>Completed March 9, 2025</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
