import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import DanishFixtures from './DanishFixtures';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div>
        {!loggedIn ? (
          <Routes>
            <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
          </Routes>
        ) : (
          <>
            <nav>
              <a href="/">Home</a> | <a href="/fixtures">Fixtures</a> |{' '}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setLoggedIn(false);
                }}
              >
                Logout
              </button>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fixtures" element={<DanishFixtures />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
