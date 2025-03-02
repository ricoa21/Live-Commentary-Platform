import React from 'react';
import './FixtureCard.css';

function FixtureCard({ fixture }) {
  if (!fixture || !fixture.participants) {
    return <div className="fixture-card loading">Loading fixture data...</div>;
  }

  const localTeam = fixture.participants.find(
    (team) => team.meta.location === 'home'
  );
  const visitorTeam = fixture.participants.find(
    (team) => team.meta.location === 'away'
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixture-card">
      <div className="fixture-header">
        <img
          className="team-logo"
          src={localTeam.image_path}
          alt={localTeam.name}
          onError={(e) => {
            e.target.src = 'default-logo.png';
          }}
        />
        <h3>
          {localTeam.name} vs {visitorTeam.name}
        </h3>
        <img
          className="team-logo"
          src={visitorTeam.image_path}
          alt={visitorTeam.name}
          onError={(e) => {
            e.target.src = 'default-logo.png';
          }}
        />
      </div>
      <p>Date: {formatDate(fixture.starting_at)}</p>
      <p>Time: {formatTime(fixture.starting_at)}</p>
      <button className="commentate-button">Become a Commentator</button>
      <button className="watch-button">Watch Live</button>
    </div>
  );
}

export default FixtureCard;
