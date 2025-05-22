import React, { useState } from 'react';
import TokenStatus from '../components/TokenStatus';
import PatientInterface from '../components/PatientInterface';
import '../styles.css';

const Home = () => {
  const [showTokenForm, setShowTokenForm] = useState(false);

  return (
    <div className="patient-interface">
      <div className="container">
        <h1>Welcome to Our Clinic</h1>
        
        <div className="token-actions">
          <button 
            onClick={() => setShowTokenForm(!showTokenForm)}
            className="btn btn-primary"
          >
            {showTokenForm ? 'Hide Token Form' : 'Get Token'}
          </button>
        </div>
        
        {showTokenForm && (
          <div className="token-form-container">
            <PatientInterface />
          </div>
        )}
        
        <TokenStatus />
      </div>
    </div>
  );
};

export default Home;