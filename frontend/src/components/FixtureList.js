import React, { useState, useEffect } from 'react';
import { getFixtures } from '../utils/api';
import FixtureCard from './FixtureCard';

function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFixtures();
      setFixtures(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;

  return (
    <div>
      <h1>Upcoming Fixtures</h1>
      {fixtures.map((fixture) => (
        <FixtureCard key={fixture.id} fixture={fixture} />
      ))}
    </div>
  );
}

export default FixtureList;
