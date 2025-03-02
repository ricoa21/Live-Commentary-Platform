import React, { useState, useEffect } from 'react';
import { getFixtures } from '../utils/api';
import FixtureCard from './FixtureCard';

function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const data = await getFixtures();
        setFixtures(data);
      } catch (error) {
        console.error('Error fetching fixtures:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFixtures();
  }, []);

  if (loading) {
    return <div>Loading fixtures...</div>;
  }

  return (
    <div className="fixture-list">
      {fixtures.map((fixture) => (
        <FixtureCard key={fixture.id} fixture={fixture} />
      ))}
    </div>
  );
}

export default FixtureList;
