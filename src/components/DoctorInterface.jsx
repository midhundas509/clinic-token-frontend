import React, { useState, useEffect } from 'react';
import '../styles.css';

const DoctorInterface = () => {
  const [currentToken, setCurrentToken] = useState(null);
  const [nextToken, setNextToken] = useState(null);
  const [averageTime, setAverageTime] = useState(15);
  const [waitingTokens, setWaitingTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTokenData();
    const interval = setInterval(fetchTokenData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current token
      const currentRes = await fetch('/api/tokens/current');
      if (!currentRes.ok) throw new Error('Failed to fetch current token');
      const currentData = await currentRes.json();
      setCurrentToken(currentData.data || null);
      
      // Fetch all tokens
      const allRes = await fetch('/api/tokens');
      if (!allRes.ok) throw new Error('Failed to fetch tokens');
      const allData = await allRes.json();
      
      const waiting = allData.data?.filter(t => t.status === 'waiting') || [];
      setWaitingTokens(waiting);
      
      // Find next token
      const next = [...waiting].sort((a, b) => 
        (b.isVIP - a.isVIP) || (a.tokenNumber - b.tokenNumber)
      )[0];
      setNextToken(next || null);
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextToken = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens/next', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to move to next token');
      }
  
      const data = await response.json();
      setCurrentToken(data.data);
      await fetchTokenData();
    } catch (err) {
      console.error('Error moving to next token:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      await fetchTokenData();
    } catch (err) {
      console.error('Error updating token status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateWaitTime = () => {
    if (!nextToken) return 0;
    
    const position = waitingTokens.findIndex(t => t._id === nextToken._id);
    return (position + 1) * averageTime;
  };

  return (
    <div className="doctor-interface">
      <div className="container">
        <h2>Doctor Dashboard</h2>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="btn-error-dismiss">
              &times;
            </button>
          </div>
        )}
        
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="settings-panel">
          <div className="form-group">
            <label>Average Time Per Patient (minutes):</label>
            <input
              type="number"
              value={averageTime}
              onChange={(e) => setAverageTime(Math.max(1, parseInt(e.target.value) || 15))}
              min="1"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="token-display">
          <div className="current-token">
            <h3>Current Patient</h3>
            {currentToken ? (
              <>
                <p>Token: <strong>#{currentToken.tokenNumber}</strong></p>
                <p>Name: {currentToken.patientName}</p>
                <p>Phone: {currentToken.phoneNumber}</p>
                {currentToken.isVIP && <p className="vip">VIP Patient</p>}
              </>
            ) : (
              <p>No patient currently being served</p>
            )}
          </div>
          
          <div className="next-token">
            <h3>Next Patient</h3>
            {nextToken ? (
              <>
                <p>Token: <strong>#{nextToken.tokenNumber}</strong></p>
                <p>Name: {nextToken.patientName}</p>
                {nextToken.isVIP && <p className="vip">VIP Patient</p>}
                <p>Estimated wait: {calculateWaitTime()} minutes</p>
              </>
            ) : (
              <p>No more patients in queue</p>
            )}
          </div>
        </div>
        
        <div className="doctor-actions">
          <button 
            onClick={handleNextToken}
            className="btn btn-next"
            disabled={!nextToken || loading}
          >
            {loading ? 'Processing...' : 'Next Patient'}
          </button>
          
          {currentToken && (
            <button 
              className="btn btn-skip"
              onClick={() => handleStatusChange(currentToken._id, 'skipped')}
              disabled={loading}
            >
              Skip Current
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorInterface;