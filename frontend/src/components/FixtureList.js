import React, { useState, useEffect } from 'react';
import { getFixtures } from '../utils/api';
import FixtureCard from './FixtureCard';
import ErrorBoundary from '../ErrorBoundary';

function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFixtures();
        setFixtures(data);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError('Failed to load fixtures. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupFixturesByDate = (fixtures) => {
    return fixtures.reduce((acc, fixture) => {
      const date = new Date(fixture.starting_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(fixture);
      return acc;
    }, {});
  };

  if (loading) return <p>Loading fixtures...</p>;
  if (error) return <p>{error}</p>;

  const groupedFixtures = groupFixturesByDate(fixtures);

  return (
    <div className="fixture-list">
      <h1>Upcoming Fixtures</h1>
      {Object.entries(groupedFixtures).map(([date, fixturesForDate]) => (
        <div key={date} className="fixture-group">
          <h2>{date}</h2>
          {fixturesForDate.map((fixture) => (
            <ErrorBoundary key={fixture.id}>
              <FixtureCard fixture={fixture} />
            </ErrorBoundary>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FixtureList;
