import React, { useState } from 'react';
import DoctorInterface from '../components/DoctorInterface';
import '../styles.css';

const DoctorLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple auth for demo (in real app, use proper authentication)
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="doctor-login">
        <div className="container">
          <h2>Doctor Login</h2>
           <form onSubmit={handleLogin}>
              <div className="floating-label">
                <input
                  type="text"
                  id="doctor-username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
                <label htmlFor="doctor-username">Username</label>
              </div>
              <div className="floating-label">
                <input
                  type="password"
                  id="doctor-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
                <label htmlFor="doctor-password">Password</label>
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>

        </div>
      </div>
    );
  }

  return <DoctorInterface />;
};

export default DoctorLogin;