import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm'; // Import the LoginForm component

const socket = io('http://localhost:4000');

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAuth, setShowAuth] = useState(false); // Renamed to showAuth
  const [isLogin, setIsLogin] = useState(true); // New state to toggle between login and register

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
      <button onClick={() => setShowAuth(!showAuth)}>
        {showAuth ? 'Hide Auth' : 'Show Auth'}
      </button>
      {showAuth && (
        <div>
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Register</button>
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      )}
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
