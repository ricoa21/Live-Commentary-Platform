import React from 'react';
import FixtureCard from './FixtureCard';

function FixtureList({ fixtures }) {
  const groupedFixtures = groupFixturesByDate(fixtures || []);

  return (
    <div className="fixture-list">
      {Object.entries(groupedFixtures).map(([date, fixturesForDate]) => (
        <div key={date} className="fixture-group">
          <h2 className="date-header">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <div className="fixture-grid">
            {fixturesForDate.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupFixturesByDate(fixtures) {
  return fixtures.reduce((acc, fixture) => {
    const dateStr = new Date(fixture.starting_at).toDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(fixture);
    return acc;
  }, {});
}

export default FixtureList;
