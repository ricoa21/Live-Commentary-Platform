import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LiveMatch from './pages/LiveMatch';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import CommentFeed from './components/CommentFeed';
import FixtureList from './components/FixtureList';
import ErrorBoundary from './components/ErrorBoundary'; // Updated import path

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Header />
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
              {isLogin ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Register />}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/match/:id" element={<LiveMatch />} />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/register" element={<Register />} />
          </Routes>
          <FixtureList />
          <CommentFeed />
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
