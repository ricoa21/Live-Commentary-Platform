import React from 'react';
import FixtureList from '../components/FixtureList'; // Use your existing FixtureList component

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Live Commentary Platform</h1>
      <FixtureList />
    </div>
  );
};

export default Home;
