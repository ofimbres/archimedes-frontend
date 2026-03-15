import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Landing page – Tailwind + daisyUI only
 */
const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-water-surface via-water-foam/30 to-sand-light/40 font-display">
      {/* Decorative bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-24 h-24 rounded-full bg-water-light/40 -top-4 left-[10%] animate-float" />
        <div className="absolute w-16 h-16 rounded-full bg-teal-light/50 top-1/3 right-[15%] animate-float [animation-delay:1s]" />
        <div className="absolute w-20 h-20 rounded-[60%_40%_50%_50%] bg-sand/50 bottom-1/4 left-1/5 animate-float [animation-delay:2s]" />
        <div className="absolute w-14 h-14 rounded-full bg-water-foam/60 bottom-[15%] right-1/4 animate-float [animation-delay:0.5s]" />
        <div className="absolute w-12 h-12 rounded-full bg-primary/20 top-1/4 right-[30%] animate-float [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 py-12 text-center">
        <img
          src="archimedes-logo.jpg"
          alt="Archimedes Logo"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto mb-6 shadow-bubble animate-float"
        />

        <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-water-deep mb-3">
          Welcome to Archimedes!
        </h1>
        <p className="text-water-mid text-lg md:text-xl max-w-xl mx-auto mb-10">
          Discover the amazing world of math and science with fun, interactive exercises designed just for you!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <Link
            to="/signin"
            className="btn btn-primary rounded-bubble shadow-bubble btn-bouncy px-8 text-lg"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="btn btn-secondary rounded-bubble shadow-bubble btn-bouncy px-8 text-lg"
          >
            Start Learning
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
          <div className="card bg-base-100 border-2 border-water-foam/50 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow">
            <div className="card-body">
              <h3 className="card-title text-water-deep">Math Adventures</h3>
              <p className="text-water-mid text-sm">Solve puzzles and explore numbers!</p>
            </div>
          </div>
          <div className="card bg-base-100 border-2 border-teal-light/40 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow">
            <div className="card-body">
              <h3 className="card-title text-teal-deep">Self-Learning Journey</h3>
              <p className="text-water-mid text-sm">Learn at your own pace and discover new things!</p>
            </div>
          </div>
          <div className="card bg-base-100 border-2 border-sand/60 rounded-blob shadow-bubble btn-bouncy hover:shadow-bubble-hover transition-shadow">
            <div className="card-body">
              <h3 className="card-title text-water-deep">Fun Challenges</h3>
              <p className="text-water-mid text-sm">Level up your learning skills!</p>
            </div>
          </div>
        </div>

        <footer className="mt-14 text-water-mid text-sm">
          © {new Date().getFullYear()} Archimedes Learning Platform – Made with care for young learners
        </footer>
      </div>
    </div>
  );
};

export default Landing;
