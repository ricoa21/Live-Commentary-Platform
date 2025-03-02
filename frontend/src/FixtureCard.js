import React from 'react';
import './FixtureCard.css'; // Import the CSS file

function FixtureCard({ fixture }) {
  // Check if fixture or participants are undefined
  if (!fixture || !fixture.participants) {
    return <div className="fixture-card loading">Loading fixture data...</div>;
  }

  // Extract local and visitor teams from participants
  const localTeam =
    fixture.participants.find((team) => team.meta.location === 'home') || {};
  const visitorTeam =
    fixture.participants.find((team) => team.meta.location === 'away') || {};

  // Format date and time
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
          src={localTeam.image_path || 'default-logo.png'}
          alt={localTeam.name || 'Local Team'}
          onError={(e) => {
            e.target.src = 'default-logo.png';
          }}
        />
        <h3>
          {localTeam.name || 'Local Team'} vs{' '}
          {visitorTeam.name || 'Visitor Team'}
        </h3>
        <img
          className="team-logo"
          src={visitorTeam.image_path || 'default-logo.png'}
          alt={visitorTeam.name || 'Visitor Team'}
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
