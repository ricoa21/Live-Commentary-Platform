import React from 'react';
import FixtureCard from './FixtureCard'; // Use your existing FixtureCard component

const UpcomingFixtures = ({ fixtures }) => {
  return (
    <div className="upcoming-fixtures">
      {fixtures.map((fixture) => (
        <FixtureCard key={fixture.id} fixture={fixture} />
      ))}
    </div>
  );
};

export default UpcomingFixtures; // If you need to rename it to DanishFixtures, change this line
