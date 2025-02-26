import React from 'react';
import './FixtureCard.css'; // Import the CSS file

function FixtureCard({ fixture }) {
  if (!fixture) {
    return <div>Loading...</div>;
  }

  // Destructure the fixture object with default values
  const {
    teamA = 'Team A',
    teamB = 'Team B',
    teamALogo = 'default-logo.png',
    teamBLogo = 'default-logo.png',
    date = 'TBA',
    time = 'TBA',
  } = fixture;

  return (
    <div className="fixture-card">
      <div className="fixture-header">
        <img
          className="team-logo"
          src={teamALogo}
          alt={teamA}
          onError={(e) => {
            e.target.src = 'default-logo.png';
          }}
        />
        <h3>
          {teamA} vs {teamB}
        </h3>
        <img
          className="team-logo"
          src={teamBLogo}
          alt={teamB}
          onError={(e) => {
            e.target.src = 'default-logo.png';
          }}
        />
      </div>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <button className="vote-button">Vote for Commentator</button>
      <button className="watch-button">Watch Live</button>
    </div>
  );
}

export default FixtureCard;
