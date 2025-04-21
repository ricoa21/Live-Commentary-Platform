import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FixtureList from './FixtureList';

const UpcomingFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/fixtures')
      .then((res) => {
        setFixtures(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading fixtures...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!fixtures.length) return <div>No upcoming matches found.</div>;

  return <FixtureList fixtures={fixtures} />;
};

export default UpcomingFixtures;
