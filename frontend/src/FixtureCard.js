import React from 'react';
import './FixtureCard.css';

function FixtureCard({ fixture }) {
  if (!fixture || !fixture.participants) {
    return (
      <div className="fixture-card loading" role="status" aria-live="polite">
        Loading fixture data...
      </div>
    );
  }

  const localTeam =
    fixture.participants.find((team) => team.meta?.location === 'home') || {};
  const visitorTeam =
    fixture.participants.find((team) => team.meta?.location === 'away') || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBA';
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
    <article
      className={`fixture-card ${isLive ? 'live' : ''}`}
      tabIndex={0}
      aria-label={`${localTeam.name || 'Home team'} versus ${visitorTeam.name || 'Away team'}, starting at ${formatDate(fixture.starting_at)} ${formatTime(fixture.starting_at)}`}
    >
      <header className="fixture-header">
        <div className="team home-team">
          <img
            className="team-logo"
            src={localTeam.image_path || 'default-logo.png'}
            alt={`${localTeam.name || 'Home team'} logo`}
            onError={(e) => {
              e.target.src = 'default-logo.png';
            }}
          />
          <span className="team-name">{localTeam.name || 'Home team'}</span>
        </div>

        <h3 className="vs-text">vs</h3>

        <div className="team away-team">
          <img
            className="team-logo"
            src={visitorTeam.image_path || 'default-logo.png'}
            alt={`${visitorTeam.name || 'Away team'} logo`}
            onError={(e) => {
              e.target.src = 'default-logo.png';
            }}
          />
          <span className="team-name">{visitorTeam.name || 'Away team'}</span>
        </div>
      </header>

      <section className="match-info">
        <p className="match-date">
          Date:{' '}
          <time dateTime={fixture.starting_at}>
            {formatDate(fixture.starting_at)}
          </time>
        </p>
        <p className="match-time">
          Time:{' '}
          <time dateTime={fixture.starting_at}>
            {formatTime(fixture.starting_at)}
          </time>
        </p>
        {isLive && (
          <p className="live-indicator" aria-live="assertive">
            LIVE NOW
          </p>
        )}
      </section>

      <section className="fixture-actions">
        {commentatorAvailable ? (
          <button type="button" className="commentate-button">
            Become a Commentator
          </button>
        ) : (
          <button type="button" className="commentate-button" disabled>
            Commentators Full
          </button>
        )}

        <a
          href={`/live-commentary/${fixture.id}`}
          className="watch-button"
          aria-label={isLive ? 'Watch live match' : 'View match details'}
        >
          {isLive ? 'Watch Live' : 'View Match Details'}
        </a>
      </section>
    </article>
  );
}

export default FixtureCard;
