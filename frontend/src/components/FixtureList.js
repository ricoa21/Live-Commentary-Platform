import React from 'react';
import FixtureCard from './FixtureCard';

function FixtureList({ fixtures }) {
  const groupedFixtures = groupFixturesByDate(fixtures);

  return (
    <div className="fixture-list">
      {Object.entries(groupedFixtures).map(([date, fixturesForDate]) => (
        <div key={date} className="fixture-group">
          <h2 className="date-header">{formatDate(date)}</h2>
          {fixturesForDate.map((fixture) => (
            <FixtureCard key={fixture.id} fixture={fixture} />
          ))}
        </div>
      ))}
    </div>
  );
}

function groupFixturesByDate(fixtures) {
  return fixtures.reduce((acc, fixture) => {
    const date = new Date(fixture.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(fixture);
    return acc;
  }, {});
}

function formatDate(dateString) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default FixtureList;
