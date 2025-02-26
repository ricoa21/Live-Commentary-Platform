import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ErrorBoundary from '../ErrorBoundary'; // Import the ErrorBoundary component

function CommentFeed() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:4000'); // Replace with your server URL

    socket.on('new-comment', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    return () => {
      socket.disconnect(); // Clean up when the component unmounts
    };
  }, []);

  return (
    <div>
      {comments.map((comment) => (
        <ErrorBoundary key={comment.id}>
          <div>{comment.text}</div>
        </ErrorBoundary>
      ))}
    </div>
  );
}

export default CommentFeed;
