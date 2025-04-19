import React from 'react';
import UpcomingFixtures from '../components/UpcomingFixtures';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Live Commentary Platform</h1>
      <p>
        Follow the latest football action with real-time, organic commentary.
      </p>
      <UpcomingFixtures />
    </div>
  );
};

export default Home;
