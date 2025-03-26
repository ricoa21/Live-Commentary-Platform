import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScotlandFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/fixtures/scotland'
        );

        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('Invalid data structure from server');
        }

        setFixtures(response.data.data);
        setLoading(false);
      } catch (err) {
        let errorMessage = 'Failed to load fixtures';
        if (err.response) {
          errorMessage = err.response.data.error || errorMessage;
          if (err.response.data.details) {
            console.error('API Error Details:', err.response.data.details);
          }
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="upcoming-fixtures">
      <h2>Upcoming Scottish Premiership Fixtures</h2>
      {fixtures.length === 0 ? (
        <p>No upcoming fixtures found</p>
      ) : (
        fixtures.map((fixture) => (
          <div key={fixture.id} className="fixture">
            {fixture.participants && fixture.participants.length >= 2 && (
              <>
                <span>{fixture.participants[0].name}</span>
                <span> vs </span>
                <span>{fixture.participants[1].name}</span>
                <span> - {new Date(fixture.starting_at).toLocaleString()}</span>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ScotlandFixtures;
