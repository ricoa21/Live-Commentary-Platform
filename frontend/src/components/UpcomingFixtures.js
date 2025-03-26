import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScotlandFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiMeta, setApiMeta] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/fixtures/scotland'
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setFixtures(response.data.data || []);
        setApiMeta(response.data.meta);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError(err.message || 'An error occurred while fetching fixtures');
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
        <div>
          <p>No upcoming fixtures found</p>
          {apiMeta && (
            <p>
              API Info: Total: {apiMeta.pagination?.total}, Count:{' '}
              {apiMeta.pagination?.count}, Per Page:{' '}
              {apiMeta.pagination?.per_page}
            </p>
          )}
        </div>
      ) : (
        fixtures.map((fixture) => (
          <div key={fixture.id} className="fixture">
            {fixture.participants && fixture.participants.length >= 2 && (
              <>
                <span>{fixture.participants[0].name}</span>
                <span> vs </span>
                <span>{fixture.participants[1].name}</span>
                <span> - {new Date(fixture.starting_at).toLocaleString()}</span>
                <span> (Status: {fixture.status})</span>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ScotlandFixtures;
