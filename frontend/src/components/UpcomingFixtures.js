import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/fixtures/between',
          {
            params: {
              startDate: '2025-03-08',
              endDate: '2025-03-10',
            },
          }
        );
        setFixtures(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load fixtures. Please try again later.');
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="upcoming-fixtures">
      <h2>Upcoming Premier League Fixtures</h2>
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="fixture">
          <span>{fixture.participants[0].name}</span>
          <span> vs </span>
          <span>{fixture.participants[1].name}</span>
          <span> - {new Date(fixture.starting_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default UpcomingFixtures;
