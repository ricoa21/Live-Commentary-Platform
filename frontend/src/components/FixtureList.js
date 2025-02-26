import React from 'react';
import FixtureCard from './FixtureCard';

function FixtureList({ fixtures }) {
  return (
    <div>
      {fixtures.map((fixture) => (
        <FixtureCard key={fixture.id} fixture={fixture} />
      ))}
    </div>
  );
}

export default FixtureList;
