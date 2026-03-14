import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-water-deep mb-6">Home</h1>

      <section>
        <h2 className="font-display font-bold text-xl text-water-deep mb-2">Recent activity</h2>
        <p className="text-water-mid text-sm mb-4">
          Assignments, submissions, and activity across your courses will appear here.
        </p>
        <div className="rounded-blob border-2 border-water-foam/30 border-dashed bg-base-200/30 p-8 text-center">
          <p className="text-base-content/60">Coming soon</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
