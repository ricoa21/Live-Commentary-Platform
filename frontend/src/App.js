import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import LiveMatch from './pages/LiveMatch';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import CommentFeed from './components/CommentFeed';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            {isLogin ? (
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <RegisterForm />
            )}
          </div>
        )}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/match/:id" component={LiveMatch} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
        <CommentFeed />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
