import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

const socket = io('http://localhost:4000');

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('comment_received', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    return () => {
      socket.off('comment_received');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to post comments');
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:4000/api/auth/comments',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: newComment }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.message); // This will log "Comment posted successfully" to the browser console
          alert(data.message); // This will show an alert with "Comment posted successfully"
          socket.emit('new_comment', newComment);
          setNewComment('');
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to post comment');
        }
      } catch (error) {
        console.error('Error posting comment:', error);
        if (error.response) {
          console.error('Response:', await error.response.text());
        }
        alert('Error posting comment');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Live Commentary</h1>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => setShowAuth(!showAuth)}>
          {showAuth ? 'Hide Auth' : 'Show Auth'}
        </button>
      )}
      {showAuth && !isLoggedIn && (
        <div>
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Register</button>
          {isLogin ? (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <RegisterForm />
          )}
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
