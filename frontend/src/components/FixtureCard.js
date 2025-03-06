import React from 'react';

function FixtureCard({ fixture }) {
  return (
    <div className="fixture-card">
      <div className="team home-team">
        <img
          src={fixture.homeTeam.logo}
          alt={fixture.homeTeam.name}
          className="team-logo"
        />
        <span className="team-name">{fixture.homeTeam.name}</span>
      </div>
      <div className="match-details">
        <span className="kick-off-time">{formatTime(fixture.date)}</span>
        <span className="score">{fixture.score || 'vs'}</span>
      </div>
      <div className="team away-team">
        <img
          src={fixture.awayTeam.logo}
          alt={fixture.awayTeam.name}
          className="team-logo"
        />
        <span className="team-name">{fixture.awayTeam.name}</span>
      </div>
    </div>
  );
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default FixtureCard;
