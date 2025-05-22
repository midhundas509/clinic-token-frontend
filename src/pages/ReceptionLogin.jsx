import React, { useState, useEffect } from 'react';
import ReceptionInterface from '../components/ReceptionInterface';
import '../styles.css';

const ReceptionLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [tokens, setTokens] = useState([]);

  const fetchTokens = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tokens');
      const data = await response.json();
      setTokens(data.data || []); // Extract the data property or default to empty array
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setTokens([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTokens();
      const interval = setInterval(fetchTokens, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple auth for demo (in real app, use proper authentication)
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="reception-login">
        <div className="container">
          <h2>Reception Login</h2>
           <form onSubmit={handleLogin}>
              <div className="floating-label">
                <input
                  type="text"
                  id="reception-username"
                  placeholder=" "
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
                <label htmlFor="reception-username">Username</label>
              </div>
              <div className="floating-label">
                <input
                  type="password"
                  id="reception-password"
                  placeholder=" "
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
                <label htmlFor="reception-password">Password</label>
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>

        </div>
      </div>
    );
  }

  return <ReceptionInterface tokens={tokens} fetchTokens={fetchTokens} />;
};

export default ReceptionLogin;