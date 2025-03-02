import React, { useState, useEffect } from 'react';
import FixtureCard from './FixtureCard';
import api from './api'; // Assuming you have an Axios instance set up

function FixtureList() {
  const [fixtures, setFixtures] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const response = await api.get('/fixtures'); // Fetch fixtures from your backend API
        setFixtures(response.data.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching fixtures:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }

    fetchFixtures();
  }, []);

  if (loading) {
    return <div>Loading fixtures...</div>;
  }

  if (!fixtures.length) {
    return <div>No fixtures available.</div>;
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
