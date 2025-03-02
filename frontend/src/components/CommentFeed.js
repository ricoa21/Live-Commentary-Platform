import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ErrorBoundary from '../ErrorBoundary';

function CommentFeed() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4000'); // Replace with your server URL

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('comment_received', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to the server. Please try again later.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="comment-feed">
      <h2>Live Commentary</h2>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <ErrorBoundary key={comment.id}>
            <div className="comment">
              <strong>{comment.User.username}:</strong> {comment.content}
              <span className="timestamp">
                {new Date(comment.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </ErrorBoundary>
        ))
      )}
    </div>
  );
}

export default CommentFeed;
