import React, { useState } from 'react';
import '../styles.css';

const ReceptionInterface = ({ tokens, fetchTokens }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newToken, setNewToken] = useState({
    patientName: '',
    phoneNumber: '',
    isVIP: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleStatusChange = async (tokenId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
  
      await fetchTokens();
    } catch (err) {
      console.error('Error updating token status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVIPChange = async (tokenId, isVIP) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tokens/reorder/${tokenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVIP })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update VIP status');
      }
  
      await fetchTokens();
      setSuccess('VIP status updated successfully');
    } catch (err) {
      console.error('Error updating VIP status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

// client/src/components/ReceptionInterface.jsx
const handleCreateToken = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError(null);
    
    // Basic validation
    if (!newToken.patientName.trim()) {
      throw new Error('Patient name is required');
    }
    if (!newToken.phoneNumber.trim()) {
      throw new Error('Phone number is required');
    }

    const response = await fetch('/api/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: newToken.patientName.trim(),
        phoneNumber: newToken.phoneNumber.trim().replace(/\D/g, ''), // Clean phone number
        isVIP: newToken.isVIP
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create token');
    }

    await fetchTokens();
    setNewToken({
      patientName: '',
      phoneNumber: '',
      isVIP: false
    });
    setSuccess('Token created successfully');
    setTimeout(() => setSuccess(null), 3000);
  } catch (err) {
    console.error('Error creating token:', err);
    setError(err.message.includes('validation failed') 
      ? 'Please check your input and try again'
      : err.message);
  } finally {
    setLoading(false);
  }
};

  const filteredTokens = tokens?.filter(token =>
    token.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.phoneNumber.includes(searchTerm) ||
    token.tokenNumber.toString().includes(searchTerm)
  ) || [];

  return (
    <div className="reception-interface">
      <div className="container">
        <h2>Reception Dashboard</h2>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="btn-error-dismiss">
              &times;
            </button>
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
            <button onClick={() => setSuccess(null)} className="btn-success-dismiss">
              &times;
            </button>
          </div>
        )}
        
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="reception-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, phone, or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="create-token-form">
            <h3>Create New Token</h3>
            <form onSubmit={handleCreateToken}>
              <div className="form-row">
                <div className="floating-label">
                  <input
                    type="text"
                    id="patient-name"
                    placeholder=" "
                    value={newToken.patientName}
                    onChange={(e) => setNewToken({ ...newToken, patientName: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <label htmlFor="patient-name">Patient Name</label>
                </div>

                <div className="floating-label">
                  <input
                    type="tel"
                    id="phone-number"
                    placeholder=" "
                    value={newToken.phoneNumber}
                    onChange={(e) => setNewToken({ ...newToken, phoneNumber: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <label htmlFor="phone-number">Phone Number</label>
                </div>

                
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={newToken.isVIP}
                      onChange={(e) => setNewToken({...newToken, isVIP: e.target.checked})}
                      disabled={loading}
                    />
                    VIP Patient
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="token-list">
          <h3>Token Queue</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>VIP</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.length > 0 ? (
                  filteredTokens.map(token => (
                    <tr key={token._id} className={`status-${token.status}`}>
                      <td>{token.tokenNumber}</td>
                      <td>{token.patientName}</td>
                      <td>{token.phoneNumber}</td>
                      <td>
                        <select
                          value={token.status}
                          onChange={(e) => handleStatusChange(token._id, e.target.value)}
                          disabled={loading}
                        >
                          <option value="waiting">Waiting</option>
                          <option value="serving">Serving</option>
                          <option value="completed">Completed</option>
                          <option value="skipped">Skipped</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={token.isVIP}
                          onChange={(e) => handleVIPChange(token._id, e.target.checked)}
                          disabled={loading}
                        />
                      </td>
                      <td>
                        {token.status === 'waiting' && (
                          <button 
                            onClick={() => handleStatusChange(token._id, 'canceled')}
                            className="btn btn-sm btn-danger"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-tokens">
                      No tokens found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionInterface;