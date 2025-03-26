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
          throw new Error('Invalid response data');
        }

        setFixtures(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError(`Failed to load fixtures: ${err.message}`);
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="upcoming-fixtures">
      <h2>Upcoming Scottish Premiership Fixtures</h2>
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="fixture">
          {fixture.participants && fixture.participants.length > 1 && (
            <>
              <span>{fixture.participants[0].name}</span>
              <span> vs </span>
              <span>{fixture.participants[1].name}</span>
              <span> - {new Date(fixture.starting_at).toLocaleString()}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScotlandFixtures;
