import React from 'react';
import './FixtureCard.css'; // Import the CSS file

function FixtureCard({ fixture }) {
  return (
    <div className="fixture-card">
      <div className="fixture-header">
        <img
          className="team-logo"
          src={fixture.teamALogo}
          alt={fixture.teamA}
        />
        <h3>
          {fixture.teamA} vs {fixture.teamB}
        </h3>
        <img
          className="team-logo"
          src={fixture.teamBLogo}
          alt={fixture.teamB}
        />
      </div>
      <p>Date: {fixture.date}</p>
      <p>Time: {fixture.time}</p>
      <button className="vote-button">Vote for Commentator</button>
      <button className="watch-button">Watch Live</button>
    </div>
  );
}

export default FixtureCard;
