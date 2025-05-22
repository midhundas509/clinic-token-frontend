import React, { useState, useEffect, useCallback } from 'react';
import '../styles.css';

const TokenStatus = () => {
  const [state, setState] = useState({
    currentToken: null,
    queueInfo: {
      waiting: 0,
      nextToken: null,
      estimatedTime: 0
    },
    error: null,
    isLoading: true,
    lastUpdated: null
  });

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE}/api/tokens`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch token data');
      }

      const tokens = data.data || [];
      
      // Process tokens data...
      const currentToken = tokens.find(t => t.status === 'serving') || null;
      const waitingTokens = tokens.filter(t => t.status === 'waiting');
      const nextToken = [...waitingTokens].sort((a, b) => 
        (b.isVIP - a.isVIP) || (a.tokenNumber - b.tokenNumber)
      )[0] || null;
      const estimatedTime = Math.ceil(waitingTokens.length * 5);

      setState({
        currentToken,
        queueInfo: {
          waiting: waitingTokens.length,
          nextToken,
          estimatedTime
        },
        error: null,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (err) {
      console.error('API Error:', err);
      setState(prev => ({
        ...prev,
        error: `Connection error: ${err.message}`,
        isLoading: false
      }));
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (state.isLoading && !state.error) {
    return (
      <div className="status-loading">
        <div className="spinner"></div>
        <p>Loading token status...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="status-error">
        <p>⚠️ Service Temporarily Unavailable</p>
        <p>{state.error}</p>
        <button 
          onClick={fetchData}
          className="retry-button"
        >
          Retry Now
        </button>
      </div>
    );
  }

  return (
    <div className="token-status-container">
      <div className="current-token-section">
        <h4>Now Serving</h4>
        {state.currentToken ? (
          <div className="current-token">
            <span className="token-number">{state.currentToken.tokenNumber}</span>
            <span className="patient-name">{state.currentToken.patientName}</span>
            {state.currentToken.isVIP && <span className="vip-badge">VIP</span>}
          </div>
        ) : (
          <p className="no-token">No active tokens</p>
        )}
      </div>

      <div className="queue-section">
        <h4>Queue Information</h4>
        <div className="queue-metrics">
          <div className="metric">
            <span className="metric-label">Waiting</span>
            <span className="metric-value">{state.queueInfo.waiting}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Est. Time</span>
            <span className="metric-value">{state.queueInfo.estimatedTime} min</span>
          </div>
        </div>

        {state.queueInfo.nextToken && (
          <div className="next-token">
            <span className="metric-label">Next:</span>
            <span className="metric-value">
              {state.queueInfo.nextToken.tokenNumber}
              {state.queueInfo.nextToken.isVIP && <span className="vip-badge">VIP</span>}
            </span>
          </div>
        )}
      </div>

      {state.lastUpdated && (
        <div className="last-updated">
          Last updated: {state.lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default TokenStatus;