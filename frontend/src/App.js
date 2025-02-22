import React, { useEffect } from 'react';
import io from 'socket.io-client';
import FixtureCard from './FixtureCard';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });

    return () => socket.disconnect();
  }, []);

  const fixtureData = {
    teamA: 'Manchester United',
    teamB: 'Liverpool',
    teamALogo: 'https://example.com/man-utd-logo.png',
    teamBLogo: 'https://example.com/liverpool-logo.png',
    date: '2023-02-20',
    time: '20:00',
  };

  return (
    <div className="App">
      <h1>Upcoming Fixtures</h1>
      <FixtureCard fixture={fixtureData} />
    </div>
  );
}

export default App;
