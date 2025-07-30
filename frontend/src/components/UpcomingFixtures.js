import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FixtureList from './FixtureList';

const UpcomingFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/api/fixtures/danish') // Use relative path with proxy for dev
      .then((res) => {
        setFixtures(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load fixtures. Please try again.');
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div role="status" aria-live="polite">
        Loading fixtures...
      </div>
    );
  if (error) return <div role="alert">Error: {error}</div>;
  if (!fixtures.length) return <div>No upcoming matches found.</div>;

  return <FixtureList fixtures={fixtures} />;
};

export default UpcomingFixtures;
