// src/pages/Home.js

import React from 'react';
import FixtureList from '../components/FixtureList'; // Ensure this path is correct

const Home = () => {
  return (
    <div
      className="home-page"
      style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Welcome to Live Commentary Platform
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
        Follow the latest football action with real-time, organic commentary.
        <br />
        Select a match below to view live updates or apply to be a commentator!
      </p>
      <FixtureList />
    </div>
  );
};

export default Home;
