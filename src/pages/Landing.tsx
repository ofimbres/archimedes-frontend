import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

/**
 * Kid-friendly Landing – custom CSS for reliable styling; works with or without Tailwind
 */
const Landing: React.FC = () => {
  return (
    <div className="landing">
      <div className="landing__bubbles">
        <div className="landing__bubble" />
        <div className="landing__bubble" />
        <div className="landing__bubble" />
        <div className="landing__bubble" />
        <div className="landing__bubble" />
      </div>

      <div className="landing__content">
        <img
          src="archimedes-logo.jpg"
          alt="Archimedes Logo"
          className="landing__logo"
        />

        <h1 className="landing__title">Welcome to Archimedes!</h1>
        <p className="landing__subtitle">
          Discover the amazing world of math and science with fun, interactive exercises designed just for you!
        </p>

        <div className="landing__actions">
          <Link to="/signin" className="landing__btn landing__btn--primary">
            Sign In
          </Link>
          <Link to="/signup" className="landing__btn landing__btn--secondary">
            Start Learning
          </Link>
        </div>

        <div className="landing__cards">
          <div className="landing__card">
            <h3 className="landing__card-title">Math Adventures</h3>
            <p className="landing__card-text">Solve puzzles and explore numbers!</p>
          </div>
          <div className="landing__card">
            <h3 className="landing__card-title">Self-Learning Journey</h3>
            <p className="landing__card-text">Learn at your own pace and discover new things!</p>
          </div>
          <div className="landing__card">
            <h3 className="landing__card-title">Fun Challenges</h3>
            <p className="landing__card-text">Level up your learning skills!</p>
          </div>
        </div>

        <footer className="landing__footer">
          © {new Date().getFullYear()} Archimedes Learning Platform – Made with care for young learners
        </footer>
      </div>
    </div>
  );
};

export default Landing;
