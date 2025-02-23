import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RegisterForm from './components/RegisterForm'; // Import the RegisterForm component

const socket = io('http://localhost:4000');

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showRegister, setShowRegister] = useState(false); // New state to toggle registration form

  useEffect(() => {
    socket.on('comment_received', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    return () => {
      socket.off('comment_received');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      socket.emit('new_comment', newComment);
      setNewComment('');
    }
  };

  return (
    <div>
      <h1>Live Commentary</h1>
      <button onClick={() => setShowRegister(!showRegister)}>
        {showRegister ? 'Hide Registration' : 'Show Registration'}
      </button>
      {showRegister && <RegisterForm />}{' '}
      {/* Render RegisterForm when showRegister is true */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment"
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
