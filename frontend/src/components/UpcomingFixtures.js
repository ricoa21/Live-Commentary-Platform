import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DanishFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        // Fetch data from the backend API
        const response = await axios.get(
          'http://localhost:4000/api/fixtures/danish'
        );

        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('Invalid response data');
        }

        setFixtures(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError(
          err.response?.data?.error ||
            err.message ||
            'An unknown error occurred'
        );
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="upcoming-fixtures">
      <h2>Upcoming Danish Superliga Fixtures</h2>
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

export default DanishFixtures;
