import React from 'react';
import FixtureCard from './FixtureCard';

function App() {
  const fixtureData = {
    teamA: "Manchester United",
    teamB: "Liverpool",
    teamALogo: "https://example.com/man-utd-logo.png",
    teamBLogo: "https://example.com/liverpool-logo.png",
    date: "2023-02-20",
    time: "20:00"
  };

  return (
    <div className="App">
      <h1>Upcoming Fixtures</h1>
      <FixtureCard fixture={fixtureData} />
    </div>
  );
}

export default App;
