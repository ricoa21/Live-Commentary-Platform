import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import FixtureCard from './FixtureCard';
// eslint-disable-next-line no-unused-vars
import ErrorBoundary from './ErrorBoundary';

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
});

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('Connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('Error: ' + error.message);
    });

    socket.on('new_comment', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    // Check if user is authenticated
    checkAuthStatus();

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('new_comment');
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/check-auth');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error checking auth status:', error.message);
      // Handle the error appropriately, e.g., set user to null or show an error message
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      socket.emit('new_comment', {
        message: newComment,
        user: user.username,
      });
      setNewComment('');
    }
  };

  return (
    <div className="app-container">
      <h1>Live Commentary Platform</h1>
      <p>Connection Status: {connectionStatus}</p>

      <div className="stream-container">
        <div className="video-stream">
          {/* Placeholder for video stream */}
          <div
            style={{ width: '640px', height: '360px', backgroundColor: '#000' }}
          >
            Video Stream Placeholder
          </div>
        </div>

        <div className="comments-section">
          <h2>Live Comments</h2>
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.user}:</strong> {comment.message}
              </div>
            ))}
          </div>
          {user ? (
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment..."
              />
              <button type="submit">Send</button>
            </form>
          ) : (
            <p>Please log in to comment.</p>
          )}
        </div>
      </div>

      <FixtureCard />
    </div>
  );
}

export default App;
