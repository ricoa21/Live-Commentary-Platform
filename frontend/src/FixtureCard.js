import React from 'react';
import './FixtureCard.css';

function FixtureCard({ fixture }) {
  if (!fixture || !fixture.data) {
    return <div className="fixture-card loading">Loading fixture data...</div>;
  }

  const localTeam =
    fixture.participants.find((team) => team.meta.location === 'home') || {};
  const visitorTeam =
    fixture.participants.find((team) => team.meta.location === 'away') || {};

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

  const isLive = new Date(fixture.starting_at) <= new Date() && !fixture.ended;
  const commentatorAvailable =
    !fixture.commentators || fixture.commentators.length < 2;

  return (
    <div className={`fixture-card ${isLive ? 'live' : ''}`}>
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
      {isLive && <p className="live-indicator">LIVE NOW</p>}
      {commentatorAvailable ? (
        <button className="commentate-button">Become a Commentator</button>
      ) : (
        <button className="commentate-button" disabled>
          Commentators Full
        </button>
      )}
      <a href={`/live-commentary/${fixture.id}`} className="watch-button">
        {isLive ? 'Watch Live' : 'View Match Details'}
      </a>
    </div>
  );
}

export default FixtureCard;
