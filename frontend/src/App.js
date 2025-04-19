import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home'; // You can remove this if not needed
import Login from './pages/Login';
import Register from './pages/Register';
import LiveMatch from './pages/LiveMatch';
import DanishFixtures from './components/UpcomingFixtures';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="app-container">
        <Header />

        <main>
          <Routes>
            <Route
              path="/login"
              element={
                !loggedIn ? (
                  <Login setLoggedIn={setLoggedIn} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/register"
              element={
                !loggedIn ? (
                  <Register setLoggedIn={setLoggedIn} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Show fixtures on homepage for everyone */}
            <Route path="/" element={<DanishFixtures />} />

            {/* Optionally, keep this for direct /fixtures route */}
            <Route path="/fixtures" element={<DanishFixtures />} />

            {/* Only logged-in users can access live match */}
            <Route
              path="/match/:id"
              element={
                loggedIn ? <LiveMatch /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
