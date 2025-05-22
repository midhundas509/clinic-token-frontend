import React, { useState } from 'react';
import '../styles.css';

const PatientInterface = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    isVIP: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
  
    try {
      console.log('Submitting form data:', formData); // Add logging
      
      const response = await fetch(`${API_BASE}/api/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          isVIP: formData.isVIP
        })
      });
  
      const data = await response.json();
      console.log('API response:', data); // Add logging
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create token');
      }
  
      if (!data.data?.tokenNumber) {
        throw new Error('Server did not return a token number');
      }
  
      setToken(data.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Token creation error:', err);
      setError(err.message.includes('Validation failed') 
        ? 'System error: Please try again or contact support'
        : err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="token-form">
      {submitted && token ? (
        <div className="token-result">
          <h3>Your Token Number</h3>
          <p className="token-number">{token.tokenNumber}</p>
          <p>Name: {token.patientName}</p>
          {token.isVIP && <p className="vip">VIP Patient</p>}
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({
                patientName: '',
                phoneNumber: '',
                isVIP: false
              });
            }} 
            className="btn btn-primary"
          >
            Get Another Token
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
           <div className="form-group floating-label">
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder=" "
              />
              <label>Patient Name</label>
            </div>

            <div className="form-group floating-label">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder=" "
              />
              <label>Phone Number</label>
            </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isVIP"
                checked={formData.isVIP}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              VIP Patient
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="btn btn-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Token'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PatientInterface;