import React from 'react';

function FixtureCard({ fixture }) {
  if (!fixture) return null;

  const { localTeam, visitorTeam, time } = fixture;

  return (
    <div className="fixture-card">
      <h2>
        {localTeam.data.name} vs {visitorTeam.data.name}
      </h2>
      <p>Date: {new Date(time.starting_at.date_time).toLocaleDateString()}</p>
      <p>Time: {new Date(time.starting_at.date_time).toLocaleTimeString()}</p>
    </div>
  );
}

export default FixtureCard;
