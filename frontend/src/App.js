import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import FixtureCard from './FixtureCard';

const socket = io('http://127.0.0.1:4000', {
  transports: ['websocket', 'polling'],
});

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server', reason);
      setConnectionStatus('Disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error.message);
      setConnectionStatus('Error: ' + error.message);
    });

    socket.on('welcome', (message) => {
      console.log('Received welcome message:', message);
      setWelcomeMessage(message);
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('welcome');
    };
  }, []);

  return (
    <div>
      <h1>Live Commentary Platform</h1>
      <p>Connection Status: {connectionStatus}</p>
      {welcomeMessage && <p>Server Message: {welcomeMessage}</p>}
      <FixtureCard />
    </div>
  );
};

export default App;
