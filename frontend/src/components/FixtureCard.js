import React from 'react';

function FixtureCard({ fixture }) {
  // Handle cases where participants might be missing
  const [team1, team2] = fixture.participants || [{}, {}];

  return (
    <div className="fixture-card">
      <div className="team home-team">
        <img
          src={team1.logo}
          alt={team1.name}
          className="team-logo"
          onError={(e) => (e.target.style.display = 'none')}
        />
        <span className="team-name">{team1.name || 'TBD'}</span>
      </div>

      <div className="match-details">
        <span className="kick-off-time">
          {new Date(fixture.starting_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <span className="score">
          {fixture.status === 'NS' ? 'vs' : fixture.status}
        </span>
      </div>

      <div className="team away-team">
        <img
          src={team2.logo}
          alt={team2.name}
          className="team-logo"
          onError={(e) => (e.target.style.display = 'none')}
        />
        <span className="team-name">{team2.name || 'TBD'}</span>
      </div>
    </div>
  );
}

export default FixtureCard;
